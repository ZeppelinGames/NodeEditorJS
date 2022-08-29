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
        this.connectionManager.deleteConnection(this.selectedConnection);
    }

    updateContextMenu(e) {
        if (e) {
            e.preventDefault();

            let updated = false;
            this.connectionManager.connections.forEach((c) => {
                const isSelected = this.connectionManager.c2d.isPointInPath(c.path, e.clientX, e.clientY);
                if (c.selected != isSelected) {

                    if (isSelected) {
                        if (this.selectedConnection != null) {
                            this.selectedConnection.selected = false;
                        }
                        this.selectedConnection = c;
                    }

                    c.selected = isSelected;
                    updated = true;
                }
            });
            if (!updated) {
                return;
            }

            this.connectionManager.updateAndDrawConnections();


            this.handle.style.top = e.clientY + "px";
            this.handle.style.left = e.clientX + "px";
        }

        this.handle.style.display = this.isVisible ? "flex" : "none";
        this.isVisible = !this.isVisible;
    }
}

export default ConnectionContextMenu;