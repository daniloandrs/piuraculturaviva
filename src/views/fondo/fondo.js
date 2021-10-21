
import { dnComponent } from '../../../dine.js';


export default dnComponent({

    name: 'fondo',

    fn: function (scope) {

        scope.togleClass = false;

        scope.addClass = () => {
            scope.togleClass = !scope.togleClass;
        }

    },

    templateUrl: './src/views/fondo/fondo.html',
    stylesUrl: './src/views/fondo/fondo.css',
    deps: [
        '$scope'
    ]
});