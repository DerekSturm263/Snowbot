import { MessageFlags } from "discord.js";
import { logError } from "../debug";

export const event = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand())
            return;
    
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            logError(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            await command.execute(interaction)
                .catch(err => logError(err));
        } catch (err) {
            logError(err);
            
            await interaction.reply({
                content: 'The command could not be executed.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
