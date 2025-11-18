import { add_achievement } from "../database";

const target_practice = {
    id: "target_practice",
    name: "Target Practice",
    description: "Get hit with a snowball 10 times.",
    property: "times_hit",
    value: 10
};

const achievements = [
    target_practice
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
