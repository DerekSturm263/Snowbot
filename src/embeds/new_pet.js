import { EmbedBuilder } from 'discord.js';

export function build_new_pet() {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('Pets')
        .setDescription('New feature coming soon! Stay tuned for updates!');
};
