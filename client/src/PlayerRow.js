import React, {Component} from 'react'
import {Button, Input, Alert} from 'reactstrap'

export default class PlayerRow extends Component {
  state = {addingScore: ''}

  addPoints = id => {
    this.props.addPointsToPlayer(id, this.state.addingScore)
    this.setState({addingScore: ''})
  }

  render() {
    const {p, maxScore} = this.props
    return (
      <div className="py-3">
        <form>
          <div className="row border-bottom">
            <h5>{p._name}</h5>
          </div>
          <div className="row justify-content-between align-items-center mt-1">
            <div>
              <span>Points:</span>
              <span className="ml-2">{p._score}</span>
            </div>
            <div>
              <span className="ml-2">Points Needed:</span>
              <span className="ml-2">{maxScore - Number(p._score)}</span>
            </div>
            <div className="row">
              <Input
                style={{width: '40%'}}
                onChange={e => {
                  this.setState({addingScore: e.target.value})
                }}
                value={this.state.addingScore}
              />
              <Button
                className="btn-xs ml-1"
                onClick={() => this.addPoints(p._id)}
              >
                Add Points
              </Button>
            </div>
          </div>
        </form>
        {Number(maxScore) > 0 && Number(maxScore) === Number(p._score) && (
          <div style={{width: '100%', marginTop: '0.5rem'}}>
            <Alert color="success">Congrats you have hit the score!</Alert>
          </div>
        )}
      </div>
    )
  }
}
