class ConnectionData {
    constructor(input, output) {
        this.input = input;
        this.output = output;
        this.path = new Path2D();
        this.updatePath();
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
        this.nodeManager = nodeManager;
        this.connections = [];
        this.currentSelectedSocket = null;

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

        document.addEventListener("nodeMove", () => {
            this.updateAndDrawConnections();
        });
    }

    updateAndDrawConnections() {
        this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.connections.forEach((c) => {
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
        const seletedElement = document.elementFromPoint(e.clientX, e.clientY);

        //Connect sockets
        if (seletedElement.classList.contains("socket")) {
            if (this.currentSelectedSocket) {
                const connTo = this.getSocketFromElement(seletedElement);
                if (this.currentSelectedSocket.isInput !== connTo.isInput && !this.currentSelectedSocket.node.handle.isSameNode(connTo.node.handle)) {
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

                    } else {
                        //Input already connected to something else
                        const conn = this.getConnectionFromInput(inp);

                        //Remove old connection
                        conn.output.connections.pop(inp);
                        inp.connections.pop(conn.output);

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
                this.currentSelectedSocket = this.getSocketFromElement(seletedElement);
            }
        } else {
            this.currentSelectedSocket = null;

            //See if connection was selected
        }
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