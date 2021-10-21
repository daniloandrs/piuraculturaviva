import { dnComponent } from "../../../../../../../dine.js";

export default dnComponent({
    name: 'administrarCuenta',
    fn: function (scope, fApi, sLocal, sStorage, cSession, cApi, sModal,location) {
        /**
     * Mapeo de numeros -> orden
     * 0 : roles
     * 1 : sesiones
     */ 
        scope.visible = true;
        scope.user = sLocal.get('user_change');

        if(!scope.user)
            location.path('administrar_usuarios');

        let UserId = scope.user.id;
        /**
         * List Event : Consulta y guarda elementos principales del controlador
         * Actual: Roles
         */
        scope.ListEvent__roles = () => {
            scope.list_data_modal = [];
            fApi.show('usuario/roles', UserId)
                .then(res => scope.list_data_modal = res.success ? res.info : [])
        };

        scope.ListEvent__sessions = () => {
            scope.list_data_modal = [];
            fApi.show('usuario/tokens', UserId)
                .then(res => scope.list_data_modal = res.success ? res.info : [])
        };

        /**
         * Mapeo de numeros -> orden
         * 0 : especícico
         * 1 : todas
         * 2 : suspender cuenta
         */
        scope.closeEvent = (type, data) => {
            switch (type) {
                case 0:
                    fApi.remove('usuario/token', { token: data.token })
                        .then(res => {
                            if (res.success) sModal.success(res.message);
                            else sModal.warning(res.message);
                        });
                    break;
                case 1:
                    fApi.delete('usuario/sesiones', UserId)
                        .then(res => {
                            if (res.success) sModal.success(res.message);
                            else sModal.warning(res.message);
                        });
                    break;
                case 2:
                    fApi.delete('usuario', UserId)
                        .then(res => {
                            if (res.success){
                                scope.visible = false
                                sModal.success(res.message);
                            }else{
                                sModal.warning(res.message);   
                            } 
                        });
                    break;
            }
        };

        scope.openModal = type => {
            switch (type) {
                case 0:
                    scope.ListEvent__roles();
                    scope.titleModal = 'Asignar roles de usuario';
                    sModal.open('cuenta-roles');
                    break;
                case 1:
                    scope.ListEvent__sessions();
                    scope.titleModal = 'Cerrar todas las sesiones';
                    sModal.open('cuenta-sessions');
                    break;
            }
        };

        scope.changeStateItem = row => {
            fApi.push('usuario/rol', { rol_id: row.id, user_id: UserId })
                .then(res => {
                    let type;
                    if (res.success) {
                        type = 'success';
                    } else type = 'warning';
                    modal.open('cuenta.smallModal', {
                        type: type,
                        content: res.message
                    });
                });
        };

        scope.changePassword = () => {
            scope.main_object = {password:'',password_confirm:''};
            sModal.open('modal-change-password');
        };

        scope.savePassword = () => {

            if(scope.main_object.password != scope.main_object.password_confirm){
                sModal.warning('Las contraseñas no coinciden');
            }else{
                scope.loading_modal = fApi.update('usuario/password',{
                    id: scope.user.id,
                    password: scope.main_object.password
                })
                .then((res)=>{
                    if(res.success){
                        sModal.close('modal-change-password');
                        sModal.success(res.message);
                    }else{
                        sModal.warning(res.message);
                    }
                });
            }
        };

        scope.onInit = () => {
            if (UserId) {
                scope.profile_image = cApi.STORAGE + scope.user.profile_image;
            }
        };
    },
    deps: ['$scope', 'fApi', 'sLocal', 'sStorage', 'cSession', 'cApi', 'sModal', '$location'],
    templateUrl: './src/views/home/components/usuarios/administrar/cuenta/cuenta.html',
    stylesUrl: './src/views/home/components/usuarios/administrar/cuenta/cuenta.css'
});