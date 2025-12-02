import { EmbedBuilder } from 'discord.js';

export function build_new_building(build, costModifier, currentSnow) {
	return new EmbedBuilder()
        .setColor(currentSnow >= build.cost + costModifier ? 0x00FF00 : 0xFF0000)
		.setTitle(`${build.icon} **${build.name}**`)
		.setDescription(`${build.description}`)
        .setImage(build.image)
        .addFields(
			{
				name: 'Health',
				value: `${build.hits}`,
				inline: true
			},
			{
				name: 'Snow Cost',
				value: `${build.cost + costModifier}`,
				inline: true
			},
			{
				name: 'Current Snow In-Hand',
				value: `${currentSnow}`,
				inline: true
			}
		);
};
