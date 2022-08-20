class TextField {
    constructor(key, socket = null, isMultiline = false) {
        this.key = key;
        this.text = "";

        const textFieldContainer = document.createElement("div");
        textFieldContainer.classList.add("nodeTextField");

        const inputField = document.createElement(isMultiline ? "textarea" : "input");
        inputField.accept = "text";

        textFieldContainer.append(inputField);

        this.handle = textFieldContainer;
        this.input = inputField;

        this.value = "";

        if (inputField.addEventListener) {
            inputField.addEventListener('input', (e) => {
                this.value = e.target.value;

                if (socket) {
                    console.log("updated socket value to " + this.value);
                    socket.value = this.value;
                }

                // Update nodes. update this to recurse over connections attatched to node. Move listener to node
                const event = new Event('updateNodes');
                document.dispatchEvent(event);
            });
        }
        //inputField.attachEvent('onpropertychange', e => { dispatchEvent("updateNodes") });
    }
}

export default TextField;