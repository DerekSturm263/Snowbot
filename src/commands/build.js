// Builds something using snow from your hand.
// What you build will give you a certain number of shots to block.

import { MessageFlags, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder 							} from 'discord.js';
import { get_user_data, set_snow_amount, set_building, get_weather, set_total_buildings, set_packed_object, get_server_data, tryGetAchievements, try_pet_ability	} from '../miscellaneous/database.js';
import { build_new_building 							} from '../embeds/new_builds.js';
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

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /build:`);

		const [ user_data, server_data, weather ] = [
			await get_user_data(interaction.member.id),
			await get_server_data(interaction.guild.id),
			get_weather(0)
		];

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(interaction.member.id, 0),
				set_packed_object(interaction.member.id, { id: "" }),
				set_building(interaction.member.id, { id: "", hits: 0 })
			]);

			user_data.snow_amount = 0;
			user_data.packed_object = "";
			user_data.building = { id: "", hits_left: 0 };
		}

		let buildingIndex = 0;

		const buildingsRow = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('buildings')
					.addOptions(
						server_data.buildings.map((building, index) => new StringSelectMenuOptionBuilder()
							.setLabel(`${building.icon} ${building.name}` + `${user_data.building.id == building.id ? ` (Active, Current Health: ${user_data.building.hits_left})` : ''}`)
							.setValue(`${index}`)
							.setDefault(index == 0)
						)
					)
				);

		let buildModifier = weather.building_cost_modifier;

		try_pet_ability(user_data, "snow_owl", (pet) => {
			buildModifier -= pet.level;
		});

		const suffix = user_data.building.id != "" ? ' (Something Already Built!)' : server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount ? ' (Can\'t Afford!!)' : '';

		const buttonsRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('build')
					.setLabel(`Build For ${server_data.buildings[buildingIndex].cost + buildModifier} Snow` + suffix)
					.setStyle('Primary')
					.setDisabled(user_data.building.id != "" || server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount),
				new ButtonBuilder()
					.setCustomId('destroy')
					.setLabel('Destroy')
					.setStyle('Danger')
					.setDisabled(server_data.buildings[buildingIndex].id != user_data.building.id)
			);

		function selectBuilding(index) {
			for (let i = 0; i < server_data.buildings.length; ++i) {
				buildingsRow.components[0].options[i].setDefault(i == index);
			}

			const suffix = user_data.building.id != "" ? ' (Something Already Built!)' : server_data.buildings[index].cost + buildModifier > user_data.snow_amount ? ' (Can\'t Afford!)' : '';

			buttonsRow.components[0].setLabel(`Build For ${server_data.buildings[index].cost + buildModifier} Snow` + suffix);
			buttonsRow.components[0].setDisabled(user_data.building.id != "" || server_data.buildings[index].cost + buildModifier > user_data.snow_amount);
			buttonsRow.components[1].setDisabled(server_data.buildings[index].id != user_data.building.id);

			return index;
		}

		async function createBuilding(index) {
			user_data.building = { id: server_data.buildings[index].id, hits_left: server_data.buildings[index].hits };

			++user_data.total_buildings;
			user_data.snow_amount -= server_data.buildings[index].cost + buildModifier;

			const suffix = user_data.building.id != "" ? ' (Something Already Built!)' : server_data.buildings[index].cost + buildModifier > user_data.snow_amount ? ' (Can\'t Afford!)' : '';

			buildingsRow.components[0].options[index].setLabel(`${server_data.buildings[index].icon} ${server_data.buildings[index].name} (Active, Current Health: ${user_data.building.hits_left})`);
			buttonsRow.components[0].setLabel(`Build For ${server_data.buildings[index].cost + buildModifier} Snow` + suffix);
			buttonsRow.components[0].setDisabled(true);
			buttonsRow.components[1].setDisabled(false);

			// Set the new building and decrement the user's snow amount.
			await Promise.all([
				set_building(interaction.member.id, server_data.buildings[index]),
				set_total_buildings(interaction.member.id, user_data.total_buildings),
				set_snow_amount(interaction.member.id, user_data.snow_amount)
			]);

			await tryGetAchievements(user_data, interaction.member);
		}

		async function destroyBuilding() {
			const oldBuilding = server_data.buildings.find(item => item.id == user_data.building.id);
			user_data.building = { id: "", hits_left: 0 };

			const suffix = user_data.building.id != "" ? ' (Something Already Built!)' : server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount ? ' (Can\'t Afford!)' : '';

			buildingsRow.components[0].options[buildingIndex].setLabel(`${server_data.buildings[buildingIndex].icon} ${server_data.buildings[buildingIndex].name}`);
			buttonsRow.components[0].setLabel(`Build For ${server_data.buildings[buildingIndex].cost + buildModifier} Snow` + suffix);
			buttonsRow.components[0].setDisabled(server_data.buildings[buildingIndex].cost + buildModifier > user_data.snow_amount);
			buttonsRow.components[1].setDisabled(true);

			await set_building(interaction.member.id, { id: "", hits: 0 });

			await interaction.followUp({
				content: `You destroyed your ${oldBuilding.name}!`,
				flags: MessageFlags.Ephemeral
			});
		}

		const message = await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'buildings') {
				await i.deferUpdate();

				buildingIndex = selectBuilding(Number(i.values[0]));

				await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));
			} else if (i.customId == 'build') {
				await i.deferUpdate();

				await createBuilding(buildingIndex);

				await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));
			} else if (i.customId == 'destroy') {
				await i.deferUpdate();

				await destroyBuilding();

				await interaction.editReply(build_building(buildingsRow, buttonsRow, server_data.buildings[buildingIndex], buildModifier, user_data.snow_amount));
			}
		});
	}
};
