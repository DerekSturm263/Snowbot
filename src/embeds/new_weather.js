import { EmbedBuilder } from 'discord.js';

function getHourRoundedDown(offset) {
	const now = new Date();
	const later = new Date(now.getTime() + offset * 60 * 60 * 1000);
	later.setMinutes(0, 0, 0);
	return later;
}

export function build_new_weather(weather, offset) {
    return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${offset == 0 ? "Current" : "Upcoming"} Weather: **${weather.name}**`)
		.setImage(weather.image)
		.addFields(
			{
				name: 'Description',
				value: `${weather.description}`,
				inline: false
			},
			{
				name: 'Date',
				value: `${getHourRoundedDown(offset).toLocaleDateString()}`,
				inline: true
			},
			{
				name: 'Start Time',
				value: `${getHourRoundedDown(offset).toLocaleTimeString()}`,
				inline: true
			},
			{
				name: 'End Time',
				value: `${new Date(getHourRoundedDown(offset).getTime() + 60 * 60 * 1000).toLocaleTimeString()}`,
				inline: true
			},
			{
				name: 'Collect Cooldown',
				value: `${weather.cooldown >= 0 ? weather.cooldown : 'Infinite'} Seconds`,
				inline: true
			},
			{
				name: 'Building Cost Modifier',
				value: `${weather.building_cost_modifier} Snow`,
				inline: true
			}
		);
};
