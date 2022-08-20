import Node from "../core/Node.js";

class InputNode extends Node {
    constructor() {
        super("Input");
        const outs = this.addOutput("Output");
        this.addTextField("Input", outs, false);
    }

    update() {
    }
}

export default InputNode;