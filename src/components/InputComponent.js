import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";

class InputComponent extends Rete.Component {
    constructor() {
        super("Input");
        this.module = {
            nodeType: "input",
            socket: Sockets.AnySocket
        };
    }

    builder(node) {
        var out = new Rete.Output("Output", "Output", Sockets.AnySocket);
        var ctrl = new TextControl(this.editor, "Output", false);
        return node.addControl(ctrl).addOutput(out);
    }

    worker(node, inputs, outputs) {
        outputs["Output"] = node.data.Output;
    }
}

export default InputComponent;