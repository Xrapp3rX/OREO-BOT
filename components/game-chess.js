import { Chess } from 'chess.js'

const handler = async (m, { oreo, args }) => {
  const key = m.chat
  oreo.chess = oreo.chess || {}
  let chessData = oreo.chess[key] || {
    gameData: null,
    fen: null,
    currentTurn: null,
    players: [],
    hasJoined: [],
  }
  oreo.chess[key] = chessData
  const { gameData, fen, currentTurn, players, hasJoined } = chessData
  const feature = args[0]?.toLowerCase()

  if (feature === 'delete') {
    delete oreo.chess[key]
    return oreo.reply(m.chat, '🏳️ *Chess game stopped.*', m)
  }

  if (feature === 'create') {
    if (gameData) {
      return oreo.reply(m.chat, '⚠️ *Game already in progress.*', m)
    }
    chessData.gameData = { status: 'waiting', black: null, white: null }
    return oreo.reply(m.chat, '🎮 *Chess game started.*\nWaiting for other players to join.', m)
  }

  if (feature === 'join') {
    const senderId = m.sender
    if (players.includes(senderId)) {
      return oreo.reply(m.chat, '🙅‍♂️ *You have already joined this game.*', m)
    }
    if (!gameData || gameData.status !== 'waiting') {
      return oreo.reply(m.chat, '⚠️ *No chess game is currently waiting for players.*', m)
    }
    if (players.length >= 2) {
      return oreo.reply(
        m.chat,
        '👥 *Players are already enough.*\nThe game will start automatically.',
        m
      )
    }
    players.push(senderId)
    hasJoined.push(senderId)
    if (players.length === 2) {
      gameData.status = 'ready'
      const [black, white] =
        Math.random() < 0.5 ? [players[1], players[0]] : [players[0], players[1]]
      gameData.black = black
      gameData.white = white
      chessData.currentTurn = white
      return oreo.reply(
        m.chat,
        `🙌 *Players who have joined:*\n${hasJoined.map(playerId => `- @${playerId.split('@')[0]}`).join('\n')}\n\n*Black:* @${black.split('@')[0]}\n*White:* @${white.split('@')[0]}\n\nPlease use *'chess start'* to begin the game.`,
        m,
        { mentions: hasJoined }
      )
    } else {
      return oreo.reply(
        m.chat,
        '🙋‍♂️ *You have joined the chess game.*\nWaiting for other players to join.',
        m
      )
    }
  }

  if (feature === 'start') {
    if (gameData.status !== 'ready') {
      return oreo.reply(m.chat, '⚠️ *Cannot start the game. Wait for two players to join.*', m)
    }
    gameData.status = 'playing'
    const senderId = m.sender
    if (players.length === 2) {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      chessData.fen = fen
      const encodedFen = encodeURIComponent(fen)
      const turn = `🎲 *Turn:* White @${gameData.white.split('@')[0]}`
      const flipParam = senderId === gameData.black ? '' : '&flip=true'
      const flipParam2 = senderId === gameData.black ? '' : '-flip'
      const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`
      try {
        await oreo.sendFile(m.chat, boardUrl, '', turn, m, false, { mentions: [gameData.white] })
      } catch (error) {
        const boardUrl2 = `https://chessboardimage.com/${encodedFen + flipParam2}.png`
        await oreo.sendFile(m.chat, boardUrl2, '', turn, m, false, { mentions: [gameData.black] })
      }
      return
    } else {
      return oreo.reply(
        m.chat,
        '🙋‍♂️ *You have joined the chess game.*\nWaiting for other players to join.',
        m
      )
    }
  }

  if (args[0] && args[1]) {
    const senderId = m.sender
    if (!gameData || gameData.status !== 'playing') {
      return oreo.reply(m.chat, '⚠️ *The game has not started yet.*', m)
    }
    if (currentTurn !== senderId) {
      return oreo.reply(
        m.chat,
        `⏳ *It's currently ${chessData.currentTurn === gameData.white ? 'White' : 'Black'}'s turn to move.*`,
        m,
        {
          contextInfo: {
            mentionedJid: [currentTurn],
          },
        }
      )
    }
    const chess = new Chess(fen)
    if (chess.isCheckmate()) {
      delete oreo.chess[key]
      return oreo.reply(
        m.chat,
        `⚠️ *Game Checkmate.*\n🏳️ *Chess game stopped.*\n*Winner:* @${m.sender.split('@')[0]}`,
        m,
        {
          contextInfo: {
            mentionedJid: [m.sender],
          },
        }
      )
    }
    if (chess.isDraw()) {
      delete oreo.chess[key]
      return oreo.reply(
        m.chat,
        `⚠️ *Game Draw.*\n🏳️ *Chess game stopped.*\n*Players:* ${hasJoined.map(playerId => `- @${playerId.split('@')[0]}`).join('\n')}`,
        m,
        {
          contextInfo: {
            mentionedJid: hasJoined,
          },
        }
      )
    }
    const [from, to] = args
    try {
      chess.move({ from, to, promotion: 'q' })
    } catch (e) {
      return oreo.reply(m.chat, '❌ *Invalid move.*', m)
    }
    chessData.fen = chess.fen()
    const currentTurnIndex = players.indexOf(currentTurn)
    const nextTurnIndex = (currentTurnIndex + 1) % 2
    chessData.currentTurn = players[nextTurnIndex]
    const encodedFen = encodeURIComponent(chess.fen())
    const currentColor = chessData.currentTurn === gameData.white ? 'White' : 'Black'
    const turn = `🎲 *Turn:* ${currentColor} @${chessData.currentTurn.split('@')[0]}\n\n${chess.getComment() || ''}`
    const flipParam = senderId === gameData.black ? '' : '&flip=true'
    const flipParam2 = senderId === gameData.black ? '' : '-flip'
    const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`
    try {
      await oreo.sendFile(m.chat, boardUrl, '', turn, m, false, {
        mentions: [chessData.currentTurn],
      })
    } catch (error) {
      const boardUrl2 = `https://chessboardimage.com/${encodedFen + flipParam2}.png`
      await oreo.sendFile(m.chat, boardUrl2, '', turn, m, false, {
        mentions: [chessData.currentTurn],
      })
    }
    chess.deleteComment()
    return
  }

  if (feature === 'help') {
    return oreo.reply(
      m.chat,
      `
      🌟 *Chess Game Commands:*

*chess create* - Start a chess game
*chess join* - Join a waiting chess game
*chess start* - Start the chess game if two players have joined
*chess delete* - Stop the chess game
*chess [from] [to]* - Make a move in the chess game

*Example:*
Type *chess create* to start a chess game.
Type *chess join* to join a waiting chess game.
    `,
      m
    )
  }
  return oreo.reply(
    m.chat,
    '❓ Invalid command. Use *"chess help"* to see the available commands.',
    m
  )
}

handler.help = ['chess [from to]', 'chess delete', 'chess join', 'chess start']
handler.tags = ['game']
handler.command = /^(chess|chatur)$/i

export default handler
