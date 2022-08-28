import InputNode from "../components/InputNode.js";
import OutputNode from "../components/OutputNode.js";
import ConcatNode from "../components/ConcatNode.js";
import AddNode from "../components/AddNode.js";

import { ContextMenu, ContextMenuItem } from "./ContextMenu.js";

class MainContextMenu extends ContextMenu {
    constructor(nodeManager) {
        super(nodeManager, [
            new ContextMenuItem("Input", (e) => this.createNewNode(e, new InputNode())),
            new ContextMenuItem("Output", (e) => this.createNewNode(e, new OutputNode())),
            new ContextMenuItem("Concatenate", (e) => this.createNewNode(e, new ConcatNode())),
            new ContextMenuItem("Add", (e) => this.createNewNode(e, new AddNode())),
        ]);
    }

    createNewNode(e, newNode) {
        this.nodeManager.registerNode(newNode);
        newNode.setPosition(e.clientX, e.clientY);
    }
}

export default MainContextMenu;