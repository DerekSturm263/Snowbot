export const event = {
    name: 'clientReady',
    async execute(client) {
        console.log(`${client.user.tag} is online.`);
        client.guilds.cache.forEach(guild => {
            console.log(`- ${guild.name} (ID: ${guild.id})`);
        });

        client.user.setActivity(`/help | ${client.guilds.cache.size} servers`);
    }
};
