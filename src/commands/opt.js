// Collects snow from off the ground.

import { MessageFlags, SlashCommandBuilder 	} from 'discord.js';
import { build_new_opt } from '../embeds/opt_embed.js';
import { get_user_data, set_opt                } from '../database.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('opt')
		.setDescription('Opt in or out of the bot.')
        .addSubcommand(subcommand => subcommand
            .setName('in')
            .setDescription('Opt in to the bot.')
        )
        .addSubcommand(subcommand => subcommand
            .setName('out')
            .setDescription('Opt out of the bot.')
        ),

    async execute(interaction) {
    	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        // Get whether the user chose to opt in or not.
        const opt_in = interaction.options.getSubcommand() == 'in';
        const in_msg = opt_in ? 'in' : 'out';

		console.log(`\n${interaction.user.displayName} used /opt ${in_msg}:`);

        const user_data = await get_user_data(interaction.member.id);

        // Check if they are already opted in or out.
        if (opt_in == user_data.playing) {
            await interaction.editReply({
                content: `You're already opted ${in_msg}!`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        await set_opt(interaction.member.id, opt_in);

        // Tell them if they opted in or out.
        await interaction.editReply({
            embeds: [ build_new_opt(opt_in ? 0 : 1) ],
            flags: MessageFlags.Ephemeral
        });
    }
};