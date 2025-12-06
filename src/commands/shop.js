// Lets the user spend coins at the gachapon machine.

import { MessageFlags, SlashCommandBuilder    }   from 'discord.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Buy items at the shop. Coins can be collected by throwing snowballs or getting achievements.'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /shop:`);

        await interaction.editReply({
            content: "This feature is under construction! If you'd like to test it out, join the [official development server](https://discord.gg/tpfVdFsYKg).",
            flags: MessageFlags.Ephemeral
        });
        return;
	}
};
