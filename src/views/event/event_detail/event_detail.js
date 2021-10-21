
import { dnComponent } from '../../../../dine.js';

export default dnComponent({
    
    name: 'eventDetail',

    fn: function (scope, fToast, sForm, fApi, routeParams, cApi, location, route, sModal) {

        scope.loader;
 
        scope.data = {};

        scope.paramsName = routeParams.item;
        
        scope.defaultProfile = './assets/img/login/avatar.svg';

        scope.path  = cApi.STORAGE;

        let Event = async () => { 

            let json = {
                event_url : scope.paramsName
            };
  
            let query = await fApi.post('page/get_event_detail',json);

            scope.data = query.success ? query.info : null;

            if (scope.data == null)  {

                scope.isEmpty = true;

            } else {

                scope.isEmpty = false;
                
                scope.url = scope.data.url;
            
            }
            
            scope.$apply();

        }


        scope.shareModal = (item) => {
            
//          scope.url_copy  = location.absUrl().trim();

            let path = cApi.SHARED_URL;

            scope.url_copy  = (path + 'eventos/' + item.url_detail).trim();

            fToast.push({ title: 'Éxito', body : 'Copiado en el partapapeles. ' , type: 'success' });
            
        };  


        scope.gotoEvent = (item) => {
            
            location.path(`eventos/${item.url_detail}`);

            route.reload();
        };  

        let GetEvents = async () => {

            let res = await fApi.post('page/get_events',{ take : 4 });

            scope.listEvents = res.success ? res.info : [];

        };   

        /** sección comentarios  */

        scope.defaultProfile = './assets/img/login/avatar.svg';
    
        let modelComments = 'event';

        let getComment = async () => {

            let query = await fApi.get(`page/get_comments/${modelComments}/${scope.IP}/${scope.data?.id}`);

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

            scope.commentObject.item_id = scope.data?.id;

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

        scope.setFecha = (fecha) => {
            return  moment(fecha).format('LLL a');
        }

        scope.OnInit = async () => {
            
            scope.loader = true;

            await Event();
            
            await GetEvents();

            scope.IP = await sForm.miIp();

            await getComment();

            scope.loader = false;

            scope.$apply();

        };
  

    },
    
    templateUrl: './src/views/event/event_detail/event_detail.html',
    stylesUrl: './src/views/event/event_detail/event_detail.css',
    deps: [
        '$scope',
        'fToast',
        'sForm',
        'fApi',
        '$routeParams',
        'cApi',
        '$location',
        '$route',
        'sModal'
    ]
});