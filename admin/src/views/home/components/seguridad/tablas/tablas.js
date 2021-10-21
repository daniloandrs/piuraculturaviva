import {dnComponent} from '../../../../../../dine.js';

export default dnComponent({
    name: 'tablas',
    fn: function (scope, api, crud, modal) {
        let Model = 'tabla';
        scope.mainObj = {};
        scope.normalView = true;
        let ListEvent = () => {
            scope.listData = [];
            scope.loading = crud.getdata(Model)
                .then(res => scope.listData = res.success ? res.info : [])
        };
        let ListEventUnavailable = () => {
            scope.loading = crud.trashed(Model)
                .then(res => scope.listData = res.success ? res.info : [])
        };
        let PostTransaction = res => {
            if (res.success) {
                modal.close('modal-tablas-form');
                modal.success(res.message);
                ListEvent();
            } else {
                if (res.errors) scope.errors = res.errors;
                if (res.message) modal.error(res.message);
            }
        };
        let PostTransactionUnavailable = res => {
            if (res.success) {
                modal.success(res.message);
                ListEventUnavailable();
            } else modal.warning(res.message);
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
            scope.loading_modal = crud[operation](Model, scope.mainObj)
                .then(PostTransaction);
        };
        scope.deleteEvent = () => {
            scope.loading = crud.executeDelete(Model, scope.mainObj.id, PostTransaction);
        };
        scope.restoreEvent = () => {
            scope.loading = crud.executeRestore(Model, scope.mainObj.id, PostTransactionUnavailable);
        };
        scope.openModal = (type, data) => {
            scope.cleanForm();
            if (data) {
                scope.mainObj = angular.copy(data);
            }
            switch (type) {
                case 0:
                    scope.title = 'agregar tabla';
                case 1:
                    scope.title = scope.title || 'actualizar tabla';
                    modal.open('modal-tablas-form');
                    break;
                case 2:
                    modal.question('¿Desea inhabilitar este tabla de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    modal.question('¿Desea restaurar este tabla de la lista?', scope.restoreEvent);
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
    templateUrl: './src/views/home/components/seguridad/tablas/tablas.html',
    stylesUrl: './src/views/home/components/seguridad/tablas/tablas.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal'
    ]
});