export const event = {
    name: 'clientReady',
    async execute(client) {
        console.log(`${client.user.tag} is online.`);
        client.user.setActivity('/help');
    }
};
