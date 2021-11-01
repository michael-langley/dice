import React, {Component} from 'react'
import {Button, Modal, ModalBody, Input, Alert} from 'reactstrap'
import axios from 'axios'
import PlayerRow from './PlayerRow'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {'Content-Type': 'application/json'},
})

class App extends Component {
  state = {
    gameActive: false,
    gameModalOpen: false,
    playerModalOpen: false,
    playerModalType: null,
    newPlayerName: '',
    maxScore: '',
    players: [],
    currentGame: null,
    error: null,
  }

  newGameClick = async () => {
    if (this.state.gameActive) {
      await this.resetGame()
    }
    await this.createGame()
    this.setState({gameActive: true, gameModalOpen: true})
  }

  resetGame = async () => {
    this.setState({gameActive: false})
    await axiosInstance.get('/reset-game')
  }

  gameModalClose = () => {
    this.setState({gameModalOpen: false})
  }

  addNewPlayer = () => {
    this.setState({playerModalOpen: true, playerModalType: 'add'})
  }

  editPlayer = () => {
    this.setState({playerModalOpen: true, playerModalType: 'edit'})
  }

  playerModalClose = () => {
    this.setState({playerModalOpen: false})
  }

  createGame = async e => {
    await axiosInstance.get('/create-game')
    this.updateGame()
  }

  startGame = async e => {
    await axiosInstance.post('/add-max-score', {maxScore: this.state.maxScore})
    e.preventDefault()
    this.gameModalClose()
    this.updateGame()
  }

  updateGame = async () => {
    const response = await axiosInstance.get('/game')
    this.setState({currentGame: response.data.game})
  }

  handlePlayerAdd = async () => {
    const response = await axiosInstance.post('/create-player-and-add', {
      name: this.state.newPlayerName,
    })
    await this.updateGame()

    this.setState(prevState => ({
      players: [...prevState.players, response.data.player],
      newPlayerName: '',
      playerModalOpen: false,
      playerModalType: null,
    }))
  }

  addPointsToPlayer = async (playerId, amt) => {
    const response = await axiosInstance.post('/add-to-score', {
      playerId: Number(playerId),
      amount: Number(amt),
    })
    if (response.data.message) {
      this.setState({error: response.data.message})
    }
    this.updateGame()
  }

  onDismiss = () => {
    this.setState({error: null})
  }

  render() {
    console.log('game', this.state.currentGame)
    return (
      <div className="container mt-3">
        <div>
          <h3>Dice!</h3>

          <Button
            color="secondary"
            variant="outlined"
            onClick={this.newGameClick}
          >
            New Game
          </Button>

          <Button
            color="secondary"
            variant="outlined"
            onClick={this.addNewPlayer}
          >
            Add New Player
          </Button>
        </div>

        <div>
          {this.state.currentGame && (
            <div className="mt-4">
              <h4>Current Game</h4>
              <span>Playing To</span>
              <span className="ml-2">{this.state.currentGame._maxScore}</span>
              <h4 className="mt-4">Scores</h4>
              {this.state.currentGame._players.map(p => {
                return (
                  <PlayerRow
                    p={p}
                    addPointsToPlayer={this.addPointsToPlayer}
                    maxScore={this.state.currentGame._maxScore}
                  />
                )
              })}
            </div>
          )}
        </div>
        <Modal
          isOpen={this.state.playerModalOpen}
          toggle={this.playerModalClose}
        >
          <ModalBody>
            <div>
              {this.state.playerModalType === 'add' && (
                <div>
                  <Input
                    placeholder="Enter Name"
                    onChange={e =>
                      this.setState({newPlayerName: e.target.value})
                    }
                  />
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={this.handlePlayerAdd}
                  >
                    Add Player
                  </Button>
                </div>
              )}
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.gameModalOpen} toggle={this.gameModalClose}>
          <ModalBody>
            <form onSubmit={e => this.createGame(e)}>
              <div>
                <div className="row">
                  <Input
                    placeholder="Enter Max Score"
                    value={this.state.maxScore}
                    style={{width: '50%', margin: 'auto'}}
                    onChange={e => {
                      this.setState({
                        maxScore: e.target.value,
                      })
                    }}
                  />
                </div>
                <hr />
                <div className="row justify-content-around">
                  <Input
                    placeholder="Enter Name"
                    value={this.state.newPlayerName}
                    onChange={e =>
                      this.setState({newPlayerName: e.target.value})
                    }
                    style={{width: '75%'}}
                  />
                  <Button onClick={this.handlePlayerAdd}>Add Player</Button>
                </div>
                <hr />
                {this.state.currentGame && (
                  <div className="p-2">
                    <h5>Current Players</h5>
                    <ul>
                      {this.state.currentGame._players.map(p => {
                        return <li key={p._id}>{p._name}</li>
                      })}
                    </ul>
                  </div>
                )}

                <hr />
                <div className="row justify-content-end p-2">
                  <Button onClick={e => this.startGame(e)}>Start Game!</Button>
                </div>
              </div>
            </form>
          </ModalBody>
        </Modal>
        {this.state.error && (
          <Alert
            color="danger"
            isOpen={this.state.error}
            toggle={this.onDismiss}
          >
            {this.state.error}
          </Alert>
        )}
      </div>
    )
  }
}

export default App
