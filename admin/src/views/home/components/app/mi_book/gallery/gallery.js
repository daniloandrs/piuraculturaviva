
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'galleryBook',

    fn: function (scope, fApi, fCrud, sModal, sFirebase, Dropzone) {
        
       
        scope.routeDropzone = fApi.routeDropzone(`gallery/add`);

        scope.files       = {};
        scope.mainObj     = {};
        scope.formGallery = {};
        scope.objectItem  = {};
        scope.path = './api/storage/app/';
        scope.formEdit = {};

        let createDropzone = () => {

            if (document.getElementById('myGalleryBook')) {
            
                scope.dropzone = Dropzone.configDropzone('myGalleryBook',scope.routeDropzone,'files');
            
            }
        }   

        scope.editImage = (image) => {
            
            scope.objectItem.gallery_id = image.id;

            scope.default_image = scope.path + image.src;

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
                libro_id : scope.post.id
            };

            scope.clearImages();

            scope.images = angular.copy(scope.post.gallery);
            
            angular.forEach(scope.images,function(value,key){

                var lenghtName = value.src.length;
                var storage = './api/storage/app/';
                var mockFile = { 
                    name: value.src, 
                    size: 41690,
                    accepted:true,
                    type: 'image/'+ value.src.substr(lenghtName-3,lenghtName),
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

                scope.dropzone.emit("thumbnail", mockFile, storage + value.src + '?' + (new Date()).getTime());
                
                scope.dropzone.emit("complete",mockFile);
                
                scope.dropzone.files.push(mockFile);
                
                if(scope.dropzone.files.length > 20) {
                    scope.dropzone.emit("maxfilesexceeded",mockFile);
                } 

            });
            
            scope.dropzone.on('sendingmultiple',function(file, response,formData){

                formData.append('libro_id',scope.galleryFormData.libro_id);
            });

            
            scope.dropzone.on('addedfile',function(file){
                scope.files = file;
            });

            scope.dropzone.on("processing", function(file,operation) {
                this.options.url = scope.routeDropzone;
            });

            scope.dropzone.on('successmultiple',async function(file,response){
            
                if(response.success) {
                
                    sModal.success(response.message);
                    
                    sModal.close('modal-base-form');

                    await Post();

                    scope.flagImages = false;
                    
                    scope.spin_gallery = false;
                        
                    
                }  else {

                    sModal.error('Algo ha salido mal :c .');

                    scope.spin_gallery = false;
                }
            });

            scope.dropzone.on("dictCancelUpload", function(file) {
                
                console.log(file);
                
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

                await Post();
                
                scope.loading = false;

                scope.$apply();

            } else {

               sModal.error(res.errors);
                
                scope.spin = false;

            }
 
        };

        scope.sendDataEventUpdate = async () => {
            
            scope.spin = true;
            
            let query = await fApi.image('gallery/update',scope.objectItem);
                
            PostTransaction(query);
        };
 
        scope.deleteImage = (image) => { 

            sModal.question('¿Seguro que desea eliminar esta imagen?', async () => {
                
                let query = await fApi.post('gallery/delete',
                    {
                        gallery_id :image.id
                    }
                );

                PostTransaction(query);

            });
        };

        let Post = async () => {

            let post = {
                key_post : 'my_book'
            }

            let query = await fApi.post('libro/get_libro',post);

            scope.post = query.success ? query.info : [];

            scope.$apply();
        }

        scope.onInit = async () => {
            
            scope.loading = true;

            await Post();

            scope.loading = false;

            scope.$apply();

            setTimeout(() => {

                createDropzone();
                
                scope.loadDropzone();


            },100);
        
        };
    
    },
    
    templateUrl: './src/views/home/components/app/mi_book/gallery/gallery.html',
    
    stylesUrl: './src/views/home/components/app/mi_book/gallery/gallery.css',
    
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sFirebase',
        'helperDropzone'
    ]
});