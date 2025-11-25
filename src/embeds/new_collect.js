import { EmbedBuilder } from 'discord.js';

export function build_new_collect(amount, readyTime) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('You collected some snow!')
		.setDescription(`You can collect more <t:${Math.floor(readyTime / 1000)}:R>`)
        .addFields({
			name: 'Snow Collected',
			value: `${amount}/20`
		});
};
