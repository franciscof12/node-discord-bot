import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('recordatorio')
  .setDescription('Programa un recordatorio para una sesión de programación')
  .addStringOption(option =>
    option.setName('mensaje')
      .setDescription('El mensaje de tu recordatorio')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('tiempo')
      .setDescription('Tiempo en minutos hasta que se active el recordatorio')
      .setRequired(true))

export async function execute (interaction) {
  const mensaje = interaction.options.getString('mensaje')
  const tiempo = interaction.options.getInteger('tiempo')

  await interaction.reply(`Recordatorio configurado para dentro de ${tiempo} minutos: "${mensaje}"`)

  setTimeout(async () => {
    await interaction.followUp(`⏰ Recordatorio: ${mensaje}`)
  }, tiempo * 60000) // tiempo en milisegundos
}
