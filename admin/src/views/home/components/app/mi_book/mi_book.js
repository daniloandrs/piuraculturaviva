
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    name: 'myBook',
    fn: function (scope, fApi, fCrud, sModal, sFirebase) {
        
       
        scope.objectSlider = {};
  
        
        scope.onInit = async () => {
        };
    },
    templateUrl: './src/views/home/components/app/mi_book/mi_book.html',
    stylesUrl: './src/views/home/components/app/mi_book/mi_book.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sFirebase'
    ]
});