// Throws a snowball at another user that times them out.
// Throwing a snowball has a small chance to miss and a smaller chance to crit.

import { MessageFlags, SlashCommandBuilder,  																							} from 'discord.js';
import { parseAchievements, get_user_data, set_packed_object, set_snow_amount, set_building, set_score, set_misses, set_hits, set_crits, set_times_hit, get_current_weather, try_add_to_leaderboard	} from '../database.js';
import { build_snowball_hit, build_snowball_miss, build_snowball_block, build_snowball_block_break, build_snowball_hit_dm					    } from '../embeds/snowball.js';
import { build_new_achievement } from '../embeds/new_achievement.js';

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

		const [ user_data, weather ] = [ await get_user_data(interaction.member.id), await get_current_weather() ];

		if (!user_data.playing) {
			await interaction.reply({ content: 'You can\'t play if you\'re not opted in! Use `/opt in` to start playing!', flags: MessageFlags.Ephemeral });
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
		
		// Get the snow amount and check if the user has any snow.
		if (user_data.snow_amount == 0) {
			await interaction.reply({ content: 'You don\'t have any snow! Use `/collect` to get some.', flags: MessageFlags.Ephemeral });
			return;
		}

		// Get the target of the snowball.
		const target = interaction.options.getMember('target');

		// Check if the user is trying to throw a snowball at themselves.
		if (interaction.member.id == target.user.id) {
			await interaction.reply({ content: 'You can\'t throw a snowball at yourself!', flags: MessageFlags.Ephemeral });
			return;
		}
		
		const target_data = await get_user_data(target.user.id);

		// Check if the user is opted in to playing.
		if (!target_data.playing) {
			await interaction.reply({ content: 'The target isn\'t opted in!', flags: MessageFlags.Ephemeral });
			return;
		}

		const state = Math.random();

		if (target.presence && target.presence.status != "online") {
			state += 0.5;
		}

		const miss = state < 0.15;
		const crit = state >= 0.9;

		// Decrement the snow amount.
		await Promise.all([
			set_snow_amount(interaction.member.id, user_data.snow_amount - 1),
			set_packed_object(interaction.member.id, null)
		]);

		// Check if the snowball missed.
		if (miss) {
			++user_data.misses;

			await set_misses(interaction.member.id, user_data.misses);

			const achievements = await parseAchievements(user_data);
			await Promise.all(achievements.map(async item => {
				interaction.member.send({ embeds: [ build_new_achievement(item, true, true) ] });
			}));

			await interaction.reply({ embeds: [ build_snowball_miss(target) ] });
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
			++user_data.crits;
			await set_crits(interaction.member.id, user_data.crits);
		}

		// Set the timeout time based on the packed object.
		const timeout_time = (5 + user_data.packed_object?.timeout_time) * crit ? 1.5 : 1;

		// Time the target out.
		target.timeout(timeout_time * 1000, 'Covered in snow!')
			.catch(err => console.error("User can't be timed out."));

		// Increment the user's score.
		const newScore = user_data.score + (crit ? 2 : 1);
		const newTargetScore = target_data.score - (crit ? 2 : 1);

		++user_data.hits;
		++target_data.times_hit;

		await Promise.all([
			set_score(interaction.member.id, newScore),
			set_score(target.user.id, newTargetScore),
			set_hits(interaction.member.id, user_data.hits),
			set_times_hit(target.user.id, target_data.times_hit),
			try_add_to_leaderboard(interaction.guild.id, interaction.member.id),
			try_add_to_leaderboard(interaction.guild.id, target.user.id)
		]);
		
		// Tell the user the snowball hit.
		const message = await interaction.reply({ embeds: [ build_snowball_hit(target, user_data.packed_object, newScore, newTargetScore, interaction.member, crit) ], withResponse: true });

		const ping = interaction.options.getBoolean('ping') ?? false;

		if (ping) {
			// Send the target a DM telling them about the shot.
			await target.user.send({ content: `You're under attack by <@${interaction.member.id}>! Click the link at the bottom to fight back!` });
			await message.resource.message.forward(target.user.dmChannel);
		}
		
		const achievements = await parseAchievements(user_data);
		await Promise.all(achievements.map(async item => {
			interaction.member.send({ embeds: [ build_new_achievement(item, true, true) ] });
		}));

		const achievements2 = await parseAchievements(target_data);
		await Promise.all(achievements2.map(async item => {
			target.user.send({ embeds: [ build_new_achievement(item, true, true) ] });
		}));
	}
}
