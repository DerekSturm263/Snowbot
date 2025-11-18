import { EmbedBuilder } from 'discord.js';

export function build_new_stats(name, data, hide_data) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${name}'s Stats`)
        .addFields(
			{ name: 'Current Score', 			value: `${data.score}`,												inline: true },
			{ name: 'Hits', 					value: `${data.hits}`,		inline: true },
			{ name: 'Crits', 					value: `${data.crits}`,													inline: true },
			{ name: 'Misses',		 			value: `${data.misses}`,	inline: true },
			{ name: 'Times Hit', 				value: `${data.times_hit}`,												inline: true }
		)
		.addFields(
			{ name: 'Current Snow Collected',	value: hide_data ? '???' : `${data.snow_amount}`, 											inline: true },
			{ name: 'Current Packed Item', 		value: hide_data ? '???' : `${data.packed_object ? `${data.packed_object.name}\n(Timeout: +${data.packed_object.timeout_time}s)` : 'None'}`, 		inline: true },
			{ name: 'Current Building', 		value: hide_data ? '???' : `${data.building ? `${data.building.name}\n(Hits Left: ${data.building.hits})` : 'None'}`, inline: true }
		)
		.addFields(
			{ name: 'Total Snow Collected',		value: `${data.total_snow_amount}`, 											inline: true },
			{ name: 'Total Packed Items', 		value: `${data.total_packed_objects}`, 		inline: true },
			{ name: 'Total Buildings', 			value: `${data.total_buildings}`, inline: true }
		);
};
