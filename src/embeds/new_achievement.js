import { EmbedBuilder } from 'discord.js';

export function build_new_list_achievement(achievement, isUnlocked) {
    return new EmbedBuilder()
        .setColor(isUnlocked ? 0x00FF00 : 0xFF0000)
        .setTitle(`${achievement.icon} **${achievement.name}**`)
        .setDescription(`${achievement.description}`)
        .addFields(
            {
                name: 'Status',
                value: `${isUnlocked ? '✅ Unlocked' : '❌ Locked'}`,
                inline: true
            }
        );
};

export function build_new_get_achievement(achievement) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Achievement Unlocked: ${achievement.icon} **${achievement.name}**`)
        .setDescription(`${achievement.description}`);
};
