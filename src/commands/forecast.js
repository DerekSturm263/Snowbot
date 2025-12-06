// Checks the current weather.
// Weather is updated every 2 hours and is static across servers. Updated randomly.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder						} 	from 'discord.js';
import { get_event, get_weather	}	from '../miscellaneous/database.js';
import { build_new_weather	}	from '../embeds/new_weather.js';
import log from '../miscellaneous/debug.js';

async function build_weather(row, offset, serverID) {
	return {
		embeds: [ build_new_weather(get_weather(offset), await get_event(offset, serverID), offset) ],
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

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /forecast:`);

		let offset = 0;

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('prev')
					.setEmoji('◀️')
					.setStyle('Secondary'),
				new ButtonBuilder()
					.setCustomId('current')
					.setLabel('Current')
					.setStyle('Primary')
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('next')
					.setEmoji('▶️')
					.setStyle('Secondary')
			);

		// Tell the user the current and upcoming weather.
		const message = await interaction.editReply(await build_weather(row, offset, interaction.guild.id));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'prev') {
				await i.deferUpdate();

				--offset;
				row.components[1].setDisabled(offset == 0);

				await interaction.editReply(await build_weather(row, offset, interaction.guild.id));
			} else if (i.customId == 'current') {
				await i.deferUpdate();

				offset = 0;
				row.components[1].setDisabled(true);

				await interaction.editReply(await build_weather(row, offset, interaction.guild.id));
			} else if (i.customId == 'next') {
				await i.deferUpdate();

				++offset;
				row.components[1].setDisabled(offset == 0);

				await interaction.editReply(await build_weather(row, offset, interaction.guild.id));
			}
		});
	}
};
