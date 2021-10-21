
import { dnComponent } from '../../../dine.js';


export default dnComponent({
      
    name: 'virtualTours',
    
    fn: function (scope, fApi, sModal, cApi) {
        
        scope.path = cApi.STORAGE;

        scope.spinFrame;

        scope.togleClass = false;
        
        let ListVirtualTours = async () => {

            let res = await fApi.get('page/get_virtual_tours');

            scope.listVirtualTours = res.success ? res.info : [];

            scope.$apply();

        }
   
        scope.iframeLoadedCallBack = () => {
            scope.spinFrame  = false;
            scope.$apply(); 
        }

        scope.openIframe = (item) => {
            
            scope.spinFrame = true;

            scope.iframe = angular.copy(item);

            sModal.openIframe('modal-base-form',() => {
                
                scope.iframe = {
                    url : 'no-load'
                };

                scope.$apply();
            });
        };

        scope.OnInit = async () => {
            
            scope.loader = true;

            await ListVirtualTours();

            scope.loader = false;

            scope.$apply();
            
        };
        

    },
    
    templateUrl: './src/views/virtual_tours/virtual_tours.html',
    stylesUrl: './src/views/virtual_tours/virtual_tours.css',
    deps: [
        '$scope',
        'fApi',
        'sModal',
        'cApi'
    ]
});