import { EmbedBuilder } from 'discord.js';

const snowball_hit_images = [
	'https://media4.giphy.com/media/xUySTqYAa9n6awCiSk/giphy.gif',
	'https://media4.giphy.com/media/xUySTZhLpepqXCl5Dy/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG9wdDk5bXYyMDQ5Z3N5azN4ajRuNThjbTFwZDVmZWRyejI1dXNuMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QEMJ0cVvISSn0TDTgM/giphy.gif',
	'https://media2.giphy.com/media/IDx2YG1IDi8Gk/giphy.gif',
	'https://media2.giphy.com/media/3ov9kaSQS6dBFGiPXW/giphy.gif',
	'https://media0.giphy.com/media/3o6ZsSX6wprrUBSCv6/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG9wdDk5bXYyMDQ5Z3N5azN4ajRuNThjbTFwZDVmZWRyejI1dXNuMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Yqp8T6wy2OxCaUlzyd/giphy.gif',
	'https://media0.giphy.com/media/82UShOcFtOdNquZdlB/giphy.gif',
	'https://media4.giphy.com/media/xUNd9RQX4c7jWRdOCs/giphy.gif',
	'https://media1.giphy.com/media/5jWIDxC67K4DPWNx4N/giphy.gif',
	'https://media3.giphy.com/media/Nszy4Ei57cwf2JyCYH/giphy.gif',
	'https://media2.giphy.com/media/559r1pO9qyWUMMyP8o/giphy.gif',
	'https://media1.giphy.com/media/3o7aCQxbiKiFu0hNWU/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG9wdDk5bXYyMDQ5Z3N5azN4ajRuNThjbTFwZDVmZWRyejI1dXNuMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dPrpytzF7QuDh9LpCq/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Z3BjM3hxMzlpM2g4dm1nYzE5NjJmaHV0Y3pnMGhvYm5ubWwzYTJxMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RHstWOQRL0p7I7tyvG/giphy.gif',
	'https://media1.giphy.com/media/5UENwOHdLcbQxYu8Jf/giphy.gif',
	'https://media2.giphy.com/media/L6CFxTanndCEhrG7Or/giphy.gif',
	'https://media0.giphy.com/media/9Y5pYhSkW46iOhQjoJ/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3amZscDYyN3c3NGQyZTVsemEwM21rbHYzNjI2aDRpanZ2NjdvOWRqMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/r3X6A0sKxhf44/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2duMnBqOXdmMGJudGtjMTZyZXY1c2IzNGZpaGE5ODVpNWZ5c2ExbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SceEMK2IAePGU/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2duMnBqOXdmMGJudGtjMTZyZXY1c2IzNGZpaGE5ODVpNWZ5c2ExbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YVPoPAW4O8hcTUqSyM/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2duMnBqOXdmMGJudGtjMTZyZXY1c2IzNGZpaGE5ODVpNWZ5c2ExbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9C8pGHTRwgw1y/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2duMnBqOXdmMGJudGtjMTZyZXY1c2IzNGZpaGE5ODVpNWZ5c2ExbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/55itBAIWPMWKej8RgH/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MjRxcWVuMTI5dHVkNHdlM2gxbjh0bzdqNndjbm5wOG5tczJodmY0YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GppTiyige7r5XPxejM/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MjRxcWVuMTI5dHVkNHdlM2gxbjh0bzdqNndjbm5wOG5tczJodmY0YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XFuIMGYs6fyp2/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MjRxcWVuMTI5dHVkNHdlM2gxbjh0bzdqNndjbm5wOG5tczJodmY0YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3019zizFQTcGh1Nmcs/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cHQ5NWE3bGZyaGR3eWp5OTA0Njc4Z3JuejV2dzd0cTQ1emFndzF6YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/V133Y69cB7K2CKYCUC/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cHQ5NWE3bGZyaGR3eWp5OTA0Njc4Z3JuejV2dzd0cTQ1emFndzF6YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3rUbrm19o2LeeKNGqW/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cGNldXoxY2NsNDhodDlmb2NndTF0a242d2wxemVnbWU5ZWZtdWNhYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UU1CrZZQp8aKA/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cGNldXoxY2NsNDhodDlmb2NndTF0a242d2wxemVnbWU5ZWZtdWNhYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6MboOhxuTRzxTngc/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cGNldXoxY2NsNDhodDlmb2NndTF0a242d2wxemVnbWU5ZWZtdWNhYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l41lM2VgxPD0RGI8w/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWxndGRiN2dtb2o5Ym4yb2JxMG53dXh1cmRncWJsYjl1ZjY4c3VmZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4rCniJKmiHmeQSnnO2/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dXp5aXRkNzFqNXlnMjFjdDBkbXBocGNsYjZvcmxtYm56ZXBjZmlzeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MOMoK5azG6Hf6BytYF/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dXp5aXRkNzFqNXlnMjFjdDBkbXBocGNsYjZvcmxtYm56ZXBjZmlzeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0Ex4RUz3h0L65I64/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NWNnenNhNXRvc29zM2tveGcwdTdtMG44MnlsN25vMXU4eGNqMHozMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/eepnK29bE2Ads913ab/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OXZuM2dybXhjbHhlZGg1aWMzbWc5a3k1Y2RjMG9xdjcxb3VwNG14YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EgxV0D26HftkuqNnSZ/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OXZuM2dybXhjbHhlZGg1aWMzbWc5a3k1Y2RjMG9xdjcxb3VwNG14YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/623OeWe6Zf1812Ke8b/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzZtdHZrdzAwbjJmNzlnbGdjMzlvcWs4bDRrOXRyNTV0YWE2d3JnaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kiocLO7ufwihsdRTlx/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXJmaGNqcTFyNG52NHh6Z3ZhbHJvMDJ5ejU4dzZ1cTMyNjQ4dnZreiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlFCPviJKE9Opvq/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnduZXF6bGo5anV5M3VzN3czNnUzcjNibGN6MTI1Z3g4MXJmaDUzaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2hUEYYsJThKUUz9jCJ/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NDkwc3oxanRscXVhczIxNzJ4bHBoNzJjYzlyeTJuNDBnZ2toNXB5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KMDZ62REkZTRK4URMF/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NDkwc3oxanRscXVhczIxNzJ4bHBoNzJjYzlyeTJuNDBnZ2toNXB5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3otPopKmXeMoSOjA2I/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dTVuc3Z0MmxvM2pkbmhueXE2dzhjcHBiM214cGpvcWNtc2Y2bnUzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/sTUe8s1481gY0/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MTg3d29ldXU3bDBueGd0djZtNWxoaWRtMTN4bjYzcG53b2NvYmd4YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/u7OpQv5xxx9C/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bm0zY3hqbXAxbWVsbHd1cnNzeTY2ZnozeWd6MHJzZWNzcDE5eTE3eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XekXRMMVEa0jD6xT0b/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3b3p6NnVldnN1cWM4dzFha3JpdXI3NjlyZHIxemZpOGw2OXZ4Y2dpdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kH1WgBtxP93hKnDLKV/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dXVieGc1YzVxOWR6eHF0OHowbmd4MG45ejdqYzUzd2Jzd2xnNHZvdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BSXimnwkAwGYzcDQ4y/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eTY2d2FldnBoY3lsMTJranE4MTF4cHMzdmhzMnZjbnhpd2l0aWFoNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iDUME0Hr0fNe9YUfvQ/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3N3V1dGN6N3M0MGh5a282dmowN3dkZnFkNWx2eDQyNTgzN2hrOW5yeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l4hLU9YxwVtap8eRy/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3N3V1dGN6N3M0MGh5a282dmowN3dkZnFkNWx2eDQyNTgzN2hrOW5yeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0IycKo122K2rL5Ty/giphy.gif',
	'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3a2I5ZmRra205eXlsOWlxbGNiZXhlZTYydjNnYjlja2N4dWFjZDBrMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ZwfZPvcSoQKBzfsJ6r/giphy.gif'
];

function snowball_hit_messages(id, item) {
	return [
		`You threw a ${item != null ? item.name + '-packed ' : ''}snowball at <@${id}>! Good job!`,
		`You pelted <@${id}> with a ${item != null ? item.name + '-packed ' : ''}snowball! Who's laughing now?`,
		`You gave it everything you got and hit <@${id}> with a ${item != null ? item.name + '-packed ' : ''}snowball!`,
		`You hit <@${id}> right in the kisser with a ${item != null ? item.name + '-packed ' : ''}snowball! Ouch!`,
		`You nailed <@${id}> with a ${item != null ? item.name + '-packed ' : ''}snowball! Bullseye!`
	];
};

function snowball_miss_messages(id) {
	return [
		`You tried pelting <@${id}> with a snowball, but missed!`,
		`You attempted to throw a snowball at <@${id}>, but they dodged!`,
		`Despite giving it everything you had, you missed <@${id}> by a mile!`,
		`You tried aiming at <@${id}>, but it went way off target!`,
		`You got distracted and completely missed <@${id}>!`
	];
};

function snowball_block_messages(id, build) {
	return [
		`You tried your best to throw a snowball at <@${id}>, but it was blocked by their **${build.name}**! It has **${build.hits}** hit${build.hits == 1 ? '' : 's'} left until it shatters!`,
		`You tried pelting <@${id}> with a snowball, but it was denied by their **${build.name}**! It has **${build.hits}** hit${build.hits == 1 ? '' : 's'} left until it breaks!`,
		`You gave it everything you got, but <@${id}>'s **${build.name}** blocked your shot! It has **${build.hits}** hit${build.hits == 1 ? '' : 's'} left until it collapses!`,
		`You attempted to hit <@${id}> with a snowball, but their **${build.name}** got in the way! It has **${build.hits}** hit${build.hits == 1 ? '' : 's'} left until it falls apart!`,
		`You tried nailing <@${id}> with a snowball, but their **${build.name}** had other plans! It has **${build.hits}** hit${build.hits == 1 ? '' : 's'} left until it goes down!`
	];
};

function snowball_block_break_messages(id, build) {
	return [
		`You threw a snowball at <@${id}> and took down their **${build.name}**! Quick, throw another!`,
		`You pelted <@${id}> with a snowball and broke their **${build.name}**! Throw another while you can!`,
		`You gave it everything you got and annihilated <@${id}>'s **${build.name}**! Keep it up!`,
		`You hit <@${id}>'s **${build.name}** with a snowball and destroyed it! Don't stop now!`,
		`You nailed <@${id}>'d **${build.name}** with a snowball and demolished it! Now, throw more!`
	];
};

export function build_snowball_hit(member, item, score, score2, member2, crit, amount) {
    const randomImageIndex = Math.floor(Math.random() * snowball_hit_images.length);
    const randomMessageIndex = Math.floor(Math.random() * snowball_hit_messages(0, item).length);
	
	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(crit ? 'Critical Hit!' : 'Hit!')
		.setDescription(snowball_hit_messages(member.user.id, item)[randomMessageIndex])
		.addFields(
			{ name: `${member2.user.displayName}`,	value: `Score: ${score} (+${amount})`,	inline: true },
			{ name: `${member.user.displayName}`,	value: `Score: ${score2}`,	inline: true }
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

export function build_snowball_block_break(member, item, score, score2, member2, crit, amount, build) {
	const randomMessageIndex = Math.floor(Math.random() * snowball_block_break_messages(0, build).length);

	return new EmbedBuilder()
		.setColor(0xFFFFFF)
		.setTitle(`Defense Broken!${crit ? ' (Critical!)' : ''}`)
		.setDescription(snowball_block_break_messages(member.user.id, build)[randomMessageIndex])
		.addFields(
			{ name: `${member2.user.displayName}`,	value: `Score: ${score} (+${amount})`,	inline: true },
			{ name: `${member.user.displayName}`,	value: `Score: ${score2}`,	inline: true }
		);
};
