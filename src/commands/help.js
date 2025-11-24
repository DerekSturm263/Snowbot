// Gives some basic information about each command to the user.

import { MessageFlags, SlashCommandBuilder 											} from 'discord.js';
import { build_new_help } from '../embeds/new_help.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Learn more about each of the commands and the bot itself.'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /help:`);

        // Tell the user everything about the bot.
		await interaction.editReply({
			embeds: [ build_new_help() ],
			flags: MessageFlags.Ephemeral
		});
	}
};
