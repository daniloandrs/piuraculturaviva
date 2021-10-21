
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'gallery',

    fn: function (scope, sForm, fApi, cApi, sModal, fToast, location, sStorage) {
    
        scope.objectGallery = {};
        
        scope.path = cApi.STORAGE;

        scope.clearForm = () => {

            scope.objectGallery = { 
                
                image : undefined,
                title : null
            }

            scope.default_image = undefined;

        }

        scope.gallery_options = {
            dimentions: {
                width: 240000,
                height: 1800000,
                size:10240000
            }
        };

        scope.openModalGallery = () => {

            scope.create = true;
            
            scope.titleModal = 'Nueva Galeria';

            scope.clearForm();

            sModal.open('modal-form');
        
        }
  
        scope.editImage = (item) => {

            scope.create = false;
            
            scope.clearForm();

            scope.objectGallery = {    
                title : item.title,
                image : '',
                id: item.id
            }

            scope.default_image = scope.path + item.url_image;

            scope.titleModal = 'Editar Galería';

            sModal.open('modal-form');
        }

        let ListGalleries = async () => {

            let res = await fApi.get('gallery_view/get_list');

            scope.listGalleries = res.success ? res.info : [];
            
            let i = 0;
            angular.forEach(scope.listGalleries,item => item.position_key = i++);

            scope.$apply();
  
        }

        let PostImage = (res) => {

            if (res.success) {

                sModal.close('modal-form');
                
                sModal.success(res.message);
                
                ListGalleries();
                
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
                res = await fApi.image('gallery_view/create',scope.objectGallery);
            else
                res = await fApi.image('gallery_view/update',scope.objectGallery);

            PostImage(res);
  
            scope.$apply();

        }

        let PostImageToast = async (res) => {

            if (res.success) {
                    
                scope.loading = true;

                await ListGalleries();
                
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

            sModal.question('¿Seguro que desea eliminar esta Galeria?', async () => {
                
                scope.loading = true;

                let res = await fApi.post('gallery_view/delete',
                    {
                        gallery_id : image.id
                    }  
                );
                
                PostImageToast(res);

            });
        }

        scope.updateOrden = (keys) => {
        
            fApi.post('gallery_view/update_order',keys).then(res =>{
                
                if (res.success) {
                    
                    ListGalleries();

                    fToast.push({ title: 'Éxito', body : res.message , type: 'success' });
                }

            });

        };  

        scope.stopCallback = function(event, ui,item) {
   
            let nueva = scope.listGalleries[item.position_key];
            
            let keys = { previous_position_id : item.id , new_position_id : nueva.id };
            
            if(keys.previous_position_id != keys.new_position_id)
                scope.updateOrden(keys);
            
        };

        scope.manage = (gallery) => {

            sStorage.set('gallery',gallery);

            location.path(`/galeria/detalle`);

        }

        scope.OnInit = async () => {
            
            scope.loading = true;

            await ListGalleries();

            scope.loading = false;

            scope.$apply();

        };
  

    },
    
    templateUrl: './src/views/home/components/app/gallery/gallery.html',
    stylesUrl: './src/views/home/components/app/gallery/gallery.css',
    deps: [
        '$scope',
        'sForm',
        'fApi',
        'cApi',
        'sModal',
        'fToast',
        '$location',
        'sStorage'
    ]
});