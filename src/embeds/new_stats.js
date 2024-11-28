import { EmbedBuilder } from 'discord.js';

export function build_new_stats(data, score) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('Stats')
        .addFields(
			{ name: 'Server Score', 		value: `${score}`,													inline: true },
			{ name: 'Snow In-Hand', 		value: `${data.snow_amount}`, 											inline: true },
			{ name: 'Packed Item', 			value: `${data.packed_object ? data.packed_object.name : 'None'}`, 		inline: true },
			{ name: 'Building', 			value: `${data.current_building ? data.current_building.name : 'None'}`,inline: true }
		);
};
