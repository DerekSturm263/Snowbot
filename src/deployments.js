import { readdirSync                }   from "node:fs";
import { Collection, REST, Routes   }   from "discord.js";
import log, { logError } from "./debug.js";

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
            .catch(err => logError(err));
    }

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            log(`Started refreshing ${commandDatas.length} application (/) commands.\n`);

            // Refresh all commands in the guild with the current set.
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandDatas },
            );

            log(`Successfully reloaded ${data.length} application (/) commands.\n`);
        } catch (error) {
            logError(error);
        }
    })();

    client.commands = new Collection();
    for (const command of commands) {
        client.commands.set(command.data.name, command);

        log(`Command: ${command.data.name} was loaded successfully.`);
        log(` - Contents: ${JSON.stringify(command)}\n`);
    }
};

// Load and register events.
export async function init_events(client) {
    for (const file of readdirSync('./src/events').filter(file => file.endsWith('.js'))) {
	    await import(`./events/${file}`)
			.then(obj => {
				const event = Object.values(obj)[0];		
				event.once ? client.once(event.name, (...args) => event.execute(...args))
						   : client.on  (event.name, (...args) => event.execute(...args));

				log(`Event: ${event.name} was loaded successfully.`);
                log(` - Contents: ${JSON.stringify(obj)}\n`);
			})
			.catch(err => logError(err));
    }
};
