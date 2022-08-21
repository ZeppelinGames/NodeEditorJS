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
        const seletedElement = document.elementFromPoint(e.clientX, e.clientY);

        //Manage nodes
        if (!seletedElement.classList.contains("nodeTitle")) {
            return;
        }

        let getNode = seletedElement.classList.contains("node") ? seletedElement : seletedElement.closest(".node");

        if (getNode === undefined || getNode === null) {
            return;
        }

        const node = this.getNodeFromNodeElement(getNode);

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
        this.nodes.push(node);
    }

    getNodeFromNodeElement(ele) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].handle.isSameNode(ele)) {
                return this.nodes[i];
            }
        }
        return null;
    }
}

export default NodeManager;