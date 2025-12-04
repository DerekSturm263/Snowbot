// Lets server admins manage the server's buildings, objects, pets, and events.

import { ActionRowBuilder, ButtonBuilder, LabelBuilder, MessageFlags, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { get_server_data } from '../miscellaneous/database.js';
import log from '../miscellaneous/debug.js';

function createNewBuildingModal() {
    const modal = new ModalBuilder()
        .setCustomId('newBuilding')
        .setTitle('Create New Building');

    const nameLabel = new LabelBuilder()
        .setLabel('Name')
        .setDescription('The name of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));
            
    const iconLabel = new LabelBuilder()
        .setLabel('Icon')
        .setDescription('The icon for this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('icon')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1)
            .setMinLength(1)
            .setRequired(true));

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setDescription('A short description of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('description')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const imageLabel = new LabelBuilder()
        .setLabel('Image URL')
        .setDescription('An image for this building (URL only!)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('image')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const costLabel = new LabelBuilder()
        .setLabel('Cost')
        .setDescription('The snowball cost of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('cost')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const healthLabel = new LabelBuilder()
        .setLabel('Health')
        .setDescription('The health of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('health')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    modal.addLabelComponents(nameLabel, iconLabel, imageLabel, descriptionLabel, costLabel, healthLabel);

    return modal;
}

function createNewObjectModal() {
    const modal = new ModalBuilder()
        .setCustomId('newObject')
        .setTitle('Create New Object');

    const nameLabel = new LabelBuilder()
        .setLabel('Name')
        .setDescription('The name of this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));
            
    const iconLabel = new LabelBuilder()
        .setLabel('Icon')
        .setDescription('The icon for this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('icon')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1)
            .setMinLength(1)
            .setRequired(true));

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setDescription('A short description of this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('description')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const imageLabel = new LabelBuilder()
        .setLabel('Image URL')
        .setDescription('An image for this object (URL only!)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('image')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const costLabel = new LabelBuilder()
        .setLabel('Cost')
        .setDescription('The snowball cost of this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('cost')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const rarityLabel = new LabelBuilder()
        .setLabel('Rarity')
        .setDescription('The rarity of this object (1 is rarest, higher is more common)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('rarity')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    modal.addLabelComponents(nameLabel, iconLabel, imageLabel, descriptionLabel, costLabel, rarityLabel);

    return modal;
}

function createNewPetModal() {
    const modal = new ModalBuilder()
        .setCustomId('newPet')
        .setTitle('Create New Pete');

    const nameLabel = new LabelBuilder()
        .setLabel('Name')
        .setDescription('The name of this pet')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));
            
    const iconLabel = new LabelBuilder()
        .setLabel('Icon')
        .setDescription('The icon for this pete')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('icon')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1)
            .setMinLength(1)
            .setRequired(true));

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setDescription('A short description of this pet')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('description')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const imageLabel = new LabelBuilder()
        .setLabel('Image URL')
        .setDescription('An image for this pet (URL only!)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('image')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const appetiteLabel = new LabelBuilder()
        .setLabel('Appettite')
        .setDescription('How much this pet needs to eat before it levels up')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('appetite')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const eggTimeLabel = new LabelBuilder()
        .setLabel('Egg Time')
        .setDescription('How many hours this pet takes to hatch from its egg')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('rarity')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const eventTypeLabel = new LabelBuilder()
        .setLabel('Event Type')
        .setDescription('The type of event this pet responds to')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('eventType')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    const rarityLabel = new LabelBuilder()
        .setLabel('Rarity')
        .setDescription('The rarity of this pet (1 is rarest, higher is more common)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('rarity')
            .setStyle(TextInputStyle.Short)
            .setRequired(true));

    modal.addLabelComponents(nameLabel, iconLabel, imageLabel, descriptionLabel, appetiteLabel, eggTimeLabel, eventTypeLabel, rarityLabel);

    return modal;
}

function editExistingBuildingModal(building) {
    const modal = new ModalBuilder()
        .setCustomId('editBuilding')
        .setTitle('Edit Existing Building');

    const nameLabel = new LabelBuilder()
        .setLabel('Name')
        .setDescription('The name of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(building.name.toString()));
            
    const iconLabel = new LabelBuilder()
        .setLabel('Icon')
        .setDescription('The icon for this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('icon')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1)
            .setMinLength(1)
            .setRequired(true)
            .setValue(building.icon.toString()));

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setDescription('A short description of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('description')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(building.description.toString()));

    const imageLabel = new LabelBuilder()
        .setLabel('Image URL')
        .setDescription('An image for this building (URL only!)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('image')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(building.image.toString()));

    const costLabel = new LabelBuilder()
        .setLabel('Cost')
        .setDescription('The snowball cost of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('cost')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(building.cost.toString()));

    const healthLabel = new LabelBuilder()
        .setLabel('Health')
        .setDescription('The health of this building')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('health')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(building.hits.toString()));

    modal.addLabelComponents(nameLabel, iconLabel, imageLabel, descriptionLabel, costLabel, healthLabel);

    return modal;
}

function editExistingObjectModal(object) {
    const modal = new ModalBuilder()
        .setCustomId('editObject')
        .setTitle('Edit Existing Object');

    const nameLabel = new LabelBuilder()
        .setLabel('Name')
        .setDescription('The name of this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(object.name.toString()));
            
    const iconLabel = new LabelBuilder()
        .setLabel('Icon')
        .setDescription('The icon for this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('icon')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1)
            .setMinLength(1)
            .setRequired(true)
            .setValue(object.icon.toString()));

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setDescription('A short description of this object')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('description')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(object.description.toString()));

    const imageLabel = new LabelBuilder()
        .setLabel('Image URL')
        .setDescription('An image for this object (URL only!)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('image')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(object.image.toString()));

    const costLabel = new LabelBuilder()
        .setLabel('Damage')
        .setDescription('The damage this object does')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('damage')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(object.damage.toString()));

    const rarityLabel = new LabelBuilder()
        .setLabel('Rarity')
        .setDescription('The rarity of this object (1 is rarest, higher is more common)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('rarity')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(object.count.toString()));

    modal.addLabelComponents(nameLabel, iconLabel, imageLabel, descriptionLabel, costLabel, rarityLabel);

    return modal;
}

function editExistingPetModal(pet) {
    const modal = new ModalBuilder()
        .setCustomId('newPet')
        .setTitle('Create New Pete');

    const nameLabel = new LabelBuilder()
        .setLabel('Name')
        .setDescription('The name of this pet')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.name.toString()));
            
    const iconLabel = new LabelBuilder()
        .setLabel('Icon')
        .setDescription('The icon for this pete')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('icon')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1)
            .setMinLength(1)
            .setRequired(true)
            .setValue(pet.icon.toString()));

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setDescription('A short description of this pet')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('description')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.description.toString()));

    const imageLabel = new LabelBuilder()
        .setLabel('Image URL')
        .setDescription('An image for this pet (URL only!)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('image')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.image.toString()));

    const appetiteLabel = new LabelBuilder()
        .setLabel('Appettite')
        .setDescription('How much this pet needs to eat before it levels up')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('appetite')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.appetite.toString()));

    const eggTimeLabel = new LabelBuilder()
        .setLabel('Egg Time')
        .setDescription('How many hours this pet takes to hatch from its egg')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('rarity')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.hatch_time.toString()));

    const eventTypeLabel = new LabelBuilder()
        .setLabel('Event Type')
        .setDescription('The type of event this pet responds to')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('eventType')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.event_type.toString()));

    const rarityLabel = new LabelBuilder()
        .setLabel('Rarity')
        .setDescription('The rarity of this pet (1 is rarest, higher is more common)')
        .setTextInputComponent(new TextInputBuilder()
            .setCustomId('rarity')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(pet.count.toString()));

    modal.addLabelComponents(nameLabel, iconLabel, imageLabel, descriptionLabel, appetiteLabel, eggTimeLabel, eventTypeLabel, rarityLabel);

    return modal;
}

export const command = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup this server\'s custom buildings, objects, pets, and events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand
            .setName('buildings')
            .setDescription('Manage this server\'s custom buildings.'))
        .addSubcommand(subcommand => subcommand
            .setName('objects')
            .setDescription('Manage this server\'s custom objects.'))
        .addSubcommand(subcommand => subcommand
            .setName('pets')
            .setDescription('Manage this server\'s custom pets.'))
        .addSubcommand(subcommand => subcommand
            .setName('events')
            .setDescription('Manage this server\'s custom events.')),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        log(`\n${interaction.user.displayName} from ${interaction.guild.name} used /setup ${interaction.options.getSubcommand()}:`);

        const server_data = await get_server_data(interaction.guild.id);

		let index = 0;

		const selectRow = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('options')
					.addOptions(
						[ ...server_data[interaction.options.getSubcommand()].map((item, index) => new StringSelectMenuOptionBuilder()
							.setLabel(`${item.icon} ${item.name}`)
							.setValue(`${index}`)
							.setDefault(index == 0)
						), new StringSelectMenuOptionBuilder()
							.setLabel('Create New')
							.setValue('create')
							.setDefault(false) ]
					)
				);

		const buttonsRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('edit')
					.setLabel('Edit')
					.setStyle('Primary'),
				new ButtonBuilder()
					.setCustomId('delete')
					.setLabel('Delete')
					.setStyle('Danger')
			);

        const message = await interaction.editReply({
            components: [ selectRow, buttonsRow ],
            flags: MessageFlags.Ephemeral
        });

		const collector = message.createMessageComponentCollector({ time: 2 * 60 * 1000 });
		collector.on('collect', async i => {
            if (i.customId == 'options') {
				await i.deferUpdate();

                if (i.values[0] != 'create') {
                    index = Number(i.values[0]);
                } else {
                    await interaction.showModal(
                        interaction.options.getSubcommand() == 'buildings' ? createNewBuildingModal() :
                        interaction.options.getSubcommand() == 'objects' ? createNewObjectModal() :
                        createNewPetModal()
                    );
                }
                
            } else if (i.customId == 'edit') {
				await i.deferUpdate();

                await interaction.showModal(
                    interaction.options.getSubcommand() == 'buildings' ? editExistingBuildingModal(server_data.buildings[index]) :
                    interaction.options.getSubcommand() == 'objects' ? editExistingObjectModal(server_data.objects[index]) :
                    editExistingPetModal(server_data.pets[index])
                );
            } else if (i.customId == 'delete') {
				await i.deferUpdate();

            }
        });
    }
};