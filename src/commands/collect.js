// Collects snow from off the ground.
// Has a cooldown depending on how hard it's snowing.

import { SlashCommandBuilder 													} from 'discord.js';
import { build_new_collect } from '../embeds/new_collect.js';
import { get_snow_amount, get_weather, set_snow_amount, set_ready, get_ready, get_opt	} from '../serialize.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect some fresh snow from off the ground.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /collect:`);

		const opt = await get_opt(interaction.member.id);
		if (opt == false) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}
		
		// Check if it isn't snowing.
		if (get_weather().cooldown == -1) {
			await interaction.reply({ content: `It isn't snowing! Wait for the weather to change!`, ephemeral: true });
			return;
		}

		// Check if the user isn't ready to collect more snow.
		const ready = await get_ready(interaction.user.id);
		if (ready == false) {
			await interaction.reply({ content: `You have to wait before you can collect more snow!`, ephemeral: true });
			return;
		}

		// Get the amount of snow the user has and check if they already have the max.
		const snow_amount = await get_snow_amount(interaction.member.id);
		if (snow_amount == 10) {
			await interaction.reply({ content: `Your arms are full! You already have 10 snow!`, ephemeral: true });
			return;
		}

		// Set the user as not ready and set them as ready after some time.
		if (get_weather().cooldown != 0) {
			await set_ready(interaction.user.id, false);
				setTimeout(() => {
					set_ready(interaction.user.id, true);
				}, get_weather().cooldown * 1000);
		}

		// Increment the user's snow amount and tell them it was a success.
		await set_snow_amount(interaction.member.id, snow_amount + 1);
		await interaction.reply({ embeds: [ build_new_collect(snow_amount + 1) ], ephemeral: true });
	}
};
