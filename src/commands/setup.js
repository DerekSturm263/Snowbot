// Lets server admins manage the server's buildings, events, objects, and pets.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import log from '../miscellaneous/debug.js';
import { get_user_data } from '../miscellaneous/database.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup this server\'s custom buildings, objects, pets, and events.'),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        log(`\n${interaction.user.displayName} used /setup:`);

        const user_data = await get_user_data(interaction.member.id);

        

        await interaction.editReply({
            content: "Feature under construction, check back soon! If you'd like to help test beta versions of the bot, join the [official development server](https://discord.gg/tpfVdFsYKg).",
            flags: MessageFlags.Ephemeral
        });
    }
};