import { add_achievement } from "../database";

const snow_hoarder = {
    id: "snow_hoarder",
    name: "Snow Hoarder",
    description: "Collect a total of 10 snow.",
    property: "total_snow_collected",
    value: 10
};

const sharpshooter = {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "Hit someone with a snowball for the first time.",
    property: "hits",
    value: 1
};

const lucky_shot = {
    id: "lucky_shot",
    name: "Lucky Shot",
    description: "Get a critical hit for the first time.",
    property: "crits",
    value: 1
};

const blindfolded = {
    id: "blindfolded",
    name: "Blindfolded",
    description: "Miss a shot for the first time.",
    property: "misses",
    value: 1
};

const target_practice = {
    id: "target_practice",
    name: "Target Practice",
    description: "Get hit with a snowball for the first time.",
    property: "times_hit",
    value: 1
};

const snow_novice = {
    id: "snow_novice",
    name: "Snow Novice",
    description: "Create your first snow building.",
    property: "total_buildings",
    value: 1
};

const snow_stuffer = {
    id: "snow_stuffer",
    name: "Snow Stuffer",
    description: "Pack your first object inside snow.",
    property: "total_objects_packed",
    value: 1
};

const achievements = [
    snow_hoarder,
    sharpshooter,
    lucky_shot,
    blindfolded,
    target_practice,
    snow_novice,
    snow_stuffer
]

export default function parseAchievements(userData) {
    let achievementsOut = [];

    for (let i = 0; i < achievements.length; ++i) {
        const achievement = achievements[i];

        if (userData[achievement.property] >= achievement.value && !userData.achievements.includes(achievement.id)) {
            add_achievement(userData.userID, achievement.id);
            achievementsOut.push(achievement);
        }
    }

    return achievementsOut;
};
