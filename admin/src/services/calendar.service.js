
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
                now: '2020-06-31 00:00',
                scrollTime: '00:00',
                editable: true,
                selectable: true,
                aspectRatio: 1,
                height: 550,
                headerToolbar: {
                  left: 'today prev,next',
                  center: 'title',
                  right: 'resourceTimelineDay,resourceTimelineThreeDays'
                },
                titleFormat : {
                  year: 'numeric', month: 'long', day: 'numeric'
                },
                dayHeaderFormat : {
                  weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true
                },
                initialView: 'resourceTimelineThreeDays',
                views: {
                  resourceTimelineThreeDays: {
                    type: 'resourceTimeline',
                    duration: { days: 7 },
                    buttonText: 'Semana'
                  }
                },
                eventOverlap: false,
                slotDuration:{days: 1},
                slotLabelFormat: [
                  { month: 'long', year: 'numeric' }, 
                  { weekday: 'short', day: 'numeric', }
                ],
                resourceAreaHeaderContent: 'Habitaciones',
                resources: [], 
                timeZone: 'UTC',
                events: [],
              };
        };


        
    },
    deps: [
        
    ]
});