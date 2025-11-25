// Builds something using snow from your hand.
// What you build will give you a certain number of shots to block.

import { MessageFlags, SlashCommandBuilder 							} from 'discord.js';
import { parseAchievements, get_user_data, set_snow_amount, set_building, get_weather, set_total_buildings, set_packed_object	} from '../database.js';
import { build_new_building 							} from '../embeds/new_builds.js';
import { build_new_get_achievement } from '../embeds/new_achievement.js';
import builds from '../exports/builds.js';
import log from '../debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Build something out of snow! Requires that you\'re holding snow. Items are cheaper in heavier snow.')
		.addStringOption(option => option
			.setName('build')
			.setDescription('What to build.')
			.setRequired(true)
			.addChoices(builds.map(item => ({
				name: `${item.name} (cost: ${item.cost} snow, blocks: ${item.hits} hit${item.hits == 1 ? '' : 's'})`,
				value: item.id
			})))
		),
	
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} used /build:`);

		const [ user_data, weather ] = [ await get_user_data(interaction.member.id), get_weather(0) ];

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
		
		// Get what the user is building
		const build = interaction.options.get('build').value;
		const buildObj = builds.find(item => item.id == build);

		buildObj.cost += weather.building_cost_modifier;

		// Check if the user entered an invalid value.
		if (buildObj == null) {
			await interaction.editReply({
				content: 'Please enter a valid building name.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user already has something built.
		if (user_data.building != null) {
			await interaction.editReply({
				content: `You already have a ${user_data.building.name} built!`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user doesn't have enough snow to build.
		if (user_data.snow_amount < buildObj.cost) {
			await interaction.editReply({
				content: 'You don\'t have enough snow! Use `/collect` to get some more!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		++user_data.total_buildings;

		// Set the new building and decrement the user's snow amount.
		await Promise.all([
			set_building(interaction.member.id, buildObj),
			set_total_buildings(interaction.member.id, user_data.total_buildings),
			set_snow_amount(interaction.member.id, user_data.snow_amount - buildObj.cost)
		]);

		// Tell the user the building was a success.
		await interaction.editReply({
			embeds: [ build_new_building(buildObj) ],
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
};
