import { EmbedBuilder } from 'discord.js';

export function build_new_help() {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('Info')
        .setDescription(
            'Welcome to Snowbot! This bot aims to recreate the Snowsgiving 2021 official Discord Snowball Bot, while also adding new features and functionality. If you experience any issues or want to give feature requests, please join the official development server [here](https://discord.gg/tpfVdFsYKg).\n\n' +

            '`/collect`: Collects some fresh snow from off the ground. Snow is needed to use `/throw`, `/build`, and `/pack`.\n\n' +

            '`/throw`: Throws a snowball at someone! When someone is hit by a snowball, by default, they get timed out for 3 seconds.\n\n' +

            '`/build`: Builds something out of snow to take hits for you. Each build will block hits until it eventually breaks.\n\n' +

            '`/pack`: Packs a snowball with a random item from off the ground. This item increases the damage of your snowballs.\n\n' +

            '`/pets (WIP)`: Lets you manage your pets by feeding them, selecting which is the active pet, and more.\n\n' +            
            
            '`/forecast`: Checks the current and upcoming weather. Each weather type impacts the cooldown on `/collect`, among other things.\n\n' +

            '`/stats`: Checks a user\'s stats, including snow collected, current packed object, current building, and more.\n\n' +

            '`/achievements`: Shows you all achievements, including hidden ones (with limited information).\n\n' + 

            '`/leaderboard`: Checks this server\'s leaderboard. The leaderboard is organized from who has the most to least points.\n\n' +
            
            '`/settings`: Lets you change personal settings related to the bot.\n\n' +

            '`/reset`: Resets all of your stats and achievements to their defaults.'
        );
};
