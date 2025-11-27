import { EmbedBuilder } from 'discord.js';

export function build_new_pet(pet, isEgg) {
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
				name: 'Age',
				value: `${!isEgg ? `<t:${Math.floor(pet.hatch_time / 1000)}:R>` : 'N/A'}`,
				inline: true
			},
			{
				name: 'Fullness',
				value: `${isEgg ? 'N/A'
					: pet.fullness == -3 ? 'On the brink of collapse!'
					: pet.fullness == -2 ? 'Starving!'
					: pet.fullness == -1 ? 'Hungry!'
					: pet.fullness == 0 ? 'Could Eat'
					: pet.fullness == 1 ? 'Satiated'
					: pet.fullness == 2 ? 'Getting Full'
					: pet.fullness == 3 ? 'Stuffed!'
					: '' }`,
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
