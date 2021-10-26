import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button className="square" onClick = {props.onClick}>
            {props.value}
        </button>
    );
}
function Board(props){
    const renderSquare =(i) => {
        return <Square 
              value={props.squares[i]} 
              onClick={() => props.onClick(i)}
              />
      };
    const renderBoard = () => {
        let n = 0;
        let board = [];
        for(let i=0;i<3;i++){
            const boardRow = [];
            for(let j = 0;j<3;j++, n++){
                boardRow.push(renderSquare(n))
            }
            board.push(<div className = "border-row" key = {i}>{boardRow}</div>)
        }
        console.log(board)
        return board; 
    }
    return(
        <div>
            {renderBoard()}
        </div>
    );
}
function Game(){
    const [history, setHistory] = useState([{
        squares:Array(9).fill(null),
        nowCoordinate: null,
    }])
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext,setXIsNext] = useState(true);
    const [descendingOrder, setDescendingOrder] = useState(false);

    const handleClick = (i) => {
        const new_history = history.slice(0,stepNumber + 1);
        const current = new_history[new_history.length -1];
        const squares = current.squares.slice();
        const column = 3;
        var row = 3;
        var nowColumn = (i+1) % column ===0? row : (i+1) % column;
        var nowRow = parseInt(i / row) + 1;
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = xIsNext? 'X':'O';
        setHistory(new_history.concat([{
            squares: squares,
            nowCoordinate:[nowColumn,nowRow],
        }]));
        setStepNumber(new_history.length);
        setXIsNext(!xIsNext);
        setDescendingOrder(descendingOrder)
    }
    
    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }
    const reverseHistory = () => {
        setDescendingOrder(!descendingOrder);
    }


    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move?
          '访问第' + move +'步，落点(' +  step.nowCoordinate +')':
          '重新开始';
          let className = stepNumber === move? 'bold-li' : ''
          return(
              <li key={move} className={className}>
                  <button onClick = {() => jumpTo(move)} className={className}>{desc}</button>
              </li>
          );
        })
      if(descendingOrder){
          moves.reverse();
      }
    
      let status;
      if(winner){
          status = 'Winner:' + winner;
      }else if(stepNumber === 9){
          status ='平局';
      }
      else{
          status = 'Next player:' + (xIsNext ? 'X' :'O');
      }
      return (
          <div className="game">
            <div className="game-board">
              <Board squares={current.squares}
              onClick = {(i) => handleClick(i)}/>
            </div>
            <div className="game-info">
              <div>{status}</div>
              <button onClick = {() => reverseHistory()}>{descendingOrder? '降序排列':'升序排列'}</button>
              <ol>{moves}</ol>
            </div>
          </div>
        );
}

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

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );