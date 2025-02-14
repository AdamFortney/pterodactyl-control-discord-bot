import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ComponentType } from 'discord.js';
import { serverSelectMenu } from '../components/serverSelect.js';
import { sendServerCommand } from '../../pteroComponents/serverCommands.js';
import { getEndpointData } from '../../pteroComponents/pteroManager.js';

// Creates command in list
export const data = new SlashCommandBuilder()
    .setName('command')
    .setDescription('Send a command to the server console');

// Command action when executed
export async function execute(interaction) {

    // Gets serverSelectMenu dropdown
    const selectMenu = await serverSelectMenu();
    const serverSelect = await interaction.reply({
        content: '',
        components: [selectMenu],
        embeds: [{title: "Which server would you like to command?"}],
        withResponse: true,
    });

    // Waits for response or timeout after 120s
    try { const selectResponse = await serverSelect.resource.message.awaitMessageComponent({ componentType: ComponentType.StringSelect, filter: (i => i.user.id === interaction.user.id), time: 120_000 });

    // Gets the selected server
    let selectedServer = selectResponse.values[0];

    // Checks if server is locked
    let serverState = (await getEndpointData(`/api/client/servers/${selectedServer}`)).data.attributes.status
    if (serverState != null) {
        interaction.editReply({
            content: '',
            components: [],
            embeds: [{title: `Server is ${serverState}.`}]
        });
    } 

    // Checks if the server is offline
    else if ((await getEndpointData(`/api/client/servers/${selectedServer}/resources`)).data.attributes.current_state == 'offline') {
        interaction.editReply({
            content: '',
            components: [],
            embeds: [{title: "Server is offline."}]
        });
    } 
    
    // If the server is ready
    else {
        interaction.editReply({
            content: '',
            components: [],
            embeds: [{title: "Waiting for command..."}],
            withResponse: true,
        });

        // Send popup for command input and wait for response
        const modalResponse = await commandPopup(selectResponse);

        // Get the input values from popup
        let submittedCommand = modalResponse.fields.getTextInputValue('consoleCommand');

        // Send command to server
        let requestStatus = await sendServerCommand(selectedServer, submittedCommand)

        // Checks if post request errored out
        if (!requestStatus.ok) {
            // Respond to the user about action error
            await modalResponse.update({
                content: ``,
                embeds: [{title: `Unable to send command. Status: ${requestStatus.status}`}],
                components: [],
                ephemeral: true,
            });
        } else {
            // Respond to the user confirming action
            await modalResponse.update({
                content: ``,
                embeds: [{title: `Ran command: ${submittedCommand}`}],
                components: [],
                ephemeral: true,
            });}
    };

    // Catch error or timeout
    } catch {
    try { 
        // Catch error or timeout
        await interaction.editReply({ content: '', components: [], embeds: [{title: "Interaction timed out."}]})
    } catch(error) {
        // Catch reply error and log
        if(error.rawError.message == 'Unknown Message') {console.log('Unable to find message')}
        else {console.log('An unknown error occured: ' + error)};
    }}
}

async function commandPopup(interaction) {
    // Creates the modal popup menu
    const commandMenu = new ModalBuilder()
        .setCustomId('serverCommandMenu')
        .setTitle('Console Command');

    // Creates the command input field
    const commandInput = new TextInputBuilder()
        .setCustomId('consoleCommand')
        .setLabel('What command would you like to run?')
        .setStyle(TextInputStyle.Short);
    const commandInputRow = new ActionRowBuilder()
        .addComponents(commandInput);
    
    // Adds the components and sends the popup to the user
    commandMenu.addComponents(commandInputRow)
    await interaction.showModal(commandMenu)

    // Modal submission
    try {
        // Creates filter for this event
        const filter = i => i.customId === 'serverCommandMenu' && i.user.id === interaction.user.id;

        // Waits for event submission and return it through function
        const modalSubmission = await interaction.awaitModalSubmit({ filter, time: 220000 });
        return modalSubmission;
    }
    catch {
        try { 
            // Catch error or timeout
            await interaction.editReply({ content: '', components: [], embeds: [{title: "Submission timed out."}]})
            console.log('Server command aborted. Submission timed out or failed');
        } catch(error) {
            // Catch reply error and log
            if(error.rawError.message == 'Unknown Message') {console.log('Unable to find message')}
            else {console.log('An unknown error occured: ' + error)};
        }}
}