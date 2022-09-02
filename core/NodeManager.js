import ConnectionManager from "./ConnectionManager.js";

import InputNode from "../components/InputNode.js";
import OutputNode from "../components/OutputNode.js";
import ConcatNode from "../components/ConcatNode.js";
import AddNode from "../components/AddNode.js";

class NodeManager {
    constructor() {
        this.nodes = [];

        this.connectionManager = new ConnectionManager(this);

        document.addEventListener('mousedown', (e) => { this.handleNodeSelection(e); });
        document.addEventListener('mousemove', (e) => { this.handleNodeMovement(e); });

        document.addEventListener('mouseup', (e) => { this.handleNodeRelease(e); });

        this.currentSelectedNode = null;
        this.dragOffset = { x: 0, y: 0 };
        this.globalOffset = { x: 0, y: 0 };

        this.nodeLinks = new Map();
        this.nodeLinks["input"] = new InputNode();
        this.nodeLinks["output"] = new OutputNode();
        this.nodeLinks["concatenate"] = new ConcatNode();
        this.nodeLinks["add"] = new AddNode();
    }

    loadSaveFile(filepath) {
        fetch(filepath).then(e => e.text()).then((e) => {
            const parsedJSON = JSON.parse(e);

            const createdNodes = [];
            for (let i = 0; i < parsedJSON.nodes.length; i++) {
                const newNode = this.createNode(parsedJSON.nodes[i].nodeType, parsedJSON.nodes[i].positionX, parsedJSON.nodes[i].positionY);
                console.log(newNode);
                createdNodes.push(newNode);
            }

            console.log(createdNodes.length);

            for (let i = 0; i < createdNodes.length; i++) {
                for (let j = 0; j < parsedJSON.nodes[i].inputs.length; j++) {
                    const connNode = createdNodes[parsedJSON.nodes[i].inputs[j]];

                    //Need to swap out using string IDs on connections for inputs and outputs
                    this.connectionManager.createConnection(createdNodes[i].inputs["Input"], connNode.outputs["Output"]);
                }

                for (let j = 0; j < parsedJSON.nodes[i].outputs.length; j++) {
                    const connNode = createdNodes[parsedJSON.nodes[i].outputs[j]];

                    //Need to swap out using string IDs on connections for inputs and outputs
                    this.connectionManager.createConnection(createdNodes[i].outputs["Output"], connNode.inputs["Input"]);
                }
            }

            this.connectionManager.updateAndDrawConnections();
        });
    }

    saveToFile() {

    }

    createNode(id, x, y) {
        const newNode = this.nodeLinks[id];
        this.registerNode(newNode);
        newNode.setPosition(x, y);

        return newNode;
    }

    handleNodeSelection(e) {
        const ele = document.elementFromPoint(e.clientX, e.clientY);

        const selectedElement = this.tryGetNodeElement(ele);
        if (selectedElement == null) { return; }

        const node = this.getNodeFromNodeElement(selectedElement);
        if (node == null) { return; }

        this.dragOffset.x = e.clientX - node.position.x;
        this.dragOffset.y = e.clientY - node.position.y;

        this.currentSelectedNode = node;
    }

    handleNodeMovement(e) {
        if (!this.currentSelectedNode) {
            return;
        }
        const moveEvent = new Event("nodeMove");
        document.dispatchEvent(moveEvent);

        this.currentSelectedNode.setPosition(e.clientX - this.dragOffset.x, e.clientY - this.dragOffset.y);
    }

    handleNodeRelease(e) {
        this.currentSelectedNode = null;
    }

    registerNode(node) {
        if (!this.nodes.includes(node)) {
            this.nodes.push(node);
        }
    }

    duplicateNodeFromElement(ele, posx, posy) {
        const node = this.getNodeFromNodeElement(ele);
        if (node == null) { return; }
        console.log("Duplicating node to " + posx + ", " + posy);
        console.log(node);

        const newNode = new Node();
        newNode.nodeName = node.nodeName;
        newNode.nodeData = node.nodeData;
        newNode.inputs = node.inputs;
        this.outputs = node.outputs;

        newNode.setPosition(posx, posy);
        this.registerNode(newNode);
    }

    deleteNodeFromElement(nodeEle) {
        const nodeE = this.tryGetNodeElement(nodeEle);
        if (nodeE == null) {
            return;
        }

        const node = this.getNodeFromNodeElement(nodeE);
        if (node == null) {
            return;
        }

        this.deleteNode(node);
    }

    deleteNode(node) {
        const nodeInputs = Object.values(node.inputs);
        const nodeOutputs = Object.values(node.outputs);

        for (let i = 0; i < nodeInputs.length; i++) {
            if (nodeInputs[i] == null) { continue; }

            const nodeConnOutputs = Object.values(nodeInputs[i].connections);
            for (let j = 0; j < nodeConnOutputs.length; j++) {
                const input = nodeInputs[i];
                const output = nodeConnOutputs[j];

                this.connectionManager.deleteConnectionsOnSockets(input, output);
            }
        }

        for (let i = 0; i < nodeOutputs.length; i++) {
            if (nodeOutputs[i] == null) { continue; }

            const nodeConnInputs = Object.values(nodeOutputs[i].connections);
            for (let j = 0; j < nodeConnInputs.length; j++) {
                const input = nodeConnInputs[j];
                const output = nodeOutputs[i];

                this.connectionManager.deleteConnectionsOnSockets(input, output);
            }
        }

        this.connectionManager.updateAndDrawConnections();

        document.body.removeChild(node.handle);
        this.nodes.splice(this.nodes.indexOf(node), 1);

        console.log("Node removed");
    }

    getNodeFromNodeElement(ele) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].handle.isSameNode(ele)) {
                return this.nodes[i];
            }
        }
        return null;
    }

    tryGetNodeElement(selectedElement) {
        //Manage nodes
        let getNode = selectedElement.classList.contains("node") ? selectedElement : selectedElement.closest(".node");

        if (getNode === undefined || getNode === null) {
            return null;
        }

        return getNode;
    }
}

export default NodeManager;