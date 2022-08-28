class TextField {
    constructor(key, socket = null, readonly = false) {
        this.key = key;
        this.text = "";

        const textFieldContainer = document.createElement("div");
        textFieldContainer.classList.add("nodeTextField");

        const inputField = document.createElement("input");
        inputField.accept = "text";
        inputField.readOnly = readonly;

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