import { MongoClient } from "mongodb";
import { build_new_get_achievement } from "../embeds/new_achievement.js";
import { create_default_server, create_default_user } from "../exports/defaults.js";
import { v4 as uuidv4 } from 'uuid';
import seedrandom from "seedrandom";
import log from "./debug.js";
import achievements from "../exports/achievements.js";
import weather from "../exports/weathers.js";

const client = new MongoClient(process.env.MONGODB_URI ?? '', {
    serverSelectionTimeoutMS: 120000,
    connectTimeoutMS: 120000
});



// Server Data.

async function create_server_data(id) {
    const server = create_default_server(id);

    log(`Server with id ${id} does not exist. Creating new server data.`);

    const result = await client.db('database').collection('leaderboards').insertOne(server);

    return server;
}

export async function get_server_data(id) {
    const server = await client.db('database').collection('leaderboards').findOne({ guildID: id }) ?? await create_server_data(id);

    log(`Retrieving data for server ${id}. ${JSON.stringify(server, null, 2)}`);

    return server;
}

async function try_add_to_server(guildID, userID) {
    const server = await get_server_data(guildID);

    if (!server.users.includes(userID)) {
        log(`User with id ${userID} is not yet active in server with id ${guildID}. Adding user to guild.`);

        server.users.push(userID);
        
        await client.db('database').collection('leaderboards').updateOne(
            { guildID: guildID },
            { $set: { users: server.users }}
        );
    }
}

export async function set_crit_chance(server_data, val) {
    server_data.crit_chance = val;

    const result = await client.db('database').collection('leaderboards').updateOne(
        { guildID: server_data.guildID },
        { $set: { crit_chance: server_data.crit_chance }}
    );

    log(`Setting server with id ${server_data.guildID}'s crit chance to ${val}`);

    return result;
}

export async function set_miss_chance(server_data, val) {
    server_data.miss_chance = val;

    const result = await client.db('database').collection('leaderboards').updateOne(
        { guildID: server_data.guildID },
        { $set: { miss_chance: server_data.miss_chance }}
    );

    log(`Setting server with id ${server_data.guildID}'s miss chance to ${val}`);

    return result;
}

export async function set_egg_chance(server_data, val) {
    server_data.egg_chance = val;

    const result = await client.db('database').collection('leaderboards').updateOne(
        { guildID: server_data.guildID },
        { $set: { egg_chance: server_data.egg_chance }}
    );

    log(`Setting server with id ${server_data.guildID}'s egg chance to ${val}`);

    return result;
}

export async function set_max_snow_amount(server_data, val) {
    server_data.max_snow_amount = val;

    const result = await client.db('database').collection('leaderboards').updateOne(
        { guildID: server_data.guildID },
        { $set: { max_snow_amount: server_data.max_snow_amount }}
    );

    log(`Setting server with id ${server_data.guildID}'s max snow amount to ${val}`);

    return result;
}

export async function set_snow_collect_amount(server_data, val) {
    server_data.snow_collect_amount = val;

    const result = await client.db('database').collection('leaderboards').updateOne(
        { guildID: server_data.guildID },
        { $set: { snow_collect_amount: server_data.snow_collect_amount }}
    );

    log(`Setting server with id ${server_data.guildID}'s snow collect amount to ${val}`);

    return result;
}



// User Data.

async function create_user_data(id) {
    const user = create_default_user(id);

    log(`User with id ${id} does not exist. Creating new user data.`);

    const result = await client.db('database').collection('users').insertOne(user);

    return user;
}

export async function get_user_data(id) {
    const user = await client.db('database').collection('users').findOne({ userID: id }) ?? await create_user_data(id);

    log(`Retrieving data for user ${id}. ${JSON.stringify(user, null, 2)}`);

    return user;
}

export async function reset_user_data(id) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: {
            snow_amount: 0,
            total_snow_amount: 0,
            packed_object: "",
            total_packed_objects: 0,
            building: {
                id: "",
                hits_left: 0
            },
            total_buildings: 0,
            ready_time: 0,
            show_pet_updates: true,
            show_achievements: true,
            show_pings: true,
            score: 0,
            hits: 0,
            crits: 0,
            misses: 0,
            times_hit: 0,
            active_pet: "",
            pets: [],
            total_pets: 0,
            achievements: []
        }}
    );

    log(`Resetting data for user ${id}.`);

    return result;
}

export async function set_snow_amount(user_data, val) {
    user_data.snow_amount = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { snow_amount: user_data.snow_amount }}
    );

    log(`Setting user with id ${user_data.userID}'s snow amount to ${val}`);

    return result;
}

export async function set_total_snow_amount(user_data, member, val) {
    user_data.total_snow_amount = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { total_snow_amount: user_data.total_snow_amount }}
    );

    log(`Setting user with id ${user_data.userID}'s total snow amount to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_packed_object(user_data, val) {
    user_data.packed_object = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { packed_object: user_data.packed_object.id }}
    );
    
    log(`Setting user with id ${user_data.userID}'s packed object to ${val.id}`);

    return result;
}

export async function set_total_packed_objects(user_data, member, val) {
    user_data.total_packed_objects = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { total_packed_objects: user_data.total_packed_objects }}
    );

    log(`Setting user with id ${user_data.userID}'s total packed objects to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_building(user_data, val) {
    user_data.building = {
        id: val.id,
        hits_left: val.hits
    };

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { building: user_data.building }}
    );

    log(`Setting user with id ${user_data.userID}'s building to ${val.id} with hits ${val.hits}`);

    return result;
}

export async function set_total_buildings(user_data, member, val) {
    user_data.total_buildings = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { total_buildings: user_data.total_buildings }}
    );

    log(`Setting user with id ${user_data.userID}'s total buildings to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_show_pet_updates(user_data, val) {
    user_data.show_pet_updates = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { show_pet_updates: user_data.show_pet_updates }}
    );

    log(`Setting user with id ${user_data.userID}'s show pet updates to ${val}`);

    return result;
}

export async function set_show_achievements(user_data, val) {
    user_data.show_achievements = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { show_achievements: user_data.show_achievements }}
    );

    log(`Setting user with id ${user_data.userID}'s show achievements to ${val}`);

    return result;
}

export async function set_show_pings(user_data, val) {
    user_data.show_pings = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { show_pings: user_data.show_pings }}
    );

    log(`Setting user with id ${user_data.userID}'s show pings to ${val}`);

    return result;
}

export async function set_score(user_data, serverID, member, val) {
    user_data.score = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { score: user_data.score }}
    );

    log(`Setting user with id ${user_data.userID}'s score to ${val}`);

    await try_add_to_server(serverID, user_data.userID);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_hits(user_data, member, val) {
    user_data.hits = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { hits: user_data.hits }}
    );

    log(`Setting user with id ${user_data.userID}'s hits to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_crits(user_data, member, val) {
    user_data.crits = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { crits: user_data.crits }}
    );

    log(`Setting user with id ${user_data.userID}'s crits to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_misses(user_data, member, val) {
    user_data.misses = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { misses: user_data.misses }}
    );

    log(`Setting user with id ${user_data.userID}'s misses to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_times_hit(user_data, member, val) {
    user_data.times_hit = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { times_hit: user_data.times_hit }}
    );

    log(`Setting user with id ${user_data.userID}'s times hit to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function set_ready_time(user_data, val) {
    user_data.ready_time = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { ready_time: user_data.ready_time }}
    );

    log(`Setting user with id ${user_data.userID}'s ready time to ${val}`);

    return result;
}

export async function set_active_pet(user_data, val) {
    user_data.active_pet = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { active_pet: user_data.active_pet }}
    );

    log(`Setting user with id ${user_data.userID}'s active pet to ${val}`);

    return result;
}

export async function set_total_pets(user_data, member, val) {
    user_data.total_pets = val;

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { total_pets: user_data.total_pets }}
    );

    log(`Setting user with id ${user_data.userID}'s total pets to ${val}`);
    await tryGetAchievements(user_data, member);

    return result;
}

export async function add_pet(user_data, archetype, hatchOffset) {
    const now = new Date();
    const delay = archetype.delay + hatchOffset;
    const later = new Date(now.getTime() + (delay < 0 ? 0 : delay) * 60 * 60 * 1000);

    const instance = {
        uuid: uuidv4(),
        archetype_id: archetype.id,
        name: archetype.name,
        hatch_time: later.getTime(),
        appetite: archetype.appetite,
        last_eat_time: now.getTime(),
        total_food: 0,
        level: 1
    };

    user_data.pets.push(instance);

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Adding new pet with data ${JSON.stringify(instance, null, 2)} from user with id ${user_data.userID}`);

    return instance;
}

export async function remove_pet(user_data, petIndex) {
    user_data.pets.splice(petIndex, 1);

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Removing pet at index ${petIndex} from user with id ${user_data.userID}`);

    return result;
}

export async function set_pet_name(user_data, petIndex, val) {
    user_data.pets[petIndex].name = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Setting user with id ${user_data.userID}'s pet name at index ${petIndex} to ${val}`);

    return result;
}

export async function set_pet_last_eat_time(user_data, petIndex, val) {
    user_data.pets[petIndex].last_eat_time = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Setting user with id ${user_data.userID}'s pet last eat time at index ${petIndex} to ${val}`);

    return result;
}

export async function set_pet_total_food(user_data, petIndex, val) {
    user_data.pets[petIndex].total_food = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Setting user with id ${user_data.userID}'s pet total food at index ${petIndex} to ${val}`);

    return result;
}

export async function set_pet_appetite(user_data, petIndex, val) {
    user_data.pets[petIndex].appetite = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Setting user with id ${user_data.userID}'s pet appetite at index ${petIndex} to ${val}`);

    return result;
}

export async function set_pet_level(user_data, petIndex, val) {
    user_data.pets[petIndex].level = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { pets: user_data.pets }}
    );

    log(`Setting user with id ${user_data.userID}'s pet level at index ${petIndex} to ${val}`);

    return result;
}

export function invoke_pet_events(user_data, server_data, weather, eventType) {
    if (user_data.active_pet == "")
        return;
    
	const instance = user_data.pets.find(pet => pet.uuid == user_data.active_pet);
    if (!instance)
        return;

    const archetype = server_data.pets.find(item => item.id == instance.archetype_id);
	
    if (archetype.event_type == eventType) {
        for (const key in archetype.server_changes) {
            if (archetype.server_changes[key].type == "set") {
                server_data[key] = archetype.server_changes[key].values[instance.level - 1];
            } else if (archetype.server_changes[key].type == "delta") {
                server_data[key] += archetype.server_changes[key].values[instance.level - 1];
            }
        }
        
        for (const key in archetype.user_changes) {
            if (archetype.user_changes[key].type == "set") {
                user_data[key] = archetype.user_changes[key].values[instance.level - 1];
            } else if (archetype.user_changes[key].type == "delta") {
                user_data[key] += archetype.user_changes[key].values[instance.level - 1];
            }
        }
        
        for (const key in archetype.weather_changes) {
            if (archetype.weather_changes[key].type == "set") {
                weather[key] = archetype.weather_changes[key].values[instance.level - 1];
            } else if (archetype.weather_changes[key].type == "delta") {
                weather[key] += archetype.weather_changes[key].values[instance.level - 1];
            }
        }
	}
}

async function tryGetAchievements(user_data, member) {
    const achievements = await parseAchievements(user_data);
    
    if (user_data.show_achievements) {
        await Promise.all(achievements.map(async item => {
            member.send({
                embeds: [ build_new_get_achievement(item) ]
            });
        }));
    }
}

async function parseAchievements(user_data) {
    let achievementsOut = [];

    for (let i = 0; i < achievements.length; ++i) {
        const achievement = achievements[i];

        if (user_data[achievement.property] >= achievement.value && !user_data.achievements.includes(achievement.id)) {
            await add_achievement(user_data, achievement.id);
            achievementsOut.push(achievement);
        }
    }

    return achievementsOut;
};

async function add_achievement(user_data, val) {
    user_data.achievements.push(val);

    const result = await client.db('database').collection('users').updateOne(
        { userID: user_data.userID },
        { $set: { achievements: user_data.achievements }}
    );

    log(`Giving user with id ${user_data.userID} the ${val} achievement`);

    return result;
}



// Weather & Events.

export function get_weather(hourOffset) {
    const now = new Date();
    const withOffset = new Date(now.getTime() + (hourOffset * 60 * 60 * 1000));
    const dayIndex = withOffset.getUTCDay();
    const hourIndex = withOffset.getUTCHours();

    const rng = seedrandom((hourIndex + dayIndex).toString());
    const random = Math.floor(rng() * weather.length);

    const newWeather = structuredClone(weather[random]);

    if (newWeather.cooldown > 0)
        newWeather.cooldown += Math.floor(rng() * 5) - 2;

    log(`Getting current weather as ${JSON.stringify(newWeather, null, 2)}`);

    return newWeather;
}

export async function get_event(hourOffset, id) {
    const now = new Date();
    const withOffset = new Date(now.getTime() + (hourOffset * 60 * 60 * 1000));
    const dayIndex = withOffset.getUTCDay();
    const hourIndex = withOffset.getUTCHours();

    const rng = seedrandom((hourIndex + dayIndex + 1).toString());
    const hasEvent = rng() < 0.1;
    
    const events = (hasEvent && get_weather(hourOffset).cooldown < 0) ? (await get_server_data(id)).events : [
        {
            id: "none",
            name: "None",
            description: "There are no active events.",
            icon: " ",
            changes: { }
        }
    ];

    const random = Math.floor(rng() * events.length);
    const event = events[random];

    log(`Getting current event as ${JSON.stringify(event, null, 2)}`);

    return event;
}

export async function invoke_event(hourOffset, server_data) {
    const event = await get_event(hourOffset, server_data.guildID);
    if (event.id == "none")
        return;

    for (const key in event.changes) {
        server_data[key] = event.changes[key];
    }
}
