class ConnectionManager {
    constructor(nodeManager) {
        this.nodeManager = nodeManager;

        this.currentSelectedSocket = null;

        document.addEventListener('mousedown', this.handleNodeSelection);
        document.addEventListener('updateNodes', this.connectionUpdate);
    }

    connectionUpdate = (e) => {
        for (let i = 0; i < this.nodeManager.nodes.length; i++) {
            const n = this.nodeManager.nodes[i];
            const outs = Object.values(n.outputs);

            outs.forEach((o) => {
                o.connections.forEach((s) => {
                    s.value = o.value;
                });
            });
        }
    }

    handleNodeSelection = (e) => {
        const seletedElement = document.elementFromPoint(e.clientX, e.clientY);

        //Connect sockets
        if (seletedElement.classList.contains("socket")) {
            if (this.currentSelectedSocket) {
                console.log("Connecting to " + seletedElement);

                const connTo = this.getSocketFromElement(seletedElement);
                if (this.currentSelectedSocket.isInput !== connTo.isInput) {
                    console.log("Valid conenction");

                    this.currentSelectedSocket.connections.push(connTo);
                    connTo.connections.push(this.currentSelectedSocket);
                } else {
                    console.log("Cannot connect same sockets");
                }

                this.currentSelectedSocket = null;
            } else {
                this.currentSelectedSocket = this.getSocketFromElement(seletedElement);
                console.log("Started connection");
            }
        } else {
            this.currentSelectedSocket = null;
            console.log("Deselected");
        }
    }

    getSocketFromElement = (socket) => {
        let getNode = socket.classList.contains("socketBody") ? socket : socket.closest(".socketBody");

        if (getNode === undefined || getNode === null) {
            return null;
        }

        for (let i = 0; i < this.nodeManager.nodes.length; i++) {
            const n = this.nodeManager.nodes[i];

            const ins = Object.values(n.inputs);
            for (let j = 0; j < ins.length; j++) {
                if (getNode.isSameNode(ins[j].handle)) {
                    return ins[j];
                }
            }

            const outs = Object.values(n.outputs);
            for (let j = 0; j < outs.length; j++) {
                if (getNode.isSameNode(outs[j].handle)) {
                    return outs[j];
                }
            }
        }
        return null;
    }
}

export default ConnectionManager;