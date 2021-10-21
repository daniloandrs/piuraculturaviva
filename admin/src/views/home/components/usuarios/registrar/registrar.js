import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({
    name: 'registrarUsuarios',
    fn: function (scope, fApi, sModal, fCrud, WizardHandler) {
        
        let Model = 'cuenta';

        scope.formUsuario = null;

        scope.main_obj = {};
        scope.bandera = false;
        
        scope.spin = false;

        let ListEvent__roles = async () => {
              
            scope.list_roles = [];
            
            let res = await fApi.getdata('auth/roles');

            scope.list_roles = res.success ? res.info : [];

        };   

        scope.addEvent = async () => {

            let res = await fApi.create(Model, scope.main_obj);

            if (res.success) {
                scope.bandera = false;
                scope.spin = false;
                sModal.success(res.message);
                scope.cancelEvent();
            } else {
                if (res.errors) {
                    scope.errors = res.errors;
                    let errorsString = '\n';
                    angular.forEach(scope.errors, function (value, key) {
                        errorsString += ` ${value} <br>`;
                    });
                    sModal.error(errorsString);
                    scope.spin = false;
                }
                if (res.message) {
                    sModal.error(res.message);
                    scope.spin = false;
                }
            }  
        };

        scope.see = () => {
            let item
            if(scope.main_obj.rol_id != null){
                item = scope.list_roles.find(i => i.id == scope.main_obj.rol_id)
                if(item.nick = 'cliente'){
                    scope.bandera = true;
                }   
            }
        }

        scope.verify = () => {

            if (scope.main_obj.password !== scope.main_obj.password_confirmation) 
                return sModal.warning('Las contraseñas no coinciden');
            
            scope.spin = true;

            scope.addEvent();
              
        };

        scope.cancelEvent = () => {

            scope.main_obj = {};

            scope.formUsuario?.$setPristine()
            WizardHandler.wizard().reset();
        
        };

        scope.onInit = () => {
            ListEvent__roles();
        };
    },
    templateUrl: './src/views/home/components/usuarios/registrar/registrar.html',
    stylesUrl: './src/views/home/components/usuarios/registrar/registrar.css',
    deps: [
        '$scope', 
        'fApi', 
        'sModal',
        'fCrud',
        'WizardHandler'

    ]
});