  
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'virtualTours',

    fn: function (scope, sForm, fApi, cApi, sModal, fToast, location, sStorage,fCrud) {
    
        var model = 'virtual_tours';

        scope.objectData = {};
        
        scope.forms = {
            formData : null
        }

        scope.path = cApi.STORAGE;

        scope.clearForm = () => {

            scope.objectData = { 
                image : undefined,
                title : null,
                url   : null,
            }

            scope.forms.formData.$setPristine();

            scope.default_image = undefined;

        }

        scope.gallery_options = {
            dimentions: {
                width: 240000,
                height: 1800000,
                size:10240000
            }
        };

        scope.openModal = () => {

            scope.create = true;
            
            scope.titleModal = 'Nueva Recorrido Virtual';

            scope.clearForm();

            sModal.open('modal-base-form');
        
        }
  
        scope.editImage = (item) => {

            scope.create = false;
            
            scope.clearForm();

            scope.objectData = {    
                title : item.title,
                url   : item.url,
                image : '',
                id: item.id
            }

            scope.default_image = scope.path + item.background_image;

            scope.titleModal = 'Editar Recorrido Virtual';

            sModal.open('modal-base-form');
        }

        let ListVirtualTours = async () => {

            let res = await fCrud.getdata(model);

            scope.listVirtualTours = res.success ? res.info : [];

            scope.$apply();
  
        }

        let PostTransaction = (res) => {

            if (res.success) {

                sModal.close('modal-base-form');
                
                sModal.success(res.message);
                
                ListVirtualTours();
                
                scope.spin_form = false;

            } else {

                scope.spin_form = false;

                sModal.error(res.error);

            }
        }

        scope.sendDataEvent = async () => {

            let res;

            scope.spin_form = true;

            if (scope.create)
                res = await fApi.image('virtual_tours/create',scope.objectData);
            else
                res = await fApi.image('virtual_tours/update',scope.objectData);

            PostTransaction(res);
  
            scope.$apply();

        }

        let PostToast = async (res) => {

            if (res.success) {
                    
                scope.loading = true;

                await ListVirtualTours();
                
                fToast.push({ title: 'Éxito', body : res.message , type: 'success' });
                
                scope.loading = false;

                scope.$apply();
            
            } else {   
                
                fToast.push({ title: 'Error', body : res.error , type: 'error' });
                
                scope.loading = false;

                scope.$apply();
            }
        }

        scope.deleteImage = (image) => {

            sModal.question('¿Seguro que desea eliminar esta Recorrido Virtual?', async () => {
                
                scope.loading = true;

                let res = await fApi.post('virtual_tours/delete',
                    {
                        virtual_tours_id : image.id
                    }  
                );
                
                PostToast(res);

            });
        }

        scope.OnInit = async () => {
            
            scope.loading = true;

            await ListVirtualTours();

            scope.loading = false;

            scope.$apply();

        };
  
    },
    
    templateUrl: './src/views/home/components/app/virtual_tours/virtual_tours.html',
    stylesUrl: './src/views/home/components/app/virtual_tours/virtual_tours.css',
    deps: [
        '$scope',
        'sForm',
        'fApi',
        'cApi',
        'sModal',
        'fToast',
        '$location',
        'sStorage',
        'fCrud'
    ]
});