// Imports.
import { config                     			} 	from 'dotenv';
import { Client, GatewayIntentBits  			}	from 'discord.js';
import { init_commands, init_events             } 	from './src/miscellaneous/deployments.js';

// Initialize client.
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
]});

// Initialize all commands and events.
config();
init_commands(client, process.env.TOKEN, process.env.CLIENT_ID);
init_events(client);

// Turn the bot on.
client.login(process.env.TOKEN);
