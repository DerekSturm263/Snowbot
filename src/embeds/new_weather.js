import { EmbedBuilder } from 'discord.js';

export function build_new_weather(weather) {
    return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`Current Weather: **${weather.id}**`)
		.setImage(weather.image)
        .addFields({ name: 'Collect Cooldown', value: `${weather.cooldown != -1 ? weather.cooldown : 'Infinite'} Seconds` });
};

export function build_upcoming_weather(weather) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`Upcoming Weather: **${weather.id}**`)
		.setImage(weather.image)
        .addFields({ name: 'Collect Cooldown', value: `${weather.cooldown != -1 ? weather.cooldown : 'Infinite'} Seconds` });
};
