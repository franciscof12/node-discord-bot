import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
})

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    // Importa dinámicamente los comandos como módulos ES
    const command = await import(`file://${filePath}`)
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

client.on('guildMemberAdd', async member => {
  const welcomeChannelId = '1188208568931979294'
  const channel = await client.channels.fetch(welcomeChannelId)

  if (!channel) {
    console.warn(`Channel with ID ${welcomeChannelId} was not found!`)
    return
  }

  try {
    await channel.send(`¡Bienvenido al servidor, ${member.displayName}! 🎉`)
  } catch (error) {
    console.error('Error sending message:', error)
  }
})

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.login(process.env.DISCORD_TOKEN)
