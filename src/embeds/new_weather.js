import { EmbedBuilder } from 'discord.js';

function getHourRoundedDown(offset) {
	const now = new Date();
	const later = new Date(now.getTime() + offset * 60 * 60 * 1000);
	later.setMinutes(0, 0, 0);
	return later;
}

// TODO: Update to use a pagination.
export function build_new_weather(weather, weatherType, offset) {
    return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${weatherType}: **${weather.name}**`)
		.setImage(weather.image)
		.addFields({ name: 'Description', value: `${weather.description}` })
        .addFields(
			{ name: 'Start Time', value: `${getHourRoundedDown(offset).toLocaleString()}`, inline: true},
			{ name: 'End Time', value: `${new Date(getHourRoundedDown(offset).getTime() + 60 * 60 * 1000).toLocaleString()}`, inline: true }
		)
		.addFields(
			{ name: 'Collect Cooldown', value: `${weather.cooldown >= 0 ? weather.cooldown : 'Infinite'} Seconds`, inline: true },
			{ name: 'Building Cost Modifier', value: `${weather.building_cost_modifier}`, inline: true }
		);
};
