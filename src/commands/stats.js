// Checks the user's current stats and builds, packs, etc.

import { SlashCommandBuilder    }   from 'discord.js';
import { build_new_stats 		}	from '../embeds/new_stats.js';
import { get_user_data, get_opt }   from '../serialize.js';
import { get_score } from '../update_leaderboard.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Check your current stats.'),
			
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /stats:`);

		if (await get_opt(interaction.member.id) == false) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}

		// Get the data from this user.
        const data = await get_user_data(interaction.member.id);
		const score = await get_score(interaction.guild.id, interaction.member.id);

		// Tell the user their stats.
		await interaction.reply({ embeds: [ build_new_stats(data, score) ], ephemeral: true });
	}
};
