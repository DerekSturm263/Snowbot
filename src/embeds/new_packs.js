import { EmbedBuilder } from 'discord.js';

export function build_new_pack(obj) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`You packed a **${obj.name}** in your snowball!`)
		.setDescription(`${obj.description}`)
        .setImage(obj.image)
        .addFields(
			{
				name: `Damage`,
				value: `+${obj.damage} Damage`,
				inline: true
			}
		);
};

export function build_new_pack_existing(obj) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${obj.name}`)
		.setDescription(`${obj.description}`)
        .setImage(obj.image)
        .addFields(
			{
				name: `Damage`,
				value: `+${obj.damage} Damage`,
				inline: true
			}
		);
};
