import { dnComponent } from '../../../dine.js';

export default dnComponent({

    name: 'about',
    
    fn: function (scope, ngroot, sModal,cApi, fApi, sStorage,location) {

        scope.path    = cApi.STORAGE;

        scope.loader = false;

        let GetBusinessData = async () => {

            let res = await fApi.get('page/get_business');

            scope.about = res.success ? res.info : {};

            scope.allies = scope.about.allies;
            
        }

        scope.getBackgroundStyle = function ( url ) {
            return {
                'background-image':'url(' + url + ')'
            }
        };


        scope.Init = async () => {

            scope.loader = true;

            await GetBusinessData();

            scope.loader = false;
            
            scope.$apply();
            
        };
    },
    
    templateUrl: './src/views/about/about.html',
    
    stylesUrl: './src/views/about/about.css',
    
    deps: [
        '$scope',
        '$rootScope',
        'sModal',
        'cApi',
        'fApi',
        'sStorage',
        '$location'
    ]
});