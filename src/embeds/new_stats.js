import { EmbedBuilder } from 'discord.js';

export function build_new_stats(name, data, hide_data) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${name}'s Stats`)
        .addFields(
			{ name: 'Score', 		value: `${data.score}`,												inline: true },
			{ name: 'Hits', 		value: `${data.hits}`,		inline: true },
			{ name: 'Crits', 		value: `${data.crits}`,													inline: true },
			{ name: 'Misses', 		value: `${data.misses}`,	inline: true },
			{ name: 'Times Hit', 		value: `${data.times_hit}`,												inline: true }
		)
		.addFields(
			{ name: 'Snow In-Hand', 		value: hide_data ? '???' : `${data.snow_amount}`, 											inline: true },
			{ name: 'Packed Item', 			value: hide_data ? '???' : `${data.packed_object ? `${data.packed_object.name}\n(Timeout: +${data.packed_object.timeout_time}s)` : 'None'}`, 		inline: true },
			{ name: 'Building', 			value: hide_data ? '???' : `${data.building ? `${data.building.name}\n(Hits Left: ${data.building.hits})` : 'None'}`,inline: true }
		);
};
