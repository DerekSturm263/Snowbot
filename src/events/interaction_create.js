import { Events, MessageFlags } from "discord.js";
import { logError } from "../miscellaneous/debug.js"

export const event = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand())
            return;
    
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            logError(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        await command.execute(interaction)
            .catch(async err => {
                logError(err);
                    
                await interaction.followUp({
                    content: 'An error occurred. Please report this bug [here](https://github.com/DerekSturm263/Snowbot/issues) with as many details as possible.',
                    flags: MessageFlags.Ephemeral
                });
            });
    }
};
