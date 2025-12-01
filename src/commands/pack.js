// Packs a snowball with something random.
// What you put in the snowball impacts how long another user hit with the snowball is timed out for.

import { MessageFlags, SlashCommandBuilder				} from 'discord.js';
import { parseAchievements, get_user_data, set_packed_object, get_weather, set_total_packed_objects, set_snow_amount, set_building, get_server_data	} from '../miscellaneous/database.js';
import { build_new_pack, build_new_pack_existing 					} from '../embeds/new_packs.js';
import { build_new_get_achievement } from '../embeds/new_achievement.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('pack')
		.setDescription('Pack a snowball with something random! Requires that you\'re holding at least 2 snow.'),
		
	async execute(interaction) {
    	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} used /pack:`);

		const [ user_data, server_data, weather ] = [ await get_user_data(interaction.member.id), await get_server_data(interaction.guild.id), get_weather(0) ];

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(interaction.member.id, 0),
				set_packed_object(interaction.member.id, { id: "" }),
				set_building(interaction.member.id, { id: "", hits_left: 0 })
			]);

			user_data.snow_amount = 0;
			user_data.packed_object = "";
			user_data.building = { id: "", hits_left: 0 };
		}
		
		// Check if the user is already packed something.
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
		if (user_data.snow_amount < 2) {
			await interaction.editReply({
				content: 'You must have at least 2 snow in your hand to pack something in! Use `/collect` to get some.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		let chance = Math.random();
		const pet = user_data.pets.find(pet => pet.id == user_data.id);
		if (pet && pet.type == "snow_cat") {
			chance += pet.level * 0.1;
		}

		const objects = server_data.objects.map(object => new Array(object.count).fill(object.id)).flat();

		// Pick a random item to pack.
		const randomIndex = Math.floor(chance * objects.length);
		if (randomIndex >= objects.length - 1)
			randomIndex = objects.length - 1;

		const item = server_data.objects.find(item => item.id == objects[randomIndex]);

		++user_data.total_packed_objects;

		// Set the packed object and tell the user it was a success.
		await Promise.all([
			set_packed_object(interaction.member.id, item),
			set_total_packed_objects(interaction.member.id, user_data.total_packed_objects)
		]);
		
		await interaction.editReply({
			embeds: [ build_new_pack(item) ],
			flags: MessageFlags.Ephemeral
		});
		
		const achievements = await parseAchievements(user_data);

		if (user_data.show_achievements) {
			await Promise.all(achievements.map(async item => {
				interaction.member.send({
					embeds: [ build_new_get_achievement(item) ]
				});
			}));
		}
	}
};
