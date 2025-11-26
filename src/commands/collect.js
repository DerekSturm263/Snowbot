// Collects snow from off the ground.
// Has a cooldown depending on how hard it's snowing.

import { MessageFlags, SlashCommandBuilder 													} from 'discord.js';
import { build_new_collect } from '../embeds/new_collect.js';
import { parseAchievements, get_user_data, set_snow_amount, set_ready_time, get_weather, set_packed_object, set_building, set_total_snow_amount, add_pet	} from '../miscellaneous/database.js';
import { build_new_get_achievement } from '../embeds/new_achievement.js';
import { build_new_pet_unlocked } from '../embeds/new_pet.js';
import pets from '../exports/pets.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect some fresh snow from off the ground.'),

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} used /collect:`);

		const [ user_data, weather ] = [ await get_user_data(interaction.member.id), get_weather(0) ];

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(interaction.member.id, 0),
				set_packed_object(interaction.member.id, null),
				set_building(interaction.member.id, null)
			]);

			user_data.snow_amount = 0;
			user_data.packed_object = null;
			user_data.building = null;
		}
		
		// Check if it isn't snowing.
		if (weather.cooldown < 0) {
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

		const readyTime = new Date().getTime() + (weather.cooldown * 1000);
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

		const petChance = Math.random() < 0.05;
		if (petChance) {
			const randomIndex = Math.floor(Math.random() * pets.length);
			const pet = pets[randomIndex];

			await add_pet(interaction.member.id, pet);

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
