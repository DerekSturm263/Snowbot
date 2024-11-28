import { createWriteStream, existsSync, readFile, writeFileSync } from "node:fs";

function leaderboard_data_path(id) { return `./data/leaderboards/${id}.json`; }

const leaderboard_t = {
    all: [
        {
            id: "default",
            score: 0
        }
    ]
};

async function create_leaderboard_data(id) {
    return new Promise((resolve, reject) => {
        if (!existsSync(leaderboard_data_path(id))) {
            // Create the file.
            console.log(`Leaderboard data not found for ${id}. Creating new file...`);
                
            const fs = createWriteStream(leaderboard_data_path(id));
            fs.write(JSON.stringify(leaderboard_t, null, 2));
            fs.end();

            fs.on('finish', () => {
                console.log(`Leaderboard data created for ${id}.`);
                resolve();
            })
    
            fs.on('error', err => reject(err));
        } else {
            resolve();
        }
    });
};

async function read_leaderboard_data(id) {
    return new Promise((resolve, reject) => {
        // Read the file.
        console.log(`Attempting to read leaderboard data for ${id}.`);
        readFile(leaderboard_data_path(id), (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            console.log(`Leaderboard data found for ${id}.`);
            resolve(JSON.parse(data));
        });
    });
}

async function create_and_read_leaderboard_data(id) {
    return new Promise((resolve, reject) => {
        create_leaderboard_data(id)
            .then(() => {
                read_leaderboard_data(id)
                    .then((data) => resolve(data))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

export async function get_leaderboard_data(id) { return await create_and_read_leaderboard_data(id); }

export async function get_score(boardID, userID) {
    let leaderboard = await get_leaderboard_data(boardID);

    // Update the score of the user.
    const user = leaderboard.all.find(element => element.id == userID);
    if (user != null) {
        console.log(`Reading score as ${user.score}.`);
        return user.score;
    } else {
        leaderboard.all.push({ id: userID, score: 0 });

        const leaderBoardString = JSON.stringify(leaderboard, null, 2);
        writeFileSync(leaderboard_data_path(boardID), leaderBoardString);

        console.log(`Reading score as 0.`);
        return 0;
    }
};

export async function set_score(boardID, userID, val) {
    let leaderboard = await get_leaderboard_data(boardID);

    // Update the score of the user.
    let user = leaderboard.all.find(element => element.id == userID);
    if (user != null) {
        user.score = val;
    } else {
        leaderboard.all.push({ id: userID, score: val });
    }

    console.log(`Writing score as ${val}.`);
    const leaderBoardString = JSON.stringify(leaderboard, null, 2);
    writeFileSync(leaderboard_data_path(boardID), leaderBoardString);
};
