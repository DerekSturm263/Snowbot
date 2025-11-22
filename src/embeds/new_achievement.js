import { EmbedBuilder } from 'discord.js';

export function build_new_achievement(achievement, showUnlocked, showDescription) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(showUnlocked ? `Achievement Unlocked: **${achievement.name}**` : `${achievement.name}`)
        .addFields({
            name: 'Description',
            value: showDescription ? `${achievement.description}` : '???'
        });
};
