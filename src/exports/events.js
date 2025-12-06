const no_misses = {
    id: "no_misses",
    name: "No Misses",
    description: "All throws hit their target.",
    icon: "🎯",
    changes: {
        miss_chance: 0
    }
}

const only_criticals = {
    id: "only_criticals",
    name: "Only Criticals",
    description: "All successful hits are criticals.",
    icon: "💥",
    changes: {
        crit_chance: 0.15
    }
}

const higher_egg_chance = {
    id: "higher_egg_chance",
    name: "Higher Egg Chance",
    description: "Increases chance of finding eggs when using `/collect`.",
    icon: "🥚",
    changes: {
        egg_chance: 0.8
    }
}

const extra_snow = {
    id: "extra_snow",
    name: "Extra Snow",
    description: "Increases amount of snow collected when using `/collect`.",
    icon: "❄️",
    changes: {
        snow_collect_amount: 2
    }
}

export default [
    no_misses,
    only_criticals,
    higher_egg_chance,
    extra_snow
];
