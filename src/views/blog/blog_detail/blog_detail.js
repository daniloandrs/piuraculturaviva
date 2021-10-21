
import { dnComponent } from '../../../../dine.js';


export default dnComponent({
    
    name: 'blogDetail',

    fn: function (scope, fToast, sForm, fApi, routeParams, sce, cApi, ngMeta, location) {

        scope.loader;

        scope.paramsName = routeParams.item;

        scope.blog = {};

        scope.path    = cApi.STORAGE;

        scope.notFound = false;
        
        scope.formComment   = {};
        
        scope.commentObject = {};

        let nullData = () => {

            let defaultData = { id : 'none' , background_image : 'error.jpg'};

            return defaultData;
        };

        let Blog = async () => { 

            let json = {
                blog_url : scope.paramsName
            };

            let query = await fApi.post('page/get_blog_detail',json);

            scope.blog = query.success ? query.info : {};

            if (scope.blog == null) {
                
                scope.blog = nullData();

                scope.notFound = true;

            }

            scope.misImgs = {
            
               // mobile : scope.path + scope.data.logo,
                web : scope.path + scope.blog.background_image
            }

            scope.$apply();

        }

        let getOtherData = async () => {

            let res = await fApi.post('page/get_other_blogs', { blog_id : scope.blog.id } );

            scope.others = res.success ? res.info : [];
            
            scope.$apply();

        }


        scope.getBackgroundStyle = function () {
            return {
                'background-image':'url(' + scope.path + scope.blog.background_image + ')'
            }
        }
  

        /** sección comentarios  */

        scope.defaultProfile = './assets/img/login/avatar.svg';
        
        let modelComments = 'blog';

        let getComment = async () => {

            let query = await fApi.get(`page/get_comments/${modelComments}/${scope.IP}/${scope.blog.id}`);

            scope.listcomments = query.success ? query.info : [];

            scope.$apply();
        }
  
        scope.clearForm = () => {

            scope.commentObject = {};

            scope.formComment ? scope.formComment?.$setPristine() : {};
        }

        scope.timeAgo = (date) => sForm.timeAgo(date);

        scope.newComment = async () => {

            scope.spin_form = true;
            
            scope.commentObject.status = 0;
            
            scope.commentObject.model = modelComments;

            scope.commentObject.IP = scope.IP; 

            scope.commentObject.item_id = scope.blog?.id;

            let query = await fApi.post('page/send_comment',scope.commentObject);

            scope.spin_form = false;
            
            if (query.success) {

                fToast.push({ title: 'Éxito', body : query.message , type: 'success' });
            
            } else {

                fToast.push({ title: 'Éxito', body : query.message  , type: 'error' });
            
            }

            scope.clearForm();  
            
            getComment();

            scope.$apply();
 
        }

        scope.OnInit = async () => {
            
            scope.loader = true;

            await Blog();
            
            await getOtherData();
            
            scope.IP = await sForm.miIp();

            await getComment();

            scope.loader = false;

            scope.$apply();

        };
  

    },
    
    templateUrl: './src/views/blog/blog_detail/blog_detail.html',
    stylesUrl: './src/views/blog/blog_detail/blog_detail.css',
    deps: [
        '$scope',
        'fToast',
        'sForm',
        'fApi',
        '$routeParams',
        '$sce',
        'cApi',
        'ngMeta',
        '$location'
    ]
});