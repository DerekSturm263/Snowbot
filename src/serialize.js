import { createWriteStream, existsSync, readFile, readFileSync, writeFileSync } from "node:fs";

const user_t = {
    snow_amount: 0,
    packed_object: null,
    current_building: null,
    ready: true,
    playing: true
};

function user_data_path(id) { return `./data/user_data/${id}.json`; }
const weather_data = './data/current_weather.json';
const next_weather_data = './data/next_weather.json';

async function create_user_data(id) {
    return new Promise((resolve, reject) => {
        if (!existsSync(user_data_path(id))) {
            // Create the file.
            console.log(`User data not found for ${id}. Creating new file...`);
                
            const fs = createWriteStream(user_data_path(id));
            fs.write(JSON.stringify(user_t, null, 2));
            fs.end();

            fs.on('finish', () => {
                console.log(`User data created for ${id}.`);
                resolve();
            })

            fs.on('error', err => reject(err));
        } else {
            resolve();
        }
    });
};

async function read_user_data(id) {
    return new Promise((resolve, reject) => {
        // Read the file.
        console.log(`Attempting to read user data for ${id}.`);
        readFile(user_data_path(id), (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            console.log(`User data found for ${id}.`);
            resolve(JSON.parse(data));
        });
    });
}

async function create_and_read_user_data(id) {
    return new Promise((resolve, reject) => {
        create_user_data(id)
            .then(() => {
                console.log(`Ready to ready user data ${id}`);
                read_user_data(id)
                    .then((data) => resolve(data))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

export async function get_user_data(id) { return await create_and_read_user_data(id); }

export async function get_snow_amount(id) {
    const val = await get_user_data(id);
    console.log(`${id} reading snow_amount as ${val.snow_amount}.`);
    return val.snow_amount;
};

export async function set_snow_amount(id, val) {
    const user = await get_user_data(id);
    user.snow_amount = val;
    const userString = JSON.stringify(user, null, 2);

    console.log(`${id} writing snow_amount as ${val}.`);
    writeFileSync(user_data_path(id), userString);
};

export async function get_packed_object(id) {
    const val = await get_user_data(id);
    console.log(`${id} reading packed_object as ${val.packed_object}.`);
    return val.packed_object;
};

export async function set_packed_object(id, val) {
    const user = await get_user_data(id);
    user.packed_object = val;
    const userString = JSON.stringify(user, null, 2);

    console.log(`${id} writing packed_object.`);
    writeFileSync(user_data_path(id), userString);
};

export async function get_building(id) {
    const val = await get_user_data(id);
    console.log(`${id} reading building as ${val.current_building}.`);
    return val.current_building;
};

export async function set_building(id, val) {
    const user = await get_user_data(id);
    user.current_building = val;
    const userString = JSON.stringify(user, null, 2);

    console.log(`${id} writing building as ${val}.`);
    writeFileSync(user_data_path(id), userString);
};

export async function get_ready(id) {
    const val = await get_user_data(id);
    console.log(`${id} reading ready as ${val.ready}.`);
    return val.ready;
};

export async function set_ready(id, val) {
    const user = await get_user_data(id);
    user.ready = val;
    const userString = JSON.stringify(user, null, 2);

    console.log(`${id} writing ready as ${val}.`);
    writeFileSync(user_data_path(id), userString);
};

export async function get_opt(id) {
    const val = await get_user_data(id);
    console.log(`${id} reading opt as ${val.playing}.`);
    return val.playing;
};

export async function set_opt(id, val) {
    const user = await get_user_data(id);
    user.playing = val;
    const userString = JSON.stringify(user, null, 2);

    console.log(`${id} writing opt as ${val}.`);
    writeFileSync(user_data_path(id), userString);
}

export function get_weather() {
    const jsonString = readFileSync(weather_data);
    try {
        const weather = JSON.parse(jsonString);
        return weather;
    } catch(err) {
        console.error(err);
        return -1;
    }
}

export function set_weather(weather) {
    const weatherString = JSON.stringify(weather, null, 2);
    writeFileSync(weather_data, weatherString);
}

export function get_next_weather() {
    const jsonString = readFileSync(next_weather_data);
    try {
        const weather = JSON.parse(jsonString);
        return weather;
    } catch(err) {
        console.error(err);
        return -1;
    }
}

export function set_next_weather(weather) {
    const weatherString = JSON.stringify(weather, null, 2);
    writeFileSync(next_weather_data, weatherString);
}
