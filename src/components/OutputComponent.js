import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";
import ToggleControl from "./ToggleControl";

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
        var tglCtrl = new ToggleControl(this.editor, "Raw", false, "View raw");

        return node.addInput(inp).addControl(tglCtrl).addControl(ctrl);
    }

    worker(node, inputs, outputs) {
        var v = inputs["Input"] ? inputs["Input"] : node.data.Input;
        var raw = inputs["Raw"] ? inputs["Raw"] : node.data.Raw;

        this.editor.nodes.find(n => n.id == node.id).controls.get('Input').setValue(v);
    }
}

export default OutputComponent;