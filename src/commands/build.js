// Builds something using snow from your hand.
// What you build will give you a certain number of shots to block.

import { MessageFlags, SlashCommandBuilder 							} from 'discord.js';
import { parseAchievements, get_user_data, set_snow_amount, set_building, get_weather, set_total_buildings	} from '../database.js';
import { build_new_building 							} from '../embeds/new_builds.js';
import builds from '../exports/builds.js';
import { build_new_achievement } from '../embeds/new_achievement.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Build something out of snow! Requires that you\'re holding snow. Items are cheaper in heavier snow.')
		.addStringOption(option => option
			.setName('build')
			.setDescription('What to build.')
			.setRequired(true)
			.addChoices(builds.map(item => ({
				name: `${item.name} (cost: ${item.cost} snow, blocks: ${item.hits} hits)`,
				value: item.id
			})))
		),
	
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /build:`);

		const [ user_data, weather ] = [ await get_user_data(interaction.member.id), get_weather(0) ];

		if (!user_data.playing) {
			await interaction.reply({
				content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

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
			await interaction.reply({
				content: 'Please enter a valid building name.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user already has something built.
		if (user_data.building != null) {
			await interaction.reply({
				content: `You already have a ${user_data.building.name} built!`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user doesn't have enough snow to build.
		if (user_data.snow_amount < buildObj.cost) {
			await interaction.reply({
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
		await interaction.reply({
			embeds: [ build_new_building(buildObj) ],
			flags: MessageFlags.Ephemeral
		});
		
		const achievements = await parseAchievements(user_data);
		await Promise.all(achievements.map(async item => {
			interaction.member.send({
				embeds: [ build_new_achievement(item, true, true) ]
			});
		}));
	}
};
