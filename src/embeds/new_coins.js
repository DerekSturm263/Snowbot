import { EmbedBuilder } from 'discord.js';

export function build_new_coins(user_data) {
    return new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle('You got a coin!')
        .setDescription('Use `/shop` or `/gacha` to spend your coins!')
        .addFields({
            name: 'Total Coins',
            value: `${user_data.coins}`,
            inline: true
        });
};
