
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({

    name: 'businessAbout',
    
    fn: function (scope, cApi, sStorage, cSession, fApi, sModal, pTranslate,fCrud, fToast) {

        scope.path = cApi.STORAGE;

        scope.main_obj  = {}

        scope.objectAliado = {};

        scope.forms = {
            formPost : null,
            formAliado : null
        };

        var quill;

        var toolbarOptions = [

            ['bold', 'italic', 'underline', 'strike'],

            ['blockquote', 'code-block'],

            [{'header': 1}, { 'header': 2}],

            [{'list': 'ordered'}, {'list': 'bullet'}],

            [{ 'script': 'sub'}, {'script': 'super'}],
            
            [{'indent': '-1'}, {'indent': '+1'}],
            
            [{ 'direction': 'rtl'}],

            [{ 'size': ['small', false, 'large', 'huge'] }], 

            [{
                'header': [1, 2, 3, 4, 5, 6, false]
            }],

            ['link', 'image', 'video', 'formula'],

            [{
                'color': []
            }, {
                'background': []
            }],
            [{
                'font': []
            }],
            [{ 'align': 'left'}, { 'align': 'center'}, {'align': 'right'}],

            ['clean']
        ];
        
        scope.openModal = (option) => {

            scope.option = option;

            switch (option) {

                case 'about':
                    
                    scope.titleModal = '¿Quiénes Somos?';

                    quill.root.innerHTML = scope.mainObj.about_us;

                    break;

                case 'mision':

                    scope.titleModal = 'Misión';
                    
                    quill.root.innerHTML = scope.mainObj.mission;
                    
                    break;
                
                case 'vision' :

                    scope.titleModal = 'Visión';

                    quill.root.innerHTML = scope.mainObj.vision;

                    break;
            
            }

            sModal.open('modal-form');
        };

        let PostTransaction = (res) => {
            if (res.success) {
                
                scope.empresa();
                
                scope.spin_form = false;
            
                sModal.close('modal-form');
                
                sModal.success(res.message);
                
                
            } else  {
                scope.spin_form = false;
                
                sModal.warning(res.message)
            };
        };

    
        scope.saveData = async () => {
            
            scope.spin_form = true;

            if (scope.option == 'about')
                scope.mainObj.about_us = quill.root.innerHTML;

            if (scope.option == 'mision')
                scope.mainObj.mission = quill.root.innerHTML;
            
            if (scope.option == 'vision')  
                scope.mainObj.vision = quill.root.innerHTML;
            
            let res = await fApi.update(`business`, scope.mainObj);

            PostTransaction(res);

            
            scope.$apply();
        };  

        scope.gallery_options = {
            dimentions: {
                width: 240000,
                height: 1800000,
                size:10240000
            }
        };

        scope.openModalAllies = () => {

            scope.create = true;
            
            scope.titleModal = 'Nueva Aliado';

            scope.clearForm();

            sModal.open('modal-aliado');
        
        }
        
        scope.clearForm = () => {

            scope.objectAlido = { 
                
                logo : undefined,
                name : null
            };

            scope.default_image = undefined;

        }

        let PostImage = (res) => {

            if (res.success) {

                sModal.close('modal-aliado');
                
                sModal.success(res.message);
                
                getAliados();
                
                scope.spin_form = false;

            } else {

                scope.spin_form = false;

                sModal.error(res.error);

            }
        }

        scope.sendAliado = async () => {
            
            let res;

            scope.spin_form = true;

            scope.objectAliado.business_id = scope.mainObj.id;

            if (scope.create)
                res = await fApi.image('business_allies/create',scope.objectAliado);
            else
                res = await fApi.image('business_allies/update',scope.objectAliado);

            PostImage(res);
  
            scope.$apply();
        };

        let PostImageToast = async (res) => {

            if (res.success) {
                    
                scope.loading = true;

                await getAliados();
                
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

            sModal.question('¿Seguro que desea eliminar este aliado?', async () => {
                
                scope.loading = true;

                let res = await fApi.post('business_allies/delete',
                    {
                        allies_id : image.id
                    }  
                );
                
                PostImageToast(res);

            });
        }

        scope.editImage = (item) => {

            scope.create = false;
            
            scope.clearForm();

            scope.objectAliado = {    
                name : item.name,
                url  : item.url,
                id : item.id,
                logo : '',
            }

            scope.default_image = scope.path + item.logo;

            scope.titleModal = 'Editar Aliado';

            sModal.open('modal-aliado');
        }

        let getAliados = async () => {

            scope.listAliados = [];

            let res = await fApi.get('business_allies/get_list');

            scope.listAliados = res.success ? res.info : [];

            scope.$apply();

        };

        scope.empresa = () => {

            fApi.get('business').then(res => {
                
                scope.mainObj = res.success ? res.info : {};
                
            })
                
        };  

        scope.onInit = async () => {

            scope.empresa();

            await getAliados();

            setTimeout(() => {
                quill = new Quill('#editor', {
                    theme: 'snow',
                    modules: {
                        toolbar: toolbarOptions,
                        imageResize: {
                            displaySize: true
                        }
                    },
                });
            }, 100);

        };
    },

    templateUrl: './src/views/home/components/app/business/business_about/business_about.html',
    stylesUrl: './src/views/home/components/app/business/business_about/business_about.css',
    deps: [
        '$scope',
        'cApi',
        'sStorage',
        'cSession',
        'fApi',
        'sModal',
        'pTranslate',
        'fCrud',
        'fToast',
    ]
});