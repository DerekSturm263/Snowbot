import { EmbedBuilder } from 'discord.js';

const snowball_hit_images = [
	'https://media4.giphy.com/media/xUySTqYAa9n6awCiSk/giphy.gif',
	'https://media4.giphy.com/media/xUySTZhLpepqXCl5Dy/giphy.gif',
	'https://media3.giphy.com/media/l0HlFCPviJKE9Opvq/giphy.gif',
	'https://media2.giphy.com/media/IDx2YG1IDi8Gk/giphy.gif',
	'https://media2.giphy.com/media/3ov9kaSQS6dBFGiPXW/giphy.gif',
	'https://media0.giphy.com/media/3o6ZsSX6wprrUBSCv6/giphy.gif',
	'https://media3.giphy.com/media/V0cSLsFbRO7SM/giphy.gif',
	'https://media0.giphy.com/media/82UShOcFtOdNquZdlB/giphy.gif',
	'https://media4.giphy.com/media/xUNd9RQX4c7jWRdOCs/giphy.gif',
	'https://media1.giphy.com/media/5jWIDxC67K4DPWNx4N/giphy.gif',
	'https://media3.giphy.com/media/Nszy4Ei57cwf2JyCYH/giphy.gif',
	'https://media2.giphy.com/media/559r1pO9qyWUMMyP8o/giphy.gif',
	'https://media1.giphy.com/media/3o7aCQxbiKiFu0hNWU/giphy.gif',
	'https://media2.giphy.com/media/9C8pGHTRwgw1y/giphy.gif',
	'https://media1.giphy.com/media/XekXRMMVEa0jD6xT0b/giphy.gif',
	'https://media1.giphy.com/media/5UENwOHdLcbQxYu8Jf/giphy.gif',
	'https://media2.giphy.com/media/L6CFxTanndCEhrG7Or/giphy.gif',
	'https://media0.giphy.com/media/9Y5pYhSkW46iOhQjoJ/giphy.gif',
	'https://media1.giphy.com/media/3019zizFQTcGh1Nmcs/giphy.gif'
];

function snowball_hit_messages(id, item) {
	return [
		`You threw a ${item != null ? item.name + '-packed ' : ''}snowball at <@${id}>! Good job!`,
		`You pelted <@${id}> with a ${item != null ? item.name + '-packed ' : ''}snowball! Who's laughing now?`,
		`You gave it everything you got and hit <@${id}> with a ${item != null ? item.name + '-packed ' : ''}snowball!`
	];
};

function snowball_hit_dm_messages(id, item) {
	return [
		`<@${id}> just threw a ${item != null ? item.name + '-packed ' : ''}snowball at you! Are you gonna stand for that?`,
		`<@${id}> pelted you with a ${item != null ? item.name + '-packed ' : ''}snowball! What are you gonna do about it?`,
		`<@${id}> gave it everything they got and hit you with a ${item != null ? item.name + '-packed ' : ''}snowball! Now it's your turn!`
	];
};

function snowball_miss_messages(id) {
	return [
		`You tried pelting <@${id}> with a snowball, but missed!`,
		`You tried throwing a snowball at <@${id}>, but they dodged!`,
		`Despite giving it everything you had, you missed <@${id}> by a mile!`
	];
};

function snowball_block_messages(id, build) {
	return [
		`You tried throwing a snowball at <@${id}>, but it was blocked by their ${build.name}! It has ${build.hits} hit(s) left until it breaks!`,
		`You tried pelting <@${id}> with a snowball, but it was blocked by their ${build.name}! It has ${build.hits} hit(s) left until it breaks!`,
		`You gave it everything you got, but <@${id}>'s ${build.name} blocked your shot! It has ${build.hits} hit(s) left until it breaks!`
	];
};

function snowball_block_break_messages(id, build) {
	return [
		`You threw a snowball at <@${id}> and broke their ${build}!`,
		`You pelted <@${id}> with a snowball and broke their ${build}!`,
		`You gave it everything you got and broke <@${id}>'s ${build}!`
	];
};

export function build_snowball_hit(member, item, score, score2, member2, crit) {
    const randomImageIndex = Math.floor(Math.random() * snowball_hit_images.length);
    const randomMessageIndex = Math.floor(Math.random() * snowball_hit_messages(0, item).length);
	
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(crit ? 'Critical Hit!' : 'Hit!')
		.setDescription(snowball_hit_messages(member.user.id, item)[randomMessageIndex])
		.addFields(
			{ name: `${member2.user.displayName}`,	value: `Score: ${score} (+${crit ? 2 : 1})`,	inline: true },
			{ name: `${member.user.displayName}`,	value: `Score: ${score2} (-${crit ? 2 : 1})`,	inline: true }
		)
		.setImage(snowball_hit_images[randomImageIndex]);
};

export function build_snowball_miss(member) {
	const randomMessageIndex = Math.floor(Math.random() * snowball_miss_messages(0).length);

	return new EmbedBuilder()
		.setColor(0x787878)
		.setTitle('Miss!')
		.setDescription(snowball_miss_messages(member.user.id)[randomMessageIndex]);
};

export function build_snowball_block(member, build) {
	const randomMessageIndex = Math.floor(Math.random() * snowball_block_messages(0, build).length);

	return new EmbedBuilder()
		.setColor(0x787878)
		.setTitle('Blocked!')
		.setDescription(snowball_block_messages(member.user.id, build)[randomMessageIndex]);
};

export function build_snowball_block_break(member, build) {
	const randomMessageIndex = Math.floor(Math.random() * snowball_block_break_messages(0, build).length);

	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('Defense Broken!')
		.setDescription(snowball_block_break_messages(member.user.id, build)[randomMessageIndex]);
};

export function build_snowball_hit_dm(member, item, score, score2, member2, crit) {
    const randomImageIndex = Math.floor(Math.random() * snowball_hit_images.length);
	const randomMessageIndex = Math.floor(Math.random() * snowball_hit_dm_messages(0, item).length);
	
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle('You\'re under attack!')
		.setDescription(snowball_hit_dm_messages(member2.user.id, item)[randomMessageIndex])
		.setImage(snowball_hit_images[randomImageIndex]);
};
