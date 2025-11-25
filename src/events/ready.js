import log from "../debug";

export const event = {
    name: 'clientReady',
    async execute(client) {
        log(`${client.user.tag} is online.`);
        client.guilds.cache.forEach(guild => {
            log(`- ${guild.name} (ID: ${guild.id})`);
        });

        client.user.setActivity(`/help | ${client.guilds.cache.size} servers`);
    }
};
