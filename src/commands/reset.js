// Resets the user's stats and achievements.

import { MessageFlags, SlashCommandBuilder 											} from 'discord.js';
import { reset_user_data } from '../database.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Reset all stats and achievements.'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /stats:`);

		reset_user_data(interaction.member.id);

        // Tell the user everything about the bot.
		await interaction.editReply({
			content: 'All progress has been reset.',
			flags: MessageFlags.Ephemeral
		});
	}
};
