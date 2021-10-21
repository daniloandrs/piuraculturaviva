
import { dnComponent } from '../../../dine.js';

export default dnComponent({

    name: 'footer',
    
    fn: function (scope, rootScope, cApi, fApi) {

        scope.path = cApi.STORAGE;
        
        let GetBusinessData = async () => {

            let res = await fApi.get('page/get_business');

            rootScope.business = res.success ? res.info : [];

            rootScope.logo_navbar = scope.path  + rootScope.business.logos[0].image;

        }

        scope.Init = async () => {

            await GetBusinessData();

        }

    },

    templateUrl: './src/views/footer/footer.html',
    stylesUrl: './src/views/footer/footer.css',
    deps: [
        '$scope',
        '$rootScope',
        'cApi',
        'fApi'
    ]
});  