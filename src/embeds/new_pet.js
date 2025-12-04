import { EmbedBuilder } from 'discord.js';

export function build_new_pet(archetype, instance, currentSnow) {
	const now = new Date();
	const earlier = new Date(now.getTime() - 1 * 60 * 60 * 1000);
	const wayEarlier = new Date(now.getTime() - 24 * 60 * 60 * 1000);

	const isEgg = now.getTime() < instance.hatch_time;
	const isDead = instance.last_eat_time < wayEarlier;
	
	return new EmbedBuilder()
        .setColor(isDead ? 0xFF0000 : 0x00FF00)
		.setTitle(`${isEgg ? '🥚 Unhatched Egg' : `${isDead ? '💀' : archetype.icon} **${instance.name}**${isDead ? ' (RIP)' : ''}`}`)
        .setDescription(`${isEgg ? `This egg will hatch **<t:${Math.floor(instance.hatch_time / 1000)}:R>**.` : isDead ? 'This pet died from not being fed for over 24 hours. Rest in peace.' : archetype.description}`)
		.setImage(isEgg ? "https://images.everydayhealth.com/images/news/an-egg-day-lower-dementia-risk-1440x810.jpg?sfvrsn=d81b2e39_3" : isDead ? "https://media.istockphoto.com/id/901964114/photo/rip-headstone.jpg?s=612x612&w=0&k=20&c=GV_qkhh8VxGFtTHu5950cvhKzlfOMw7DS7dHqoo3rRE=" : archetype.image)
		.addFields(
			{
				name: 'Level',
				value: `${isEgg ? '0' : isDead ? 'N/A' : instance.level}`,
				inline: true
			},
			{
				name: 'Birthdate',
				value: `${!isEgg ? `<t:${Math.floor(instance.hatch_time / 1000)}:D>` : 'N/A'}`,
				inline: true
			},
			{
				name: 'Hunger',
				value: `${isEgg || isDead ? 'N/A'
					: instance.last_eat_time >= earlier ? 'Full!'
					: instance.last_eat_time <= wayEarlier ? 'Starving!'
					: 'Could eat...' }`,
				inline: true
			},
			{
				name: 'Level Up Progress',
				value: `${isEgg || isDead ? 'N/A' : instance.level < 5 ? `${instance.total_food}/${instance.appetite}` : 'Max'}`,
				inline: true
			},
			{
				name: 'Current Snow In-Hand',
				value: `${currentSnow}`,
				inline: true
			}
		);
};

export function build_new_pet_unlocked(archetype, instance) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`What's this? You found an egg!`)
        .setDescription(`**<t:${Math.floor(instance.hatch_time / 1000)}:R>**, the egg will hatch into a new pet! Come back later and use \`/pets\` to see what it is! After your pet is born, don't forget to feed it at least once a day!`)
		.setImage("https://images.everydayhealth.com/images/news/an-egg-day-lower-dementia-risk-1440x810.jpg?sfvrsn=d81b2e39_3");
};
