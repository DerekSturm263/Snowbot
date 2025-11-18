import { EmbedBuilder } from 'discord.js';

export function build_new_achievements(name, data, hide_data) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Achievement Unlocked: **${achievement.name}**`)
        .addFields({ description: `${achievement.description}` });
};
