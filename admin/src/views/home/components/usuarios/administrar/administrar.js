import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({
    name: 'administrarUsuarios',
    fn: function (scope, fApi, fCrud, sLocal, location, sModal, WizardHandler) {

        let Model = 'user';
        scope.normal_view = true;

        scope.normal_view = true;

        scope.userObject = {};

        scope.modal = {};

        let ListEvent = () => {
            scope.list_data = [];
            fApi.getdata('auth/users')
                .then(res => scope.list_data = res.success ? res.info : [])
                .then(() => ListEvent__roles());
        };

        let ListEvent__roles = () => {
            scope.list_roles = [];
            fApi.getdata('auth/roles')
                .then(res => scope.list_roles = res.success ? res.info : [])
        };

        let ListEvent__unavailable = () => {
            fApi.trashed('auth/users')
                .then(res => scope.list_data = res.success ? res.info : [])
        };

        let ListEvent__users = () => {
            fCrud.showdata('rol', scope.role.id)
                .then(res => scope.list_data = res.success ? res.info.users : [])
        };

        let PostTransactionUnavailable = res => {
            if (res.success) {
                sModal.success(res.message);
                ListEvent__unavailable();
            } else sModal.warning(res.message);
        };

        scope.restoreEvent = () => {
            fCrud.executeRestore(Model, scope.main_obj.id, PostTransactionUnavailable);
        };

        scope.toggleView = () => {
            scope.normal_view = !scope.normal_view;
            if (!scope.normal_view) {
                ListEvent__unavailable();
            } else {
                ListEvent();
            }
        };


        scope.EditUser = async row => {  
            
            scope.modal.spin = true;
            
            sModal.open('modal-edit-user');

            WizardHandler.wizard().reset();
            
            let query  = await fApi.post('cuenta/get_persona',{email:row.email});
            
            scope.userObject.persona = query.info.persona;   
            scope.userObject.user    =  {
                nick : query.info.nick,
                id    : query.info.id,
                email : query.info.email
            };

            scope.change_password = false;
            scope.modal.spin_form = false;
            scope.modal.spin = false;
        };

        scope.listUsers = data => {
            scope.role = data;
            if (scope.role === null) ListEvent()
            else ListEvent__users()
        };

        scope.changePassword = () => {
            scope.change_password = !scope.change_password;
            if(!scope.change_password) 
                delete  scope.userObject.user.password;
        };

        scope.saveUser = async () => {
            scope.modal.spin_form = true;
            let res = await fApi.post('cuenta/update',scope.userObject);
            postUpdateUSer(res);
        };

        let postUpdateUSer = (res) => {
            if(res.success) {
                sModal.close('modal-edit-user');
                ListEvent();
                sModal.success(res.message);
                scope.modal.spin_form = false;
            } else { 
                
                scope.errors = res.errors;
                
                let errorsString = '\n';
                
                angular.forEach(scope.errors, (value) => errorsString += ` ${value} <br>`);
                
                sModal.error(errorsString);

                scope.modal.spin_form = false;
            }
        };

        scope.managerView = row => {
            sLocal.set('user_change', row);
            location.path('administrar_usuarios/cuenta');
        };

        scope.openModal = (type, data) => {
            scope.main_obj = data;
            switch (type) {
                case 0:
                    sModal.question('¿Desea restaurar este Usuario de la lista?', scope.restoreEvent);
                    break;
            }
        };

        scope.onInit = () => {
            sLocal.remove('user_id');
            ListEvent();
        };
    },
    templateUrl: './src/views/home/components/usuarios/administrar/administrar.html',
    stylesUrl: './src/views/home/components/usuarios/administrar/administrar.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sLocal',
        '$location',
        'sModal',
        'WizardHandler'
    ]
});