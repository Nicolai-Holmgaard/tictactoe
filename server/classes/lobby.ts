import { randomBytes } from "crypto";
import { Namespace, Server, Socket } from "socket.io";


export default class lobby {
    // Alot of differnt important values for games state managment
    public code = randomBytes(3).toString('hex')
    public socket: Namespace
    public board = [""]
    public turn = "x"
    public player1 = ""
    public player2 = ""
    public scorep1 = 0
    public scorep2 = 0
    public public = false

    constructor(io: Server) {
        // Creating a websocket for the game
        this.socket = io.of(this.code)

        // This fires when a user connects
        this.socket.on("connection", (privSocket:Socket) => {
            // Sets the new user as player 1/2 if the spot is available
            if(!this.player1) this.player1 = privSocket.id
            else if(!this.player2) this.player2 = privSocket.id

            // Sends vital information to newly connected client
            // Its in a 400ms timeout to ensure the client is connected and ready
            setTimeout(() => {
                privSocket.emit("init", {
                    player: this.player1 === privSocket.id ? "x" : this.player2 === privSocket.id ? "o" : "spec",
                    board: this.board,
                    turn: this.turn,
                    public: this.public,
                    scorep1: this.scorep1,
                    scorep2: this.scorep2
                })
                console.log("Client connected")
            }, 400);

            // This fires when a client disconnects and checks if the client is either player 1 or 2
            // If the client is a player it will free the spot they were in
            privSocket.on("disconnect", thing => {
                if(this.player1 === privSocket.id) this.player1 = ""
                if(this.player2 === privSocket.id) this.player2 = ""
                if(!this.player1 && !this.player2) {
                    this.socket.removeAllListeners()
                }
            })

            //This fires when a client press a sqaure on the board
            privSocket.on("input", (data: {board: string[], turn: string}) => {
                // Creates a value from the output of the checkboard function
                let checkedboard = this.checkBoard(data.board)
                // Checks if the game is over and what caused the game to end 
                if(checkedboard) {
                    if(data.turn == "x") this.scorep2++
                    if(data.turn == "o") this.scorep1++
                    this.socket.emit("endgame", {type: checkedboard, by: this.turn, score:{p1: this.scorep1, p2: this.scorep2}})
                }
                // Then it emits the updated board and who's turn it is
                this.socket.emit("boardupdate", {board: data.board, turn: data.turn})
                this.turn = data.turn
                this.board = data.board
            })

            // This fires when player 1 clicks on the public toggle
            // It toggles if the public is public
            privSocket.on("public", state => {
                if(privSocket.id !== this.player1) return
                this.public = state
                console.log(this.public)
            })
        })
    }

    // This fuction checks the board inputted if the game has ended and outputs how it ended.
    private checkBoard (board:Array<string|null>){
        if(board[0] === board[1] && board[1] === board[2] && board[0] && board[1] && board[2]) return 1
        if(board[3] === board[4] && board[4] === board[5] && board[3] && board[4] && board[5]) return 2
        if(board[6] === board[7] && board[7] === board[8] && board[6] && board[7] && board[8]) return 3
        if(board[0] === board[3] && board[3] === board[6] && board[0] && board[3] && board[6]) return 4
        if(board[1] === board[4] && board[4] === board[7] && board[1] && board[4] && board[7]) return 5
        if(board[2] === board[5] && board[5] === board[8] && board[2] && board[5] && board[8]) return 6
        if(board[0] === board[4] && board[4] === board[8] && board[0] && board[4] && board[8]) return 7
        if(board[2] === board[4] && board[4] === board[6] && board[2] && board[4] && board[6]) return 8
        if(board[0] && board[1] && board[2] && board[3] && board[4] && board[5] && board[6] && board[7] && board[8]) return 9
        return false
    }
}