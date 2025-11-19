import { EmbedBuilder } from 'discord.js';
import achievements from '../exports/achievements.js';

export function build_new_achievements_unlocked(data) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Achievements Unlocked`)
        .addFields(achievements.filter(achievement => data.achievements.includes(achievement.id)).map(achievement => ({
            name: achievement.name,
            value: achievement.description
        })));
};

export function build_new_achievements_locked(data) {
    return new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(`Locked Achievements`)
        .addFields(achievements.filter(achievement => !data.achievements.includes(achievement.id)).map(achievement => ({
            name: achievement.name,
            value: achievement.description
        })));
};
