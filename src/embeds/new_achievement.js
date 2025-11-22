import { EmbedBuilder } from 'discord.js';

export function build_new_list_achievement(achievement, isUnlocked) {
    return new EmbedBuilder()
        .setColor(isUnlocked ? 0x00FF00 : 0xFF0000)
        .setTitle(`${achievement.name}`)
        .addFields(
            {
                name: 'Status',
                value: `${isUnlocked ? '✅ Unlocked' : '❌ Locked'}`,
                inline: true
            },
            {
                name: 'Description',
                value: `${achievement.description}`,
                inline: true
            }
        );
};

export function build_new_get_achievement(achievement) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Achievement Unlocked: **${achievement.name}**`)
        .addFields({
            name: 'Description',
            value: `${achievement.description}`
        });
};
