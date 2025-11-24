// Collects snow from off the ground.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder 	} from 'discord.js';
import { build_new_settings } from '../embeds/new_settings.js';
import { get_user_data, set_show_achievements, set_show_pet_updates, set_show_pings } from '../database.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Manage your settings with the bot.'),

    async execute(interaction) {
    	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /settings:`);

        const user_data = await get_user_data(interaction.member.id);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('togglePetUpdates')
					.setLabel(`Turn Pet Updates ${user_data.show_pet_updates ? 'Off' : 'On'}`)
					.setStyle(user_data.show_pet_updates ? 'Danger' : 'Success'),
				new ButtonBuilder()
					.setCustomId('toggleAchievements')
					.setLabel(`Turn Achievements ${user_data.show_achievements ? 'Off' : 'On'}`)
					.setStyle(user_data.show_achievements ? 'Danger' : 'Success'),
				new ButtonBuilder()
					.setCustomId('togglePings')
					.setLabel(`Turn Pings ${user_data.show_pings ? 'Off' : 'On'}`)
					.setStyle(user_data.show_pings ? 'Danger' : 'Success')
			);

        const message = await interaction.editReply({
            embeds: [ build_new_settings(user_data) ],
            components: [ row ],
            flags: MessageFlags.Ephemeral
        });

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'togglePetUpdates') {
				await i.deferUpdate();

                user_data.show_pet_updates = !user_data.show_pet_updates;
				await set_show_pet_updates(interaction.member.id, user_data.show_pet_updates);

				row.components[0].setLabel(`Turn Pet Updates ${user_data.show_pet_updates ? 'Off' : 'On'}`);
                row.components[0].setStyle(user_data.show_pet_updates ? 'Danger' : 'Success');

                await interaction.editReply({
                    embeds: [ build_new_settings(user_data) ],
                    components: [ row ],
                    flags: MessageFlags.Ephemeral
                });
			} else if (i.customId == 'toggleAchievements') {
				await i.deferUpdate();

                user_data.show_achievements = !user_data.show_achievements;
                await set_show_achievements(interaction.member.id, user_data.show_achievements);

                row.components[1].setLabel(`Turn Achievements ${user_data.show_achievements ? 'Off' : 'On'}`);
                row.components[1].setStyle(user_data.show_achievements ? 'Danger' : 'Success');

                await interaction.editReply({
                    embeds: [ build_new_settings(user_data) ],
                    components: [ row ],
                    flags: MessageFlags.Ephemeral
                });
			} else if (i.customId == 'togglePings') {
				await i.deferUpdate();

                user_data.show_pings = !user_data.show_pings;
                await set_show_pings(interaction.member.id, user_data.show_pings);

                row.components[2].setLabel(`Turn Pings ${user_data.show_pings ? 'Off' : 'On'}`);
                row.components[2].setStyle(user_data.show_pings ? 'Danger' : 'Success');

                await interaction.editReply({
                    embeds: [ build_new_settings(user_data) ],
                    components: [ row ],
                    flags: MessageFlags.Ephemeral
                });
            }
		});
    }
};