import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './game.scss';
import socket2 from '../../socket';

function App() {
  // Just alot of differnt values
  const [board, setBoard] = useState([""])
  const [turn, setTurn] = useState("")
  const [player, setPlayer] = useState("")
  const [selfturn, setselfTurn] = useState(false)
  const [publicmode, setPublic] = useState(false)
  const [done, setDone] = useState(false)
  const [scorep1, setScorep1] = useState(0)
  const [scorep2, setScorep2] = useState(0)
  const [socket, setSocket]: any = useState()
  const params = useParams()
  const numbers = [1,2,3,4,5,6,7,8,9]

  // This fires when the value turn updates
  // It checks if its your turn
  useEffect(()=> {
    if(turn === player) setselfTurn(true)
    else setselfTurn(false)
  }, [turn])

  // This runs once when the page loads at first
  useEffect(() => {
    // First it creates a websocket connection to the backend
    const newSocket = new socket2(params.id!)
    setSocket(newSocket)

    // This fires when the backend sends the init signal
    // This has alot of imporant data for the client
    newSocket.socket.on("init", data => {
      setPlayer(data.player)
      setBoard(data.board)
      setTurn(data.turn)
      setPublic(data.public)
      setScorep1(data.scorep1)
      setScorep2(data.scorep2)
    })

    // This fires when the backend says the game has ended
    // This updates the score and locks user input
    newSocket.socket.on("endgame", data => {
      setScorep1(data.score.p1)
      setScorep2(data.score.p2)
      setDone(true)
    })

    // This updates when the backend has an updated board
    // This updates the client board to match the new board
    newSocket.socket.on("boardupdate", data => {
      if(data.board.length == 1 && !data.board[0]) setDone(false)
      setBoard(data.board)
      setTurn(data.turn)
    })

    // This runs when the page gets unloaded/closed
    // It closes the connection to the backend
    return () => {newSocket.socket!.close()}
  }, [setSocket]);


  // This loading screen shows until the backend has sent the information
  if(!player) return (
    <div>Loading</div>
  )

  // This function is to toggle public or private and sends it to the server
  const publictoggle = async () => {
    socket.socket.emit("public", !publicmode)
    setPublic(!publicmode)
  }

  // This function fires when the user clicks a sqaure on the board
  const clickEvent = async (i: number) => {
    // Checks if the user is allowed to click
    if(done) return
    if(!selfturn) return
    // Updates selfturn to false
    setselfTurn(false)
    
    // Creates a temp board
    let tempboard = board

    // Checks if the square is already taken
    if(tempboard[i-1]) return
    // Takes that sqaure
    tempboard[i-1] = turn
    // Updates turn
    setTurn(turn === "x" ? "o" : "x")
    
    // Sends data to backend
    socket.input(tempboard, turn === "x" ? "o" : "x")
  }

  // This fires when the user clicks the reset button
  // It clears the board and sends it to the server
  const resetGame = () => {
    setBoard([""])
    setTurn("x")
    socket.input([""], [""], turn)
    setDone(false)
  }

  return (
    <div className='body'>
      <div className='title'>TicTacToe</div>
      <div style={{flexDirection: "row", display: "flex", justifyContent: "space-around"}}>
        <div style={{flexDirection: "row", display: "flex"}}>
          <p>Turn: {turn}</p>
          <p> You: {player}</p>
        </div>
        <div style={{flexDirection: "row", display: "flex"}}>
          <p>p1 score {scorep1}</p>
          <p> p2 score {scorep2}</p>
        </div>
        <div>
          <p>code {params.id}</p>
        </div>       
      </div>
      {player === "x" ? <input
          type="checkbox"
          id="public"
          name="piblic"
          checked={publicmode}
          onChange={publictoggle}
        /> : ""} {player === "x" ? "public": ""}
      {done ? <button onClick={()=> resetGame()}>Reset</button> : ""}
      <div className="grid center-horizontal">
        {numbers.map((i,index)=>{
         return <div key={index} id={i.toString()} onClick={()=>{clickEvent(i)}}><p className="center-vertical center-horizontal textthing">{board[i-1]}</p></div>
        })}
      </div>
    </div>
  );
}

export default App;
