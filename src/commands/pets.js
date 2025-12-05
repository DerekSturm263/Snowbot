// Lets users manage their pets.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { build_new_pet } from '../embeds/new_pet.js';
import { get_user_data, set_pet_last_eat_time, set_active_pet, set_pet_total_food, set_snow_amount, set_pet_appetite, set_pet_level, remove_pet, set_packed_object, set_building, get_server_data, get_weather, invoke_event } from '../miscellaneous/database.js';
import log from '../miscellaneous/debug.js';

function build_pet(row1, row2, archetype, instance, currentSnow) {
	return {
		embeds: [ build_new_pet(archetype, instance, currentSnow) ],
		components: [ row1, row2 ],
		flags: MessageFlags.Ephemeral
	};
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('pets')
		.setDescription('Manage your pets by feeding them and selecting which one is active.'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		log(`\n${interaction.user.displayName} from ${interaction.guild.name} from ${interaction.guild.name} used /pets:`);

		const [ user_data, server_data, weather ] = [
			await get_user_data(interaction.member.id),
			await get_server_data(interaction.guild.id),
			get_weather(0)
		];

		await invoke_event(0, server_data);

		if (weather.cooldown == -2) {
			await Promise.all([
				set_snow_amount(user_data, 0),
				set_packed_object(user_data, { id: "" }),
				set_building(user_data, { id: "", hits: 0 })
			]);
		}

		if (user_data.pets.length == 0) {
			await interaction.editReply({
				content: 'You don\'t have any pets! Use `/collect` for a chance to find one!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		let petIndex = 0;

		const petsRow = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('pets')
					.addOptions(
						user_data.pets.map((pet, index) => new StringSelectMenuOptionBuilder()
							.setLabel(`${new Date().getTime() < pet.hatch_time ? '🥚 Unhatched Egg' : `${pet.last_eat_time < new Date(new Date().getTime() - 48 * 60 * 60 * 1000) ? '💀' : server_data.pets.find(pet => pet.id == user_data.pets[index].archetype_id).icon} ${pet.name}` + (pet.last_eat_time < new Date(new Date().getTime() - 48 * 60 * 60 * 1000) ? ' (RIP)' : pet.uuid == user_data.active_pet ? ' (Active)' : '')}`)
							.setValue(`${index}`)
							.setDefault(index == petIndex)
						)
					)
				);

		const now = new Date();
		const isEgg = now.getTime() < user_data.pets[petIndex].hatch_time;
		const isDead = user_data.pets[petIndex].last_eat_time < new Date(now.getTime() - 48 * 60 * 60 * 1000);

		const buttonsRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('setActive')
					.setLabel('Set As Active Pet')
					.setStyle('Primary')
					.setDisabled(user_data.pets[petIndex].uuid == user_data.active_pet || isEgg || isDead),
				new ButtonBuilder()
					.setCustomId('feed')
					.setLabel('Feed For 1 Snow')
					.setStyle('Secondary')
					.setDisabled(isEgg || isDead),
				new ButtonBuilder()
					.setCustomId('release')
					.setLabel('Release')
					.setStyle('Danger')
					.setDisabled(isEgg)
			);

		function selectPet(index) {
			for (let i = 0; i < user_data.pets.length; ++i) {
				petsRow.components[0].options[i].setDefault(i == index);
			}

			const now = new Date();
			const wayEarlier = new Date(now.getTime() - 48 * 60 * 60 * 1000);
			
			const isEgg = now.getTime() < user_data.pets[index].hatch_time;
			const isDead = user_data.pets[index].last_eat_time < wayEarlier;

			buttonsRow.components[0].setDisabled(user_data.pets[index].uuid == user_data.active_pet || isEgg || isDead);
			buttonsRow.components[1].setDisabled(isEgg || isDead);
			buttonsRow.components[2].setDisabled(isEgg);

			return index;
		}

		async function setActive(index) {
			await set_active_pet(user_data, user_data.pets[index].uuid);

			for (let i = 0; i < user_data.pets.length; ++i) {
				const now = new Date();
				const wayEarlier = new Date(now.getTime() - 48 * 60 * 60 * 1000);

				const isEgg = now.getTime() < user_data.pets[i].hatch_time;
				const isDead = user_data.pets[i].last_eat_time < wayEarlier;

				const suffix = isDead ? ' (RIP)' : user_data.pets[i].uuid == user_data.active_pet ? ' (Active)' : '';
				const archetype = server_data.pets.find(pet => pet.id == user_data.pets[i].archetype_id);

				petsRow.components[0].options[i].setLabel(`${isEgg ? '🥚 Unhatched Egg' : `${isDead ? '💀' : archetype.icon} ${user_data.pets[i].name}` + suffix}`);
			}

			buttonsRow.components[0].setDisabled(true);
		}

		async function feed(index) {
			const now = new Date();
			const earlier = new Date(now.getTime() - 1 * 60 * 60 * 1000);
			const later = new Date(user_data.pets[index].last_eat_time +  1 * 60 * 60 * 1000);

			if (user_data.pets[index].last_eat_time >= earlier) {
				await interaction.followUp({
					content: `${user_data.pets[index].name} is full! Try feeding them again <t:${Math.floor(later / 1000)}:R>.`,
					flags: MessageFlags.Ephemeral
				});
			} else if (user_data.snow_amount == 0) {
				await interaction.followUp({
					content: `You don't have any snow! Use \`/collect\` to get some.`,
					flags: MessageFlags.Ephemeral
				});
			} else {
				if (user_data.pets[index].level < 5 && user_data.pets[index].total_food >= user_data.pets[index].appetite) {
					await Promise.all([
						set_pet_total_food(user_data, index, -1),
						set_pet_appetite(user_data, index, user_data.pets[index].appetite + 5),
						set_pet_level(user_data, index, user_data.pets[index].level + 1)
					]);

					await interaction.followUp({
						content: `${user_data.pets[index].name} leveled up! Their ability has gotten stronger.`,
						flags: MessageFlags.Ephemeral
					});
				}

				await Promise.all([
					set_pet_total_food(user_data, index, user_data.pets[index].total_food + 1),
					set_pet_last_eat_time(user_data, index, now.getTime()),
					set_snow_amount(user_data, user_data.snow_amount - 1)
				]);
			}
		}

		async function release(index) {
			const oldPet = user_data.pets[index];
			await remove_pet(user_data, index);

			petsRow.components[0].options.splice(index, 1);
			for (let i = 0; i < petsRow.components[0].options.length; ++i) {
				petsRow.components[0].options[i].setValue(`${i}`);
			}

			// If the released pet was active, set no pets as active.
			if (user_data.active_pet == oldPet.id) {
				await set_active_pet(user_data, "");
			}

			// If there are still pets left in your inventory, select the first one.
			if (user_data.pets.length > 0) {
				petIndex = selectPet(0);
			}

			await interaction.followUp({
				content: `You released ${oldPet.name}!`,
				flags: MessageFlags.Ephemeral
			});
		}

		const archetype = server_data.pets.find(pet => pet.id == user_data.pets[petIndex].archetype_id);
		const message = await interaction.editReply(build_pet(petsRow, buttonsRow, archetype, user_data.pets[petIndex], user_data.snow_amount));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'pets') {
				await i.deferUpdate();

				petIndex = selectPet(Number(i.values[0]));

				const archetype = server_data.pets.find(pet => pet.id == user_data.pets[petIndex].archetype_id);
				await interaction.editReply(build_pet(petsRow, buttonsRow, archetype, user_data.pets[petIndex], user_data.snow_amount));
			} else if (i.customId == 'setActive') {
				await i.deferUpdate();

				await setActive(petIndex);

				const archetype = server_data.pets.find(pet => pet.id == user_data.pets[petIndex].archetype_id);
				await interaction.editReply(build_pet(petsRow, buttonsRow, archetype, user_data.pets[petIndex], user_data.snow_amount));
			} else if (i.customId == 'feed') {
				await i.deferUpdate();

				await feed(petIndex);

				const archetype = server_data.pets.find(pet => pet.id == user_data.pets[petIndex].archetype_id);
				await interaction.editReply(build_pet(petsRow, buttonsRow, archetype, user_data.pets[petIndex], user_data.snow_amount));
			} else if (i.customId == 'release') {
				await i.deferUpdate();

				await release(petIndex);
				petIndex = 0;

				if (user_data.pets.length > 0) {
					const archetype = server_data.pets.find(pet => pet.id == user_data.pets[petIndex].archetype_id);
					await interaction.editReply(build_pet(petsRow, buttonsRow, archetype, user_data.pets[petIndex], user_data.snow_amount));
				} else {
					await interaction.delete();
				}
			}
		});
	}
};
