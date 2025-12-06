// Lets the user view their inventory and use their collected items.

import { MessageFlags, SlashCommandBuilder    }   from 'discord.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('View your current inventory and use collected items.'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /gacha:`);

        await interaction.editReply({
            content: "This feature is under construction! If you'd like to test it out, join the [official development server](https://discord.gg/tpfVdFsYKg).",
            flags: MessageFlags.Ephemeral
        });
        return;
	}
};
