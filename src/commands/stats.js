// Checks the user's current stats and builds, packs, etc.

import { MessageFlags, SlashCommandBuilder    }   from 'discord.js';
import { build_new_stats 		}	from '../embeds/new_stats.js';
import { get_user_data, get_weather, set_snow_amount, set_building, set_packed_object, get_server_data }   from '../miscellaneous/database.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Check a user\'s stats.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user you\'d like to see the stats of. Without one, you will see your own stats.')
			.setRequired(false)),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /stats:`);

		const target = interaction.options.getMember('user') ?? interaction.member;
		const [ user_data, server_data, weather ] = [
			await get_user_data(target.id),
			await get_server_data(interaction.guild.id),
			get_weather(0)
		];

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(user_data, 0),
				set_packed_object(user_data, { id: "" }),
				set_building(user_data, { id: "", hits: 0 })
			]);
		}
		
		// Tell the user the stats.
		await interaction.editReply({
			embeds: [ build_new_stats(target.displayName, user_data, server_data, target != interaction.member) ],
			flags: MessageFlags.Ephemeral
		});
	}
};
