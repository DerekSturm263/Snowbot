import { MongoClient, ObjectId } from "mongodb";
import achievements from "./exports/achievements.js";

const client = new MongoClient(process.env.MONGODB_URI ?? '', {
    serverSelectionTimeoutMS: 120000,
    connectTimeoutMS: 120000
});



// User Data.

async function create_user_data(id) {
    console.log("create");

    const user = {
        userID: id,
        snow_amount: 0,
        total_snow_amount: 0,
        packed_object: null,
        total_packed_objects: 0,
        building: null,
        total_buildings: 0,
        ready: true,
        playing: true,
        score: 0,
        hits: 0,
        crits: 0,
        misses: 0,
        times_hit: 0,
        achievements: []
    };

    const result = await client.db('database').collection('users').insertOne(user);

    return user;
}

export async function get_user_data(id) {
    console.log("get");
    const user = await client.db('database').collection('users').findOne({ userID: id }) ?? await create_user_data(id);

    console.log(JSON.stringify(user));

    return user;
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
    if (val > 20)
        val = 20;
    
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { total_snow_amount: val }}
    );

    return result;
}

export async function set_packed_object(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { packed_object: val }}
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
        { $set: { building: val }}
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

export async function set_ready(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { ready: val }}
    );

    return result;
}

export async function set_opt(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { playing: val }}
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



// Weather.

export async function get_current_weather() {
    const weather = await client.db('database').collection('weather').findOne(
        { _id: new ObjectId("691acb0a45118463c7cc7d6f") }
    );

    return weather.currentWeather;
}

export async function set_current_weather(weather) {
    const result = await client.db('database').collection('weather').updateOne(
        { _id: new ObjectId("691acb0a45118463c7cc7d6f") },
        { $set: { currentWeather: weather }}
    );

    return result;
}

export async function get_next_weather() {
    const weather = await client.db('database').collection('weather').findOne(
        { _id: new ObjectId("691acb0a45118463c7cc7d6f") }
    );

    return weather.nextWeather;
}

export async function set_next_weather(weather) {
    const result = await client.db('database').collection('weather').updateOne(
        { _id: new ObjectId("691acb0a45118463c7cc7d6f") },
        { $set: { nextWeather: weather }}
    );

    return result;
}



// Leaderboard.

async function create_leaderboard_data(id) {
    const leaderboard = {
        guildID: id,
        users: []
    };

    const result = await client.db('database').collection('leaderboards').insertOne(leaderboard);

    return leaderboard;
}

export async function get_leaderboard_data(id) {
    console.log("get");
    const leaderboard = await client.db('database').collection('leaderboards').findOne({ guildID: id }) ?? await create_leaderboard_data(id);

    console.log(JSON.stringify(leaderboard));

    return leaderboard;
}

export async function try_add_to_leaderboard(guildID, userID) {
    const leaderboard = await get_leaderboard_data(guildID);

    if (!leaderboard.users.includes(userID)) {
        leaderboard.users.push(userID);
        
        await client.db('database').collection('leaderboards').updateOne(
            { guildID: guildID },
            { $set: { users: leaderboard.users }}
        );
    }
}
