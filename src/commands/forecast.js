// Checks the current weather.
// Weather is updated every 2 hours and is static across servers. Updated randomly.

import { SlashCommandBuilder						} 	from 'discord.js';
import { get_current_weather, get_user_data, get_next_weather		}	from '../database.js';
import { build_new_weather	}	from '../embeds/new_weather.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Checks the current and upcoming weather.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /forecast:`);

		const user_data = await get_user_data(interaction.member.id);

		if (!user_data.playing) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}
		
		// Get the current weather.
		const [ curr_weather, next_weather ] = [ await get_current_weather(), await get_next_weather() ];

		// Tell the user the current and upcoming weather.
		await interaction.reply({ embeds: [ build_new_weather(curr_weather, "Current Weather"), build_new_weather(next_weather, "Upcoming Weather") ], ephemeral: true });
	}
};
