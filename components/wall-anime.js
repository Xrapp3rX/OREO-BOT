import axios from 'axios'
let handler = async (m, { command, oreo, usedPrefix }) => {
  let res = (
    await axios.get(
      `https://raw.githubusercontent.com/shizothetechie/shizoFiles/anime/${command}.json`
    )
  ).data
  let haha = await res[Math.floor(res.length * Math.random())]
  oreo.sendButton(m.chat, `_${command}_`, author, haha, [['🔄 NEXT 🔄', `${usedPrefix + command}`]], null, [['Follow Owner 🫣', smlink]], m)
}
handler.command = handler.help = [
  'akira',
  'akiyama',
  'anna',
  'asuna',
  'ayuzawa',
  'boruto',
  'chiho',
  'chitoge',
  'deidara',
  'erza',
  'elaina',
  'eba',
  'emilia',
  'hestia',
  'hinata',
  'inori',
  'isuzu',
  'itachi',
  'itori',
  'kaga',
  'kagura',
  'kaori',
  'keneki',
  'kotori',
  'kurumi',
  'madara',
  'mikasa',
  'miku',
  'minato',
  'naruto',
  'nezuko',
  'sagiri',
  'sasuke',
  'sakura',
]
handler.tags = ['anime']
export default handler
