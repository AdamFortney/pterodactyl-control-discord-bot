# Discord bot for Pterodactyl Clients
A Discord bot for managing your servers in Pterodactyl.
This bot uses the ClientAPI, so it can be used reguardless if you host the panel or not.
This *should* work with other hosts that use Pterodactyl as a base system.

## Features
### `/control`
Allows you to view and control the state of the server.

<br>![Image of the Discord server control menu](https://i.imgur.com/ny8m1P6.png)

### `/command`
Allows you to run a command on a selected server. 
Example: `op MinecraftUser`

## Running the bot

### Docker Compose
You can find an example compose file below. [docker-compose.yml](https://github.com/AdamFortney/pterodactyl-control-discord-bot/blob/main/github_content/docker-compose.yml).
```
services:
  discord-bot:
    container_name: 'pterodactyl-bot'
    image: adam80mb/pterodactyl-control-discord-bot:latest
    restart: unless-stopped
    environment:
      botToken: ${botToken}
      botClientID: ${botClientID}
      botServerID: ${botServerID}
      pteroAPI: ${pteroAPI}
      pteroURL: ${pteroURL}
```

Then add the .env to fill out. [example.env](https://github.com/AdamFortney/pterodactyl-control-discord-bot/blob/main/github_content/example.env)
```
botToken=
botClientID=
botServerID=
pteroAPI=
pteroURL=
```

### Pterodactyl Egg
You can find the Egg import script [here](https://github.com/AdamFortney/pterodactyl-control-discord-bot/blob/main/github_content/egg-pterodactyl-control-discord-bot.json).
After the instillation has finished, you can open the .env file to fill out as you follow the rest of the guide.

## Setting up

### Creating a Discord bot
1. Go to [Discord Developer Portal](https://discord.com/developers/applications/) and click "New Application"
2. Navigate to the Installation page and set Install Link to "None"
2. Navigate to the OAuth2 page and put the client ID into your .env
3. Navigate to the Bot page and reset the token. Put the bot token issued into your .env
4. Still in the Bot page, uncheck "Public Bot"

### Getting server ID
1. If not already, enable [Developer Mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5CRSRTWYCGPHZQ37H) in your Discord app
2. Right click on the server you would like to use and copy the ID of it into the .env

### Getting Pterodactyl API Key
1. Navigate to your server management interface
2. Click on your profile icon to open Account Settings
3. Open the API Credentials page
4. Create a unique description 
5. Create the key and copy it into the .env
6. Enter the BASE of the URL to the server panel
<br>   Example: `https://panel.servers.com`

> [!WARNING]
> DO NOT INCLUDE ANYTHING AFTER THE TLD (.com, .app, .net)
> <br> Wrong: `https://panel.servers.com/`
> <br> Wrong: `https://panel.servers.com/servers`
> <br> Wrong: `https://panel.servers.com/account/api`

### Example of finished .env
```
botToken=MTMzMzi532oinb.23uy5g7ycvfi-nbyhbasdf-do
botClientID=1323874650264512
botServerID=1208976234509134
pteroAPI=ptlc_jhdsbvkjhbb87q3456dsfv
pteroURL=https://panel.example.com
```

### Inviting the bot
1. Run the bot and open the link returned by the bot
2. Invite the bot to the server you copied the ID from earlier
   <br> Alternatively, add the client id and navigate here
<br>`https://discord.com/oauth2/authorize?client_id=CLIENT_ID_GOES_HERE&permissions=0&scope=bot%20applications.commands`
4. Finally, restart the bot! You're done!

### Setting permissions (optional)
If you would like to limit what users have access to the commands.
1. Open the server settings
2. Open the Integrations page under the Apps category
3. Click manage next to the Bot you created

At the top, you can set global permissions which effects all commands.
To change permissions for each command, click on the command and set permissions there.

## Usage

### Server Control
`/control` will start the control menu.

After running the command, the server select dropdown will appear.
<br>![Image of the server select menu](https://i.imgur.com/PIYgaJB.png)

After selecting a server, the control menu will appear with the server usage and action buttons.
<br>![Image of the Discord server control menu](https://i.imgur.com/ny8m1P6.png)

Supported actions: start, stop, kill, & restart.
<br>The *Refresh* button will pull an updated status and hardware usage.
<br>The *Menu* button brings you back to the server select dropdown.

> [!CAUTION]
> Actions in the control menu can be used by anyone with access to the channel!!

### Console Command
`/command` will start the command menu, first opening to the server select menu.

After selecting a server, the command input menu will popup.
<br>![Image of the Discord console command input menu](https://i.imgur.com/CncbsEe.png)

After submitting, the command will run on the server.

> [!NOTE]
> Actions for this command CANNOT be ran by other users, only the user who started the interaction.