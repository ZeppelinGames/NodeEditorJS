import Rete from 'rete';

const ToggleControlTemplate = {
    props: ['readonly', 'emitter', 'ikey', 'label', 'getData', 'putData'],
    template: '<div style="display:flex; align-items: center; justify-content:center; color: white">{{label}}<input style="flex:0" id="check" type="checkbox" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/></div>',
    data() {
        return {
            value: false,
        }
    },
    methods: {
        change(e) {
            this.value = !this.value;
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
    },
}

class ToggleControl extends Rete.Control {
    constructor(emitter, key, readonly, label) {
        super(key);

        this.component = ToggleControlTemplate;
        this.props = {
            emitter,
            ikey: key,
            readonly,
            label
        }
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}

export default ToggleControl;