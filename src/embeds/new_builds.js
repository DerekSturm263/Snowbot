import { EmbedBuilder } from 'discord.js';

export function build_new_building(build, costModifier, currentSnow) {
	return new EmbedBuilder()
        .setColor(currentSnow >= build.cost + costModifier ? 0x00FF00 : 0xFF0000)
		.setTitle(`${build.name}`)
		//.setDescription(`${build.description}`)
        .setImage(build.image)
        .addFields(
			{
				name: 'Health',
				value: `${build.hits}`,
				inline: true
			},
			{
				name: 'Cost',
				value: `${build.cost + costModifier}`,
				inline: true
			},
			{
				name: 'You Have',
				value: `${currentSnow}`,
				inline: true
			}
		);
};

export function build_new_building_buy(build) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`You built a **${build.name}**!`)
		.setDescription('Your new building will takes hits for you until it breaks.')
        .setImage(build.image)
        .addFields({
			name: 'Current Health',
			value: `${build.hits}`
		});
};
