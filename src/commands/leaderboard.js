// Displays the leaderboard based on each user's score.

import { MessageFlags, SlashCommandBuilder 	}	from 'discord.js';
import { get_leaderboard_data, get_user_data		}	from '../database.js';
import { build_new_leaderboard 	}	from '../embeds/embed_leaderboard.js';


export const command = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check the leaderboard for this server.'),

	async execute(interaction) {
    	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /leaderboard:`);

		// Get the leaderboard data for this server.
		const leaderboard = await get_leaderboard_data(interaction.guild.id);

		if (leaderboard.users.length == 0) {
			await interaction.editReply({
				content: 'No one\'s on the leaderboard yet! Throw a snowball at someone to get started!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Parse and sort user IDs.
		const scores = leaderboard.users.map(async (item) => ({
			userID: item,
			score: (await get_user_data(item)).score
		}));
		const awaitedScores = (await Promise.all(scores)).sort((a, b) => -(a.score - b.score));

		let output = '';
		for (let i = 0; i < awaitedScores.length; ++i) {
			output += `${i + 1}: <@${awaitedScores[i].userID}> ${i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : ''}     -     **${awaitedScores[i].score} Points**\n`;
		}
		
		// Tell the user the top users based on their score.
        await interaction.editReply({
			embeds: [ build_new_leaderboard(output) ],
			flags: MessageFlags.Ephemeral
		});
    }
};
