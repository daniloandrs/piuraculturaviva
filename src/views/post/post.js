
import { dnComponent } from '../../../dine.js';


export default dnComponent({
      
    name: 'post',

    fn: function (scope, fApi, cApi, sStorage, location, routeParams) {
        
        scope.paramsName = routeParams.item;
        
        scope.path = cApi.STORAGE;

        let ListPost = async () => {

            let res = await fApi.get('page/get_post');

            scope.ListPost = res.success ? res.info : [];

            scope.$apply();

        }

        scope.gotoNotice = (item) => {
            
            location.path(`noticias/${item.url}`);
            
        };

        scope.setFecha = (fecha) => {
            return  moment(fecha).format('LL');
        }

        scope.OnInit = async () => {
            
            scope.loader = true;

            await ListPost();

            scope.loader = false;

            scope.$apply();
            
        };
  

    },
    
    templateUrl: './src/views/post/post.html',
    stylesUrl: './src/views/post/post.css',
    deps: [
        '$scope',
        'fApi',
        'cApi',
        'sStorage',
        '$location',
        '$routeParams',
    ]
});