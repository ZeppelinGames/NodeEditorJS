import ConnectionManager from "./ConnectionManager.js";

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

                this.deleteConnection(input, output);
            }
        }

        for (let i = 0; i < nodeOutputs.length; i++) {
            if (nodeOutputs[i] == null) { continue; }

            const nodeConnInputs = Object.values(nodeOutputs[i].connections);
            for (let j = 0; j < nodeConnInputs.length; j++) {
                const input = nodeConnInputs[j];
                const output = nodeOutputs[i];

                this.deleteConnection(input, output);
            }
        }

        this.connectionManager.updateAndDrawConnections();

        document.body.removeChild(node.handle);
        this.nodes.splice(this.nodes.indexOf(node), 1);

        console.log("Node removed");
    }

    deleteConnection(input, output) {
        const conn = this.connectionManager.getConnectionFromInputAndOutput(input, output);
        if (conn !== null) {
            this.connectionManager.connections.splice(this.connectionManager.connections.indexOf(conn), 1);
        } else {
            console.log("Couldnt find connection");
        }

        input.connections.splice(input.connections.indexOf(output), 1);
        output.connections.splice(output.connections.indexOf(input), 1);

        //not updating linked connections properly. need to find out whats going on + fix
        output.updateConnections();
        input.updateConnections();

        input.node.update();
        output.node.update();
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