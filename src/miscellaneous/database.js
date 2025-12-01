import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import seedrandom from "seedrandom";
import log from "./debug.js";
import achievements from "../exports/achievements.js"
import weather from "../exports/weathers.js";
import buildings from "../exports/buildings.js";
import pets from "../exports/pets.js";
import objects from "../exports/objects.js";
import events from "../exports/events.js";

const client = new MongoClient(process.env.MONGODB_URI ?? '', {
    serverSelectionTimeoutMS: 120000,
    connectTimeoutMS: 120000
});



// User Data.

async function create_user_data(id) {
    const user = {
        userID: id,
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
    };

    const result = await client.db('database').collection('users').insertOne(user);

    return user;
}

export async function get_user_data(id) {
    const user = await client.db('database').collection('users').findOne({ userID: id }) ?? await create_user_data(id);

    log(JSON.stringify(user));

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

    return result;
}



// Setters.

export async function set_snow_amount(id, val) {
    if (val > 20)
        val = 20;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { snow_amount: val }}
    );

    return result;
}

export async function set_total_snow_amount(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { total_snow_amount: val }}
    );

    return result;
}

export async function set_packed_object(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { packed_object: val.id }}
    );

    return result;
}

export async function set_total_packed_objects(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { total_packed_objects: val }}
    );

    return result;
}

export async function set_building(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { building: {
            id: val.id,
            hits_left: val.hits
        } }}
    );

    return result;
}

export async function set_total_buildings(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { total_buildings: val }}
    );

    return result;
}

export async function set_show_pet_updates(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { show_pet_updates: val }}
    );

    return result;
}

export async function set_show_achievements(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { show_achievements: val }}
    );

    return result;
}

export async function set_show_pings(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { show_pings: val }}
    );

    return result;
}

export async function set_score(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { score: val }}
    );

    return result;
}

export async function set_hits(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { hits: val }}
    );

    return result;
}

export async function set_crits(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { crits: val }}
    );

    return result;
}

export async function set_misses(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { misses: val }}
    );

    return result;
}

export async function set_times_hit(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { times_hit: val }}
    );

    return result;
}

export async function set_ready_time(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { ready_time: val }}
    );

    return result;
}

export async function set_active_pet(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { active_pet: val.id }}
    );

    return result;
}

export async function set_total_pets(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { total_pets: val }}
    );

    return result;
}

export async function parseAchievements(userData) {
    let achievementsOut = [];

    for (let i = 0; i < achievements.length; ++i) {
        const achievement = achievements[i];

        if (userData[achievement.property] >= achievement.value && !userData.achievements.includes(achievement.id)) {
            await add_achievement(userData.userID, achievement.id);
            achievementsOut.push(achievement);
        }
    }

    return achievementsOut;
};

async function add_achievement(id, val) {
    const user = await client.db('database').collection('users').findOne({ userID: id }) ?? await create_user_data(id);
    user.achievements.push(val);

    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { achievements: user.achievements }}
    );

    return result;
}

export async function add_pet(id, val, hatchOffset) {
    const now = new Date();

    const delay = val.delay - hatchOffset;
    const later = new Date(now.getTime() + (delay < 0 ? 0 : delay) * 60 * 60 * 1000);

    val.id = uuidv4().toString();
    val.hatch_time = later.getTime();
    val.last_eat_time = later.getTime();

    const user = await client.db('database').collection('users').findOne({ userID: id }) ?? await create_user_data(userID);
    user.pets.push(val);

    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { pets: user.pets }}
    );

    return result;
}

export async function remove_pet(userID, petIndex) {
    const user = await client.db('database').collection('users').findOne({ userID: userID }) ?? await create_user_data(userID);
    user.pets.splice(petIndex, 1);

    const result = await client.db('database').collection('users').updateOne(
        { userID: userID },
        { $set: { pets: user.pets }}
    );

    return result;
}

export async function set_pet_name(userID, petIndex, val) {
    const user = await client.db('database').collection('users').findOne({ userID: userID }) ?? await create_user_data(userID);
    user.pets[petIndex].name = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { pets: user.pets }}
    );

    return result;
}

export async function set_pet_last_eat_time(userID, petIndex, val) {
    const user = await client.db('database').collection('users').findOne({ userID: userID }) ?? await create_user_data(userID);
    user.pets[petIndex].last_eat_time = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: userID },
        { $set: { pets: user.pets }}
    );

    return result;
}

export async function set_pet_total_food(userID, petIndex, val) {
    const user = await client.db('database').collection('users').findOne({ userID: userID }) ?? await create_user_data(userID);
    user.pets[petIndex].total_food = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: userID },
        { $set: { pets: user.pets }}
    );

    return result;
}

export async function set_pet_appetite(userID, petIndex, val) {
    const user = await client.db('database').collection('users').findOne({ userID: userID }) ?? await create_user_data(userID);
    user.pets[petIndex].appetite = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: userID },
        { $set: { pets: user.pets }}
    );

    return result;
}

export async function set_pet_level(userID, petIndex, val) {
    const user = await client.db('database').collection('users').findOne({ userID: userID }) ?? await create_user_data(userID);
    user.pets[petIndex].level = val;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: userID },
        { $set: { pets: user.pets }}
    );

    return result;
}


// Weather.

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

    return newWeather;
}



// Leaderboard.

async function create_server_data(id) {
    const leaderboard = {
        guildID: id,
        users: [],
        buildings: buildings,
        objects: objects,
        pets: pets,
        events: events
    };

    const result = await client.db('database').collection('leaderboards').insertOne(leaderboard);

    return leaderboard;
}

export async function get_server_data(id) {
    const leaderboard = await client.db('database').collection('leaderboards').findOne({ guildID: id }) ?? await create_server_data(id);

    log(JSON.stringify(leaderboard));

    return leaderboard;
}

export async function try_add_to_server(guildID, userID) {
    const leaderboard = await get_server_data(guildID);

    if (!leaderboard.users.includes(userID)) {
        leaderboard.users.push(userID);
        
        await client.db('database').collection('leaderboards').updateOne(
            { guildID: guildID },
            { $set: { users: leaderboard.users }}
        );
    }
}
