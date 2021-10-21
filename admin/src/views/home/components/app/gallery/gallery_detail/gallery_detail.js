
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'galleryDetail',

    fn: function (scope, fApi, fCrud, sModal, Dropzone, location, sStorage) {
        
       
        scope.routeDropzone = fApi.routeDropzone(`gallery_detail/create_gallery`);

        scope.files       = {};  
        scope.mainObj     = {};
        scope.formGallery = {};
        scope.objectItem  = {};
        scope.galleryTmp  = {};

        scope.path = './api/storage/app/';
        scope.formEdit = {};

        let createDropzone = () => {

            if (document.getElementById('myGalleryBook')) {
            
                scope.dropzone = Dropzone.configDropzone('myGalleryBook',scope.routeDropzone,'files');
            
            }
        }   

        scope.editImage = (image) => {
            
            scope.objectItem.gallery_id = image.id;
            
            scope.default_image = scope.path + image.url_image;

            scope.title = 'Cambiar Imagen';

            sModal.open('modal-edit-form');
        }

        
        scope.clearImages = function () {

            scope.flagImages = false;
            
            scope.dropzone.removeAllFiles(); 
            
            scope.imagesDeletes = [];
        
        }

        scope.openModalDropzone = () => {

            sModal.open('modal-base-form');
            
            scope.clearImages();
        }

        scope.loadDropzone = () => {

            scope.galleryFormData = {
                gallery_id : scope.galleryTmp.id
            };

            scope.clearImages();

            scope.images = angular.copy(scope.photos);
            
            angular.forEach(scope.images,function(value,key){

                var lenghtName = value.url_image.length;
                var storage = './api/storage/app/';
                var mockFile = { 
                    name: value.url_image, 
                    size: 41690,
                    accepted:true,
                    type: 'image/'+ value.url_image.substr(lenghtName-3,lenghtName),
                    status: Dropzone.ADDED,
                    upload:{
                        bytesSent : 43404,
                        progress : 100,
                        total : 41690
                    },
                    height : 1500,
                    width: 2000 
                };  

                scope.dropzone.emit("addedfile", mockFile);

                scope.dropzone.emit("thumbnail", mockFile, storage + value.url_image + '?' + (new Date()).getTime());
                
                scope.dropzone.emit("complete",mockFile);
                
                scope.dropzone.files.push(mockFile);
                
                if(scope.dropzone.files.length > 20) {
                    scope.dropzone.emit("maxfilesexceeded",mockFile);
                } 

            });
            
            scope.dropzone.on('sendingmultiple',function(file, response,formData){

                formData.append('gallery_id',scope.galleryFormData.gallery_id);
            });

            
            scope.dropzone.on('addedfile',function(file){
                scope.files = file;
            });

            scope.dropzone.on("processing", function(file,operation) {
                this.options.url = scope.routeDropzone;
            });

            scope.dropzone.on('successmultiple',async function(file,response){
            
                if(response.success) {
                
                    sModal.close('modal-base-form');

                    sModal.success(response.message);
                    
                    await getPhotos(scope.galleryTmp.id);

                    scope.flagImages = false;
                    
                    scope.spin_gallery = false;
                        
                    
                }  else {

                    sModal.error('Algo ha salido mal :c .');

                    scope.spin_gallery = false;
                }
            });

            scope.dropzone.on("dictCancelUpload", function(file) {
                
                scope.loadDeleteImage(file.name);
            });

            scope.dropzone.on("maxfilesexceeded", function(file) {
                this.removeFile(file); 
            });
            
            scope.loadDeleteImage = function(name){
                angular.forEach(scope.images,function(value){
                    if(value.src == name)
                        scope.imagesDeletes.push(value.id);
                });
            };

        }

        scope.sendDataEvent = () => {

            if(scope.dropzone.getQueuedFiles().length > 0) {

                scope.spin_gallery = true;

                scope.dropzone.processQueue();
            
            } else {
               return sModal.error('No hay imágenes para subir.');
            }

            if(scope.imagesDeletes.length > 0 ) {
                
                var jsonUpdateImages = {
                    deletes: scope.imagesDeletes
                };

                fApi.post('gallery/delete',jsonUpdateImages)
                .then(res => {
                    !res.success ?  sModal.error(res.message) : '';
                });
            }
        }

        let PostTransaction = async res => {
            
            if (res.success) {
                
                scope.spin = false;
                
                sModal.close('modal-edit-form');

                sModal.success(res.message);
                
                scope.loading = true;

                await getPhotos(scope.galleryTmp.id);
                
                scope.loading = false;

                scope.$apply();

            } else {

               sModal.error(res.errors);
                
                scope.spin = false;

            }
 
        };

        scope.sendDataEventUpdate = async () => {
            
            scope.spin = true;
            
            let query = await fApi.image('gallery_detail/update',scope.objectItem);
                
            PostTransaction(query);
        };
 
        scope.deleteImage = (image) => { 

            sModal.question('¿Seguro que desea eliminar esta imagen?', async () => {
                
                let query = await fApi.post('gallery_detail/delete',
                    {
                        gallery_id :image.id
                    }
                );  

                PostTransaction(query);

            });
        };

        let getPhotos = async (gallery_id) => {

            let query = await fApi.post('gallery_detail/get_list',{gallery_id : gallery_id});

            scope.photos = query.success ? query.info : {};

            scope.$apply();
        }

        let Photos = async () => {

            scope.galleryTmp = sStorage.get('gallery');

            console.log(scope.galleryTmp);
            if (scope.galleryTmp) 
                sStorage.remove('gallery');

            if(scope.galleryTmp == undefined)
                location.path('galeria');
            else 
                await getPhotos(scope.galleryTmp.id);
        }

        scope.onInit = async () => {
            
            scope.loading = true;

            await Photos();

            scope.loading = false;

            scope.$apply();

            setTimeout(() => {

                createDropzone();
                
                scope.loadDropzone();

            },100);
        
        };
    
    },
    
    templateUrl: './src/views/home/components/app/gallery/gallery_detail/gallery_detail.html',
    
    stylesUrl: './src/views/home/components/app/gallery/gallery_detail/gallery_detail.css',
    
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'helperDropzone',
        '$location',
        'sStorage'
    ]
});