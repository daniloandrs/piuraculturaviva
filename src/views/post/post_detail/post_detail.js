
import { dnComponent } from '../../../../dine.js';


export default dnComponent({
    
    name: 'postDetail',

    fn: function (scope, fToast, sForm, fApi, routeParams, cApi, location) {
  
        scope.loader;

        scope.paramsName = routeParams.item;

        scope.notice = {};

        scope.path    = cApi.STORAGE;

        scope.comments = [];
        
        let Notice = async () => { 

            let json = {
                post_url : scope.paramsName
            };

            let query = await fApi.post('page/get_notice',json);

            scope.notice = query.success ? query.info : {};

            scope.misImgs = {
            
                web : scope.path + scope.notice.background_image
            }

            scope.$apply();

        }

        let getOtherData = async () => {

            let res = await fApi.post('page/get_other_notices', {post_id : scope.notice.id } );

            scope.others = res.success ? res.info : [];
            
            scope.$apply();

        } 


        scope.shareModal = (item) => {

            scope.url_copy  = location.absUrl().trim();

            fToast.push({ title: 'Éxito', body : 'Copiado en el partapapeles. ' , type: 'success' });
            
        };   


        scope.getBackgroundStyle = function(){
            return {
                'background-image':'url(' + scope.path + scope.notice.background_image + ')'
            }
        };
   

        /** sección comentarios  */

        scope.defaultProfile = './assets/img/login/avatar.svg';
    
        let modelComments = 'post';

        let getComment = async () => {

            let query = await fApi.get(`page/get_comments/${modelComments}/${scope.IP}/${scope.notice.id}`);

            scope.listcomments = query.success ? query.info : [];

            scope.$apply();
        }

        scope.clearForm = () => {

            scope.commentObject = {};

            scope.formComment ? scope.formComment?.$setPristine() : {};
        }

        let setMetatags = () => {

            fApi.get('page/social_tag')
            .then(res => {
                console.log(res);
            });
            

        };

        scope.timeAgo = (date) => sForm.timeAgo(date);

        scope.newComment = async () => {

            scope.spin_form = true;
            
            scope.commentObject.status = 0;
            
            scope.commentObject.model = modelComments;

            scope.commentObject.IP = scope.IP; 

            scope.commentObject.item_id = scope.notice?.id;

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

            await Notice();
            
            await getOtherData();
            
            scope.IP = await sForm.miIp();

            await getComment();

            setMetatags();

            scope.loader = false;

            scope.$apply();

        };
  

    },
    
    templateUrl: './src/views/post/post_detail/post_detail.html',
    stylesUrl: './src/views/post/post_detail/post_detail.css',
    deps: [
        '$scope',
        'fToast',
        'sForm',
        'fApi',
        '$routeParams',
        'cApi',
        '$location'
    ]
});