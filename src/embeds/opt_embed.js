import { EmbedBuilder } from 'discord.js';

export function build_new_opt(opt) {
    const messages = [
        'You opted in! Have fun!',
        'You opted out! Thanks for playing!'
    ];
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(messages[opt]);
};
