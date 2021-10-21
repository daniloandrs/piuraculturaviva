
import { dnComponent } from '../../../dine.js';

export default dnComponent({
      
    name: 'schedule',

    fn: function (scope, fApi, sModal, cApi, sForm, location,sCalendar,calendarConfig) {
        
        scope.path = cApi.STORAGE;

        scope.spinFrame;  

        scope.today = sForm.hoy_string();   

        scope.listCalendar = {};

        scope.listOrder = [
            {id:1, name : 'Nombre'}, {id:2 , name : 'Hora'},
            {id:3, name : 'Lugar'}, {id:4, name : 'Categoría'},

        ];
        
        scope.currentDate_  = new Date();

        scope.selectOrder = (item) => {

            scope.orderSelect = angular.copy(item);

            switch (item.name) {

                case 'Nombre':
                    scope.listEvents = scope.listEvents.sort(function(a,b){
                        return a.title.localeCompare(b.title);
                    });
                    break;

                case 'Hora':
                    scope.listEvents = scope.listEvents.sort((a, b) => moment(a.publication_time) - moment(b.publication_time));

                    break;

                case 'Lugar':
                    scope.listEvents = scope.listEvents.sort(function(a,b){
                        return a.location.localeCompare(b.location);
                    });
                    break;

                case 'Categoría':
                    scope.listEvents = scope.listEvents.sort(function(a,b){
                        return a.category.name.localeCompare(b.category.name);
                    })
                    break;
            }
        };

        scope.addDay = async () => {
  
            scope.spinner = true;

            let tmp = angular.copy(scope.currentDate);

            let tmp_string_Date = sForm.parseStringDate(tmp.add(1, 'days').format('YYYY-MM-DD'));

            await getEventsByDay(tmp_string_Date);

            scope.spinner  = false;
            
            scope.$apply();
            

        };
        
        scope.onTimeSelected =    async (item,events) => {

            let tmp = moment(item);

            let tmp_string_Date = sForm.parseStringDate(tmp.format('YYYY-MM-DD'));

            await getEventsByDay(tmp_string_Date);

            scope.spinner  = false;
            
            scope.$apply();

        }

        scope.subtractDay = async () => {

            scope.spinner = true;

            let tmp = angular.copy(scope.currentDate);

            let tmp_string_Date = sForm.parseStringDate(tmp.subtract(1, 'days').format('YYYY-MM-DD'));

            await getEventsByDay(tmp_string_Date);

            scope.spinner  = false;
            
            scope.$apply();

        };

        scope.MyStyle = function (color) {
            return {
                'border-right' : `8px solid ${color}`
            }
        }
        
        scope.viewDate = new Date();
        scope.calendarView = 'month';

        let getEvents =  async () => {

            let res = await fApi.get('page/get_events_schedule');

            console.log(moment.tz);
            scope.listCalendar = res.success ? res.info : [];

            scope.eventSource = scope.listCalendar.events;
     

            scope.$apply();

        };


        scope.eventClick = async (info) => {
        
            scope.spinModal = true;

            sModal.openIframe('modal-base-form');

            let data = {
					id  : info.id
				}

            let query = await fApi.get(`page/get_event_by_id/${data.id}`);
            
            scope.item = query.success ? query.info : {};

            scope.spinModal = false;

            scope.$apply();
            
        };

        scope.setFecha = (fecha) => {
            return  moment(fecha).format('LT a');
        }

        
        scope.setDate = (fecha) => {
            return  moment(fecha).format('LL');
        }
        
        scope.gotoDetail = () => {

            sModal.closeIframe('modal-base-form');

            setTimeout(() => {
                location.path(`eventos/${scope.item.url_detail}`);
                scope.$apply();
            },1000);
        };   
  
        let getEventsByDay = async (date) => {

            scope.currentDate = moment(date);

            let res = await fApi.get(`page/get_events_by_day/${date}`);

            scope.listEvents = res.success ? res.info : [];

            scope.$apply();
        };

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

            await getEvents();

            await getEventsByDay(scope.today);

            scope.selectOrder({id:1, name : 'Nombre'});

            scope.loader = false;

            scope.$apply();
            

        };
    

    },
    
    templateUrl: './src/views/schedule/schedule.html',
    stylesUrl: './src/views/schedule/schedule.css',
    deps: [
        '$scope',
        'fApi',
        'sModal',
        'cApi',
        'sForm',
        '$location', 
        'sCalendar',
        'calendarConfig'
    ]
});