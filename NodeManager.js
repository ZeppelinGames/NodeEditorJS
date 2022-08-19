import Node from "./Node.js";

class NodeManager {
    constructor() {
        this.nodes = [];

        document.addEventListener('mousedown', this.handleNodeSelection);
        document.addEventListener('mousemove', this.handleNodeMovement);

        document.addEventListener('mouseup', this.handleNodeRelease);

        this.currentSelectedNode = null;
    }

    handleNodeSelection(e) {
        const seletedElement = document.elementFromPoint(e.clientX, e.clientY);
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

    updateNodes() {
        this.nodes.forEach((n) => {
            n?.update();
        })
    }

    CreateNode(name) {
        //Create node element
        const node = new Node(name);
        this.nodes.push(node);

        return node;
    }
}

export default NodeManager;