import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('dani')
  .setDescription('Con esto sabras los lenguajes de programacion favoritos de Dani')

export async function execute (interaction) {
  await interaction.reply('A Dani le encanta programar en Javascript, HTML y un poco de CSS')
}
