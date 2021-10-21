import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    name: 'construirMenu',
    fn: function (scope, fApi, fCrud, sModal, location, sLocal) {

    scope.menu = sLocal.get('menu');
    scope.forms = {};

    var select_deleted_opcion,select_deleted_item,select_restore_item,select_restore_opcion;

    function ToListMenu(){
       return fApi.show('item/menu',scope.menu.id)
    };

    scope.giveItem = (id) =>{
        var data_give_item = { menu_id: scope.menu.id, item_id:id};
        fApi.push('item/menu',data_give_item).then(function(res){
            sModal.success(res);
            ToListMenu();
        });
    };

    function CleanModelOpcion() {
        scope.object_opcion = {
            nombre: null,
            icono: null,
        };
        scope.errors_opcion = {};
        angular.forEach(scope.forms, value => value && value.$setPristine());
        
    };

    scope.loadModalCreateOpcion = () => {
        CleanModelOpcion();
        scope.operation_opcion = 'create';
        scope.modal_name_opcion = "Registrar Opcion";
        scope.button_name_opcion = "Guardar Opcion";
        sModal.open('modal_opcion');
    };

    scope.loadModalUpdateOpcion = (object)  => {
        CleanModelOpcion();
        scope.operation_opcion = 'update';
        scope.modal_name_opcion = "Modificar Opcion";
        scope.button_name_opcion = "Modificar Opcion";
        scope.object_opcion = angular.copy(object);
        sModal.open('modal_opcion');
    };

    scope.registerOrUpdateOpcion = function (value) {
        if (value !== null) {
            fCrud.executeCreateOrUpdate('opcion',value,scope.operation_opcion,ProcessDataOpcion);
        }
    };

    function ProcessDataOpcion(res){
        if(res.success){
            List();
            CleanModelOpcion();
            sModal.close('modal_opcion');
            sModal.success(res);
        }else{
            if (res.message) sModal.warning(res.message);
        }
    };
    scope.loadDeletedOpcion = (value) =>{
        select_deleted_opcion = value;
        sModal.question('¿Desea eliminar este item?', RemoveOpcion);

    };

    function RemoveOpcion() {
        fCrud.executeDelete('opcion',select_deleted_opcion.id,List);
    }

    function List (){
         fApi.all([ToListMenu()], (opciones) => {
            scope.opciones = opciones.info
        });  
    };
    /**
     * Operaciones de Item
     */
    function CleanModelItem(){
        scope.object_item = {
            nombre: null,
            url: null,
            opcion_id: null,
        };
        scope.errors_item = {};
        angular.forEach(scope.forms, value => value && value.$setPristine());
    };

    scope.loadModalCreateItem = (id) => {
        CleanModelItem();
        scope.operation_item = 'create';
        scope.modal_name_item = "Registrar Item";
        scope.button_name_item = "Guardar Item";
        scope.object_item.opcion_id = id;
        sModal.open('modal_item');
    };

    scope.loadModalUpdateItem = (object)  =>{
        CleanModelItem();
        scope.operation_item = 'update';
        scope.modal_name_item = "Modificar Item";
        scope.button_name_item = "Modificar Item";
        scope.object_item = angular.copy(object);
        sModal.open('modal_item');
    };

    scope.registerOrUpdateItem =(value) => {
        if (value !== null) {
            fCrud.executeCreateOrUpdate('item',value,scope.operation_item,ProcessDataItem);
        }
    };

    function ProcessDataItem(res){
        if(res.success){
            fApi.all([ToListMenu()], (opciones) => {
                scope.opciones = opciones.info
            });
            CleanModelItem();
            sModal.close('modal_item');
            sModal.success(res);

        }else{
            if (res) sModal.warning(res);
        }
    };

    scope.loadDeletedItem = (value) => {
        select_deleted_item = value;
        sModal.question('¿Desea eliminar este item?', RemoveItem);

    };

    function RemoveItem() {
        fCrud.executeDelete('item',select_deleted_item.id,List);
    };

    const onInit = (() => {
        fApi.all([ToListMenu()], (opciones) => {
            scope.opciones = opciones.info
        });

    })(); 

   
    },
    templateUrl: './src/views/home/components/seguridad/menu/build/build.html',
    stylesUrl: './src/views/home/components/seguridad/menu/build/build.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        '$location',
        'sLocal'
    ]
});