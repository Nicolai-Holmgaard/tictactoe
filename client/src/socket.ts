import { io, Socket } from "socket.io-client";


// This class is just to handle the socket of the client
class socket {
    public socket: Socket
    public player = ""
    public board = [""] 

    constructor(path: string) {
        this.socket = io(`http://${process.env.REACT_APP_NOT_SECRET_CODE}:3002/` + path)
        
        this.socket.on('connect_error', function(err) {
            console.log("client connect_error: ", err);
        });
        
        this.socket.on('connect_timeout', function(err) {
            console.log("client connect_timeout: ", err);
        });
    }
    input(tempboard: string[], turn: string){
        this.socket!.emit("input", {board: tempboard, turn: turn})
    }    
}

export default socket