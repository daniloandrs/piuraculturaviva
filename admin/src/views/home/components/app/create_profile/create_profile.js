
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'createProfile',

    fn: function (scope, fApi, fCrud, sModal, sStorage, sEditor, location, Dropzone, cApi) {
    
        scope.tabselector;
        scope.path = cApi.STORAGE;

        scope.memberTmp     = {};
        scope.member        = {};
        scope.objectItem    = {};

        var toolbarOptions = sEditor.getConfig();
        
        var quill = new Quill('#editor', {  
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                imageResize: {
                    displaySize: true
                }
            },
        });  

        let Member = async () => {
              
            scope.memberTmp = sStorage.get('member');

            if (scope.memberTmp) 
                sStorage.remove('member');

            if(scope.memberTmp == undefined)
                location.path('repositorio_cultural');
            else 
                await getMember(scope.memberTmp.id);

        }

        let setTabs = () => {

            quill.root.innerHTML = scope.member.about;

            scope.ObjectInfo = {
                    
                address : scope.member.address,
                email   : scope.member.email,
                phone   : scope.member.phone,
                website : scope.member.website,
                facebook : scope.member.facebook,
                youtube : scope.member.youtube,
                instagram : scope.member.instagram
            }
        }

        let getMember = async (member_id) => {

            let query = await fApi.post('member/my_profile',{member_id : member_id});

            scope.member = query.success ? query.info : {};
            
            setTabs();

            scope.$apply();
        }


        /*** TAB about  */

        scope.saveAbout = async () => {

            scope.about = quill.root.innerHTML;
 
            scope.spin_about = true;

            let res = await fApi.post('member/save_about',{about : scope.about, member_id : scope.memberTmp.id });

            if (res.success) {

                await getMember(scope.memberTmp.id);

                scope.spin_about = false;

                sModal.success(res.message);
            
            } else {
                sModal.error(res.error);
            }
            
        }



        /** Tab  comentarios */
   
        let modelComments = 'repository_cultural';

        let getComments = async () => {

            let query = await fApi.get(`comment/get_comments/${modelComments}/${scope.member.id}`);

            scope.listComments = query.success ? query.info : [];
            
            scope.$apply();
        }

        let PostTransactionComment = async (res) => {
            if (res.success) {
                sModal.success(res.message);
                
               await getComments();
            } else {
                if (res.errors) scope.errors = res.errors;
            
                if (res.message) sModal.error(res.message);
            }  
        };  
        
        scope.approvedComment = async (comment) => {

            comment.spinner = true;
   
            comment.status = true;

            let query  = await fApi.post('comment/approved', comment);

            PostTransactionComment(query);

            comment.spinner = false;
            
        } 

        scope.notApprovedComment = async (comment) => {

            comment.spinner = true;

            await sFirebase.collection(CONFIG.firebaseCollection)
                        .doc(comment.documentID)
                        .update({
                            isApproved : false 
                        });

            comment.spinner = false;

            await ListComments();

            sModal.success('Comentario esperando aprobación.');

        }

        scope.deleteComment = async (comment) => {

            comment.spinner_delete = true;

            await sFirebase.collection(CONFIG.firebaseCollection)
                        .doc(comment.documentID)
                        .delete();

            comment.spinner_delete = false;

            await ListComments();

            sModal.success('Comentario eliminado correctamente.');

        }
               
        /** TAB GALERIA */
        
        scope.description = {};

        scope.routeDropzone = fApi.routeDropzone(`photo/create_gallery`);
        
        let createDropzone = () => {

            if (document.getElementById('myGalleryBook')) {
            
                scope.dropzone = Dropzone.configDropzone('myGalleryBook',scope.routeDropzone,'files');
                
            }
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
                member_id : scope.member.id
            };

            scope.clearImages();

            scope.images = angular.copy(scope.member.photos);
            
            console.log(scope.member);

            angular.forEach(scope.images,function(value,key){
                var lenghtName = value.url.length;
                var storage = './api/storage/app/';
                var mockFile = { 
                    name: value.url, 
                    size: 41690,
                    accepted:true,
                    type: 'image/'+ value.url.substr(lenghtName-3,lenghtName),
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

                scope.dropzone.emit("thumbnail", mockFile, storage + value.url + '?' + (new Date()).getTime());
                
                scope.dropzone.emit("complete",mockFile);
                
                scope.dropzone.files.push(mockFile);
                
                if(scope.dropzone.files.length > 20) {
                    scope.dropzone.emit("maxfilesexceeded",mockFile);
                } 

            });
            
            scope.dropzone.on('sendingmultiple',function(file, response,formData){

                formData.append('member_id',scope.memberTmp.id);

                formData.append('description',scope.description.name);

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

                    await  getMember(scope.memberTmp.id);

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

        scope.sendDataEventUpdate = async () => {

            scope.spin = true;

            let query = await fApi.image('photo/update_image',scope.objectItem);
            
            PostTransaction(query);

        };

        let PostTransaction = async res => {
            
            if (res.success) {
                scope.spin = false;
                sModal.close('modal-edit-form');
                sModal.success(res.message);
                scope.loading = true;
                await getMember(scope.memberTmp.id);
                scope.loading = false;
                scope.$apply();
            } else {
               sModal.error(res.errors);
                scope.spin = false;
            }
 
        };


        scope.editImage = (image) => {
            
            scope.objectItem.photo_id = image.id;

            scope.objectItem.image = undefined;

            scope.objectItem.description = image.description;
            
            scope.default_image = scope.path + image.url;

            scope.title = 'Cambiar Imagen';

            sModal.open('modal-edit-form');
        }

        scope.deleteImage = (image) => { 

            sModal.question('¿Seguro que desea eliminar esta imagen?', async () => {
                
                let query = await fApi.post('photo/delete_image',
                    {
                        photo_id :image.id
                    }
                );

                PostTransaction(query);

            });
        };

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


        /** Tab Datos */

        scope.saveInfo = async () => {

            scope.spin_info = true;

            scope.ObjectInfo.member_id = scope.memberTmp.id;

            let res = await fApi.post('member/save_info',scope.ObjectInfo);
            
            if (res.success) {

                await getMember(scope.memberTmp.id);

                scope.spin_info = false;

                sModal.success(res.message);
                
                scope.$apply();
            }
        };

        /** OnInit */


        scope.onInit = async () => {

            scope.loading = true;

            await Member();

            scope.tabselector = 'firsttab';

            setTimeout(() => {

                createDropzone();
                
                scope.loadDropzone();

            },100);

            await getComments();

            scope.loading = false;
            
            scope.$apply();

        };   
    },  

    templateUrl: './src/views/home/components/app/create_profile/create_profile.html',
    stylesUrl: './src/views/home/components/app/create_profile/create_profile.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sStorage',
        'sEditor',
        '$location',
        'helperDropzone',
        'cApi'
    ]
});