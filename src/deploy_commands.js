import { readdirSync                }   from "node:fs";
import { Collection, REST, Routes   }   from "discord.js";

const commands = [];
const commandDatas = [];

// Load and register commands.
export async function init_commands(client, token, clientId) {
    for (const file of readdirSync('./src/commands').filter(file => file.endsWith('.js'))) {
        await import(`./commands/${file}`)
            .then(obj => {
                const command = Object.values(obj)[0];
                commands.push(command);
                commandDatas.push(command.data.toJSON());
            })
            .catch(err => console.error(err));
    }

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${commandDatas.length} application (/) commands.\n`);

            // Refresh all commands in the guild with the current set.
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandDatas },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.\n`);
        } catch (error) {
            console.error(error);
        }
    })();

    client.commands = new Collection();
    for (const command of commands) {
        client.commands.set(command.data.name, command);

        console.log(`Command: ${command.data.name} was loaded successfully.`);
        console.log(` - Contents: ${JSON.stringify(command)}\n`);
    }
};
