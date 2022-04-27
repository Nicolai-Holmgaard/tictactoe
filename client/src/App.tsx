import React, { useEffect, useState } from 'react';
import './App.scss';
import { useNavigate } from "react-router-dom";


function App() {
  // creating some valuables
  const [lobbyCode, setLobbyCode] = useState("")
  let navigate = useNavigate(); 


  // fuction to create an empty lobby
  const createLobby = async ()=> {
    const res = await (await fetch(`http://${process.env.REACT_APP_NOT_SECRET_CODE}:3001/createLobby`, {method: "POST"})).json()
    joinLobby(res.LobbyCode)
  }

  // fuction to join a lobby with given code
  const joinLobby = (code: string) => {
    if(!code) return
    navigate(`/game/${code}`);
  }

  // fuction to join a public lobby with a free spot
  const findlobby = async ()=> {
    const res = await (await fetch(`http://${process.env.REACT_APP_NOT_SECRET_CODE}:3001/createLobby`, {method: "POST"})).json()
    joinLobby(res.LobbyCode)
  }

  return(
    <div>
      <div className='center-horizontal'>TicTacToe4Life</div>
      <div>
        <input
          type="text" 
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
        />
        <button onClick={()=> joinLobby(lobbyCode)} >Join</button>
      </div>
      <div>
        <button onClick={createLobby}>Create lobby</button>
      </div>
      <div>
        <button onClick={findlobby}>Find Public</button>
      </div>
    </div>
  )
}

export default App;
