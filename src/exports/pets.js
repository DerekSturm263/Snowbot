const snow_worm = {
    id: "snow_worm",
    name: "Snow Worm",
    description: "A tiny snow worm that does absolutely nothing.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8yHASr5GITzfox_P7ACtyh_vJ_-yXPV-4pw&s",
    icon: "🪱",
    appetite: 10,
    delay: 0.5,
    event_type: "",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {

    },
    count: 1
}

const snow_dog = {
    id: "snow_dog",
    name: "Snow Dog",
    description: "A hyper snow dog that helps you out by decreasing your eggs' hatch time.",
    image: "https://media.istockphoto.com/id/97875216/photo/samoyed-puppy-running-in-the-snow.jpg?s=612x612&w=0&k=20&c=6OzpAULdvcJMeYdUBUC76gr2k_l1J2_tMnds4DcAwt8=",
    icon: "🐕",
    appetite: 15,
    delay: 1,
    event_type: "onGetEgg",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {
        egg_hatch_time_modifier: {
            type: "set",
            values: [ -0.2, -0.4, -0.6, -0.8, -1 ]
        }
    },
    count: 2
};

const snow_cat = {
    id: "snow_cat",
    name: "Snow Cat",
    description: "A curious snow cat that assists you by helping you find better objects for you to pack in your snowball.",
    image: "https://t3.ftcdn.net/jpg/00/38/71/14/360_F_38711492_nrVsdh9rhkrDwZhRGVd5ipndrr97nikR.jpg",
    icon: "🐈",
    appetite: 15,
    delay: 1,
    event_type: "onPack",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {
        pack_luck_modifier: {
            type: "set",
            values: [ 0.1, 0.2, 0.3, 0.4, 0.5 ]
        }
    },
    count: 2
};

const snow_wolf = {
    id: "snow_wolf",
    name: "Snow Wolf",
    description: "A cunning snow wolf that makes itself useful by shortening the cooldown on your collection speed.",
    image: "https://c02.purpledshub.com/uploads/sites/62/2024/08/Arctic-wolf-facts-scaled.jpg",
    icon: "🐺",
    appetite: 20,
    delay: 1.5,
    event_type: "onTryCollect",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {
        cooldown: {
            type: "delta",
            values: [ -2, -4, -6, -8, -10 ] 
        }
    },
    count: 2
};

const snow_bunny = {
    id: "snow_bunny",
    name: "Snow Bunny",
    description: "A prosperous snow bunny that does its part by increasing your luck when throwing snowballs.",
    image: "https://media.istockphoto.com/id/510955047/photo/white-snowshoe-hare-on-snow.jpg?s=612x612&w=0&k=20&c=7TafMOjjgAF9sLz37Qlh7ChkjaoJ7ch15P7nSt5_Og0=",
    icon: "🐇",
    appetite: 20,
    delay: 1.5,
    event_type: "onTryThrow",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {
        miss_chance: {
            type: "set",
            values: [ 0.1, 0.05, 0, 0, 0 ]
        },
        crit_chance: {
            type: "set",
            values: [ 0.85, 0.8, 0.75, 0.7, 0.65 ]
        }
    },
    count: 2
};

const snow_fox = {
    id: "snow_fox",
    name: "Snow Fox",
    description: "A sly snow fox that helps out by increasing your snow carrying limit.",
    image: "https://t3.ftcdn.net/jpg/02/25/52/78/360_F_225527887_1r2EaZbOrvCttqUDCvnA6HB9exVMrLXj.jpg",
    icon: "🦊",
    appetite: 20,
    delay: 1.5,
    event_type: "onTryCollect",
    server_changes: {
        max_snow_amount: {
            type: "set",
            values: [ 25, 30, 35, 40, 45 ]
        }
    },
    user_changes: {

    },
    weather_changes: {

    },
    count: 2
};

const snowman = {
    id: "snowman",
    name: "Snowman",
    description: "A friendly snowman that makes itself useful by letting you collect snow even when it's not snowing.",
    image: "https://t3.ftcdn.net/jpg/06/62/11/08/360_F_662110844_RuQiE5nvuTntDQ0NJCGg89VMf5vkMmA5.jpg",
    icon: "☃️",
    appetite: 25,
    delay: 2,
    event_type: "onCheckWeather",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {
        cooldown: {
            type: "set",
            values: [ 10, 8, 6, 4, 2 ]
        }
    },
    count: 2
};

const snow_owl = {
    id: "snow_owl",
    name: "Snow Owl",
    description: "A helpful snow owl that does its part by making buildings cheaper.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj1oc2ZIaT4rbdQEiSnN5SVfMH2Zi0LSUifA&s",
    icon: "🦉",
    appetite: 25,
    delay: 2,
    event_type: "onTryBuild",
    server_changes: {
        
    },
    user_changes: {

    },
    weather_changes: {
        building_cost_modifier: {
            type: "delta",
            values: [ -1, -2, -3, -4, -5 ]
        }
    },
    count: 1
};

const snow_dragon = {
    id: "snow_dragon",
    name: "Snow Dragon",
    descriptions: "A fierce snow dragon that helps by increasing your chance of finding eggs.",
    image: "https://thumbs.dreamstime.com/b/majestic-ice-dragon-soaring-over-snowy-mountains-magnificent-takes-flight-amidst-breathtaking-mountain-range-scene-fantasy-366995737.jpg",
    icon: "🐉",
    appetite: 30,
    delay: 2.5,
    event_type: "onCollect",
    server_changes: {
        egg_chance: {
            type: "set",
            values: [ 0.9, 0.85, 0.8, 0.75, 0.7 ]
        }
    },
    user_changes: {

    },
    weather_changes: {

    },
    count: 1
};

export default [
    snow_worm,
    snow_dog,
    snow_cat,
    snow_wolf,
    snow_bunny,
    snow_fox,
    snowman,
    snow_owl,
    snow_dragon
];
