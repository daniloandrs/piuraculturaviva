    import { dnComponent } from '../../../../../../dine.js';

    export default dnComponent({
        name: 'menu',
        fn: function (scope, fApi, fCrud, sModal, location, sLocal) {
            let Model = 'menu';
            scope.mainObj = {};
            scope.normalView = true;
            scope.form = null;

            let ListEvent = () => {
                scope.listData = [];
                fCrud.getdata(Model)
                    .then(res => scope.listData = res.success ? res.info : [])
                    .then(() => ListEvent__roles());
            };

            let ListEvent__roles = () => {
                scope.listRoles = [];
                fApi.getdata('auth/roles')
                    .then(res => scope.listRoles = res.success ? res.info : [])
            };

            let ListEventUnavailable = () => {
                fCrud.trashed(Model)
                    .then(res => {
                        scope.listData = res.success ? res.info : [];
                    });
            };

            let PostTransaction = res => {
                if (res.success) {
                    sModal.open('menus.smallModal', {
                        type: 'success',
                        content: res.message
                    });
                    ListEvent();

                    sModal.close('modal-menu-form');

                } else {
                    if (res.errors) scope.errors = res.errors;
                    if (res.message) {
                        sModal.open('menus.smallModal', {
                            type: 'error',
                            content: res.message
                        });
                    }
                }
            };

            let PostTransactionUnavailable = res => {
                let type;
                if (res.success) {
                    type = 'success';
                    ListEventUnavailable();
                } else type = 'warning';
                sModal.open('menus.smallModal', {
                    type: type,
                    content: res.message
                });
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
                fCrud.executeCreateOrUpdate(Model, scope.mainObj, operation, PostTransaction);
            };

            scope.deleteEvent = () => {
                fCrud.executeDelete(Model, scope.mainObj.id, PostTransaction);
            };

            scope.restoreEvent = () => {
                fCrud.executeRestore(Model, scope.mainObj.id, PostTransactionUnavailable);
            };

            scope.openModal = (type, data) => {
                scope.cleanForm();
                if (data) {
                    scope.mainObj = angular.copy(data);
                }
                switch (type) {
                    case 0:
                        scope.title = 'agregar menú';
                    case 1:
                        scope.title = scope.title || 'actualizar menú';
                        sModal.open('modal-menu-form');
                        break;
                    case 2:
                        sModal.question('¿Desea inhabilitar este menú de la lista?', scope.deleteEvent);
                        break;
                    case 3:
                        sModal.question('¿Desea restaurar este menú de la lista?', scope.restoreEvent);
                        break;
                }
            };

            scope.cleanForm = () => {
                scope.errors = null;
                scope.mainObj = {};
                scope.form?.$setPristine();
            };

            scope.buildView = row => {
                sLocal.set('menu', row);
                location.path('/menus/build');
            };

            scope.onInit = () => {
                sLocal.remove('menu_id');
                ListEvent();
            };
        },
        templateUrl: './src/views/home/components/seguridad/menu/menu.html',
        stylesUrl: './src/views/home/components/seguridad/menu/menu.css',
        deps: [
            '$scope',
            'fApi',
            'fCrud',
            'sModal',
            '$location',
            'sLocal'
        ]
    });