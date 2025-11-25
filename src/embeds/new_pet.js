import { EmbedBuilder } from 'discord.js';

export function build_new_pet(pet, isEgg) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${isEgg ? 'Unhatched Egg' : pet.name}`)
        .setDescription(`${isEgg ? `This egg will hatch **<t:${Math.floor(pet.hatch_time / 1000)}:R>**.` : pet.descriptions[Math.floor(pet.total_food / 20)]}`)
		.setImage(pet.image)
		.addFields(
			{
				name: 'Level',
				value: `${Math.floor(pet.total_food / 20)}`,
				inline: true
			},
			{
				name: 'Fullness',
				value: `${isEgg ? 'N/A' : pet.fullness}`,
				inline: true
			}
		);
};

export function build_new_pet_unlocked() {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`What's this? You found an egg!`)
        .setDescription('Soon, the egg will hatch into a new pet! Come back later and use `/pets` to see what it is!')
		.setImage("https://images.everydayhealth.com/images/news/an-egg-day-lower-dementia-risk-1440x810.jpg?sfvrsn=d81b2e39_3");
};
