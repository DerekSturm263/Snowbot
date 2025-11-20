// Checks the user's current achievements.

import { MessageFlags, SlashCommandBuilder    }   from 'discord.js';
import { get_user_data }   from '../database.js';
import { build_new_achievement } from '../embeds/new_achievement.js';
import achievements from '../exports/achievements.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setDescription('Check a user\'s achievements.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user you\'d like to see the achievements of. Without one, you will see your own stats.')
			.setRequired(false)),
			
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /achievements:`);

		const target = interaction.options.getMember('user') ?? interaction.member;
		const user_data = await get_user_data(target.id);

		const unlocked = achievements.filter(achievement => user_data.achievements.includes(achievement.id)).map(achievement => {
            return build_new_achievement(achievement, false, true);
        });

		const locked = achievements.filter(achievement => !user_data.achievements.includes(achievement.id)).map(achievement => {
            return build_new_achievement(achievement, false, false);
        });
		
		// Tell the user the stats.
		await interaction.reply({ embeds: unlocked, flags: MessageFlags.Ephemeral });
		await interaction.reply({ embeds: locked, flags: MessageFlags.Ephemeral });
	}
};
