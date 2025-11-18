import { EmbedBuilder  								} from 'discord.js';

export function build_new_weather(weather, weatherType) {
    return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${weatherType}: **${weather.name}**`)
		.setImage(weather.image)
		.addFields({ name: 'Description', value: `${weather.description}` })
        .addFields(
			{ name: 'Start Time', value: `${new Date(weather.start_time).toLocaleString()}`, inline: true},
			{ name: 'End Time', value: `${new Date(weather.end_time).toLocaleString()}`, inline: true }
		)
		.addFields(
			{ name: 'Collect Cooldown', value: `${weather.cooldown >= 0 ? weather.cooldown : 'Infinite'} Seconds`, inline: true },
			{ name: 'Building Cost Modifier', value: `${weather.building_cost_modifier}`, inline: true }
		);
};
