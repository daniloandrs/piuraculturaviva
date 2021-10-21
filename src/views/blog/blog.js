
import { dnComponent } from '../../../dine.js';


export default dnComponent({
      
    name: 'blog',

    fn: function (scope, fApi, cApi, sStorage, location, routeParams) {
        
        scope.paramsName = routeParams.item;
        
        scope.path = cApi.STORAGE;

        let GetBlog = async () => {

            let res = await fApi.post('page/get_blog',{ take : null });

            scope.listBlog = res.success ? res.info : [];

        };   

        scope.gotoBlog = (item) => {
            
            location.path(`blog/${item.url}`);
            
        };

        scope.setFecha = (fecha) => {
            return  moment(fecha).format('LL');
        }

        scope.OnInit = async () => {
            
            scope.loader = true;

            await GetBlog();

            scope.loader = false;

            scope.$apply();
            
        };
  

    },
    
    templateUrl: './src/views/blog/blog.html',
    stylesUrl: './src/views/blog/blog.css',
    deps: [
        '$scope',
        'fApi',
        'cApi',
        'sStorage',
        '$location',
        '$routeParams',
    ]
});