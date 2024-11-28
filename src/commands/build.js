// Builds something using snow from your hand.
// What you build will give you a certain number of shots to block.

import { SlashCommandBuilder 											} from 'discord.js';
import { get_snow_amount, set_snow_amount, get_building, set_building, get_opt	} from '../serialize.js';
import { snowman, snow_wall, snow_fort, igloo, snow_castle				} from '../exports/builds.js'
import { build_new_building 											} from '../embeds/new_builds.js';

const builds = new Map([
	[ "snowman", 		snowman 	],
	[ "snow_wall", 		snow_wall 	],
	[ "igloo", 			igloo 		],
	[ "snow_fort", 		snow_fort 	],
	[ "snow_castle",	snow_castle	]
]);

export const command = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Build something out of snow! Requires that you\'re holding snow.')
		.addStringOption(option => option
			.setName('build')
			.setDescription('What to build.')
			.setRequired(true)
			.addChoices(
				{ name: 'Snowman (cost: 2, hits: 2)', 		value: 'snowman' 	},
				{ name: 'Snow Wall (cost: 4, hits: 3)', 	value: 'snow_wall' 	},
				{ name: 'Igloo (cost: 5, hits: 4)', 		value: 'igloo' 		},
				{ name: 'Snow Fort (cost: 8, hits: 5)', 	value: 'snow_fort' 	},
				{ name: 'Snow Castle (cost: 10, hits: 7)',	value: 'snow_castle'}
			)),
			
	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /build:`);

		if (await get_opt(interaction.member.id) == false) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}
		
		// Get what the user is building
		const build = interaction.options.get('build');
		const buildObj = builds.get(build.value);

		// Check if the user entered an invalid value.
		if (buildObj == null) {
			await interaction.reply({ content: 'Please try entering something valid.', ephemeral: true });
			return;
		}

		// Check if the user already has something built.
		const building = await get_building(interaction.member.id);
		if (building != null) {
			await interaction.reply({ content: `You already have a ${building.name} built!`, ephemeral: true });
			return;
		}

		// Check if the user doesn't have enough snow to build.
		const snow_amount = await get_snow_amount(interaction.member.id);
		if (snow_amount < buildObj.cost) {
			await interaction.reply({ content: 'You don\'t have enough snow! Use `/collect` to get some more!', ephemeral: true });
			return;
		}

		// Set the new building and decrement the user's snow amount.
		await set_building(interaction.member.id, buildObj);
		await set_snow_amount(interaction.member.id, snow_amount - buildObj.cost);

		// Tell the user the building was a success.
		await interaction.reply({ embeds: [ build_new_building(buildObj) ], ephemeral: true });
	}
};
