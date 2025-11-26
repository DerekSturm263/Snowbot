// Checks the user's current achievements.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder    }   from 'discord.js';
import { get_user_data }   from '../miscellaneous/database.js';
import { build_new_list_achievement } from '../embeds/new_achievement.js';
import achievements from '../exports/achievements.js';
import log from '../miscellaneous/debug.js';

function build_achievements(row, user_data, page, itemCount) {
	return {
		embeds: achievements.slice(page * itemCount, page * itemCount + itemCount).map(achievement => {
	        return build_new_list_achievement(achievement, user_data.achievements.includes(achievement.id));
    	}),
		components: [ row ],
		flags: MessageFlags.Ephemeral
	};
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setDescription('Check a user\'s achievements.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user you\'d like to see the achievements of. Without one, you will see your own stats.')
			.setRequired(false)),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} used /achievements:`);

		let page = 0;

		const target = interaction.options.getMember('user') ?? interaction.member;
		const user_data = await get_user_data(target.id);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('prev')
					.setEmoji('◀️')
					.setStyle('Primary')
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('next')
					.setEmoji('▶️')
					.setStyle('Primary')
			);

		// Tell the user the achievements.
		const message = await interaction.editReply(build_achievements(row, user_data, page, 5));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'prev') {
				await i.deferUpdate();

				--page;

				row.components[0].setDisabled(page == 0);
				row.components[1].setDisabled(false);

				await interaction.editReply(build_achievements(row, user_data, page, 5));
			} else if (i.customId == 'next') {
				await i.deferUpdate();

				++page;

				row.components[0].setDisabled(false);
				row.components[1].setDisabled(page == Math.floor(achievements.length / 5) - 1);

				await interaction.editReply(build_achievements(row, user_data, page, 5));
			}
		});
	}
};
