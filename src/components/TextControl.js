import Rete from 'rete';

var TextControlTemplate = {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template: '<input type="text" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>',
    data() {
        return {
            value: "",
        }
    },
    methods: {
        change(e) {
            this.value = e.target.value;
            this.update();
        },
        update() {
            if (this.ikey)
                this.putData(this.ikey, this.value)
            this.emitter.trigger('process');
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
}

class TextControl extends Rete.Control {
    constructor(emitter, key, readonly) {
        super(key);

        this.component = TextControlTemplate;
        this.props = {
            emitter,
            ikey: key,
            readonly
        }
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}

export default TextControl;