import { EmbedBuilder } from 'discord.js';

export function build_new_pet(pet, isEgg) {
	const now = new Date();

	const earlier = new Date(now.getTime() - 2 * 60 * 60 * 1000);
	const wayEarlier = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${isEgg ? 'Unhatched Egg' : pet.name}`)
        .setDescription(`${isEgg ? `This egg will hatch **<t:${Math.floor(pet.hatch_time / 1000)}:R>**.` : pet.descriptions[pet.level - 1]}`)
		.setImage(isEgg ? "https://images.everydayhealth.com/images/news/an-egg-day-lower-dementia-risk-1440x810.jpg?sfvrsn=d81b2e39_3" : pet.image)
		.addFields(
			{
				name: 'Level',
				value: `${isEgg ? '0' : pet.level}`,
				inline: true
			},
			{
				name: 'Birthdate',
				value: `${!isEgg ? `<t:${Math.floor(pet.hatch_time / 1000)}:D>` : 'N/A'}`,
				inline: true
			},
			{
				name: 'Hunger',
				value: `${isEgg ? 'N/A'
					: pet.last_eat_time >= earlier ? 'Full!'
					: pet.last_eat_time <= wayEarlier ? 'Starving!'
					: 'Could eat...' }`,
				inline: true
			},
			{
				name: 'Level Up Progress',
				value: `${pet.level < 5 ? `${pet.total_food}/${pet.appetite}` : 'Max'}`,
				inline: true
			}
		);
};

export function build_new_pet_unlocked(pet) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`What's this? You found an egg!`)
        .setDescription(`**<t:${Math.floor(pet.hatch_time / 1000)}:R>**, the egg will hatch into a new pet! Come back later and use \`/pets\` to see what it is!`)
		.setImage("https://images.everydayhealth.com/images/news/an-egg-day-lower-dementia-risk-1440x810.jpg?sfvrsn=d81b2e39_3");
};
