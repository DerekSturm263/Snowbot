// Throws a snowball at another user that times them out.
// Throwing a snowball has a small chance to miss and a smaller chance to crit.

import { MessageFlags, SlashCommandBuilder,  																							} from 'discord.js';
import { get_user_data, set_packed_object, set_snow_amount, set_building, set_score, set_misses, set_hits, set_crits, set_times_hit, get_weather, try_add_to_server, get_server_data, tryGetAchievements	} from '../miscellaneous/database.js';
import { build_snowball_hit, build_snowball_miss, build_snowball_block, build_snowball_block_break					    } from '../embeds/snowball.js';
import log from '../miscellaneous/debug.js';

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
		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /throw:`);

		const target = interaction.options.getMember('target');
		const [ user_data, target_data, server_data, weather ] = [
			await get_user_data(interaction.member.id),
			await get_user_data(target.user.id),
			await get_server_data(interaction.guild.id),
			get_weather(0)
		];

		if (user_data.snow_amount == 0 || interaction.member.id == target.user.id || target.user.bot) {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		}

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
		
		// Get the snow amount and check if the user has any snow.
		if (user_data.snow_amount == 0) {
			await interaction.editReply({
				content: 'You don\'t have any snow! Use `/collect` to get some.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user is trying to throw a snowball at themselves.
		if (interaction.member.id == target.user.id) {
			await interaction.editReply({
				content: 'You can\'t throw snowballs at yourself!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}
		
		// Check if the user is trying to throw a snowball at a bot.
		if (target.user.bot) {
			await interaction.editReply({
				content: 'You can\'t throw snowballs at bots!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}
		
		await interaction.deferReply();

		let state = Math.random();

		if (target.presence && target.presence.status != "online") {
			state += 0.5;
		}

		const pet = user_data.pets.find(pet => pet.id == user_data.id);
		if (pet && pet.type == "snow_bunny") {
			state += pet.level * 0.1;
		}

		const miss = state < 0.15;
		const crit = state >= 0.9;

		--user_data.snow_amount;

		// Decrement the snow amount.
		await Promise.all([
			set_snow_amount(interaction.member.id, user_data.snow_amount),
			set_packed_object(interaction.member.id, { id: "" })
		]);

		const pet2 = target_data.pets.find(pet => pet.id == user_data.id);
		let hitPet = false;

		if (pet2 && pet2.type == "snow_fox") {
			const blockChance = Math.random();

			if (blockChance < pet2.level * 0.1) {
				hitPet = true;
			}
		}

		// Check if the snowball missed.
		if (miss || hitPet) {
			++user_data.misses;

			await set_misses(interaction.member.id, user_data.misses);
			await tryGetAchievements(user_data, interaction.member);
			
			await interaction.editReply({
				embeds: [ build_snowball_miss(target, hitPet, pet2?.name) ]
			});
			return;
		}

		let amount = (crit ? 2 : 1) * (((user_data.packed_object ? user_data.packed_object.damage : 0) + 1));

		if (crit) {
			++user_data.crits;
			await set_crits(interaction.member.id, user_data.crits);
		}

		// Get the building if the user has one.
		if (target_data.building.id != "") {
			// Decrement the number of hits on the building.
			target_data.building.hits_left -= amount;
			
			// Check if the building is broken.
			if (target_data.building.hits_left <= 0) {
				// Increment the user's score.
				amount = (crit ? 2 : 1) * server_data.buildings.find(item => item.id == target_data.building.id).hits;
				const newScore = user_data.score + amount;

				++user_data.hits;
				++target_data.times_hit;

				await Promise.all([
					set_score(interaction.member.id, newScore),
					try_add_to_server(interaction.guild.id, interaction.member.id)
				]);
				
				// Remove the building and tell the user it was broken.
				await set_building(target.user.id, { id: "", hits: 0 });
				await interaction.editReply({
					embeds: [ build_snowball_block_break(target, user_data.packed_object, newScore, target_data.score, interaction.member, crit, amount, server_data.buildings.find(item => item.id == target_data.building.id)) ]
				});
				
				return;
			}

			// Update the building and tell the user it was hit.
			await set_building(target.user.id, { id: target_data.building.id, hits: target_data.building.hits_left });
			await interaction.editReply({
				embeds: [ build_snowball_block(target, server_data.buildings.find(item => item.id == target_data.building.id), target_data.building.hits_left, crit) ]
			});
			
			return;
		}
		
		// Increment the user's score.
		const newScore = user_data.score + amount;

		++user_data.hits;
		++target_data.times_hit;

		await Promise.all([
			set_score(interaction.member.id, newScore),
			set_hits(interaction.member.id, user_data.hits),
			set_times_hit(target.user.id, target_data.times_hit),
			try_add_to_server(interaction.guild.id, interaction.member.id),
			try_add_to_server(interaction.guild.id, target.user.id)
		]);
		
		// Tell the user the snowball hit.
		const message = await interaction.editReply({
			embeds: [ build_snowball_hit(target, server_data.objects.find(item => item.id == user_data.packed_object.id), newScore, target_data.score, interaction.member, crit, amount) ],
			withResponse: true
		});

		const ping = interaction.options.getBoolean('ping') ?? false;

		if (target_data.show_pings && ping) {
			// Send the target a DM telling them about the shot.
			await target.user.send({
				content: `You're under attack by <@${interaction.member.id}>! Click the link at the bottom to fight back!`
			});
			await message.forward(target.user.dmChannel);
		}

		await Promise.all([
			tryGetAchievements(user_data, interaction.member),
			tryGetAchievements(target_data, target.user)
		]);
	}
}
