import {
    dnComponent
} from '../../../../../../dine.js';

export default dnComponent({
    name: 'actualizarDatos',
    fn: function (scope, cApi, sStorage, cSession, fApi, sModal, pTranslate) {

        scope.isClient = sStorage.get(cSession.MENU).nombre === 'Cliente'
        pTranslate.use(scope.isClient ? 'en' : 'sp')
        scope.correos = [];
        
        scope.main_obj = sStorage.get(cSession.USER);
        scope.menu = sStorage.get(cSession.MENU);
        scope.text = {
            no_recovery_email: scope.isClient ? 'Please choose a recovery email' : 'Aún no registrado',
            email_message: scope.isClient ? 'Select emails to receive notifications' : 'Seleccione correos para recepcion de notificaciones',
            email_document: scope.isClient ? 'Select emails to receive document\'s' : 'Seleccione correos para recepcion de notificaciones',
        }

        scope.flats = {
            nick: true,
            password: true,
            email: true
        };
        scope.profile_options = {
            dimentions: {
                width: 400,
                height: 400
            }
        };

        scope.loadImage = () => scope.profile_image = './assets/img/sidebar/profile.png';
        
        let CleanPassword = () => {
            scope.main_obj.password = undefined;
            scope.main_obj.password_new = undefined;
            scope.main_obj.password_confirmation = undefined;
        };

        let PostTransaction = (res, type) => {
            if (res.success) {
                sModal.success(res.message);
                CleanPassword();
                sStorage.set(cSession.USER, scope.main_obj);
                if (type === 'image') {
                    UpdateSessionUser();
                }
            } else sModal.warning(res.message);
        };

        let UpdateSessionUser = () => {
            fApi.getdata('usuario/auth')
                .then(res => {
                    scope.main_obj = res.info;
                    sStorage.set(cSession.USER, scope.main_obj);
                    scope.loadImage();
                });
        };

        scope.updateEvent__custom = type => {
            let custom_data;
            switch (type) {
                case 'nick':
                    custom_data = {
                        id: scope.main_obj.id,
                        nick: scope.main_obj.nick
                    }
                    break;
                case 'password':
                    custom_data = {
                        id: scope.main_obj.id,
                        password: scope.main_obj.password,
                        new_password: scope.main_obj.password_new,
                        password_confirmation: scope.main_obj.password_confirmation
                    }
                    break;
                case 'email':
                    custom_data = {
                        id: scope.main_obj.id,
                        email: scope.main_obj.email
                    }
                    break;
                case 'recovery_email':
                    custom_data = {
                        id: scope.main_obj.id,
                        recovery_email: scope.main_obj.recovery_email
                    }
                    break;
            }
            fApi.update('cuenta/' + type, custom_data)
                .then(res => PostTransaction(res));
        };

        scope.updateEvent__image = () => {
            if (scope.main_obj.imagen_perfil !== undefined) {
                scope.loading_image = fApi.image('cuenta/imagen_perfil', scope.main_obj)
                    .then(res => PostTransaction(res, 'image'));
                console.log(scope.loading_image);
            }
        };

        scope.changeFlat = type => {
            let type_string;
            switch (type) {
                case 0:
                    type_string = 'nick';
                    break;
                case 1:
                    type_string = 'password';
                    break;
                case 2:
                    type_string = 'email';
                    break;
            }
            scope.flats[type_string] = !scope.flats[type_string];
            if (scope.flats[type_string]) {
                if (type === 1) {
                    if (scope.main_obj.password_new === scope.main_obj.password_confirmation) {
                        scope.updateEvent__custom(type_string);
                    } else {
                        if(isClient){
                           sModal.warning('Passwords do not match');
                        }else{
                           sModal.warning('Las contraseñas no coinciden');
                        }
                    }
                } else {
                    scope.updateEvent__custom(type_string);
                }
            } else {
                scope.main_obj = sStorage.get(cSession.USER);
            }
        };

        const ListEvent__emails = () => {
            scope.loading_sync = fApi.getdata('cliente/auth/correos')
                .then(res => scope.list_data__emails = res.info);
        };

        scope.openModal = (index) => {
            
            switch (index) {
                case 1:
                    ListEvent__emails();
                    sModal.open('modal-emails');
                break;
                case 2:
                    ListEvent__emails();
                    sModal.open('modal-emails2');
                break;
                case 3:
                    ListEvent__emails();
                    sModal.open('modal-emails3');
                break;
            }
        };

        scope.changeEmail = () => {

            let flag = false;

            angular.forEach(scope.list_data__emails, (value) => {
                if (value.check) {
                    scope.main_obj.recovery_email = value.email;
                    flag = true;
                }
            });

            if (!flag)
                sModal.warning('Seleccione por lo menos un correo.');

            scope.updateEvent__custom('recovery_email');
            sModal.close('modal-emails');
        };

        scope.selectEmail = (email) => {

            angular.forEach(scope.list_data__emails, (value) => {
                value.check = false;
                if (value.email == email)
                    value.check = true;
            });
        };

        scope.changeEmailNuevo = () => {

            let data = angular.copy(scope.list_data__emails);

            fApi.post('cliente/maestro', data).then(res => {
                if (res.success) {
                    sModal.close('modal-emails2');
                    sModal.success(res.message);
                } else {
                    sModal.warning(res.message);
                }
            });   
        };

        scope.selectEmailNuevo = (item) => {
            angular.forEach(scope.list_data__emails, (value) => {
                if (value.email == item.email){
                    if(value.is_enviar == true)
                        value.is_enviar = false
                    else
                        value.is_enviar = true;
                }

            });
        };

        scope.changeEmailDocumento = () => {

            let data = angular.copy(scope.list_data__emails);

            fApi.post('cliente/documento', data).then(res => {
                if (res.success) {
                    sModal.close('modal-emails3');
                    sModal.success(res.message);
                } else {
                    sModal.warning(res.message);
                }
            });   
        };

        scope.selectEmailDocumento = (item) => {
            angular.forEach(scope.list_data__emails, (value) => {
                if (value.email == item.email){
                    if(value.is_enviar_documento == true)
                        value.is_enviar_documento = false
                    else
                        value.is_enviar_documento = true;
                }

            });
        };

        scope.onInit = () => {
            if (scope.main_obj) {
                scope.loadImage();
            }
        };
    },
    templateUrl: './src/views/home/components/app/actualizar-datos/actualizar-datos.html',
    stylesUrl: './src/views/home/components/app/actualizar-datos/actualizar-datos.css',
    deps: [
        '$scope',
        'cApi',
        'sStorage',
        'cSession',
        'fApi',
        'sModal',
        'pTranslate'
    ]
});