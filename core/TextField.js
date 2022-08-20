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
                    socket.value = this.value;
                    socket.updateConnections();
                }
            });
        }
    }
}

export default TextField;