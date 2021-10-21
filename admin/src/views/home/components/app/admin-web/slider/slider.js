
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    name: 'slider',
    fn: function (scope, fApi, fCrud, sModal,cApi) {
        let Model = 'slider';
        scope.objectSlider = {};
        scope.normalView = true;

        scope.path = cApi.STORAGE;

        let ListEvent = () => {
            scope.updateOrden = (keys) => {
                fApi.post('slider/update_orden',keys)
                .then(res => PostTransaction(res))
            };
    
            scope.stopCallback = function(event, ui,item) {
                let nueva = scope.listData[item.position_key];
                let keys = {anterior_posicion_id:item.id,nueva_posicion_id:nueva.id};
                if(keys.anterior_posicion_id != keys.nueva_posicion_id)
                    scope.updateOrden(keys);
            }; 
            scope.listData = [];
            scope.loading = fCrud.getdata('slider')
                .then(res => {
                    scope.listData = res.success ? res.info : [];
                    angular.forEach(scope.listData,(value) => {
                        value.position_key = i++;
                    })
                })
        };
        let ListEventUnavailable = () => {
            scope.loading = fCrud.trashed(Model)
                .then(res => scope.listData = res.success ? res.info : [])
        };
    
        scope.loadImage = () =>  { 
            scope.default_image = './assets/img/sidebar/profile.png';
            scope.default_image_mobile = './assets/img/sidebar/profile.png';
        }
        
        scope.archivo_options = {
            dimentions: {
                width: 900000,
                height: 900000,
                size: 5002400
            }
        };

        let PostTransaction = res => {
            if (res.success) {
                sModal.close('modal-base-form');
                sModal.success(res.message);
                ListEvent();
            } else {
                if (res.errors) {
                    scope.errors = res.errors;
                    angular.forEach(scope.errors, function (value, key) {
                        sModal.error(value);
                    });
                }
                if (res.message) {
                    sModal.error(res.message);
                }
            }
            scope.spin = false;
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

        scope.estadoItem  = (show) => ` ${ show ? 'Visible' : 'Oculto' }`;

        scope.executeCreate = () => {
            if(scope.objectSlider.imagen == undefined)
                return sModal.error('Necesita agregar una imagen');
            scope.spin = true;
            scope.loading_modal = fApi.image('slider',scope.objectSlider).then( res => {
                PostTransaction(res);
            });
        };

        scope.executeUpdate = () => {
            scope.spin = true;
            scope.loading_modal = fApi.image('slider/update',scope.objectSlider).then( res => {
                PostTransaction(res);
            });
        };

        scope.sendDataEvent = () => {

            let operation = (scope.objectSlider.id == null) ? 'create' : 'update';

            operation == 'create' ? scope.executeCreate() : scope.executeUpdate();
            
        };
        
        scope.deleteEvent = () => {
            scope.loading = fApi.delete('slider',scope.objectSlider.id).then(res => PostTransaction(res));
        };

        scope.restoreEvent = () => {
            scope.loading = fCrud.executeRestore(Model, scope.objectSlider.id, PostTransactionUnavailable);
        };
        
        scope.openModal = (type, data) => { 
            scope.cleanForm();
            
            if (data) {
                scope.objectSlider = angular.copy(data);
            }
            switch (type) {
                case 0:
                    scope.loadImage();
                    scope.title = 'Agregar slider';
                    sModal.open('modal-base-form');
                    break;
                case 1:
                    scope.default_image = scope.path + scope.objectSlider.src_imagen,
                    scope.default_image_mobile = scope.path + scope.objectSlider.src_image_mobile
                    scope.title = 'Actualizar slider';
                    sModal.open('modal-base-form');
                    break;
                case 2:
                    sModal.question('¿Desea eliminar este slider de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar este slider de la lista?', scope.restoreEvent);
                    break;
            }
        };

        scope.updateOrden = (keys) => {
            fApi.post('slider/update_orden',keys)
            .then(res => PostTransaction(res))
        };

        scope.stopCallback = function(event, ui,item) {
            let nueva = scope.listData[item.position_key];
            let keys = {anterior_posicion_id:item.id,nueva_posicion_id:nueva.id};
            if(keys.anterior_posicion_id != keys.nueva_posicion_id)
                scope.updateOrden(keys);
        }; 
         
        scope.cleanForm = () => {
            scope.errors = null;
            scope.objectSlider = {
                show:true
            };
        };

        scope.onInit = () => {
            ListEvent();
            scope.loadImage();
        };
    },
    templateUrl: './src/views/home/components/app/admin-web/slider/slider.html',
    stylesUrl: './src/views/home/components/app/admin-web/slider/slider.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'cApi'
    ]
});