import Socket from "./Socket.js"
import TextField from "./TextField.js";

class Node {
    constructor(name) {
        //Node elements
        this.nodeName = name ? name : "Node";
        this.nodeData = [];
        this.inputs = [];
        this.outputs = [];

        // <div class="node">
        //     <div class="nodeTitle">Input</div>
        //
        //     <div class="nodeBody">
        //         <div class="socket">
        //             <div>Output</div>
        //             <div>O</div>
        //         </div>
        //         <div class="nodeTextInput">
        //             <textarea type="text"></textarea>
        //         </div>
        //     </div>
        // </div>

        //Create DOM elements
        const nodeDiv = document.createElement("div");
        nodeDiv.classList.add("node");

        //Create tite
        const nodeTitle = document.createElement("div");
        nodeTitle.classList.add("nodeTitle");
        nodeTitle.innerHTML = this.nodeName;

        //Append title to node
        nodeDiv.appendChild(nodeTitle);

        //Create node body
        const nodeBody = document.createElement("div");
        nodeBody.classList.add("nodeBody");
        nodeDiv.appendChild(nodeBody);

        //Add element to DOM
        document.body.appendChild(nodeDiv);

        this.handle = nodeDiv;
        this.nodeBody = nodeBody;
    }

    addInput(key) {
        const newSocket = new Socket(this, key, true);
        this.nodeBody.appendChild(newSocket.handle);
        this.inputs[key] = newSocket;

        return newSocket;
    }

    addOutput(key) {
        const newSocket = new Socket(this, key, false);
        this.nodeBody.appendChild(newSocket.handle);
        this.outputs[key] = newSocket;

        console.log(this.outputs);

        return newSocket;
    }

    addTextField(key, socket, isMultiline = false) {
        const textField = new TextField(key, socket, isMultiline);
        this.nodeBody.appendChild(textField.handle);

        this.nodeData[key] = textField;
    }

    //override 
    update() {

    }
}

export default Node;