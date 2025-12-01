// Collects snow from off the ground.
// Has a cooldown depending on how hard it's snowing.

import { MessageFlags, SlashCommandBuilder 													} from 'discord.js';
import { build_new_collect } from '../embeds/new_collect.js';
import { parseAchievements, get_user_data, set_snow_amount, set_ready_time, get_weather, set_packed_object, set_building, set_total_snow_amount, add_pet, get_server_data, set_total_pets	} from '../miscellaneous/database.js';
import { build_new_get_achievement } from '../embeds/new_achievement.js';
import { build_new_pet_unlocked } from '../embeds/new_pet.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect some fresh snow from off the ground. Has a chance to reveal an egg!'),

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} used /collect:`);

		const [ user_data, server_data, weather ] = [ await get_user_data(interaction.member.id), await get_server_data(interaction.guild.id), get_weather(0) ];

		const pet2 = user_data.pets.find(pet => pet.id == user_data.id);
		let bypassWeather = false;
		let bypassCooldown = 0;

		if (pet2 && pet2.type == "snowman") {
			bypassWeather = true;
			bypassCooldown = 10 - pet2.level;
		}

		if (!bypassWeather && weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(interaction.member.id, 0),
				set_packed_object(interaction.member.id, { id: "" }),
				set_building(interaction.member.id, { id: "", hits_left: 0 })
			]);

			user_data.snow_amount = 0;
			user_data.packed_object = null;
			user_data.building = null;
		}
		
		// Check if it isn't snowing.
		if (!bypassWeather && weather.cooldown < 0) {
			await interaction.editReply({
				content: `It isn't snowing! Wait for the weather to change!`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user isn't ready to collect more snow.
		if (user_data.ready_time > new Date().getTime()) {
			await interaction.editReply({
				content: `Slow down! You can collect more snow <t:${Math.floor(user_data.ready_time / 1000)}:R>.`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Get the amount of snow the user has and check if they already have the max.
		if (user_data.snow_amount >= 20) {
			await interaction.editReply({
				content: `Your arms are full! You already have 20 snow!`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		let readyTime = new Date().getTime() + (bypassWeather ? bypassCooldown : weather.cooldown) * 1000;
		
		++user_data.snow_amount;
		++user_data.total_snow_amount;

		// Increment the user's snow amount and tell them it was a success.
		await Promise.all([
			set_ready_time(interaction.user.id, readyTime),
			set_snow_amount(interaction.member.id, user_data.snow_amount),
			set_total_snow_amount(interaction.member.id, user_data.total_snow_amount)
		]);
		
		await interaction.editReply({
			embeds: [ build_new_collect(user_data.snow_amount, readyTime) ],
			flags: MessageFlags.Ephemeral
		});

		let petChance = Math.random();

		const pet3 = user_data.pets.find(pet => pet.id == user_data.id);
		if (pet3 && pet3.type == "snow_dragon") {
			petChance += pet3.level * 0.075;
		}

		if (petChance > 0.95) {
			const pets = server_data.pets.map(pet => new Array(pet.count).fill(pet.type)).flat();

			const randomIndex = Math.floor(Math.random() * pets.length);
			const pet = server_data.pets.find(item => item.id == pets[randomIndex]);

			const currentPet = user_data.pets.find(pet => pet.id == user_data.id);
			let hatchOffset = 0;
			if (currentPet && currentPet.type == "snow_dog") {
				hatchOffset = currentPet.level * 0.4;
			}

			++user_data.total_pets;

			await Promise.all([
				add_pet(interaction.member.id, pet, hatchOffset),
				set_total_pets(interaction.member.id, user_data.total_pets)
			]);

			await interaction.followUp({
				embeds: [ build_new_pet_unlocked(pet) ],
				flags: MessageFlags.Ephemeral
			});
		}

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
