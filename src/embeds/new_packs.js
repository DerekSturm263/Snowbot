import { EmbedBuilder } from 'discord.js';

export function build_new_pack(obj) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`You packed a **${obj.name}** in your snowball!`)
		.setDescription('Your packed snowball will do extra damage to buildings and score you extra points.')
        .setImage(obj.image)
        .addFields(
			{
				name: `Damage`,
				value: `+${obj.damage} Damage`,
				inline: true
			}
		);
};
