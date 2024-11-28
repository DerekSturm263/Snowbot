// Throws a snowball at another user that times them out.
// Throwing a snowball has a 25% chance to miss.

import { SlashCommandBuilder,  																							} from 'discord.js';
import { get_packed_object, get_snow_amount, set_packed_object, set_snow_amount, get_building, set_building, get_opt	} from '../serialize.js';
import { build_snowball_hit, build_snowball_miss, build_snowball_block, build_snowball_block_break					    } from '../embeds/snowball.js';
import { get_score, set_score } from '../update_leaderboard.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('throw')
		.setDescription('Throw a snowball at someone! Requires that you\'re holding snow.')
		.addUserOption(option => option
			.setName('target')
			.setDescription('The unfortunate victim.')
			.setRequired(true)),

	async execute(interaction) {
		console.log(`\n${interaction.member.id} used /throw:`);

		const opt1 = await get_opt(interaction.member.id);
		if (opt1 == false) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', ephemeral: true });
			return;
		}

		// Get the target of the snowball.
		const target = interaction.options.getMember('target');

		// Check if the user is trying to throw a snowball at themselves.
		if (interaction.member.id == target.user.id) {
			await interaction.reply({ content: 'You can\'t throw a snowball at yourself!', ephemeral: true });
			return;
		}
		
		// Get the snow amount and check if the user has any snow.
		const snow_amount = await get_snow_amount(interaction.member.id);
		if (snow_amount == 0) {
			await interaction.reply({ content: 'You don\'t have any snow! Use `/collect` to get some.', ephemeral: true });
			return;
		}

		// Check if the user is opted in to playing.
		const opt = await get_opt(target.user.id);
		if (opt == false) {
			await interaction.reply({ content: 'The target isn\'t opted in!', ephemeral: true });
			return;
		}

		const obj = await get_packed_object(interaction.member.id);

		// Decrement the snow amount.
		await set_snow_amount(interaction.member.id, snow_amount - 1);
		await set_packed_object(interaction.member.id, null);

		/*
		if (target.presence == null) {
			await interaction.reply({ embeds: [ build_snowball_hit_backstab(target, obj) ] });
			return;
		}
		*/

		// Check if the snowball missed.
		if (Math.random() < 0.20) {
			await interaction.reply({ embeds: [ build_snowball_miss(target) ] });
			return;
		}

		// Get the building if the user has one.
		let build = await get_building(target.user.id);
		if (build != null) {
			// Decrement the number of hits on the building.
			--build.hits;
			if (build.hits == 0) {
				// Remove the building and tell the user it was broken.
				await set_building(target.user.id, null);
				await interaction.reply({ embeds: [ build_snowball_block_break(target, build.name) ] });
				return;
			}

			// Update the building and tell the user it was hit.
			await set_building(target.user.id, build);
			await interaction.reply({ embeds: [ build_snowball_block(target, build) ] });
			return;
		}
		
		// Set the timeout time based on the packed object.
		let timeout_time = 5;
		if (obj != null) {
			timeout_time += obj.timeout_time;
		}

		// Time the target out.
		target.timeout(timeout_time * 1000, 'Covered in snow!')
			.catch(err => console.error("User can't be timed out."));

		// Increment the user's score.
		const score = await get_score(interaction.guild.id, interaction.member.id);
		const score2 = await get_score(interaction.guild.id, target.user.id);
		await set_score(interaction.guild.id, interaction.member.id, score + 1);

		// Tell the user the snowball hit.
		await interaction.reply({ embeds: [ build_snowball_hit(target, obj, score + 1, score2, interaction.member) ] });
		
		// Actually ping the user then delete the message to make it look like the embed pinged them.
		let msg = await interaction.channel.send(`<@${target.user.id}>`);
		msg.delete();
	}
}
