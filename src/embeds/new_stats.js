import { EmbedBuilder } from 'discord.js';

export function build_new_stats(name, user_data, server_data, hide_data) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${name}'s Stats`)
        .addFields(
			{
				name: 'Current Score',
				value: `${user_data.score}`,
				inline: true
			},
			{
				name: 'Hits',
				value: `${user_data.hits}`,
				inline: true
			},
			{
				name: 'Crits',
				value: `${user_data.crits}`,
				inline: true
			},
			{
				name: 'Misses',
				value: `${user_data.misses}`,
				inline: true
			},
			{
				name: 'Times Hit',
				value: `${user_data.times_hit}`,
				inline: true
			},
			{
				name: 'Current Snow In-Hand',
				value: hide_data ? '???' : `${user_data.snow_amount}`,
				inline: true
			},
			{
				name: 'Total Snow Collected',
				value: `${user_data.total_snow_amount}`,
				inline: true
			},
			{
				name: 'Total Packed Items',
				value: `${user_data.total_packed_objects}`,
				inline: true
			},
			{
				name: 'Total Buildings',
				value: `${user_data.total_buildings}`,
				inline: true
			},
			{
				name: 'Total Pets Owned',
				value: `${user_data.total_pets}`,
				inline: true
			}
		);
};
