// Collects snow from off the ground.
// Has a cooldown depending on how hard it's snowing.

import { MessageFlags, SlashCommandBuilder 													} from 'discord.js';
import { build_new_collect } from '../embeds/new_collect.js';
import { get_user_data, set_snow_amount, set_ready_time, get_weather, set_packed_object, set_building, set_total_snow_amount, add_pet, get_server_data, set_total_pets, invoke_pet_events, invoke_event	} from '../miscellaneous/database.js';
import { build_new_pet_unlocked } from '../embeds/new_pet.js';
import log from '../miscellaneous/debug.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect some fresh snow from off the ground. Has a chance to reveal an egg!'),

	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /collect:`);

		const [ user_data, server_data, weather ] = [
			await get_user_data(interaction.member.id),
			await get_server_data(interaction.guild.id),
			get_weather(0)
		];

		await invoke_event(0, server_data);

		let bypassWeather = false;
		let bypassCooldown = 0;

		invoke_pet_events(user_data, server_data, "onCheckWeather");
		//bypassWeather = true;
		//bypassCooldown = 10 - pet.level;

		if (!bypassWeather && weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(user_data, 0),
				set_packed_object(user_data, { id: "" }),
				set_building(user_data, { id: "", hits: 0 })
			]);
		}
		
		// Check if it isn't snowing.
		if (!bypassWeather && weather.cooldown < 0) {
			await interaction.editReply({
				content: 'It isn\'t snowing right now! Use `/forecast` to see when it will change.',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Check if the user isn't ready to collect more snow.
		if (user_data.ready_time > new Date().getTime()) {
			await interaction.editReply({
				content: `Slow down! You can collect more snow <t:${Math.floor(user_data.ready_time / 1000)}:R>.`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Get the amount of snow the user has and check if they already have the max.
		if (user_data.snow_amount >= server_data.max_snow_amount) {
			await interaction.editReply({
				content: `Your arms are full! You already have 20 snow!`,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		let readyTime = new Date().getTime() + (bypassWeather ? bypassCooldown : weather.cooldown) * 1000;
		
		invoke_pet_events(user_data, server_data, "onTryCollect");
		//readyTime -= pet.level * 1000;

		// Increment the user's snow amount and tell them it was a success.
		await Promise.all([
			set_ready_time(user_data, readyTime),
			set_snow_amount(user_data, user_data.snow_amount + server_data.snow_collect_amount),
			set_total_snow_amount(user_data, interaction.member, user_data.total_snow_amount + server_data.snow_collect_amount)
		]);
		
		await interaction.editReply({
			embeds: [ build_new_collect(user_data.snow_amount, readyTime) ],
			flags: MessageFlags.Ephemeral
		});

		let petChance = Math.random();

		invoke_pet_events(user_data, server_data, "onCollect");
		//petChance += pet.level * 0.075;

		if (petChance > server_data.egg_chance) {
			const pets = server_data.pets.map(pet => new Array(pet.count).fill(pet.id)).flat();

			const randomIndex = Math.floor(Math.random() * pets.length);
			const archetype = server_data.pets.find(item => item.id == pets[randomIndex]);

			let hatchOffset = 0;

			invoke_pet_events(user_data, server_data, "onGetEgg");
			//hatchOffset = pet.level * 0.4;

			const instance = await add_pet(user_data, archetype, hatchOffset);

			await set_total_pets(user_data, interaction.member, user_data.total_pets + 1);

			await interaction.followUp({
				embeds: [ build_new_pet_unlocked(archetype, instance) ],
				flags: MessageFlags.Ephemeral
			});
		}
	}
};
