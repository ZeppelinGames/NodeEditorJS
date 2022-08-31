import ConnectionContextMenu from "./ConnectionContextMenu.js";

class ConnectionData {
    constructor(input, output) {
        this.input = input;
        this.output = output;
        this.path = new Path2D();
        this.updatePath();

        this.selected = false;
    }

    updatePath() {
        const ip = this.input.socketHandle.getBoundingClientRect();
        const op = this.output.socketHandle.getBoundingClientRect();

        const inPos = { x: (ip.x + (ip.width / 2)), y: (ip.y + (ip.height / 2)) };
        const outPos = { x: (op.x + (op.width / 2)), y: (op.y + (op.height / 2)) };

        const xDist = inPos.x - outPos.x;

        this.path = new Path2D();

        this.path.moveTo(outPos.x, outPos.y);
        this.path.bezierCurveTo(outPos.x + (xDist / 2), outPos.y, inPos.x - (xDist / 2), inPos.y, inPos.x, inPos.y);
    }

    drawPath(ctx) {
        ctx.stroke(this.path);
    }
}

class ConnectionManager {
    constructor(nodeManager) {
        this.connectionContextMenu = new ConnectionContextMenu(nodeManager, this);

        this.nodeManager = nodeManager;
        this.connections = [];
        this.currentSelectedSocket = null;

        this.currConnectionPath = null;

        //Create canvas to draw connections onto
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.c2d = this.canvas.getContext('2d');
        this.c2d.strokeStyle = 'white';
        this.c2d.lineWidth = 6;

        document.body.appendChild(this.canvas);

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.c2d.strokeStyle = 'white';
            this.c2d.lineWidth = 6;

            this.updateAndDrawConnections();
        });
        document.addEventListener('mousedown', this.handleSocketSelection);
        document.addEventListener('mousemove', this.handleSocketConnectionMovement);

        document.addEventListener("nodeMove", () => {
            this.updateAndDrawConnections();
        });
    }

    getConnectionFromInputAndOutput(inp, out) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].input.handle.isSameNode(inp.handle) && this.connections[i].output.handle.isSameNode(out.handle)) {
                return this.connections[i];
            }
        }
        return null;
    }

    deleteConnectionsOnSockets(input, output) {
        const conn = this.getConnectionFromInputAndOutput(input, output);

        this.connections.splice(this.connections.indexOf(conn), 1);

        input.connections.splice(input.connections.indexOf(output), 1);
        output.connections.splice(output.connections.indexOf(input), 1);

        //not updating linked connections properly. need to find out whats going on + fix
        output.updateConnections();
        input.updateConnections();

        input.node.update();
        output.node.update();

        this.updateAndDrawConnections();
    }

    deleteConnection(conn) {
        if (conn == null) {
            return;
        }
        this.connections.splice(this.connections.indexOf(conn), 1);

        conn.input.connections.splice(conn.input.connections.indexOf(conn.output), 1);
        conn.output.connections.splice(conn.output.connections.indexOf(conn.input), 1);

        //not updating linked connections properly. need to find out whats going on + fix
        conn.output.updateConnections();
        conn.input.updateConnections();

        conn.input.node.update();
        conn.output.node.update();

        this.updateAndDrawConnections();
    }

    connectionSelected(x, y) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.c2d.isPointInStroke(this.connections[i].path, x, y)) {
                return true;
            }
        }
        return false;
    }

    updateAndDrawConnections() {
        this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.connections.forEach((c) => {
            this.c2d.strokeStyle = c.selected ? 'orange' : 'white';
            c.updatePath();
            c.drawPath(this.c2d);
        });
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

    handleSocketSelection = (e) => {
        // let updated = false;
        // this.connections.forEach((c) => {
        //     const isSelected = this.c2d.isPointInPath(c.path, e.clientX, e.clientY);
        //     if (c.selected != isSelected) {
        //         c.selected = isSelected;
        //         updated = true;
        //     }
        // });
        // if (updated) {
        //     this.updateAndDrawConnections();
        // }

        const selectedElement = document.elementFromPoint(e.clientX, e.clientY);

        //Connect sockets
        if (selectedElement.classList.contains("socket")) {
            this.currConnectionPath = new Path2D();

            const ip = selectedElement.getBoundingClientRect();

            const inPos = { x: (ip.x + (ip.width / 2)), y: (ip.y + (ip.height / 2)) };
            const outPos = { x: e.clientX, y: e.clientY };

            const xDist = inPos.x - outPos.x;

            this.currConnectionPath.moveTo(outPos.x, outPos.y);
            this.currConnectionPath.bezierCurveTo(outPos.x + (xDist / 2), outPos.y, inPos.x - (xDist / 2), inPos.y, inPos.x, inPos.y);

            if (this.currentSelectedSocket) {
                const connTo = this.getSocketFromElement(selectedElement);

                if (connTo != null && this.currentSelectedSocket.isInput !== connTo.isInput && !this.currentSelectedSocket.node.handle.isSameNode(connTo.node.handle)) {
                    const out = connTo.isInput ? this.currentSelectedSocket : connTo;
                    const inp = connTo.isInput ? connTo : this.currentSelectedSocket;

                    if (inp.connections.length == 0) {
                        console.log("Valid conenction");

                        this.currentSelectedSocket.connections.push(connTo);
                        connTo.connections.push(this.currentSelectedSocket);

                        connTo.updateConnections();
                        this.currentSelectedSocket.updateConnections();

                        const newPath = new ConnectionData(inp, out);
                        newPath.drawPath(this.c2d);
                        this.connections.push(newPath);

                        this.currConnectionPath = null;
                    } else {
                        //Input already connected to something else
                        const conn = this.getConnectionFromInput(inp);

                        //Remove old connection
                        conn.output.connections.splice(conn.output.connections.indexOf(inp), 1);
                        inp.connections.splice(inp.connections.indexOf(conn.output), 1);

                        //Add new connection
                        inp.connections.push(out);
                        out.connections.push(inp);

                        out.updateConnections();

                        conn.output = out;

                        this.updateAndDrawConnections();
                    }
                } else {
                    console.log("Cannot connect same sockets/node");
                }

                this.currentSelectedSocket = null;
            } else {
                this.currentSelectedSocket = this.getSocketFromElement(selectedElement);
            }
        } else {
            this.currentSelectedSocket = null;
            this.updateAndDrawConnections();
            //See if connection was selected
        }
    }

    handleSocketConnectionMovement = (e) => {
        if (this.currentSelectedSocket == null) {
            return;
        }

        this.currConnectionPath = new Path2D();

        const ip = this.currentSelectedSocket.socketHandle.getBoundingClientRect();

        const inPos = { x: (ip.x + (ip.width / 2)), y: (ip.y + (ip.height / 2)) };
        const outPos = { x: e.clientX, y: e.clientY };

        const xDist = inPos.x - outPos.x;

        this.currConnectionPath.moveTo(outPos.x, outPos.y);
        this.currConnectionPath.bezierCurveTo(outPos.x + (xDist / 2), outPos.y, inPos.x - (xDist / 2), inPos.y, inPos.x, inPos.y);

        this.updateAndDrawConnections();
        this.c2d.stroke(this.currConnectionPath);
    }

    getConnectionFromInput(inp) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].input.handle.isSameNode(inp.handle)) {
                return this.connections[i];
            }
        }
        return null;
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