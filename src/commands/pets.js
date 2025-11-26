// Lets users manage their pets.

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { build_new_pet } from '../embeds/new_pet.js';
import { get_user_data, set_pet_fullness, set_active_pet, set_pet_total_food, set_snow_amount, set_pet_appetite, set_pet_level } from '../miscellaneous/database.js';
import log from '../miscellaneous/debug.js';

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

		log(`\n${interaction.user.displayName} used /pets:`);

		await interaction.editReply({ content: "Feature under construction. Check back soon!" });
		return;

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
							.setLabel(`${new Date().getTime() < pet.hatch_time ? 'Unhatched Egg' : pet.name + (pet.id == user_data.active_pet ? ' (Active)' : '')}`)
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
					.setDisabled(user_data.pets[petIndex].id == user_data.active_pet || new Date().getTime() < user_data.pets[petIndex].hatch_time),
				new ButtonBuilder()
					.setCustomId('feed')
					.setLabel('Feed')
					.setStyle('Secondary')
					.setDisabled(new Date().getTime() < user_data.pets[petIndex].hatch_time)/*,
				new ButtonBuilder()
					.setCustomId('release')
					.setLabel('Release')
					.setStyle('Danger')
					.setDisabled(new Date().getTime() < user_data.pets[petIndex].hatch_time)*/
			);

		const message = await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId == 'pets') {
				await i.deferUpdate();

				petIndex = Number(i.values[0]);

				for (let i = 0; i < user_data.pets.length; ++i) {
					row1.components[0].options[i].setDefault(i == petIndex);
				}

				row2.components[0].setDisabled(user_data.pets[petIndex].id == user_data.active_pet || new Date().getTime() < user_data.pets[petIndex].hatch_time);
				row2.components[1].setDisabled(new Date().getTime() < user_data.pets[petIndex].hatch_time);
				//row2.components[2].setDisabled(new Date().getTime() < user_data.pets[petIndex].hatch_time);

				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'setActive') {
				await i.deferUpdate();

				user_data.active_pet = user_data.pets[petIndex].id;
				await set_active_pet(interaction.member.id, user_data.pets[petIndex]);

				for (let i = 0; i < user_data.pets.length; ++i) {
					const suffix = user_data.pets[i].id == user_data.active_pet ? ' (Active)' : '';
					row1.components[0].options[i].setLabel(`${new Date().getTime() < user_data.pets[i].hatch_time ? 'Unhatched Egg' : user_data.pets[i].name + suffix}`);
				}

				row2.components[0].setDisabled(true);

				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'feed') {
				await i.deferUpdate();

				if (user_data.pets[petIndex].fullness >= 3) {
					await interaction.followUp({
						content: `${user_data.pets[petIndex].name} is full! Try feeding them again later.`,
						flags: MessageFlags.Ephemeral
					});
				} else if (user_data.snow_amount == 0) {
					await interaction.followUp({
						content: `You don't have any snow! Use \`/collect\` to get some.`,
						flags: MessageFlags.Ephemeral
					});
				} else {
					++user_data.pets[petIndex].total_food;
					++user_data.pets[petIndex].fullness;
					--user_data.snow_amount;

					if (user_data.pets[petIndex].level < 5 && user_data.pets[petIndex].total_food >= user_data.pets[petIndex].appetite) {
						user_data.pets[petIndex].appetite += 10;
						++user_data.pets[petIndex].level;
						user_data.pets[petIndex].total_food = 0;

						await Promise.all([
							set_pet_appetite(interaction.member.id, petIndex, user_data.pets[petIndex].appetite),
							set_pet_level(interaction.member.id, petIndex, user_data.pets[petIndex].level)
						]);

						await interaction.followUp({
							content: `${user_data.pets[petIndex].name} leveled up! Their ability has gotten stronger.`,
							flags: MessageFlags.Ephemeral
						});
					}

					await Promise.all([
						set_pet_total_food(interaction.member.id, petIndex, user_data.pets[petIndex].total_food),
						set_pet_fullness(interaction.member.id, petIndex, user_data.pets[petIndex].fullness),
						set_snow_amount(interaction.member.id, user_data.snow_amount)
					]);
				}
				
				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			} else if (i.customId == 'release') {
				await i.deferUpdate();
	
				await interaction.editReply(build_pet(row1, row2, user_data.pets[petIndex]));
			}
		});
	}
};
