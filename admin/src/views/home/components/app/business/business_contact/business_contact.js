
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({

    name: 'businessContact',
    
    fn: function (scope, cApi, sStorage, cSession, fApi, sModal, pTranslate,fCrud) {

        scope.path = cApi.STORAGE;

        scope.main_obj  = {}

        scope.flats = {
            pagina_web   : true,
            razon_social : true,
            direccion    : true
        };

        scope.profile_options = {
            dimentions: {
                width: 900000,
                height: 900000,
                size: 5002400
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
                    custom_data = { id: scope.mainObj.id ,contact_title : scope.mainObj.contact_title }
                    break;
                case 'direccion':
                    scope.flats.direccion = true;
                    custom_data = { id: scope.mainObj.id ,contact_description : scope.mainObj.contact_description }
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
                        contact_background_image : null,
                        contact_background_image_mobile : null,
                    }
                    
                }
            } else sModal.warning(res.message);
        }; 
  
        scope.updateEvent__image = (key_column) => {

            if(key_column == 'desktop') {  

                if (scope.main_obj.contact_background_image !== undefined) {

                    scope.main_obj.key = key_column;
                    scope.main_obj.id  = scope.mainObj.id

                    scope.loading_image = fApi.image('business/contact_image', scope.main_obj)
                                            .then(res => PostTransactionLogo(res, 'image'));
                    
                }   

            } 

            if (key_column == 'mobile') {

                if (scope.main_obj.contact_background_image_mobile !== undefined) { 
                
                    scope.main_obj.key = key_column;
                    scope.main_obj.id  = scope.mainObj.id

                    scope.loading_image_mobile = fApi.image('business/contact_image', scope.main_obj)
                    .then(res => PostTransactionLogo(res, 'image'));
                }
            }

            
            
        };


        scope.empresa = () => {
            fApi.get('business').then(res => {
                scope.mainObj = res.success ? res.info : {} ;
                scope.profile_image =  scope.mainObj.contact_background_image ? scope.path + scope.mainObj.contact_background_image : './assets/img/sidebar/profile.png';
                scope.profile_image_mobile =  scope.mainObj.contact_background_image_mobile ? scope.path + scope.mainObj.contact_background_image_mobile : './assets/img/sidebar/profile.png';
            
            })
                
        };  

        scope.flat = {};

        scope.onInit = () => {
            scope.empresa();
        };
    },
    templateUrl: './src/views/home/components/app/business/business_contact/business_contact.html',
    stylesUrl: './src/views/home/components/app/business/business_contact/business_contact.css',
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