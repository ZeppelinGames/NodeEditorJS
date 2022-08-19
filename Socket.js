class Socket {
    constructor(isInput) {
        //  <div class="socket">
        //      <div>Output</div>
        //      <div>O</div>
        //  </div>
        this.connections = [];
        this.isInput = isInput;

        //Create DOM element
        const socket = document.createElement("div");
        socket.classList.add("socketBody");
        socket.classList.add(this.isInput ? "input" : "output");

        const socketName = document.createElement("div");
        socketName.innerHTML = this.isInput ? "Input" : "Output";

        const socketHandle = document.createElement("span");
        socketHandle.classList.add("socket");

        socket.append(socketName);
        socket.append(socketHandle);

        this.handle = socket;
        this.socketHandle = socketHandle;

        return this.handle;
    }
}

export default Socket;