import log from "../miscellaneous/debug.js";

export const event = {
    name: 'clientReady',
    async execute(client) {
        log('Servers the bot is in:');
        client.guilds.cache.forEach(guild => {
            log(`- ${guild.name} (ID: ${guild.id})`);
        });

        log(`${client.user.tag} is online.`);
        log(`==================================================================================================================`);

        client.user.setActivity(`/help | ${client.guilds.cache.size} servers`);
    }
};
