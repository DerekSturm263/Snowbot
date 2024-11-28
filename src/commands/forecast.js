// Checks the current weather.
// Weather is updated every 2 hours and is static across servers. Updated randomly.

import { SlashCommandBuilder						} 	from 'discord.js';
import { get_weather, get_opt, get_next_weather		}	from '../serialize.js';
import { build_new_weather, build_upcoming_weather	}	from '../embeds/new_weather.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Checks the current and upcoming weather.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /forecast:`);

		if (await get_opt(interaction.member.id) == false) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}
		
		// Get the current weather.
		const curr_weather = get_weather();
		const next_weather = get_next_weather();

		// Tell the user the current and upcoming weather.
		await interaction.reply({ embeds: [ build_new_weather(curr_weather), build_upcoming_weather(next_weather) ], ephemeral: true });
	}
};
