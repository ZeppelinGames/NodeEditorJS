import { ContextMenu, ContextMenuItem } from "./ContextMenu.js";

class NodeContextMenu extends ContextMenu {
    constructor(nodeManager) {
        super(nodeManager, [
            new ContextMenuItem("Duplicate", (e) => {
                const ele = document.elementFromPoint(e.clientX, e.clientY);
                nodeManager.duplicateNodeFromElement(ele, e.clientX, e.clientY);
            }),
            new ContextMenuItem("Delete", (e) => {
                const ele = document.elementFromPoint(e.clientX, e.clientY);
                nodeManager.deleteNodeFromElement(ele);
            })
        ])
    }

    updateContextMenu(e) {
        if (e) {
            e.preventDefault();

            const selectedElement = document.elementFromPoint(e.clientX, e.clientY);
            const nodeEle = this.nodeManager.tryGetNodeElement(selectedElement);
            if (nodeEle == null) {
                return;
            }

            this.handle.style.top = e.clientY + "px";
            this.handle.style.left = e.clientX + "px";
        }

        this.handle.style.display = this.isVisible ? "flex" : "none";
        this.isVisible = !this.isVisible;
    }
}

export default NodeContextMenu;