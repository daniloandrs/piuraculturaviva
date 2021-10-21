
import { dnComponent } from '../../../dine.js';

export default dnComponent({
      
    name: 'event',

    fn: function (scope, fApi, cApi, routeParams, sForm) {
        
        scope.paramsName = routeParams.item;
        
        scope.path = cApi.STORAGE;

        let GetEvents = async () => {

            let res = await fApi.post('page/get_events',{ take : null,all : true });

            scope.listEvents = res.success ? res.info : [];

        };   
 
        scope.setDate = (fecha) => {
            return  moment(fecha).format('LL');
        }

        scope.setTime = (dateToFormat) => {
            return moment(dateToFormat).format("HH:mm a");
        };
        
        scope.OnInit = async () => {
            
            scope.loader = true;

            await GetEvents();

            scope.loader = false;

            scope.$apply();
            
        };
  

    },
    
    templateUrl: './src/views/event/event.html',
    stylesUrl: './src/views/event/event.css',
    deps: [
        '$scope',
        'fApi',
        'cApi',
        '$routeParams',
        'sForm'
    ]
});