import { dnComponent } from '../../../../../../../../dine.js';

export default dnComponent({
    
    name: 'subCategories',

    fn: function (scope, fApi, fCrud, filter, sModal, sStorage, location) {

        let Model = 'sub_category';
        
        scope.mainObj = {};
        
        scope.forms = {
            crud : null 
        };

        scope.normalView = true;

        let Category = () => {
              
            scope.categoryTmp = sStorage.get('category');

            if (scope.categoryTmp) 
                sStorage.remove('category');

            if(scope.categoryTmp == undefined)
                location.path('mantenimientos/categoria');
            else 
                ListEvent();

        }

        let SubListEvent = () => {
            scope.listData = [];
            scope.loading = fCrud.getdata('category')
                .then(res => {
                    scope.subListData = res.success ? res.info : [];
                })
        };

        let ListEvent = () => {

            scope.listData = [];
            
            let data = {
                category_id : scope.categoryTmp.id
            };

            scope.loading = fApi.post('category/sub_category',data)
                .then(res => {
                    scope.listData = res.success ? res.info : [];
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
                    scope.title = 'Agregar Sub Categoría';
                    sModal.open('modal-base-form');
                    break;
                case 1:
                    scope.title = 'Actualizar Sub Categoría';
                    sModal.open('modal-base-form');
                    break;
                case 2:
                    sModal.question('¿Desea eliminar esta Sub Categoría de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar esta Sub Categoría de la lista?', scope.restoreEvent);
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
            Category();
            SubListEvent();
        };
    },
    templateUrl: './src/views/home/components/app/maintenance/category/sub_categories/sub_categories.html',
    stylesUrl: './src/views/home/components/app/maintenance/category/sub_categories/sub_categories.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        '$filter',
        'sModal',
        'sStorage',
        '$location'
    ]
});