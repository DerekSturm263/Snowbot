import { EmbedBuilder } from 'discord.js';

export function build_new_collect(amount) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('You collected some snow!')
        .addFields({
			name: 'Snow Collected',
			value: `${amount}/20`
		});
};
