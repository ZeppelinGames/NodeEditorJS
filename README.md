# Cyberweb

## Project Info   
This project aims to be a node based tool aimed to assit in cryptography, CTFs and general data modification. This project is currently in early stages as I'm building my own node editor to build the project off. Any support, pull reqs or feedback is appreciated.

## Basic setup  
### Creating new nodes
1. Create a new script in the components folder.
2. Create your node class, extending from `Node`
3. Create the node's inputs, outputs and data in the class constructor
4. Define an update function to run when any connections are updated
5. In `ContextMenu.js` import your new node.
6. Add a new event for it in the `ContextMenu`'s constructor (see example)  

**Example: AddNode**  
*AddNode class*
```js
import Node from "../core/Node.js";

class AddNode extends Node {
    constructor() {
        super("Add"); //Node name

        const a = this.addInput("A");
        const b = this.addInput("B");

        const o = this.addOutput("Output");
    }

    update() {
        this.outputs["Output"].value = Number(this.inputs["A"].value) + Number(this.inputs["B"].value);
    }
}

export default AddNode;
```

*Defining event in ContextMenu*
```js
const events = [
    new ContextMenuItem("Add", () => {
        const newNode = new AddNode();
        this.nodeManager.registerNode(newNode);
    })
]
```