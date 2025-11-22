import { EmbedBuilder } from 'discord.js';

export function build_new_building(build) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`You built a **${build.name}**!`)
        .setImage(build.image)
        .addFields({
			name: 'Hits Left',
			value: `${build.hits}`
		});
};
