import { get_next_weather, set_next_weather, set_current_weather    } from '../database.js';	
import weathers from '../exports/weathers.js';

const interval = 60 * 60 * 1000;

function createWeather(now) {
    const randomIndex = Math.floor(Math.random() * weathers.length);
    const weather = weathers[randomIndex];
    
    weather.start_time = now.getTime();
    if (weather.cooldown > 0)
        weather.cooldown += Math.floor(Math.random() * 4) - 2;

    weather.end_time = now.getTime() + (2 * 60 * 60 * 1000);

    return weather;
}

export const event = {
    name: 'clientReady',
    async execute(client) {
        console.log(`${client.user.tag} is online.`);

        const currentWeather = createWeather(new Date());
        const nextWeather = createWeather(new Date(currentWeather.start_time + interval));

        await set_current_weather(currentWeather);
        await set_next_weather(nextWeather);

        client.user.setActivity(currentWeather.name);
        console.log(`Weather set to ${currentWeather.id}.`);

        // Update the weather every interval.
        setInterval(() => async () => {
            const newCurrentWeather = await get_next_weather();
            const newNextWeather = createWeather(new Date(newCurrentWeather.start_time + interval));

        	await set_current_weather(newCurrentWeather);
            await set_next_weather(newNextWeather);

            client.user.setActivity(newCurrentWeather.name);
            console.log(`Weather set to ${newCurrentWeather.id}.`);
        }, interval);
    }
};
