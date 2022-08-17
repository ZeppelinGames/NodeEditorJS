import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";

class SplitComponent extends Rete.Component {
    constructor() {
        super("Split");
    }

    builder(node) {
        var inp1 = new Rete.Input("A", "Input A", Sockets.AnySocket);
        var out = new Rete.Output("O", "Output", Sockets.AnySocket);

        inp1.addControl(new TextControl(this.editor, "A"));

        return node
            .addInput(inp1)
            .addControl(new TextControl(this.editor, "Out", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs["A"].length > 0 ? inputs["A"] : (node.data.A ? node.data.A : "");

        var out = n1.toString().split("");

        this.editor.nodes.find(n => n.id == node.id).controls.get('Out').setValue("[" + out + "]");
        outputs['A'] = out;
    }
}

export default SplitComponent;