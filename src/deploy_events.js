import { readdirSync }	from "node:fs";

// Load and register events.
export async function init_events(client) {
    for (const file of readdirSync('./src/events').filter(file => file.endsWith('.js'))) {
	    await import(`./events/${file}`)
			.then(obj => {
				const event = Object.values(obj)[0];		
				event.once ? client.once(event.name, (...args) => event.execute(...args))
						   : client.on  (event.name, (...args) => event.execute(...args));

				console.log(`Event: ${event.name} was loaded successfully.`);
                console.log(` - Contents: ${JSON.stringify(obj)}\n`);
			})
			.catch(err => console.error(err));
    }
};
