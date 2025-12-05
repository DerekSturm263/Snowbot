const sunny = {
    id: "sunny",
    name: "Sunny",
    description: "The sun is so hot! Any buildings, collected snow, and packed objects have melted away by now.",
    image: "https://thumbs.dreamstime.com/b/sunny-weather-summer-today-bright-sunny-summer-day-clear-skies-vibrant-colors-ideal-joyful-lively-design-364015406.jpg",
    icon: "☀️",
    cooldown: -2,
    building_cost_modifier: 0,
    pack_luck_modifier: 0,
    egg_hatch_time_modifier: 0
};

const clear = {
    id: "clear",
    name: "Clear",
    description: "There doesn't seem to be any snow. Snow can't be collected right now but you can use any that you currently have.",
    image: "https://img.freepik.com/free-photo/white-clouds-with-blue-sky-background_1253-224.jpg",
    icon: "☀️",
    cooldown: -1,
    building_cost_modifier: 0,
    pack_luck_modifier: 0,
    egg_hatch_time_modifier: 0
};

const light_snow = {
    id: "light_snow",
    name: "Light Snow",
    description: "It's snowing a little bit! You can collect snow after a cooldown and throw it at other users.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoGN6L6gvsJWM12UrvpJWZmjdVjpUSALlpYw&s",
    icon: "❄️",
    cooldown: 12,
    building_cost_modifier: 0,
    pack_luck_modifier: 0,
    egg_hatch_time_modifier: 0
};

const medium_snow = {
    id: "medium_snow",
    name: "Medium Snow",
    description: "It's snowing! Collect snow after a short cooldown, then throw it at your enemies!",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/TCDSAY732BCIJBKZIIJCQT2BL4.jpg",
    icon: "❄️",
    cooldown: 9,
    building_cost_modifier: 0,
    pack_luck_modifier: 0,
    egg_hatch_time_modifier: 0
};

const heavy_snow = {
    id: "heavy_snow",
    name: "Heavy Snow",
    description: "The snow is coming down hard! You can collect snow a little bit faster!",
    image: "https://imagesvc.meredithcorp.io/v3/mm/image?q=60&c=sc&poi=face&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F34%2F2020%2F12%2F18%2Fsnow-storm-blizzard-getty-1220-2000.jpg",
    icon: "❄️",
    cooldown: 6,
    building_cost_modifier: -1,
    pack_luck_modifier: 0,
    egg_hatch_time_modifier: 0
};

const snowstorm = {
    id: "snowstorm",
    name: "Snowstorm",
    description: "Snowstorm! Collect snow with a shorter cooldown and build buildings for less snow.",
    image: "https://thumbs.dreamstime.com/b/scene-beautiful-snow-covered-winter-garden-140791588.jpg",
    icon: "🏔️",
    cooldown: 3,
    building_cost_modifier: -1,
    pack_luck_modifier: 0.1,
    egg_hatch_time_modifier: 0
};

const blizzard = {
    id: "blizzard",
    name: "Blizzard",
    description: "It's a blizzard! You can collect snow without any cooldown. Buildings cost way less snow than usual.",
    image: "https://www.farmersalmanac.com/wp-content/uploads/2013/02/Snowy-Blizzard-Forest-Winter-Landscape-as_131962244-945x630.jpeg",
    icon: "🏔️",
    cooldown: 0,
    building_cost_modifier: -2,
    pack_luck_modifier: 0.1
};

export default [
    sunny,
    clear,
    light_snow,
    medium_snow,
    medium_snow,
    heavy_snow,
    snowstorm,
    blizzard
];
