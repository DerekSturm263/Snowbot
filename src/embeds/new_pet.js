import { EmbedBuilder } from 'discord.js';

export function build_new_pet(pet, isEgg) {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`${isEgg ? 'Unhatched Egg' : pet.name}`)
        .setDescription(`${isEgg ? `This egg will hatch at **${new Date(pet.hatch_time).toLocaleTimeString()}** on **${new Date(pet.hatch_time).toLocaleDateString()}**.` : pet.descriptions[pet.level]}`)
		.addFields(
			{
				name: 'Level',
				value: `${isEgg ? '0' : pet.level}`
			},
			{
				name: 'Fullness',
				value: `${isEgg ? 'N/A' : pet.fullness}`
			}
		);
};

export function build_new_pet_unlocked() {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`What's this? You found an egg!`)
        .setDescription('Soon, the egg will hatch into a new pet! Come back later and use `/pets` to see what it is!');
};
