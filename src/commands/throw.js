// Throws a snowball at another user that times them out.
// Throwing a snowball has a 25% chance to miss.

import { SlashCommandBuilder,  																							} from 'discord.js';
import { get_user_data, set_packed_object, set_snow_amount, set_building, set_score, set_misses, set_hits, set_crits, set_times_hit, get_current_weather	} from '../database.js';
import { build_snowball_hit, build_snowball_miss, build_snowball_block, build_snowball_block_break					    } from '../embeds/snowball.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('throw')
		.setDescription('Throw a snowball at someone! Requires that you\'re holding snow.')
		.addUserOption(option => option
			.setName('target')
			.setDescription('The unfortunate victim.')
			.setRequired(true))
		.addBooleanOption(option => option
			.setName('ping')
			.setDescription('Ping the target on hit?')
			.setRequired(false)
		),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /throw:`);

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
		
		// Get the snow amount and check if the user has any snow.
		if (user_data.snow_amount == 0) {
			await interaction.reply({ content: 'You don\'t have any snow! Use `/collect` to get some.', ephemeral: true });
			return;
		}

		// Get the target of the snowball.
		const target = interaction.options.getMember('target');

		// Check if the user is trying to throw a snowball at themselves.
		if (interaction.member.id == target.user.id) {
			await interaction.reply({ content: 'You can\'t throw a snowball at yourself!', ephemeral: true });
			return;
		}
		
		const target_data = await get_user_data(target.user.id);

		// Check if the user is opted in to playing.
		if (!target_data.playing) {
			await interaction.reply({ content: 'The target isn\'t opted in!', ephemeral: true });
			return;
		}

		const state = Math.random();
		const miss = state < 0.15;
		const crit = state > 0.9;

		// Decrement the snow amount.
		await set_snow_amount(interaction.member.id, user_data.snow_amount - 1);
		await set_packed_object(interaction.member.id, null);

		/*
		if (target.presence == null) {
			await interaction.reply({ embeds: [ build_snowball_hit_backstab(target, obj) ] });
			return;
		}
		*/

		// Check if the snowball missed.
		if (miss) {
			await interaction.reply({ embeds: [ build_snowball_miss(target) ] });
			await set_misses(interaction.member.id, user_data.misses + 1);
			
			return;
		}

		// Get the building if the user has one.
		if (target_data.building != null) {
			// Decrement the number of hits on the building.
			target_data.building.hits -= crit ? 2 : 1;
			
			// Check if the building is broken.
			if (target_data.building.hits == 0) {
				// Remove the building and tell the user it was broken.
				await set_building(target.user.id, null);
				await interaction.reply({ embeds: [ build_snowball_block_break(target, target_data.building.name) ] });
				
				return;
			}

			// Update the building and tell the user it was hit.
			await set_building(target.user.id, target_data.building);
			await interaction.reply({ embeds: [ build_snowball_block(target, target_data.building) ] });
			
			return;
		}
		
		if (crit) {
			await set_crits(interaction.member.id, user_data.crits + 1);
		}

		// Set the timeout time based on the packed object.
		const timeout_time = (5 + user_data.packed_object?.timeout_time) * crit ? 1.5 : 1;

		// Time the target out.
		target.timeout(timeout_time * 1000, 'Covered in snow!')
			.catch(err => console.error("User can't be timed out."));

		// Increment the user's score.
		const newScore = user_data.score + (crit ? 2 : 1);
		const newTargetScore = target_data.score - (crit ? 2 : 1);

		await set_score(interaction.member.id, newScore);
		await set_score(target.user.id, newTargetScore);
		await set_hits(interaction.member.id, user_data.hits + 1);
		await set_times_hit(target.user.id, target_data.times_hit + 1);

		// Tell the user the snowball hit.
		await interaction.reply({ embeds: [ build_snowball_hit(target, user_data.packed_object, newScore, newTargetScore, interaction.member, crit) ] });

		const ping = interaction.options.getMember('ping') ?? false;

		if (ping) {
			// Actually ping the user then delete the message to make it look like the embed pinged them.
			const msg = await interaction.channel.send(`<@${target.user.id}>`);
			msg.delete();
		}
	}
}
