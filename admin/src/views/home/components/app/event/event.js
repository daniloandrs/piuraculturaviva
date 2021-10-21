
import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({
    
    name: 'event',

    fn: function (scope, fApi, fCrud, sModal, sForm, cApi) {

        let Model = 'event';

        scope.path = cApi.STORAGE;

        scope.mainObj = {};
        
        scope.forms = {
            formEvent : null
        };
 
        scope.spin = false;

        scope.gallery_options = {
            dimentions: {
                width: 240000,
                height: 1800000,
                size:10240000
            }
        };

        let ListEvent = () => {
            scope.listData = [];
            scope.loading = fCrud.getdata(Model)
                .then(res => scope.listData = res.success ? res.info : [])         
        };

        let Category = async () => {

            let query = await fApi.get('member/categoryList');

            scope.categoryList = query.success ? query.info : [];

            scope.$apply();
        }

        scope.saveData = async () => {

            scope.spin_form = true;

            let date = sForm.parseStringDate(scope.mainObj.publication_date);
   
            let time = sForm.parseStringTime(scope.mainObj.publication_time);

            let date_end = sForm.parseStringDate(scope.mainObj.publication_date_end);
   
            let time_end = sForm.parseStringTime(scope.mainObj.publication_time_end);

            scope.mainObj.publication_date_tmp = date;  

            scope.mainObj.publication_time_tmp = time;

            scope.mainObj.publication_date_tmp_end = date_end;

            scope.mainObj.publication_time_tmp_end = time_end;
              
            scope.mainObj.url_detail = sForm.createUrl(scope.mainObj.title);
            
            let operation = (scope.mainObj.id == null) ? 'create' : 'update';

            let res = (operation == 'create') ?  await fApi.image('event/create',scope.mainObj) :  await fApi.image('event/update',scope.mainObj);
               
            PostTransaction(res);   
        }

        scope.setDate = (dateToFormat) => {

            return moment(dateToFormat).format("DD/MM/YYYY HH:mm a");
        
        };
        
        scope.getSubcategories = async () => {

            setTimeout(async () => {

                let data = {
                    category_id : scope.mainObj.category_id
                };
                
                let query = await fApi.post('category/sub_category',data);
    
                scope.subCategoriesList = query.success ? query.info : [];
                
                scope.$apply();
                
            }, 100);

        };

        scope.$watch('mainObj.description',function(value){

            if(value) {
                scope.mainObj.description.replace(/[^\n]/g,' '); 
            }
               
        });

        scope.deleteEvent = (event) => {

            sModal.question('¿Seguro que desea eliminar este Evento?', async () => {
                  
                scope.loading = true;

                let res = await fApi.post('event/delete',
                    {
                        event_id : event.id
                    }  
                );
                
                PostTransaction(res);

            });

        }

        let PostTransaction = res => {
            if (res.success) {
                ListEvent();
                sModal.close('modal-form');
                sModal.success(res.message);
                scope.spin_form = false;
                scope.loading = false;
            } else {
                if (res.errors) scope.errors = res.errors;
                if (res.message) sModal.error(res.message);
                scope.spin_form = false;
            }
        };

        scope.openModal = async (type , data) => {

            scope.cleanForm();   
            
            if (data) {
                
                scope.mainObj = angular.copy(data);

                scope.mainObj.publication_date =  sForm.parseDate(moment(data.publication_date).format('YYYY/MM/DD'));
                
                scope.mainObj.publication_time =  sForm.parseDateTime(moment(data.publication_time).format('YYYY/MM/DD HH:mm'));
                
                scope.mainObj.publication_date_end =  sForm.parseDate(moment(data.publication_date_end).format('YYYY/MM/DD'));
                
                scope.mainObj.publication_time_end =  sForm.parseDateTime(moment(data.publication_time_end).format('YYYY/MM/DD HH:mm'));
             
                await scope.getSubcategories();

                setTimeout(() => {
                    
                    scope.mainObj.sub_category_id = data.sub_category_id;

                }, 200);
            }

            switch (type) {
                
                case 0:
                    
                    scope.titleModal = 'Nueva Evento';

                    sModal.open('modal-form');
                    
                    break;

                case 1:
                
                    scope.titleModal = 'Editar Evento';
                    
                    scope.mainObj.image = 'empty';

                    scope.default_image = scope.path + data.background_image;
                    
                    sModal.open('modal-form');
                    break;
                case 2:
                    sModal.question('¿Desea eliminar este Evento de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar este Evento de la lista?', scope.restoreEvent);
                    break;
            }

        }
        
        let typeEvent = async () => {

            let query = await fCrud.getdata('event_type');

            scope.eventTypeList = query.success ? query.info : [];

        }
  
        scope.setDate = (dateToFormat) => {
            return moment(dateToFormat).format("DD/MM/YYYY HH:mm a");
        };
        
        scope.cleanForm = () => {
            
            scope.errors = null;
            
            scope.mainObj = {};
            
            scope.default_image = null;
            
            scope.forms.formEvent.$setPristine();
        };

        scope.onInit = async () => {

            scope.loading = true;

            await typeEvent();

            await Category();

            ListEvent();
            
            scope.loading = false;
            
            scope.$apply();
            
        };
    },
    templateUrl: './src/views/home/components/app/event/event.html',
    stylesUrl: './src/views/home/components/app/event/event.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sForm',
        'cApi'
    ]
});