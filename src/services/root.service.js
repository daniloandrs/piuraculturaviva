import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'sRoot',
    module: 'mdServices',
    fn: function () {
        let memory = [];
        return {
            set: (name, value) => {
                memory[name] = value;
            },
            get: name => {
                return memory[name];
            }
        };
    }
});