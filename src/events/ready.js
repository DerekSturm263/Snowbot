import { get_next_weather, get_weather, set_next_weather, set_weather                   }   from '../serialize.js';	
import { clear, light, regular, heavy, snowstorm    }   from '../exports/weathers.js';

const weathers = [
	clear, light, regular, heavy, snowstorm
];

export const event = {
    name: 'ready',
    execute(client) {
        console.log(`${client.user.tag} is online.`);

        // Set default weather.
        let randomIndex = Math.floor(Math.random() * weathers.length);
        let weather = weathers[randomIndex];
        let randomIndex2 = Math.floor(Math.random() * weathers.length);
        let weather2 = weathers[randomIndex2];
        
        set_weather(weather);
        set_next_weather(weather2);
        client.user.setActivity(weather.id);
        console.log(`Weather set to ${weather.id}.`);

        // Update the weather every 2 hours.
        setInterval(() => {
            randomIndex = Math.floor(Math.random() * weathers.length);
            weather = weathers[randomIndex];

        	set_weather(get_next_weather());
            set_next_weather(weather);
            client.user.setActivity(weather.id);

            console.log(`Weather set to ${weather.id}.`);
        }, 2 * 60 * 60 * 1000);
    }
};
