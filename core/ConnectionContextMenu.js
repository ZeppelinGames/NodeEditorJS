import { ContextMenu, ContextMenuItem } from "./ContextMenu.js";

class ConnectionContextMenu extends ContextMenu {
    constructor(nodeManager, connectionManager) {
        super(nodeManager, [
            new ContextMenuItem("Delete", (e) => this.deleteConnection(e))
        ]);

        this.connectionManager = connectionManager;
        this.selectedConnection = null;
    }

    deleteConnection(e) {
        if (this.selectedConnection == null) {
            return;
        }
        this.selectedConnection.selected = false;
        this.connectionManager.deleteConnection(this.selectedConnection);
    }

    updateContextMenu(e) {
        if (e) {
            e.preventDefault();

            let updated = false;
            const selected = this.connectionManager.connectionSelected(e.clientX, e.clientY);
            console.log(selected);
            if (selected != null) {
                if (selected != this.selectedConnection) {
                    if (this.selectedConnection) {
                        this.selectedConnection.selected = false;
                    }

                    selected.selected = true;
                    this.selectedConnection = selected;
                    updated = true;
                }
            }

            this.handle.style.top = e.clientY + "px";
            this.handle.style.left = e.clientX + "px";

            this.setVisibility(selected != null);

            if (updated) {
                this.connectionManager.updateAndDrawConnections();
            }
        }
    }

    setVisibility(visible) {
        this.handle.style.display = visible ? "flex" : "none";
        this.isVisible = visible;
    }
}

export default ConnectionContextMenu;