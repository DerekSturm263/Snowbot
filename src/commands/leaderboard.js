// Displays the leaderboard based on each user's score.

import { ReactionUserManager, SlashCommandBuilder 	}	from 'discord.js';
import { get_leaderboard_data		}	from '../database.js';
import { build_new_leaderboard 	}	from '../embeds/embed_leaderboard.js';


export const command = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check the leaderboard for this server.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /leaderboard:`);

		// Get the leaderboard data for this server.
		let leaderboard = await get_leaderboard_data(interaction.guild.id);

		if (leaderboard.users.length == 0) {
			await interaction.reply({ content: 'No one\'s on the leaderboard yet! Throw a snowball at someone to get started!', ephemeral: true });
			return;
		}

	    // Sort the leaderboard.
    	leaderboard.users.sort((a, b) => -(a.score - b.score));

		let output = '';
		for (let i = 0; i < leaderboard.users.length; ++i) {
			output += `${i + 1}: <@${leaderboard.users[i].userID}>     -     **${leaderboard.users[i].score} Points**\n`;
		}
		
		// Tell the user the top users based on their score.
        await interaction.reply({ embeds: [ build_new_leaderboard(output) ], ephemeral: true });
    }
};
