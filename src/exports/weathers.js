const sunny = {
    id: "sunny",
    name: "Sunny",
    cooldown: -2,
    building_cost_modifier: 0,
    icon: "☀️",
    image: "https://thumbs.dreamstime.com/b/sunny-weather-summer-today-bright-sunny-summer-day-clear-skies-vibrant-colors-ideal-joyful-lively-design-364015406.jpg",
    description: "The sun is so hot! Any buildings, collected snow, and packed objects have melted away by now."
};

const clear = {
    id: "clear",
    name: "Clear",
    cooldown: -1,
    building_cost_modifier: 0,
    icon: "☀️",
    image: "https://img.freepik.com/free-photo/white-clouds-with-blue-sky-background_1253-224.jpg",
    description: "There doesn't seem to be any snow. Snow can't be collected right now but you can use any that you currently have."
};

const light_snow = {
    id: "light_snow",
    name: "Light Snow",
    cooldown: 12,
    building_cost_modifier: 0,
    icon: "❄️",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoGN6L6gvsJWM12UrvpJWZmjdVjpUSALlpYw&s",
    description: "It's snowing a little bit! You can collect snow after a cooldown and throw it at other users."
};

const medium_snow = {
    id: "medium_snow",
    name: "Medium Snow",
    cooldown: 9,
    building_cost_modifier: 0,
    icon: "❄️",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/TCDSAY732BCIJBKZIIJCQT2BL4.jpg",
    description: "It's snowing! Collect snow after a short cooldown, then throw it at your enemies!"
};

const heavy_snow = {
    id: "heavy_snow",
    name: "Heavy Snow",
    cooldown: 6,
    building_cost_modifier: -1,
    icon: "❄️",
    image: "https://imagesvc.meredithcorp.io/v3/mm/image?q=60&c=sc&poi=face&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F34%2F2020%2F12%2F18%2Fsnow-storm-blizzard-getty-1220-2000.jpg",
    description: "The snow is coming down hard! You can collect snow a little bit faster!"
};

const snowstorm = {
    id: "snowstorm",
    name: "Snowstorm",
    cooldown: 3,
    building_cost_modifier: -1,
    icon: "🏔️",
    image: "https://thumbs.dreamstime.com/b/scene-beautiful-snow-covered-winter-garden-140791588.jpg",
    description: "Snowstorm! Collect snow with a shorter cooldown and build buildings for less snow."
};

const blizzard = {
    id: "blizzard",
    name: "Blizzard",
    cooldown: 0,
    building_cost_modifier: -2,
    icon: "🏔️",
    image: "https://www.farmersalmanac.com/wp-content/uploads/2013/02/Snowy-Blizzard-Forest-Winter-Landscape-as_131962244-945x630.jpeg",
    description: "It's a blizzard! You can collect snow without any cooldown. Buildings cost way less snow than usual."
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
