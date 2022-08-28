class ContextMenuItem {
    constructor(displayName, event) {
        this.displayName = displayName;
        this.event = event;
    }
}

class ContextMenu {
    constructor(nodeManager, contextEvents) {
        this.nodeManager = nodeManager;

        //Bind events
        const events = contextEvents;

        //Create DOM element
        const contextDOM = document.createElement("div");
        contextDOM.classList.add("contextMenu");
        contextDOM.style.zIndex = 1000;

        events.forEach(e => {
            const eventElementHandler = document.createElement("a");
            eventElementHandler.classList.add("contextMenuItem");
            eventElementHandler.onclick = (i) => {
                this.setContextMenuVisibility(false);
                e.event(i);
            };

            const eventText = document.createElement("div");
            eventText.classList.add("contextMenuItemName");
            eventText.innerHTML = e.displayName;

            eventElementHandler.appendChild(eventText);

            contextDOM.appendChild(eventElementHandler);
        });

        contextDOM.addEventListener('mouseleave', e => this.setContextMenuVisibility(false));

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
            if (selectedElement.tagName !== "CANVAS") {
                return;
            }

            this.handle.style.top = e.clientY + "px";
            this.handle.style.left = e.clientX + "px";
        }
        this.setContextMenuVisibility(!this.isVisible);
    }

    setContextMenuVisibility(vis) {
        this.isVisible = vis;
        this.handle.style.display = this.isVisible ? "flex" : "none";
    }
}

export { ContextMenu, ContextMenuItem };