import InputNode from "../components/InputNode.js";
import OutputNode from "../components/OutputNode.js";
import ConcatNode from "../components/ConcatNode.js";
import AddNode from "../components/AddNode.js";

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
            new ContextMenuItem("Input", (e) => { this.createNewNode(e, new InputNode()) }),
            new ContextMenuItem("Output", (e) => { this.createNewNode(e, new OutputNode()) }),
            new ContextMenuItem("Concatenate", (e) => { this.createNewNode(e, new ConcatNode()) }),
            new ContextMenuItem("Add", (e) => { this.createNewNode(e, new AddNode()) })
        ];

        //Create DOM element
        const contextDOM = document.createElement("div");
        contextDOM.classList.add("contextMenu");
        contextDOM.style.zIndex = 1000;

        events.forEach(e => {
            const eventElementHandler = document.createElement("a");
            eventElementHandler.classList.add("contextMenuItem");
            eventElementHandler.onclick = (i) => {
                e.event(i);
                this.updateContextMenu();
            };

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

    createNewNode(e, newNode) {
        this.nodeManager.registerNode(newNode);
        newNode.setPosition(e.clientX, e.clientY);
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