// Lets users manage their pets.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { build_new_pet } from '../embeds/new_pet.js';
import { get_user_data, set_pet_last_eat_time, set_active_pet, set_pet_total_food, set_snow_amount, set_pet_appetite, set_pet_level, remove_pet } from '../miscellaneous/database.js';
import log from '../miscellaneous/debug.js';

function build_pet(row1, row2, pet) {
	const now = new Date();
	const isEgg = now.getTime() < pet.hatch_time;
	const isDead = pet.last_eat_time < new Date(now.getTime() - 24 * 60 * 60 * 1000);

	return {
		embeds: [ build_new_pet(pet, isEgg, isDead) ],
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

		log(`\n${interaction.user.displayName} used /pets:`);

        const user_data = await get_user_data(interaction.member.id);

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
							.setLabel(`${new Date().getTime() < pet.hatch_time ? 'Unhatched Egg' : pet.name + (pet.last_eat_time < new Date(new Date().getTime() - 24 * 60 * 60 * 1000) ? ' (RIP)' : pet.id == user_data.active_pet ? ' (Active)' : '')}`)
							.setValue(`${index}`)
							.setDefault(index == petIndex)
						)
					)
				);

		const now = new Date();
		const isEgg = now.getTime() < user_data.pets[petIndex].hatch_time;
		const isDead = user_data.pets[petIndex].last_eat_time < new Date(now.getTime() - 24 * 60 * 60 * 1000);

		const buttonsRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('setActive')
					.setLabel('Set As Active Pet')
					.setStyle('Primary')
					.setDisabled(user_data.pets[petIndex].id == user_data.active_pet || isEgg || isDead),
				new ButtonBuilder()
					.setCustomId('feed')
					.setLabel('Feed')
					.setStyle('Secondary')
					.setDisabled(isEgg || isDead),
				new ButtonBuilder()
					.setCustomId('release')
					.setLabel('Release')
					.setStyle('Danger')
					.setDisabled(isEgg)
			);

		function selectPet(index) {
			petIndex = index;

			for (let i = 0; i < user_data.pets.length; ++i) {
				petsRow.components[0].options[i].setDefault(i == index);
			}

			const now = new Date();
			const isEgg = now.getTime() < user_data.pets[index].hatch_time;
			const isDead = user_data.pets[index].last_eat_time < new Date(now.getTime() - 24 * 60 * 60 * 1000);

			buttonsRow.components[0].setDisabled(user_data.pets[index].id == user_data.active_pet || isEgg || isDead);
			buttonsRow.components[1].setDisabled(isEgg || isDead);
			buttonsRow.components[2].setDisabled(isEgg || isDead);
		}

		async function setActive(index) {
			user_data.active_pet = user_data.pets[index].id;
			await set_active_pet(interaction.member.id, user_data.pets[index]);

			for (let i = 0; i < user_data.pets.length; ++i) {
				const now = new Date();
				const isEgg = now.getTime() < user_data.pets[i].hatch_time;
				const isDead = user_data.pets[i].last_eat_time < new Date(now.getTime() - 24 * 60 * 60 * 1000);

				const suffix = isDead ? 'RIP' : user_data.pets[i].id == user_data.active_pet ? ' (Active)' : '';
				petsRow.components[0].options[i].setLabel(`${isEgg ? 'Unhatched Egg' : user_data.pets[i].name + suffix}`);
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
				++user_data.pets[index].total_food;
				user_data.pets[index].last_eat_time = now.getTime();
				--user_data.snow_amount;

				if (user_data.pets[index].level < 5 && user_data.pets[index].total_food >= user_data.pets[index].appetite) {
					user_data.pets[index].appetite += 10;
					++user_data.pets[index].level;
					user_data.pets[index].total_food = 0;

					await Promise.all([
						set_pet_appetite(interaction.member.id, index, user_data.pets[index].appetite),
						set_pet_level(interaction.member.id, index, user_data.pets[index].level)
					]);

					await interaction.followUp({
						content: `${user_data.pets[index].name} leveled up! Their ability has gotten stronger.`,
						flags: MessageFlags.Ephemeral
					});
				}

				await Promise.all([
					set_pet_total_food(interaction.member.id, index, user_data.pets[index].total_food),
					set_pet_last_eat_time(interaction.member.id, index, now.getTime()),
					set_snow_amount(interaction.member.id, user_data.snow_amount)
				]);
			}
		}

		async function release(index) {
			const oldPet = user_data.pets.splice(index, 1);
			await remove_pet(interaction.member.id, index);

			petsRow.components[0].options.splice(index, 1);

			// If the released pet was active, set no pets as active.
			if (user_data.active_pet == oldPet.id) {
				user_data.active_pet = "";
				await set_active_pet(interaction.member.id, "");
			}

			// If there are still pets left in your inventory, select the first one.
			if (user_data.pets.length > 0) {
				selectPet(0);
			}

			await interaction.followUp({
				content: `You released ${oldPet[0].name}!`,
				flags: MessageFlags.Ephemeral
			});
		}

		const message = await interaction.editReply(build_pet(petsRow, buttonsRow, user_data.pets[petIndex]));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'pets') {
				await i.deferUpdate();

				selectPet(Number(i.values[0]));

				await interaction.editReply(build_pet(petsRow, buttonsRow, user_data.pets[petIndex]));
			} else if (i.customId == 'setActive') {
				await i.deferUpdate();

				await setActive(petIndex);

				await interaction.editReply(build_pet(petsRow, buttonsRow, user_data.pets[petIndex]));
			} else if (i.customId == 'feed') {
				await i.deferUpdate();

				await feed(petIndex);

				await interaction.editReply(build_pet(petsRow, buttonsRow, user_data.pets[petIndex]));
			} else if (i.customId == 'release') {
				await i.deferUpdate();

				await release(petIndex);

				if (user_data.pets.length > 0) {
					await interaction.editReply(build_pet(petsRow, buttonsRow, user_data.pets[petIndex]));
				} else {
					await interaction.delete();
				}
			}
		});
	}
};
