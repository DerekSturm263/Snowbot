import buildings from "../exports/buildings.js";
import pets from "../exports/pets.js";
import objects from "../exports/objects.js";
import events from "../exports/events.js";

export function create_default_user(id) {
    return {
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
        score: 0,
        hits: 0,
        crits: 0,
        misses: 0,
        times_hit: 0,
        ready_time: 0,
        pets: [],
        active_pet: "",
        total_pets: 0,
        achievements: [],
        show_pet_updates: true,
        show_achievements: true,
        show_pings: true
    };
}

export function create_default_server(id) {
    return {
        guildID: id,
        users: [],
        buildings: buildings,
        objects: objects,
        pets: pets,
        events: events,
        snow_collect_amount: 1,
        max_snow_amount: 20,
        miss_chance: 0.15,
        crit_chance: 0.9,
        egg_chance: 0.95
    };
}
