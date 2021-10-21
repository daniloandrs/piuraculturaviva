import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'categoryMember',

    fn: function (scope, fApi, fCrud, filter, sModal) {

        let Model = 'category';
        
        scope.mainObj = {};
        
        scope.forms = {
            crud : null
        };

        scope.picker = {};

        scope.picker.options = {
            label: "Eligi el color de la Categoria",
            icon: "brush",
            default: "#f00",
            genericPalette: false,
            history: false
        };

        scope.normalView = true;

        let CategoryType = () => {
            scope.listCategoryType = [];
            scope.loading = fCrud.getdata('category_type')
            .then(res => {
                scope.listCategoryType = res.success ? res.info : [];
            })
        }  

        let ListEvent = () => {
            scope.listData = [];
            scope.loading = fCrud.getdata(Model)
                .then(res => {
                    scope.listData = res.success ? res.info.filter(i => i.category_type_id == 2) : [];
                })
        };

        let ListEventUnavailable = () => {
            scope.loading = fCrud.trashed(Model)
                .then(res => scope.listData = res.success ? res.info : [])
        };

        let PostTransaction = res => {
            if (res.success) {
                sModal.close('modal-base-form');
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
                    scope.title = 'Agregar Categoría';
                    sModal.open('modal-base-form');
                    break;
                case 1:
                    scope.title = 'Actualizar Categoría';
                    sModal.open('modal-base-form');
                    break;
                case 2:
                    sModal.question('¿Desea eliminar esta Categoría de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar esta Categoría de la lista?', scope.restoreEvent);
                    break;
            }
        };

        scope.cleanForm = () => {
            scope.errors = null;
            scope.mainObj = {
                nombre: null,
            };

            scope.forms.crud.$setPristine();
        };

        scope.$watch('mainObj', function (val) {
            scope.mainObj.nombre = filter('uppercase')(val.nombre);
        }, true);

        scope.onInit = () => {
            ListEvent();
            CategoryType();
        };
    },
    templateUrl: './src/views/home/components/app/maintenance/category_member/category_member.html',
    stylesUrl: './src/views/home/components/app/maintenance/category_member/category_member.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        '$filter',
        'sModal',
    ]
});