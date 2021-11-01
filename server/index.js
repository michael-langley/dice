const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Player = require('./Player')
const Game = require('./Game')

const app = express()
app.use(cors())
app.use(bodyParser.json())

let game

const requireGame = (req, res, next) => {
  if (!game) {
    res.status(500).send({message: 'Game must be created first'})
  } else {
    next()
  }
}

app.get('/', (req, res) => {
  res.send('Welcome to Dice')
})

app.get('/create-game', (req, res) => {
  game = new Game({maxScore: 0})
  res.send({game})
})

app.post('/add-max-score', (req, res) => {
  const {maxScore} = req.body
  game.setMaxScore(maxScore)
  res.send({game})
})

app.post('/add-player-to-game', requireGame, (req, res) => {
  const {player} = req.body
  game.addPlayer(player)
  res.send({game})
})

app.post('/create-player', (req, res) => {
  const {name} = req.body
  const newPlayer = new Player(name)
  res.send({player: newPlayer})
})

app.post('/create-player-and-add', requireGame, (req, res) => {
  const {name} = req.body
  const newPlayer = new Player(name)
  game.addPlayer(newPlayer)
  res.send({game})
})

app.post('/add-to-score', requireGame, (req, res) => {
  const {playerId, amount} = req.body

  const player = game.getPlayers().find(p => p.getId() === playerId)
  const newScore = player.getScore() + amount
  if (newScore > game.getMaxScore()) {
    res.send({
      message: `Amount would surpass max score of ${game.getMaxScore()}`,
      game,
    })
  } else if (newScore === game.getMaxScore()) {
    player.addToScore(amount)
    res.send({message: 'This player has hit the max score!', game})
  } else {
    player.addToScore(amount)
    res.send({game})
  }
})

app.get('/player/:id', requireGame, (req, res) => {
  const {id} = req.params
  const player = game.getPlayers().find(p => p.getId() === Number(id))
  res.send({player})
})

app.get('/player/:id/score', requireGame, (req, res) => {
  const {id} = req.params
  const player = game.getPlayers().find(p => p.getId() === Number(id))
  res.send({playerScore: player.getScore()})
})

app.put('/player/:id/score', requireGame, (req, res) => {
  const {id} = req.params
  const {updatedScore} = req.body
  const player = game.getPlayers().find(p => p.getId() === Number(id))
  player.editScore(updatedScore)
  res.send({playerScore: player.getScore()})
})

app.get('/max-score', requireGame, (req, res) => {
  res.send({maxScore: game.getMaxScore()})
})

app.get('/reset-game', (req, res) => {
  game.resetGame()
  res.send({game})
})

app.get('/game', requireGame, (req, res) => {
  res.send({game})
})

app.listen(5000, err => {
  console.log('Listening')
})
