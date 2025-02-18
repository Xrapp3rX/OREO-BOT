let handler = async (m, { oreo, text, usedPrefix, command }) => {
  // Sound
  let name = m.pushName || oreo.getName(m.sender)
  var vn = 'https://cdn.jsdelivr.net/gh/Guru322/GURU-BOT@main/Assets/mp3/Alive.mp3'
  let url = 'https://github.com/shizothetechie/oreo-bot'
  let murl = 'https://youtu.be/c9FefNeYruI?si=zFaHI2VivaBZAVQr'
  let img = 'https://cdn.wallpapersafari.com/71/19/7ZfcpT.png'
  let con = {
    key: {
      fromMe: false,
      participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: '919637987574@s.whatsapp.net' } : {}),
    },
    message: {
      contactMessage: {
        displayName: `${name}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  }
  let doc = {
    audio: {
      url: vn,
    },
    mimetype: 'audio/mpeg',
    ptt: true,
    waveform: [100, 0, 100, 0, 100, 0, 100],
    fileName: 'shizo',

    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: 'I AM ALIVE',
        body: 'OREO BOT',
        thumbnailUrl: img,
        sourceUrl: 'https://chat.whatsapp.com/DWqdPuQ0yFkKyf1SzZ0k9Y',
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  }

  await oreo.sendMessage(m.chat, doc, { quoted: con })
}

handler.help = ['alive']
handler.tags = ['main']
handler.command = /^(alive)$/i

export default handler
