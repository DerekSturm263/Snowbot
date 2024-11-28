import { EmbedBuilder } from 'discord.js';

export function build_new_pack(obj) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`You packed a **${obj.name}** in your snowball!`)
        .setImage(obj.image)
        .addFields({ name: 'Timeout Time', value: `+${obj.timeout_time} Seconds` });
};
