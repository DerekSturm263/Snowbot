import { MongoClient, ObjectId } from "mongodb";

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
        packed_object: null,
        building: null,
        ready: true,
        playing: true,
        score: 0,
        hits: 0,
        crits: 0,
        misses: 0,
        times_hit: 0
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
};

export async function set_packed_object(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { packed_object: val }}
    );

    return result;
};

export async function set_building(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { building: val }}
    );

    return result;
};

export async function set_ready(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { ready: val }}
    );

    return result;
};

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
};

export async function set_hits(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { hits: val }}
    );

    return result;
};

export async function set_crits(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { crits: val }}
    );

    return result;
};

export async function set_misses(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { misses: val }}
    );

    return result;
};

export async function set_times_hit(id, val) {
    const result = await client.db('database').collection('users').updateOne(
        { userID: id },
        { $set: { times_hit: val }}
    );

    return result;
};



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
        users: [ ]
    };

    const result = await client.db('database').collection('leaderboards').insertOne(leaderboard);

    return leaderboard;
};

export async function get_leaderboard_data(id) {
    console.log("get");
    const leaderboard = await client.db('database').collection('leaderboards').findOne({ guildID: id }) ?? await create_leaderboard_data(id);

    console.log(JSON.stringify(leaderboard));

    return leaderboard;
}



// Score.

export async function get_server_data(boardID, userID) {
    const leaderboard = await get_leaderboard_data(boardID);
    const user = leaderboard.users.find(item => item.userID == userID);

    if (user != null) {
        return user.score;
    } else {
        leaderboard.users.push({ userID: userID, score: 0 });

        await client.db('database').collection('leaderboards').updateOne(
            { guildID: boardID },
            { $set: { users: leaderboard.users }}
        );

        return 0;
    }
};

