import log from "../miscellaneous/debug.js";

export const event = {
    name: 'clientReady',
    async execute(client) {
        log(`${client.user.tag} is online.`);
        log(`========================================================================`);

        client.user.setActivity(`/help | ${client.guilds.cache.size} servers`);
    }
};
