
import { dnComponent } from '../../../dine.js';


export default dnComponent({
    
    name: 'memberProfile',

    fn: function (scope, fToast, sForm, fApi, routeParams, sce, cApi) {

        scope.loader;
 
        scope.data = {};

        scope.paramsName = routeParams.item;

        scope.defaultProfile = './assets/img/login/avatar.svg';

        scope.phots = [];

        scope.path    = cApi.STORAGE;

        scope.formComment   = {};

        scope.commentObject = {};

        let Member = async () => { 

            let json = {
                member_url : scope.paramsName
            };

            let query = await fApi.post('page/get_member_profile',json);

            scope.data = query.success ? query.info : {};
            
            scope.photos = scope.proccessImages(scope.data.photos);

            scope.misImgs = {
            
               // mobile : scope.path + scope.data.logo,
                web : scope.path + scope.data.logo
            }

            scope.$apply();

        }

        let getOtherData = async () => {

            let res = await fApi.post('page/get_categories_and_other_members', {member_id : scope.data.id } );

            scope.others = res.success ? res.info : [];
            
            scope.$apply();
  
        }   

        scope.proccessImages = (array) => {

            let photos = [];

            angular.forEach(array, value => {

                photos.push({
                    fullres : scope.path + value.url,
                    thumbnail : scope.path + value.url,
                });
            });

            for (var i = 0; i < photos.length; i++) {
                photos[i].fullres = sce.trustAsResourceUrl(photos[i].fullres);
            }

            return photos;

        };

        scope.getBackgroundStyle = function(){
            return {
                'background-image':'url(' + scope.path + scope.data.thumbnail + ')'
            }
        }


        /** sección comentarios  */

        let modelComments = 'repository_cultural';

        let getComment = async () => {

            let query = await fApi.get(`page/get_comments/${modelComments}/${scope.IP}/${scope.data.id}`);

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
            
            scope.commentObject.status = false;
            
            scope.commentObject.model = modelComments;

            scope.commentObject.IP = scope.IP; 

            scope.commentObject.item_id = scope.data?.id;

            let query = await fApi.post('page/send_comment',scope.commentObject);

            scope.spin_form = false;
            
            if (query.success) {

                fToast.push({ title: 'Éxito', body : query.message , type: 'success' });
            
            } else {

                fToast.push({ title: 'Éxito', body : query.message  , type: 'error' });
            
            }
   
            scope.clearForm();  
            
            await getComment();

            scope.$apply();

        } 

        scope.OnInit = async () => {
            
            scope.loader = true;

            scope.tabselector = 'firsttab';

            await Member();
            
            await getOtherData();
            
            scope.IP = await sForm.miIp();

            await getComment();

            scope.loader = false;

            scope.$apply();

        };
  

    },
    
    templateUrl: './src/views/member_profile/member_profile.html',
    stylesUrl: './src/views/member_profile/member_profile.css',
    deps: [
        '$scope',
        'fToast',
        'sForm',
        'fApi',
        '$routeParams',
        '$sce',
        'cApi'
    ]
});