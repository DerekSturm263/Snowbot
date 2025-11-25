// Lets users manage their pets.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { build_new_pet } from '../embeds/new_pet.js';
import { get_user_data, set_pet_fullness, set_pet_is_active, set_pet_total_food, set_snow_amount } from '../database.js';

function build_pet(row1, row2, pet) {
	const isEgg = new Date().getTime() < pet.hatch_time;

	return {
		embeds: [ build_new_pet(pet, isEgg) ],
		components: [ row1, row2 ],
		flags: MessageFlags.Ephemeral
	};
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('pets')
		.setDescription('Manage your pets by feeding them and selecting which one is active (WIP).'),
			
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		console.log(`\n${interaction.user.displayName} used /pets:`);

        const user_data = await get_user_data(interaction.member.id);

		if (user_data.pets.length == 0) {
			await interaction.editReply({
				content: 'You don\'t have any pets! Use `/collect` for a chance to find one!',
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		let petIndex = 0;

		const row1 = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('pets')
					.addOptions(
						user_data.pets.map((pet, index) => new StringSelectMenuOptionBuilder()
							.setLabel(`${new Date().getTime() < pet.hatch_time ? 'Unhatched Egg' : pet.name + (pet.is_active ? ' (Active)' : '')}`)
							.setValue(`${index}`)
							.setDefault(index == petIndex)
						)
					)
				);

		const row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('setActive')
					.setLabel('Set As Active Pet')
					.setStyle('Primary')
					.setDisabled(user_data.pets[petIndex].is_active || new Date().getTime() < user_data.pets[petIndex].hatch_time)
			);
/*
		const row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('setActive')
					.setLabel('Set As Active Pet')
					.setStyle('Primary')
					.setDisabled(user_data.pets[petIndex].is_active || new Date().getTime() < user_data.pets[petIndex].hatch_time),
				new ButtonBuilder()
					.setCustomId('feed')
					.setLabel('Feed')
					.setStyle('Primary')
					.setDisabled(new Date().getTime() < user_data.pets[petIndex].hatch_time),
				new ButtonBuilder()
					.setCustomId('rename')
					.setLabel('Rename')
					.setStyle('Primary')
					.setDisabled(new Date().getTime() < user_data.pets[petIndex].hatch_time)
			);
*/
		const message = await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'pets') {
				await i.deferUpdate();

				petIndex = Number(i.values[0]);

				for (let i = 0; i < user_data.pets.length; ++i) {
					row1.components[0].options[i].setDefault(i == petIndex);
				}

				row2.components[0].setDisabled(user_data.pets[petIndex].is_active);

				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'setActive') {
				await i.deferUpdate();

				await Promise.all([
					set_pet_is_active(interaction.member.id, petIndex, true),
					...user_data.pets.filter((pet, index) => index != petIndex).map((pet, index) => set_pet_is_active(interaction.member.id, index, false))
				]);

				row2.components[0].setDisabled(true);

				await interaction.followUp({
					content: `${user_data.pets[petIndex].name} is now the active pet.`,
					flags: MessageFlags.Ephemeral
				});

				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'feed') {
				await i.deferUpdate();

				if (user_data.pets[petIndex].fullness > 3) {
					await interaction.followUp({
						content: 'Your pet is full! Try feeding them again later.',
						flags: MessageFlags.Ephemeral
					});
				} else {
					// TODO: Check for total_food_amount milestones and increase level as needed.
					if (user_data) {

					}

					await Promise.all([
						set_pet_total_food(interaction.member.id, petIndex, user_data.pets[petIndex].total_food + 1), // ++?
						set_pet_fullness(interaction.member.id, petIndex, user_data.pets[petIndex].fullness + 1), // ++?
						set_snow_amount(interaction.member.id, user_data.snow_amount - 1) // --?
					]);
				}
				
				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'rename') {
				await i.deferUpdate();
				
				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			}
		});
	}
};
