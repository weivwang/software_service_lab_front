import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button className="square" onClick = {props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {
    handleClick(i){
        const squares = this.state.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        })
    }
    renderSquare(i) {
      return <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
            />
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history:[{
                squares:Array(9).fill(null),
                nowCoordinate: null,
            }],
            stepNumber:0,
            xIsNext: true,
            descendingOrder:false
            
        };
    }
    handleWinnerStyle(winner,i){
        const styles = {
            background: "black"
        };
        if(winner && winner.indexOf(i) > -1){
            console.log('test');
            return styles;
        }
        return null;
    }
    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        const column = 3;
        var row = 3;
        var nowColumn = (i+1) % column ===0? row : (i+1) % column;
        var nowRow = parseInt(i / row) + 1;
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                nowCoordinate:[nowColumn,nowRow],
            }]),
            stepNumber:history.length,
            xIsNext: !this.state.xIsNext,
            descendingOrder: this.state.descendingOrder,
        })
    }
    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step % 2) === 0,
        })
    }
    reverseHistory = () => {
        const descendingOrder = this.state.descendingOrder;
        this.setState({
            descendingOrder: !descendingOrder
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const descendingOrder = this.state.descendingOrder;
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move?
                '访问第' + move +'步，落点(' +  step.nowCoordinate +')':
                '重新开始';
            let className = this.state.stepNumber === move? 'bold-li' : ''
            return(
                <li key={move} className={className}>
                    <button onClick = {() => this.jumpTo(move)} className={className}>{desc}</button>
                </li>
            );
        })
        if(descendingOrder){
            moves.reverse();
        }

        let status;
        if(winner){
            status = 'Winner:' + winner;
        }else if(this.state.stepNumber === 9){
            status ='平局';
        }
        else{
            status = 'Next player:' + (this.state.xIsNext ? 'X' :'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares}
            onClick = {(i) => this.handleClick(i)}
            styles={(i) => this.handleWinnerStyle(winner,i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick = {() => this.reverseHistory()}>{descendingOrder? '降序排列':'升序排列'}</button>

            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  