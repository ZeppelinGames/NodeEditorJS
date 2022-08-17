import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";

class OutputComponent extends Rete.Component {
    constructor() {
        super("Output");
        this.module = {
            nodeType: "output",
            socket: Sockets.AnySocket
        };
    }

    builder(node) {
        var inp = new Rete.Input("Input", "Input", Sockets.AnySocket);
        var ctrl = new TextControl(this.editor, "Input", true);

        return node.addControl(ctrl).addInput(inp);
    }

    worker(node, inputs, outputs) {
        var v = inputs["Input"] ? inputs["Input"] : node.data.Input;
        this.editor.nodes.find(n => n.id == node.id).controls.get('Input').setValue(v);
    }
}

export default OutputComponent;