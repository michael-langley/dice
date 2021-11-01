class Game {
  constructor({maxScore}) {
    this._players = []
    this._maxScore = maxScore
  }

  addPlayer(player) {
    this._players.push(player)
  }

  removePlayer(playerId) {
    this._players = this._players.filter(p => p.getId() !== playerId)
  }

  getPlayers() {
    return this._players
  }

  getMaxScore() {
    return this._maxScore
  }

  setMaxScore(amt) {
    this._maxScore = amt
  }

  updateScore({playerId, amount}) {
    const player = this._players.find(p => p.getId() === playerId)
    const newScore = player.getScore() + amount
    if (newScore > this._maxScore) {
      throw new Error(`Score is greater than max amount of ${this._maxScore}`)
    } else {
      player.addToScore(amount)
    }
    console.log(this._players)
  }

  resetGame() {
    this._players = []
    this._maxScore = 0
  }
}

module.exports = Game
