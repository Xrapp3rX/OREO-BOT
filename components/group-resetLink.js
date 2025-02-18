let handler = async (m, { oreo }) => {
  let res = await oreo.groupRevokeInvite(m.chat)
  m.reply(
    '✅ Group link has been successfully reset\n\n📌 new link:\nhttps://chat.whatsapp.com/' + res
  )
}
handler.help = ['resetlink']
handler.tags = ['group']
handler.command = ['revoke', 'resetlink', 'anularlink']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
