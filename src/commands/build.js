// Builds something using snow from your hand.
// What you build will give you a certain number of shots to block.

import { SlashCommandBuilder 							} from 'discord.js';
import { get_user_data, set_snow_amount, set_building, get_current_weather	} from '../database.js';
import { build_new_building 							} from '../embeds/new_builds.js';
import builds from '../exports/builds.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Build something out of snow! Requires that you\'re holding snow. Items are cheaper in heavier snow.')
		.addStringOption(option => option
			.setName('build')
			.setDescription('What to build.')
			.setRequired(true)
			.addChoices(builds.map(item => ({
				name: `${item.name} (cost: ${item.cost}, hits: ${item.hits})`,
				value: item.id
			})))
		),
	
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /build:`);

		const user_data = await get_user_data(interaction.member.id);

		if (!user_data.playing) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}
		
		const weather = await get_current_weather();

		if (weather.cooldown == -2) {
			await set_snow_amount(interaction.member.id, 0);
			await set_packed_object(interaction.member.id, null);
			await set_building(interaction.member.id, null);

			user_data.snow_amount = 0;
			user_data.packed_object = null;
			user_data.building = null;
		}
		
		// Get what the user is building
		const build = interaction.options.get('build').value;
		const buildObj = builds.find(item => item.id == build);

		buildObj.cost -= weather.building_cost_modifier;

		// Check if the user entered an invalid value.
		if (buildObj == null) {
			await interaction.reply({ content: 'Please enter a valid building name.', ephemeral: true });
			return;
		}

		// Check if the user already has something built.
		if (user_data.building != null) {
			await interaction.reply({ content: `You already have a ${user_data.building.name} built!`, ephemeral: true });
			return;
		}

		// Check if the user doesn't have enough snow to build.
		if (user_data.snow_amount < buildObj.cost) {
			await interaction.reply({ content: 'You don\'t have enough snow! Use `/collect` to get some more!', ephemeral: true });
			return;
		}

		// Set the new building and decrement the user's snow amount.
		await set_building(interaction.member.id, buildObj);
		await set_snow_amount(interaction.member.id, user_data.snow_amount - buildObj.cost);

		// Tell the user the building was a success.
		await interaction.reply({ embeds: [ build_new_building(buildObj) ], ephemeral: true });
	}
};
