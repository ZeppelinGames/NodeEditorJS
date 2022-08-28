class NodeContextMenuItem {
    constructor(displayName, event) {
        this.displayName = displayName;
        this.event = event;
    }
}

class NodeContextMenu {
    constructor(nodeManager) {
        this.nodeManager = nodeManager;

        const events = [
            new NodeContextMenuItem("Duplicate", (e) => {
                console.log(e.clientX + ", " + e.clientY);
                const ele = document.elementFromPoint(e.clientX, e.clientY);
                nodeManager.duplicateNodeFromElement(ele, e.clientX, e.clientY);
            }),
            new NodeContextMenuItem("Delete", (e) => {
                const ele = document.elementFromPoint(e.clientX, e.clientY);
                nodeManager.deleteNodeFromElement(ele);
            })
        ];

        const contextDOM = document.createElement("div");
        contextDOM.classList.add("contextMenu");
        contextDOM.style.zIndex = 1000;

        events.forEach(e => {
            const eventElementHandler = document.createElement("a");
            eventElementHandler.classList.add("contextMenuItem");
            eventElementHandler.onclick = (i) => {
                this.updateContextMenu();
                e.event(i);
            };

            const eventText = document.createElement("div");
            eventText.classList.add("contextMenuItemName");
            eventText.innerHTML = e.displayName;

            eventElementHandler.appendChild(eventText);

            contextDOM.appendChild(eventElementHandler);
        });

        contextDOM.addEventListener('mouseleave', e => this.updateContextMenu());

        document.body.appendChild(contextDOM);

        this.handle = contextDOM;

        this.isVisible = false;
        this.updateContextMenu();

        document.addEventListener('contextmenu', e => this.updateContextMenu(e));
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