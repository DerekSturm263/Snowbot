import { EmbedBuilder } from 'discord.js';

export function build_new_leaderboard(leaderboard) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`Leaderboard`)
        .setDescription(leaderboard);
};
