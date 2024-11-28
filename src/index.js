// Imports.
import { config                     			} 	from 'dotenv';
import { Client, GatewayIntentBits  			}	from 'discord.js';
import { init_commands              			} 	from './deploy_commands.js';
import { init_events                			}   from './deploy_events.js';

// Initialize client.
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
]});

// Initialize all commands and events.
config();
init_commands(client, process.env.TOKEN, process.env.CLIENT_ID);
init_events(client);

// Turn the bot on.
client.login(process.env.TOKEN);
