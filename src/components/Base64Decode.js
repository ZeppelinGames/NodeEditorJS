import Rete from "rete";
import TextControl from "./TextControl";
import Sockets from "./Sockets";

import CryptoJS from "crypto-js";

class Base64Decode extends Rete.Component {
    constructor() {
        super("Base64 Decode");
    }

    builder(node) {
        var inp = new Rete.Input("Input", "Input", Sockets.AnySocket);
        var out = new Rete.Output("Output", "Output", Sockets.AnySocket);
        var ctrl = new TextControl(this.editor, "View", false);

        inp.addControl(new TextControl(this.editor, "Input"));

        return node.addInput(inp).addControl(ctrl).addOutput(out);
    }

    worker(node, inputs, outputs) {
        var inpVal = inputs["Input"].length > 0 ? inputs["Input"] : (node.data.Input ? node.data.Input : "");
        inpVal = String(inpVal);
        
        var decoded = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inpVal));
        decoded = decoded ? decoded : "Unable to decode";

        this.editor.nodes.find(n => n.id == node.id).controls.get('View').setValue(decoded);
        outputs["Output"] = decoded;
    }
}

export default Base64Decode;