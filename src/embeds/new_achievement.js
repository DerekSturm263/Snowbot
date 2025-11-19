import { EmbedBuilder } from 'discord.js';

export function build_new_achievement(achievement) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Achievement Unlocked: **${achievement.name}**`)
        .addFields({ name: 'Description', value: `${achievement.description}` });
};
