// Gives some basic information about each command to the user.

import { SlashCommandBuilder 											} from 'discord.js';
import { build_new_help } from '../embeds/new_help.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Learn more about each of the commands and the bot itself.'),
			
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /help:`);

        // Tell the user everything about the bot.
		await interaction.reply({ embeds: [ build_new_help() ], ephemeral: true });
	}
};
