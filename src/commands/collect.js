// Collects snow from off the ground.
// Has a cooldown depending on how hard it's snowing.

import { SlashCommandBuilder 													} from 'discord.js';
import { build_new_collect } from '../embeds/new_collect.js';
import { get_user_data, set_snow_amount, set_ready, get_current_weather, set_packed_object, set_building, set_total_snow_amount	} from '../database.js';
import parseAchievements from '../exports/achievements.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect some fresh snow from off the ground.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /collect:`);

		const [ user_data, weather ] = [ await get_user_data(interaction.member.id), await get_current_weather() ];

		if (!user_data.playing) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}

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
			await interaction.reply({ content: `It isn't snowing! Wait for the weather to change!`, ephemeral: true });
			return;
		}

		// Check if the user isn't ready to collect more snow.
		if (!user_data.ready) {
			await interaction.reply({ content: `You have to wait before you can collect more snow!`, ephemeral: true });
			return;
		}

		// Get the amount of snow the user has and check if they already have the max.
		if (user_data.snow_amount >= 20) {
			await interaction.reply({ content: `Your arms are full! You already have 20 snow!`, ephemeral: true });
			return;
		}

		// Set the user as not ready and set them as ready after some time.
		if (weather.cooldown != 0) {
			await set_ready(interaction.user.id, false);

			setTimeout(() => {
				set_ready(interaction.user.id, true);
			}, weather.cooldown * 1000);
		}

		++user_data.snow_amount;
		++user_data.total_snow_amount;

		// Increment the user's snow amount and tell them it was a success.
		await Promise.all([
			set_snow_amount(interaction.member.id, user_data.snow_amount),
			set_total_snow_amount(interaction.member.id, user_data.total_snow_amount)
		]);
		
		await interaction.reply({ embeds: [ build_new_collect(user_data.snow_amount) ], ephemeral: true });

		const achievements = parseAchievements(user_data);
		await Promise.all(achievements.map(item => {
			interaction.member.send(`# ${item.name}\nitem${item.description}`);
		}));
	}
};
