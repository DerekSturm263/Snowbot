// Lets users manage their pets.

import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { build_new_pet } from '../embeds/new_pet.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('pets')
		.setDescription('Manage your pets by feeding them and select which ones are active.'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /pets:`);

		await interaction.editReply({
			embeds: [ build_new_pet() ],
			flags: MessageFlags.Ephemeral
		});
	}
};
