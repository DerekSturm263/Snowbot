import { EmbedBuilder } from 'discord.js';

export function build_new_help() {
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('Info')
        .setDescription(
            'Welcome to Snowbot! This bot aims to recreate the Snowsgiving 2021 official Discord Snowball Bot, while also adding new features and functionality.\n\n' +

            '`/collect`: Collects some fresh snow from off the ground. Snow is needed to use `/throw`, `/build`, and `/pack`.\n\n' +

            '`/throw`: Throws a snowball at someone! When someone is hit by a snowball, they get timed out for 5 seconds.\n\n' +

            '`/build`: Builds something out of snow to take hits for you. Each build will block hits until it eventually breaks.\n\n' +

            '`/pack`: Packs a snowball with a random item from off the ground. This item increases the timeout time of your snowballs.\n\n' +

            '`/forecast`: Checks the current and upcoming weather. Each weather type impacts the cooldown on `/collect`, among other things.\n\n' +

            '`/stats`: Checks a user\'s stats, including snow collected, packed object, building, and more.\n\n' +

            '`/achievements`: Shows you all achievements, including hidden ones (with limited information).\n\n' + 

            '`/leaderboard`: Checks this server\'s leaderboard. Leaderboard is organized from who has the most to least points.\n\n' +
            
            '`/opt in`: Opts in to using Snowbot. You will have access to all commands and be able to be hit by snowballs.\n\n' +

            '`/opt out`: Opts out of using Snowbot. You will no longer be able to use most commands or be hit by snowballs.'
        );
};
