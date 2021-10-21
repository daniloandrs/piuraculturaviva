
import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({

    name: 'business',
    
    fn: function (scope, cApi, sStorage, cSession, fApi, sModal, pTranslate,fCrud) {

        scope.path = cApi.STORAGE;
        
        scope.correos = [];
        
        scope.forms = {
            form_correos : null,
            form_telefono : null,
            form_redes : null
        };

        scope.main_obj  = {}

        scope.flats = {
            pagina_web   : true,
            razon_social : true,
            direccion    : true
        };

        scope.profile_options = {
            dimentions: {
                width: 1920,
                height: 886
            }
        };

        scope.loadImage = () => scope.profile_image = './assets/img/sidebar/profile.png';


        let PostTransaction = (res) => {
            if (res.success) {
                sModal.success(res.message);
               scope.empresa();
            } else sModal.warning(res.message);
        };

        scope.edit_event = (type) => {
        
            switch (type) {
                
                case 'razon_social':
                    scope.flats.razon_social = false;
                    break;
                
                case 'pagina_web':
                    scope.flats.pagina_web = false;
                    break;

                case 'direccion':
                    scope.flats.direccion = false;
                    break;
            }
        }

        scope.save_event = (type) => {
            
            let custom_data;

            switch (type) {
 
                case 'razon_social':
                    scope.flats.razon_social = true;
                    custom_data = { id: scope.mainObj.id ,business_name : scope.mainObj.business_name }
                    break;

                case 'pagina_web':
                    scope.flats.pagina_web = true;
                    custom_data = { id: scope.mainObj.id ,web_site : scope.mainObj.web_site }
                    break;

                case 'direccion':
                    scope.flats.direccion = true;
                    custom_data = { id: scope.mainObj.id ,direction : scope.mainObj.direction }
                    break;
            }
 
            fApi.update('business',custom_data).then(res => PostTransaction(res));
        };


        let PostTransactionLogo = (res,type) => {
            if (res.success) {
                sModal.success(res.message);
                scope.empresa();
                if (type === 'image') {
                    scope.main_obj = {
                        logo : null
                    }
                    scope.profile_image = scope.path + scope.mainObj.logos[0].image;
                }
            } else sModal.warning(res.message);
        }; 

        scope.updateEvent__image = () => {
            if (scope.main_obj.logo !== undefined) {
                scope.main_obj.business_id = scope.mainObj.id;
                scope.loading_image = fApi.image('business/logo', scope.main_obj)
                    .then(res => PostTransactionLogo(res, 'image'));
            }
        };

        const ListEvent__ = (data) => {
           fApi.show('business/manage',data.key)
                .then(res => scope.list_data__ = res.info);
        };


        scope.openModal = (index) => {
             
            switch (index) {
                case 1:
                    scope.key = {key:'phone'};
                    ListEvent__(scope.key);
                    sModal.open('modal-telefonos');
                break;
                case 2:
                    scope.key = {key:'email'};
                    ListEvent__(scope.key);
                    sModal.open('modal-correos');
                break;
                case 3:
                    scope.key = {key:'social_networks'};
                    ListEvent__(scope.key);
                    sModal.open('modal-redes-sociales');
                break;
            }
        };


        scope.empresa = () => {
            fApi.get('business').then(res => {
                scope.mainObj = res.success ? res.info : {} ;
                scope.logos   = scope.mainObj.logos;
                scope.profile_image =  scope.logos.length > 0 ? scope.path + scope.logos[0].image : './assets/img/sidebar/profile.png';
            })
                
        };  

 
        let PostTransactionTelefono = res => {
            
            if (res.success) {
                sModal.success(res.message);
                scope.flat.edit_telefono = false;
                scope.title_button_telefon = 'Crear';

                scope.forms.form_telefono.$setPristine();
                scope.forms.form_correos.$setPristine();
                scope.forms.form_redes.$setPristine();
                
                ListEvent__(scope.key);
                scope.object_ = {}
            } else {
                if (res.errors){ 
                    scope.errors = res.errors;
                    angular.forEach(scope.errors, function (value, key) {
                        sModal.error(value);
                    });
                }
                if (res.message) {
                    sModal.error(res.message);
                }
            }
        };
        scope.flat = {};

        scope.flat.edit_telefono = false;
        scope.title_button_telefon = 'Crear';
        
        scope.editTelefono = item => {
            scope.object_ = angular.copy(item);
            scope.flat.edit_telefono = true; 
            scope.title_button_telefon = 'Editar';
        };

        scope.object_ = {};

        scope.addOrUpdateTelefono = model => {
            scope.object_.business_id = scope.mainObj.id;
            let operation = (scope.object_.id == null) ? 'create' : 'update';
            fCrud.executeCreateOrUpdate(model,scope.object_,operation,PostTransactionTelefono)
        };

        scope.deleteTelefono = (model,item) => {
            fCrud.executeDelete(model, item.id, PostTransactionTelefono);
            
        };

        scope.onInit = () => {
            scope.empresa();
        };
    },
    templateUrl: './src/views/home/components/app/business/business.html',
    stylesUrl: './src/views/home/components/app/business/business.css',
    deps: [
        '$scope',
        'cApi',
        'sStorage',
        'cSession',
        'fApi',
        'sModal',
        'pTranslate',
        'fCrud'
    ]
});