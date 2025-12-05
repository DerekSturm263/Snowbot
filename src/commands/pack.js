// Packs a snowball with something random.
// What you put in the snowball impacts how long another user hit with the snowball is timed out for.

import { MessageFlags, SlashCommandBuilder				} from 'discord.js';
import { get_user_data, set_packed_object, get_weather, set_total_packed_objects, set_snow_amount, set_building, get_server_data, invoke_pet_events, invoke_event	} from '../miscellaneous/database.js';
import { build_new_pack, build_new_pack_existing 					} from '../embeds/new_packs.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('pack')
		.setDescription('Pack a snowball with something random! Requires that you\'re already holding snow.'),
		
	async execute(interaction) {
    	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /pack:`);

		const [ user_data, server_data, weather ] = [
			await get_user_data(interaction.member.id),
			await get_server_data(interaction.guild.id),
			get_weather(0)
		];

		await invoke_event(0, server_data);

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(user_data, 0),
				set_packed_object(user_data, { id: "" }),
				set_building(user_data, { id: "", hits: 0 })
			]);
		}
		
		// Check if the user has already packed something.
		if (user_data.packed_object != "") {
			const object = server_data.objects.find(item => item.id == user_data.packed_object);

			await interaction.editReply({
				content: "You already have the following in your snowball:",
				embeds: [ build_new_pack_existing(object) ],
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user doesn't have enough snow.
		if (user_data.snow_amount < 1) {
			await interaction.editReply({
				content: 'You need some snow in your hand to pack something in! Use `/collect` to get some.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		const chance = Math.random() + weather.pack_luck_modifier + user_data.snow_amount / 80;

		invoke_pet_events(user_data, server_data, weather, "onPack");

		const objects = server_data.objects.map(object => new Array(object.count).fill(object.id)).flat();

		// Pick a random item to pack.
		let randomIndex = Math.floor(chance * objects.length);
		if (randomIndex >= objects.length - 1)
			randomIndex = objects.length - 1;

		const item = server_data.objects.find(item => item.id == objects[randomIndex]);

		// Set the packed object and tell the user it was a success.
		await Promise.all([
			set_packed_object(user_data, item),
			set_total_packed_objects(user_data, interaction.member, user_data.total_packed_objects + 1)
		]);
		
		await interaction.editReply({
			embeds: [ build_new_pack(item) ],
			flags: MessageFlags.Ephemeral
		});
	}
};
