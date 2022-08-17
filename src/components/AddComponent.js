import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";

class AddComponent extends Rete.Component {
    constructor() {
        super("Add");
    }

    builder(node) {
        var inp1 = new Rete.Input("A", "Input A", Sockets.AnySocket);
        var inp2 = new Rete.Input("B", "Input B", Sockets.AnySocket);
        var out = new Rete.Output("O", "Output", Sockets.AnySocket);

        inp1.addControl(new TextControl(this.editor, "A"));
        inp2.addControl(new TextControl(this.editor, "B"));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new TextControl(this.editor, "Out", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs["A"].length > 0 ? inputs["A"] : (node.data.A ? node.data.A : "");
        var n2 = inputs["B"].length > 0 ? inputs["B"] : (node.data.B ? node.data.B : "");

        let areNumbers = parseFloat(n1) && parseFloat(n2);

        var sum = areNumbers ? (+n1 + +n2) : n1 + n2;

        this.editor.nodes.find(n => n.id == node.id).controls.get('Out').setValue(sum);
        outputs['O'] = sum;
        console.log(sum);
    }
}

export default AddComponent;