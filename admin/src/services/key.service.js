import { dnInjectable } from "../../dine.js";

dnInjectable({
    name: 'sKey',
    module: 'mdServices',
    fn: function () {
        let Config = {};
        this.set = config => {
            Config = angular.copy(config)
        }
        this.execute = type => {
            if (Config[type]) {
                Config[type]()
            }
        }
    }
});