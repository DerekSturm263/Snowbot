// Checks the user's current stats and builds, packs, etc.

import { MessageFlags, SlashCommandBuilder    }   from 'discord.js';
import { build_new_stats 		}	from '../embeds/new_stats.js';
import { get_user_data, get_current_weather, set_snow_amount, set_building, set_packed_object }   from '../database.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Check a user\'s stats.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user you\'d like to see the stats of. Without one, you will see your own stats.')
			.setRequired(false)),
			
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /stats:`);

		const target = interaction.options.getMember('user') ?? interaction.member;
		const [ user_data, weather ] = [ await get_user_data(target.id), await get_current_weather() ];

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(target.id, 0),
				set_packed_object(target.id, null),
				set_building(target.id, null)
			]);

			user_data.snow_amount = 0;
			user_data.packed_object = null;
			user_data.building = null;
		}
		
		// Tell the user the stats.
		await interaction.reply({ embeds: [ build_new_stats(target.displayName, user_data, target != interaction.member) ], flags: MessageFlags.Ephemeral });
	}
};
