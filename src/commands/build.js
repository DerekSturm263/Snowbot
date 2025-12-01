// Builds something using snow from your hand.
// What you build will give you a certain number of shots to block.

import { MessageFlags, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder 							} from 'discord.js';
import { parseAchievements, get_user_data, set_snow_amount, set_building, get_weather, set_total_buildings, set_packed_object, get_server_data	} from '../miscellaneous/database.js';
import { build_new_building_buy, build_new_building 							} from '../embeds/new_builds.js';
import { build_new_get_achievement } from '../embeds/new_achievement.js';
import log from '../miscellaneous/debug.js';

function build_building(row1, row2, building, costModifier, currentSnow) {
	return {
		embeds: [ build_new_building(building, costModifier, currentSnow) ],
		components: [ row1, row2 ],
		flags: MessageFlags.Ephemeral
	};
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Build something out of snow! Requires that you\'re holding snow. Items are cheaper during heavy snow.'),
	
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} used /build:`);

		const [ user_data, server_data, weather ] = [ await get_user_data(interaction.member.id), await get_server_data(interaction.guild.id), get_weather(0) ];

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(interaction.member.id, 0),
				set_packed_object(interaction.member.id, null),
				set_building(interaction.member.id, null)
			]);

			user_data.snow_amount = 0;
			user_data.packed_object = null;
			user_data.building = null;
		}

		let buildingIndex = 0;

		const buildingsRow = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('buildings')
					.addOptions(
						server_data.buildings.map((building, index) => new StringSelectMenuOptionBuilder()
							.setLabel(`${building.name}`)
							.setValue(`${index}`)
							.setDefault(index == 0)
						)
					)
				);

		const buildModifier = weather.building_cost_modifier;

		const pet = user_data.pets.find(pet => pet.id == user_data.id);
		if (pet && pet.type == "snow_owl") {
			buildModifier -= pet.level;
		}

		const suffix = user_data.building != null ? ' (Something Already Built!)' : server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount ? ' (Can\'t Afford!!)' : '';

		const buttonsRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('build')
					.setLabel(`Build For ${server_data.buildings[buildingIndex].cost + buildModifier} Snow` + suffix)
					.setStyle('Primary')
					.setDisabled(user_data.building != null || server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount)
			);

		function selectBuilding(index) {
			buildingIndex = index;

			console.log(JSON.stringify(server_data.buildings));
			console.log(JSON.stringify(server_data.buildings[index]));
		
			for (let i = 0; i < server_data.buildings.length; ++i) {
				buildingsRow.components[0].options[i].setDefault(i == index);
			}

			const suffix = user_data.building != null ? ' (Something Already Built!)' : server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount ? ' (Can\'t Afford!)' : '';

			buttonsRow.components[0].setLabel(`Build For ${server_data.buildings[index].cost + buildModifier} Snow` + suffix);
			buttonsRow.components[0].setDisabled(user_data.building != null || server_data.buildings[index].cost + buildModifier > user_data.snow_amount);
		}

		async function createBuilding(index) {
			++user_data.total_buildings;
			user_data.snow_amount -= server_data.buildings[index].cost;

			// Set the new building and decrement the user's snow amount.
			await Promise.all([
				set_building(interaction.member.id, server_data.buildings[index]),
				set_total_buildings(interaction.member.id, user_data.total_buildings),
				set_snow_amount(interaction.member.id, user_data.snow_amount)
			]);

			await interaction.followUp({
				embeds: [ build_new_building_buy(server_data.buildings[index]) ],
				flags: MessageFlags.Ephemeral
			});
		
			const achievements = await parseAchievements(user_data);

			if (user_data.show_achievements) {
				await Promise.all(achievements.map(async item => {
					interaction.member.send({
						embeds: [ build_new_get_achievement(item) ]
					});
				}));
			}
		}

		const message = await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'buildings') {
				await i.deferUpdate();

				selectBuilding(Number(i.values[0]));

				await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));
			} else if (i.customId == 'build') {
				await i.deferUpdate();

				await createBuilding(buildingIndex);

				await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));
			}
		});
	}
};
