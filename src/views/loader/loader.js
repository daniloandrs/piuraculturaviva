
import { dnComponent } from '../../../dine.js';

export default dnComponent({

    name: 'loader',
    
    fn: function (scope, fApi, sStorage,location) {

    },

    templateUrl: './src/views/loader/loader.html',
    stylesUrl: './src/views/loader/loader.css',
    deps: [
        '$scope',
        'fApi',
        'sStorage',
        '$location'
    ]
});