import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'fCrud',
    module: 'mdFactories',
    fn: function (sCrud) {
        return {
            select: model => {
                return sCrud.processRequest(model, 'getdata', null, 'select');
            },
            getdata: model => {
                return sCrud.processRequest(model, 'getdata');
            },
            alldata: model => {
                return sCrud.processRequest(model, 'getdata', null, 'alldata');
            },
            showselect: (model, id) => {
                return sCrud.processRequest(model, 'show', id, 'select');
            },
            show: (model, id) => {
                return sCrud.processRequest(model, 'show', id);
            },
            showdata: (model, id) => {
                return sCrud.processRequest(model, 'show', id, 'alldata');
            },
            update: (model, data) => {
                return sCrud.processRequest(model, 'update', data);
            },
            create: (model, data) => {
                return sCrud.processRequest(model, 'create', data);
            },
            delete: (model, id) => {
                return sCrud.processRequest(model, 'delete', id);
            },

            restore: (model, id) => {
                return sCrud.processRequest(model, 'restore', id);
            },
            trashed: model => {
                return sCrud.processRequest(model, 'trashed');
            },
            executeDelete: (model, id, function_execute, params = undefined) => {
                sCrud.processRequest(model, 'delete', id)
                    .then(res => {
                        function_execute(res, params);
                    });
            },
            executeRestore: (model, id, function_execute, params = undefined) => {
                sCrud.processRequest(model, 'restore', id)
                    .then(res => {
                        function_execute(res, params);
                    });
            },
            executeCreateOrUpdate: (model, object, operation, function_execute, params = undefined) => {
                if (operation == 'update') {
                    sCrud.processRequest(model, 'update', object)
                        .then(res => {
                            function_execute(res, params);
                        });
                } else {
                    sCrud.processRequest(model, 'create', object)
                        .then(res => {
                            function_execute(res, params);
                        });
                }
            }
        };
    },
    deps: ['sCrud']
});

dnInjectable({
    name: 'sCrud',
    module: 'mdFactories',
    fn: function (sApiToken) {
        this.processRequest = (model, operation, data = null, type = null) => {
            let send_data = {};
            send_data.model = model;
            send_data.type = type;
            switch (operation) {
                case 'getdata':
                    return sApiToken.post('getdata', send_data);
                    break;
                case 'show':
                    send_data.id_model = data;
                    return sApiToken.post('show', send_data);
                    break;
                case 'create':
                    send_data.data = data;
                    return sApiToken.post('create', send_data);
                    break;
                case 'update':
                    send_data.id_model = data.id;
                    send_data.data = data;
                    return sApiToken.post('update', send_data);
                    break;
                case 'delete':
                    send_data.id_model = data;
                    return sApiToken.post('delete', send_data);
                    break;
                case 'restore':
                    send_data.id_model = data;
                    return sApiToken.post('restore', send_data);
                    break;
                case 'trashed':
                    return sApiToken.post('trashed', send_data);
                    break;
            }
        };
    },
    deps: ['sApiToken']
});