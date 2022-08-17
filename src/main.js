import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount("#app");

import Rete from "rete";
import VueRenderPlugin from 'rete-vue-render-plugin';
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import ModulePlugin from "rete-module-plugin";
import AreaPlugin from 'rete-area-plugin';

import OutputComponent from "./components/OutputComponent";
import InputComponent from "./components/InputComponent";
import ConcatComponent from "./components/ConcatComponent";
import SplitComponent from "./components/SplitComponent";
import AddComponent from "./components/AddComponent";
import RecursionPlugin from "./plugins/RecursionPlugin";
import Base64Decode from "./components/Base64Decode";
import Base64Encode from "./components/Base64Encode";

(async () => {
    var container = document.querySelector('#rete');
    var components = [
        new InputComponent(),
        new OutputComponent(),
        new ConcatComponent(),
        new AddComponent(),
        new SplitComponent(),,
        new Base64Encode(),
        new Base64Decode(),
    ];

    var editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);
    editor.use(ContextMenuPlugin);
    editor.use(AreaPlugin);
    editor.use(ModulePlugin);
    
    var engine = new Rete.Engine('demo@0.1.0');

    components.map(c => {
        editor.register(c);
        engine.register(c);
    });

    editor.on('process nodecreated noderemoved connectionremoved', async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
    });

    editor.on('connectioncreated', async (c) => {
        const recursiveNodes = RecursionPlugin.detect(editor);
        if (recursiveNodes.length > 0) {
            editor.removeConnection(c);
        }

        await engine.abort();
        await engine.process(editor.toJSON());
    })

    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    editor.trigger('process');
})();