import { get_next_weather, set_next_weather, set_current_weather    } from '../database.js';	
import weathers from '../exports/weathers.js';

export const event = {
    name: 'clientReady',
    async execute(client) {
        console.log(`${client.user.tag} is online.`);

        const now = new Date();
        const later = new Date(now.getTime() + (2 * 60 * 60 * 1000));
        const evenLater = new Date(later.getTime() + (2 * 60 * 60 * 1000))

        // Set default weather.
        let randomIndex = Math.floor(Math.random() * weathers.length);
        let weather = weathers[randomIndex];
        weather.start_time = now.getTime();
        if (weather.cooldown > 0)
            weather.cooldown += Math.floor(Math.random() * 4) - 2;

        weather.end_time = later.getTime();

        let randomIndex2 = Math.floor(Math.random() * weathers.length);
        let weather2 = weathers[randomIndex2];
        weather2.start_time = later.getTime();
        if (weather2.cooldown > 0)
            weather2.cooldown += Math.floor(Math.random() * 4) - 2;

        weather2.end_time = evenLater.getTime();
        
        await set_current_weather(weather);
        await set_next_weather(weather2);
        client.user.setActivity(weather.name);
        console.log(`Weather set to ${weather.id}.`);

        // Update the weather every 2 hours.
        setInterval(() => async () => {
            randomIndex = Math.floor(Math.random() * weathers.length);
            weather = weathers[randomIndex];
    
            weather.start_time = now.getTime();
            if (weather.cooldown > 0)
                weather.cooldown += Math.floor(Math.random() * 4) - 2;

            weather.end_time = later.getTime();

        	await set_current_weather(await get_next_weather());
            await set_next_weather(weather);
            client.user.setActivity(weather.name);

            console.log(`Weather set to ${weather.name}.`);
        }, 2 * 60 * 60 * 1000);
    }
};
