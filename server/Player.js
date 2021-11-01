let id = 1
class Player {
  constructor(name) {
    this._score = 0
    this._name = name
    this._id = id++
  }

  getScore() {
    return this._score
  }

  getName() {
    return this._name
  }

  getId() {
    return this._id
  }

  editName(changedName) {
    this._name = changedName
  }

  addToScore(amt) {
    this._score += amt
  }

  subtractFromScore(amt) {
    this._score -= amt
  }

  editScore(amt) {
    this._score = amt
  }

  resetScore() {
    this._score = 0
  }
}

module.exports = Player
