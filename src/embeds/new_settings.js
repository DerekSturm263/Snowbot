import { EmbedBuilder } from 'discord.js';

export function build_new_settings(opt) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('User Settings')
        .setDescription('Press the buttons below to toggle your personal settings.');
};
