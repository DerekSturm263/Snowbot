// Checks the user's current achievements.

import { SlashCommandBuilder    }   from 'discord.js';
import { get_user_data }   from '../database.js';
import { build_new_achievements_unlocked, build_new_achievements_locked } from '../embeds/new_achievements.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setDescription('Check a user\'s achievements.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user you\'d like to see the achievements of. Without one, you will see your own stats.')
			.setRequired(false)),
			
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /achievements:`);

		const target = interaction.options.getMember('user') ?? interaction.member;
		const user_data = await get_user_data(target.id);

		if (user_data.playing == false) {
			await interaction.reply({ content: 'The specified user isn\'t currently opted in.', ephemeral: true });
			return;
		}
		
		// Tell the user the stats.
		await interaction.reply({ embeds: [ build_new_achievements_unlocked(user_data), build_new_achievements_locked(user_data) ], ephemeral: true });
	}
};
