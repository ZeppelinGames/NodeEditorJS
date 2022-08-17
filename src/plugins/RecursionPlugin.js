const RecursionPlugin = {
    extractInputNodes(node) {
        return node.getConnections().filter(c => c.input.node === node).map(c => c.output.node);
    },
    detect(editor) {
        // console.log(window.engine.detectRecursions(editor.toJSON().nodes));
        const nodesArr = [...editor.nodes];
        const findSelf = (node, inputNodes) => {
            if (inputNodes.some(n => n === node))
                return node;

            for (var i = 0; i < inputNodes.length; i++) {
                if (findSelf(node, this.extractInputNodes(inputNodes[i])))
                    return node;
            }

            return null;
        }

        return nodesArr.map(node => {
            return findSelf(node, this.extractInputNodes(node))
        }).filter(r => r !== null);
    }
}

export default RecursionPlugin;