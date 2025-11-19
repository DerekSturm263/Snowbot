// Displays the leaderboard based on each user's score.

import { ReactionUserManager, SlashCommandBuilder 	}	from 'discord.js';
import { get_leaderboard_data, get_user_data		}	from '../database.js';
import { build_new_leaderboard 	}	from '../embeds/embed_leaderboard.js';


export const command = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check the leaderboard for this server.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /leaderboard:`);

		// Get the leaderboard data for this server.
		const leaderboard = await get_leaderboard_data(interaction.guild.id);

		if (leaderboard.users.length == 0) {
			await interaction.reply({ content: 'No one\'s on the leaderboard yet! Throw a snowball at someone to get started!', ephemeral: true });
			return;
		}

		// Parse and sort user IDs. TODO: Make sure this works.
		const scores = leaderboard.users.map(async (item) => ({
			userID: item,
			score: (await get_user_data(item)).score
		}));
		const awaitedScores = (await Promise.all(scores)).sort((a, b) => -(a.score - b.score));

		let output = '';
		for (let i = 0; i < awaitedScores.length; ++i) {
			output += `${i + 1}: <@${awaitedScores[i].userID}>     -     **${awaitedScores[i].score} Points**\n`;
		}
		
		// Tell the user the top users based on their score.
        await interaction.reply({ embeds: [ build_new_leaderboard(output) ], ephemeral: true });
    }
};
