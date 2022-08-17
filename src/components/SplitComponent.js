import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";

class SplitComponent extends Rete.Component {
    constructor() {
        super("Split");
    }

    builder(node) {
        var inp1 = new Rete.Input("A", "Input A", Sockets.AnySocket);
        var delim = new Rete.Input("Delim", "Delimiter", Sockets.AnySocket);
        var out = new Rete.Output("O", "Output", Sockets.AnySocket);

        inp1.addControl(new TextControl(this.editor, "A", false, "Input"));
        delim.addControl(new TextControl(this.editor, "Delim", false, "Delimiter"));

        return node
            .addInput(inp1)
            .addInput(delim)
            .addControl(new TextControl(this.editor, "Out", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs["A"].length > 0 ? inputs["A"] : (node.data.A ? node.data.A : "");
        var delim = inputs["Delim"].length > 0 ? inputs["Delim"] : (node.data.Delim ? node.data.Delim : "");

        var out = n1.toString().split(String(delim));

        this.editor.nodes.find(n => n.id == node.id).controls.get('Out').setValue("[" + out + "]");
        outputs['A'] = out;
    }
}

export default SplitComponent;