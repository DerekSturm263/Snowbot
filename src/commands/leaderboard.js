// Displays the leaderboard based on each user's score.

import { ReactionUserManager, SlashCommandBuilder 	}	from 'discord.js';
import { build_new_leaderboard 	}	from '../embeds/embed_leaderboard.js';
import { get_leaderboard_data	} 	from '../update_leaderboard.js';


export const command = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Check the leaderboard for this server.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /leaderboard:`);

		// Get the leaderboard data for this server.
		let leaderboard = await get_leaderboard_data(interaction.guild.id);

		if (leaderboard.all.length == 1) {
			await interaction.reply({ content: 'No one\'s on the leaderboard yet! Throw a snowball at someone to get started!', ephemeral: true });
			return;
		}

	    // Re-sort the leaderboard.
    	leaderboard.all.sort((a, b) => -(a.score - b.score));

		let output = '';
		let num = 1;
		for (let i = 0; i < leaderboard.all.length; ++i) {
			if (leaderboard.all[i].id == 'default')
				continue;

			output += `${num++}: <@${leaderboard.all[i].id}>   -   ${leaderboard.all[i].score} Points\n`;
		}
		
		// Tell the user the top 10 based on their score.
        await interaction.reply({ embeds: [ build_new_leaderboard(output) ], ephemeral: true });
    }
};
