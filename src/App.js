import React from 'react';
import Board from './Board';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Tic-Tac-Toe</h1>
        </div>
        <br/>
        <Board />
      </div>
    );
  }
}

export default App;
