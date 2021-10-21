
import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'sCalendar',
    module: 'mdServices',
    fn: function () {
    
        this.newCalendar = (calendarEl,config) => {
            
            return new FullCalendar.Calendar(calendarEl,config);
        }


        this.config = () => {

            return  {
                locale: 'es',
                utc: true, 
                editable: true,
                selectable: true,
                aspectRatio: 1,
                headerToolbar: {
                    left : 'title',
                    center : '',
                    right: ' prev next',
                },
                titleFormat : {
                    year: 'numeric', month: 'long'
                },
                height: 420,
                width : 200,
                weekends: true,
                defaultView: 'agendaWeek',
                eventOverlap: false,
                handleWindowResize : true,
                resoruces : [],
                events :[]
            };
        };

    },
    deps: [
        
    ]
});