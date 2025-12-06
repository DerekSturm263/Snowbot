// Throws a snowball at another user that times them out.
// Throwing a snowball has a small chance to miss and a smaller chance to crit.

import { MessageFlags, SlashCommandBuilder,  																							} from 'discord.js';
import { get_user_data, set_packed_object, set_snow_amount, set_building, set_score, set_misses, set_hits, set_crits, set_times_hit, get_weather, get_server_data, invoke_pet_events, invoke_event, set_coins	} from '../miscellaneous/database.js';
import { build_snowball_hit, build_snowball_miss, build_snowball_block, build_snowball_block_break					    } from '../embeds/snowball.js';
import log from '../miscellaneous/debug.js';
import { build_new_coins } from '../embeds/new_coins.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('throw')
		.setDescription('Throw a snowball at someone! Requires that you\'re holding snow.')
		.addUserOption(option => option
			.setName('target')
			.setDescription('Who the snowball is being thrown at.')
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

		await invoke_event(0, server_data);

		if (user_data.snow_amount == 0 || interaction.member.id == target.user.id || target.user.bot) {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		}

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(user_data, 0),
				set_packed_object(user_data, { id: "" }),
				set_building(user_data, { id: "", hits: 0 })
			]);
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

		invoke_pet_events(user_data, target_data, weather, "onTryThrow");

		const miss = state < server_data.miss_chance;
		const crit = state >= server_data.crit_chance;
		const critMultiplier = crit ? 2 : 1;

		let amount = critMultiplier * (((user_data.packed_object != "" ? server_data.objects.find(item => item.id == user_data.packed_object).damage : 0) + 1));
		const oldObject = user_data.packed_object;

		// Decrement the snow amount.
		await Promise.all([
			set_snow_amount(user_data, user_data.snow_amount - 1),
			set_packed_object(user_data, { id: "" })
		]);

		let petName = "";
		let hitPet = false;

		invoke_pet_events(user_data, target_data, weather, "onThrow");

		// Check if the snowball missed.
		if (miss || hitPet) {
			await set_misses(user_data, interaction.member, user_data.misses + 1);
			
			await interaction.editReply({
				embeds: [ build_snowball_miss(target, hitPet, petName) ]
			});
			return;
		}

		if (crit) {
			await set_crits(user_data, interaction.member, user_data.crits + 1);
		}

		// Get the building if the user has one.
		if (target_data.building.id != "") {
			// Decrement the number of hits on the building.
			await set_building(target_data, { id: target_data.building.id, hits: target_data.building.hits_left - amount });
			
			// Check if the building is broken.
			if (target_data.building.hits_left <= 0) {
				// Increment the user's score.
				amount = critMultiplier * server_data.buildings.find(item => item.id == target_data.building.id).hits;
				const oldBuilding = target_data.building.id;

				await Promise.all([
					set_hits(user_data, interaction.member, user_data.hits + 1),
					set_times_hit(target_data, target.user, target_data.times_hit + 1),
					set_score(user_data, interaction.guild.id, interaction.member, user_data.score + amount),
					set_building(target_data, { id: "", hits: 0 })
				]);
				
				await interaction.editReply({
					embeds: [ build_snowball_block_break(target, server_data.objects.find(item => item.id == oldObject), user_data.score, target_data.score, interaction.member, crit, amount, server_data.buildings.find(item => item.id == oldBuilding)) ]
				});
				return;
			}

			await interaction.editReply({
				embeds: [ build_snowball_block(target, server_data.buildings.find(item => item.id == target_data.building.id), target_data.building.hits_left, crit) ]
			});
			return;
		}

		await Promise.all([
			set_hits(user_data, interaction.member, user_data.hits + 1),
			set_times_hit(target_data, target.user, target_data.times_hit + 1),
			set_score(user_data, interaction.guild.id, interaction.member, user_data.score + amount)
		]);
		
		// Tell the user the snowball hit.
		const message = await interaction.editReply({
			embeds: [ build_snowball_hit(target, server_data.objects.find(item => item.id == oldObject), user_data.score, target_data.score, interaction.member, crit, amount) ],
			withResponse: true
		});

		const coinChance = Math.random();
		if (coinChance <= server_data.coin_chance) {
			await set_coins(user_data, user_data.coins + 1);

			await interaction.followUp({
				embeds: [ build_new_coins(user_data) ],
				flags: MessageFlags.Ephemeral
			});
		}
		
		const ping = interaction.options.getBoolean('ping') ?? false;

		if (target_data.show_pings && ping) {
			// Send the target a DM telling them about the shot.
			await target.user.send({
				content: `You're under attack by <@${interaction.member.id}>! Click the link at the bottom to fight back!`
			});
			await message.forward(target.user.dmChannel);
		}
	}
}
