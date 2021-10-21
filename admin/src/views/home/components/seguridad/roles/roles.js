import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({
    name: 'roles',
    fn: function (scope, fApi, fCrud, sModal) {
        let Model = 'rol';
        scope.mainObj = {};
        scope.normalView = true;
        let ListEvent = () => {
            scope.listData = [];
            scope.loading = fApi.getdata('auth/roles')
                .then(res => scope.listData = res.success ? res.info : [])
        };
        let ListEventUnavailable = () => {
            scope.loading = fCrud.trashed(Model)
                .then(res => scope.listData = res.success ? res.info : [])
        };
        let PostTransaction = res => {
            if (res.success) {
                sModal.close('modal-roles-form');
                sModal.success(res.message);
                ListEvent();
            } else {
                if (res.errors) scope.errors = res.errors;
                if (res.message) sModal.error(res.message);
            }
        };
        let PostTransactionUnavailable = res => {
            if (res.success) {
                sModal.success(res.message);
                ListEventUnavailable();
            } else sModal.warning(res.message);
        };
        scope.toggleView = () => {
            scope.normalView = !scope.normalView;
            if (!scope.normalView) {
                ListEventUnavailable();
            } else {
                ListEvent();
            }
        };
        scope.sendDataEvent = () => {
            let operation = (scope.mainObj.id == null) ? 'create' : 'update';
            scope.loading_modal = fCrud.executeCreateOrUpdate(Model, scope.mainObj, operation, PostTransaction);
        };
        scope.deleteEvent = () => {
            scope.loading = fCrud.executeDelete(Model, scope.mainObj.id, PostTransaction);
        };
        scope.restoreEvent = () => {
            scope.loading = fCrud.executeRestore(Model, scope.mainObj.id, PostTransactionUnavailable);
        };
        scope.openModal = (type, data) => {
            scope.cleanForm();
            if (data) {
                scope.mainObj = angular.copy(data);
            }
            switch (type) {
                case 0:
                    scope.title = 'agregar rol';
                case 1:
                    scope.title = scope.title || 'actualizar rol';
                    sModal.open('modal-roles-form');
                    break;
                case 2:
                    sModal.question('¿Desea inhabilitar este rol de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar este rol de la lista?', scope.restoreEvent);
                    break;
            }
        };
        scope.cleanForm = () => {
            scope.errors = null;
            scope.mainObj = {
                nick: null,
                nombre: null,
                nivel: null
            };
        };
        scope.onInit = () => {
            ListEvent();
        };
    },
    templateUrl: './src/views/home/components/seguridad/roles/roles.html',
    stylesUrl: './src/views/home/components/seguridad/roles/roles.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal'
    ]
});