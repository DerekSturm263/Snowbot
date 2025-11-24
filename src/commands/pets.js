// Lets users manage their pets.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { build_new_pet } from '../embeds/new_pet.js';
import { get_user_data, set_snow_amount } from '../database.js';

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
		.setDescription('Manage your pets by feeding them and select which ones are active.'),
			
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
							.setLabel(`${new Date().getTime() < pet.hatch_time ? 'Unhatched Egg' : pet.name}`)
							.setValue(`${index}`)
							.setDefault(index == 0)
						)
					)
				);

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

		const message = await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'pets') {
				await i.deferUpdate();

				petIndex = number(interaction.values[0]);

				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'setActive') {
				await i.deferUpdate();

				// TODO: Set pet as the active pet.

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
					// TODO: Increase pet fullness by 1.

					// TODO: Check for total_food_amount milestones and increase level as needed.

					await Promise.all([
						// TODO: Test to make sure this works. Might need --.
						set_snow_amount(interaction.member.id, user_data.snow_amount - 1)
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
