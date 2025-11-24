// Checks the current weather.
// Weather is updated every 2 hours and is static across servers. Updated randomly.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder						} 	from 'discord.js';
import { get_weather	}	from '../database.js';
import { build_new_weather	}	from '../embeds/new_weather.js';

function build_weather(row, offset) {
	return {
		embeds: [ build_new_weather(get_weather(offset), offset) ],
		components: [ row ],
		flags: MessageFlags.Ephemeral
	}
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Checks the current and upcoming weather.'),

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /forecast:`);

		let offset = 0;

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

		// Tell the user the current and upcoming weather.
		const message = await interaction.editReply(build_weather(row, offset));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'prev') {
				await i.deferUpdate();

				--offset;

				row.components[0].setDisabled(offset == 0);
				row.components[1].setDisabled(false);

				await interaction.editReply(build_weather(row, offset));
			} else if (i.customId == 'next') {
				await i.deferUpdate();

				++offset;

				row.components[0].setDisabled(false);
				row.components[1].setDisabled(offset == 24 * 7);

				await interaction.editReply(build_weather(row, offset));
			}
		});
	}
};
