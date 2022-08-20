import Node from "../core/Node.js";

class AddNode extends Node {
    constructor() {
        super("Add"); //Node name
        const a = this.addInput("A");
        const b = this.addInput("B");

        const o = this.addOutput("Output");
    }

    update() {
        const aVal = Number(this.inputs["A"].value) ? Number(this.inputs["A"].value) : this.inputs["A"].value;
        const bVal = Number(this.inputs["B"].value) ? Number(this.inputs["B"].value) : this.inputs["B"].value;
        this.outputs["Output"].value = aVal + bVal;
    }
}

export default AddNode;