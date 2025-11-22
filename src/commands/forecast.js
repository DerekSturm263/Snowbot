// Checks the current weather.
// Weather is updated every 2 hours and is static across servers. Updated randomly.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder						} 	from 'discord.js';
import { get_weather	}	from '../database.js';
import { build_new_weather	}	from '../embeds/new_weather.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('forecast')
		.setDescription('Checks the current and upcoming weather.'),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /forecast:`);

		let offset = 0;

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('prev')
					.setEmoji('◀️')
					.setStyle('Primary')
					.setDisabled(offset == 0),
				new ButtonBuilder()
					.setCustomId('next')
					.setEmoji('▶️')
					.setStyle('Primary')
					.setDisabled(offset == 24 * 7)
			);

		// Tell the user the current and upcoming weather.
		const message = await interaction.reply({
			embeds: [ build_new_weather(get_weather(offset), offset) ],
			components: [ row ],
			flags: MessageFlags.Ephemeral
		});

		const collector = interaction.channel.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'prev') {
				await i.deferUpdate();

				--offset;

				row.components[0].setDisabled(offset == 0);
				row.components[1].setDisabled(false);
				message.edit({
					embeds: [ build_new_weather(get_weather(offset), offset) ],
					components: [ row ],
					flags: MessageFlags.Ephemeral
				});
			} else if (i.customId == 'next') {
				await i.deferUpdate();

				++offset;
				row.components[1].setDisabled(offset == 24 * 7);
				row.components[0].setDisabled(false);
				message.edit({
					embeds: [ build_new_weather(get_weather(offset), offset) ],
					components: [ row ],
					flags: MessageFlags.Ephemeral
				});
			}
		});
	}
};
