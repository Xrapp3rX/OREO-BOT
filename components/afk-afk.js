//import db from '../lib/database.js'

let handler = async (m, { text, oreo }) => {
  let user = global.db.data.users[m.sender]
  user.afk = +new Date()
  user.afkReason = text
  m.reply(`
  😴 *AFK* 
You are now afk until u send a message 
▢ *User:* ${oreo.getName(m.sender)} 
▢ *Reason:* ${text ? text : ''}
  `)
}
handler.help = ['afk <reason>']
handler.tags = ['fun']
handler.command = ['afk']
handler.group = true

export default handler
