import ConnectionManager from "./ConnectionManager.js";

class NodeManager {
    constructor() {
        this.nodes = [];

        this.connectionManager = new ConnectionManager(this);

        document.addEventListener('mousedown', this.handleNodeSelection);
        document.addEventListener('mousemove', this.handleNodeMovement);

        document.addEventListener('mouseup', this.handleNodeRelease);

        this.currentSelectedNode = null;
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

        this.currentSelectedNode = getNode;
    }

    handleNodeMovement(e) {
        if (!this.currentSelectedNode) {
            return;
        }

        this.currentSelectedNode.style.left = e.clientX + "px";
        this.currentSelectedNode.style.top = e.clientY + "px";
    }

    handleNodeRelease(e) {
        this.currentSelectedNode = null;
    }

    registerNode(node) {
        this.nodes.push(node);
    }
}

export default NodeManager;