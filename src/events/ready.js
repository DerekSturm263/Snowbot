import { get_leaderboard_count } from "../database.js";

export const event = {
    name: 'clientReady',
    async execute(client) {
        console.log(`${client.user.tag} is online.`);

        const serverCount = await get_leaderboard_count();
        client.user.setActivity(`/help | ${serverCount} servers`);
    }
};
