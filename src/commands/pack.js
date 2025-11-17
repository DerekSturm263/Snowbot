// Packs a snowball with something random.
// What you put in the snowball impacts how long another user hit with the snowball is timed out for.

import { SlashCommandBuilder										} from 'discord.js';
import { get_packed_object, get_snow_amount, set_packed_object, get_opt		} from '../serialize.js';
import { bomb, brick, razor_blade, rock, more_snow, twigs, icicle 	} from '../exports/objects.js'
import { build_new_pack 											} from '../embeds/new_packs.js';

const objects = [
	bomb,
	brick,
	razor_blade,
	rock,
	more_snow,
	twigs,
	icicle
];

export const command = {
	data: new SlashCommandBuilder()
		.setName('pack')
		.setDescription('Pack a snowball with something random! Requires that you\'re holding snow.'),
		
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /pack:`);

		const opt = await get_opt(interaction.member.id);
		if (opt == false) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}

		// Check if the user already packed something.
		const item1 = await get_packed_object(interaction.member.id);
		if (item1 != null) {
			await interaction.reply({ content: `You already have a ${item1.name} in your snowball!`, ephemeral: true });
			return;
		}

		// Check if the user doesn't have any snow.
		if (await get_snow_amount(interaction.member.id) == 0) {
			await interaction.reply({ content: 'You don\'t have any snow! Use `/collect` to get some.', ephemeral: true });
			return;
		}

		// Pick a random item to pack.
		const randomIndex = Math.floor(Math.random() * objects.length);
		const item = objects[randomIndex];

		// Set the packed object and tell the user it was a success.
		await set_packed_object(interaction.member.id, item);
		await interaction.reply({ embeds: [ build_new_pack(item) ], ephemeral: true });
	}
};
