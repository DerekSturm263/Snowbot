const only_criticals = {
    id: "only_criticals",
    name: "Only Criticals",
    description: "All successful hits are criticals.",
    icon: "💥",
    changes: {
        crit_chance: 1.0
    }
}

const higher_egg_chance = {
    id: "higher_egg_chance",
    name: "Higher Egg Chance",
    description: "Increases chance of finding eggs when collecting snow .",
    icon: "🥚",
    changes: {
        egg_chance: 0.8
    }
}

const extra_snow = {
    id: "extra_snow",
    name: "Extra Snow",
    description: "Increases amount of snow collected.",
    icon: "❄️",
    changes: {
        snow_collect_amount: 2
    }
}

export default [
    only_criticals,
    higher_egg_chance,
    extra_snow
];
