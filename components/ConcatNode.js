import Node from "../core/Node.js";

class ConcatNode extends Node {
    constructor() {
        super("Concatenate"); //Node name
        const a = this.addInput("A");
        const b = this.addInput("B");

        const o = this.addOutput("Output");
    }

    update() {
        this.outputs["Output"].value = this.inputs["A"].value + this.inputs["B"].value;
    }
}

export default ConcatNode;