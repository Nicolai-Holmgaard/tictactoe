import express from 'express';
// import { PrismaClient } from '@prisma/client'
import { Server, Socket } from "socket.io"
import lobby from './classes/lobby';
import cors from "cors"

// Creates the express server
const app = express();
const io = new Server(3002, {
    cors: {
        origin: "*"
    }
})

app.use(cors())

const PORT = 3001;
// A map for all the lobbies
let openlobbies = new Map<string, lobby>()

// This function creates an empty lobby and sends it to the user
app.get("/createLobby", async (req, res) => {
    const newLobby = new lobby(io)
    openlobbies.set(newLobby.code, newLobby)
    res.send({"LobbyCode": newLobby.code})
})

// This function searches all lobbies for one that public and has an open spot
app.post("/getLobby", async (req, res) => {
    let openlobby = ""
    openlobbies.forEach(lobbyi => {
        if(openlobby !== "") return
        if(!lobbyi.public) return
        if(lobbyi.player1 && lobbyi.player2) return
        openlobby = lobbyi.code
        if(!openlobby) return
        res.send({"LobbyCode": openlobby})
    })
})


// Starts the express server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

