import Node from "../core/Node.js";

class OutputNode extends Node {
    constructor() {
        super("Output");
        const skt = this.addInput("Input");
        this.addTextField("Output", skt, false);
    }

    update() {
        console.log("Outputted");
        this.nodeData["Output"].input.value = this.inputs["Input"].value;
    }
}

export default OutputNode;