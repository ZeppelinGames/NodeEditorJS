import Socket from "./Socket.js"

class Node {
    constructor(name) {
        //Node elements
        this.nodeName = name ? name : "Node";
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

    addInput() {
        const newSocket = new Socket(true);
        this.nodeBody.appendChild(newSocket);
        this.inputs.push(newSocket);
    }

    addOutput() {
        //  <div class="socket">
        //      <div>Output</div>
        //      <div>O</div>
        //  </div>
        const newSocket = new Socket(false);
        this.nodeBody.appendChild(newSocket);
        this.outputs.push(newSocket);
    }

    update() {

    }
}

export default Node;