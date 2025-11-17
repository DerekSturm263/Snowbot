import { EmbedBuilder  								} from 'discord.js';
import { clear, light, regular, heavy, snowstorm 	} from '../exports/weathers.js';

const weathers = [
	clear,
	light,
	regular,
	heavy,
	snowstorm
];

export function build_new_weather(weather) {
    return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`Current Weather: **${weather.name}**`)
		.setImage(weather.image)
        .addFields({ name: 'Collect Cooldown', value: `${weather.cooldown != -1 ? weather.cooldown : 'Infinite'} Seconds` });
};

export function build_upcoming_weather(weather) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`Upcoming Weather: **${weather.name}**`)
		.setImage(weather.image)
        .addFields({ name: 'Collect Cooldown', value: `${weather.cooldown != -1 ? weather.cooldown : 'Infinite'} Seconds` });
};
