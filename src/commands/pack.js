// Packs a snowball with something random.
// What you put in the snowball impacts how long another user hit with the snowball is timed out for.

import { SlashCommandBuilder				} from 'discord.js';
import { get_user_data, set_packed_object, get_current_weather	} from '../database.js';
import { build_new_pack 					} from '../embeds/new_packs.js';
import objects from '../exports/objects.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('pack')
		.setDescription('Pack a snowball with something random! Requires that you\'re holding snow.'),
		
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /pack:`);

		const user_data = await get_user_data(interaction.member.id);

		if (!user_data.playing) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}

		const weather = await get_current_weather();

		if (weather.cooldown == -2) {
			await set_snow_amount(interaction.member.id, 0);
			await set_packed_object(interaction.member.id, null);
			await set_building(interaction.member.id, null);

			user_data.snow_amount = 0;
			user_data.packed_object = null;
			user_data.building = null;
		}
		
		// Check if the user is already packed something.
		if (user_data.packed_object != null) {
			await interaction.reply({ content: `You already have a ${user_data.packed_object.name} in your snowball!`, ephemeral: true });
			return;
		}

		// Check if the user doesn't have enough snow.
		if (user_data.snow_amount < 2) {
			await interaction.reply({ content: `You must have at least 2 snow in your hand to pack something in! Use `/collect` to get some.`, ephemeral: true });
			return;
		}

		// Pick a random item to pack.
		const randomIndex = Math.floor(Math.random() * objects.length);
		const item = objects[randomIndex];
		item.timeout_time += Math.floor(Math.random() * 4) - 2;

		// Set the packed object and tell the user it was a success.
		await set_packed_object(interaction.member.id, item);
		await interaction.reply({ embeds: [ build_new_pack(item) ], ephemeral: true });
	}
};
