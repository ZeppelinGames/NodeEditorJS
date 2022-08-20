import InputNode from "../components/InputNode.js";
import OutputNode from "../components/OutputNode.js";

class ContextMenuItem {
    constructor(displayName, event) {
        this.displayName = displayName;
        this.event = event;
    }
}

class ContextMenu {
    constructor(nodeManager) {
        this.nodeManager = nodeManager;

        //Bind events
        const events = [
            new ContextMenuItem("Input", () => {
                const newNode = new InputNode();
                this.nodeManager.registerNode(newNode);
            }),
            new ContextMenuItem("Output", () => {
                const newNode = new OutputNode();
                this.nodeManager.registerNode(newNode);
            }),
        ];

        //Create DOM element
        const contextDOM = document.createElement("div");
        contextDOM.classList.add("contextMenu");
        contextDOM.style.zIndex = 1000;

        events.forEach(e => {
            const eventElementHandler = document.createElement("a");
            eventElementHandler.classList.add("contextMenuItem");
            eventElementHandler.onclick = e.event;

            const eventText = document.createElement("div");
            eventText.classList.add("contextMenuItemName");
            eventText.innerHTML = e.displayName;

            eventElementHandler.appendChild(eventText);

            contextDOM.appendChild(eventElementHandler);
        });

        document.body.appendChild(contextDOM);

        this.handle = contextDOM;

        this.isVisible = false;
        this.updateContextMenu();

        document.addEventListener('contextmenu', e => this.updateContextMenu(e));
    }

    updateContextMenu(e) {
        if (e) {
            e.preventDefault();

            this.handle.style.top = e.clientY + "px";
            this.handle.style.left = e.clientX + "px";
        }
        this.handle.style.display = this.isVisible ? "flex" : "none";
        this.isVisible = !this.isVisible;
    }
}

export default ContextMenu;