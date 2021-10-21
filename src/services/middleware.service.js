import {
    dnInjectable
} from '../../dine.js';

export default dnInjectable({
    name: 'sMiddleware',
    module: 'mdServices',
    fn: function (sStorage, cSession, location, sModal, $q, http, env, sInterval, fUser) {
        
        let storage_menu = sStorage.get(cSession.MENU) ? sStorage.get(cSession.MENU).opciones : [],
            routes__mapped,
            url__next,
            status_numbers;

        this.allowed_routes = {};
        this.current_url = {
            value: location.url()
        };
        this.middleware_info_error = {
            value: undefined
        };

        this.info_notify = {
            value: undefined
        };
       

        this.recursiveCaptureUrls = array => {
            angular.forEach(array, value => {
                if (value.url) {
                    this.allowed_routes['/' + value.url] = {
                        name: value.nombre,
                        masked: value.nombre,
                        icon: value.icono ? value.icono.nick : undefined
                    };
                }
                if (value.items && value.items.length > 0) this.recursiveCaptureUrls(value.items);
            });
        };

        this.changeRouteMask = callback => {
            let route = this.allowed_routes[this.current_url.value];
            if (route) this.allowed_routes[this.current_url.value].masked = callback(route.name);
        };

        let ToHome = () =>  { 
            location.path('/home');
        };
        
        let ToNotfound = () => {
            if (env.APP_INTERCEPTED_URL) location.path('/404')
        };

        this.interceptUrl = (event, route) => {
            if (route) {
                url__next = route.$$route.originalPath;
                AnalizeUrl(url__next);
            } else ToHome();
        };

        let DefineParamsOfModalDebug = res => {
            this.middleware_info_error.value = {
                headers: {
                    'Request URL': res.config.url,
                    'Request Method': res.config.method,
                    'Status Code': res.status,
                    'Content-Type': res.config.headers['Content-Type'],
                    'Accept': res.config.headers.Accept,
                    'Authorization': res.config.headers.Authorization,
                    'Request Payload': res.config.data
                },
                preview: res.data
            };
            sModal.open('depuration-modal');
        };

        status_numbers = {
            200: {
                statusText: 'OK'
            },
            404: {
                statusText: 'Not Found'
            },
            401: {
                statusText: 'Unauthorized',
                method: data => {
                    
                },
            },
            500: {
                statusText: 'Internal Server Error',
                method: DefineParamsOfModalDebug
            },
            '-1': {
                statusText: 'Network Disconnected',
                method: () => {
                    sModal.warning('Verifique su conexión a internet.');
                }
            }
        };

        this.interceptResponse = response => {
            let method,
                status,
                deferred = $q.defer();
            response
                .then(res => {
                    if (res.data.file && res.data.line) {
                        if (env.APP_STATE_DEBUG) {
                            let status = status_numbers[res.data.code];
                            if (status && status.method) {
                                status.method(res);
                            } else {
                                DefineParamsOfModalDebug(res);
                                deferred.resolve({
                                    errorDebug: true
                                });
                            }
                        } else {
                            sModal.warning('Algo no ha salido bien, intente nuevamente');
                        }
                    } else {
                        if (angular.isObject(res.data)) {

                            if (res.data.notify) {
                                this.info_notify.value = res.data.notify
                                sModal.open('send-notify-general', () => {
                                    deferred.resolve(res.data);
                                });

                            } else {
                                deferred.resolve(res.data);
                            }
                        } else {
                            DefineParamsOfModalDebug(res);
                        }
                    }
                }, res => {
                    status = status_numbers[res.status];
                    if (status && typeof status.method === 'function') status.method(res);
                })
                .catch(error => {
                    status = status_numbers[error.status];
                    if (status && typeof status.method === 'function') status.method(error);
                });
            return deferred.promise;
        };

        this.replayXHR = () => {
            let data = this.middleware_info_error.value.headers;
            let promise = http({
                url: data['Request URL'],
                method: data['Request Method'],
                data: data['Request Payload']
            });
            this.middleware_info_error.value.petition = this.interceptResponse(promise)
                .then(res => {
                    if (!res.errorDebug) {
                        sModal.close('depuration-modal');
                        sModal.info('Depuración exitosa');
                    }
                });
        };

        let AnalizeUrl = data => {

        };

        this.isLogged = () => {
            return sStorage.get(cSession.TOKEN) !== undefined;
        };

        let Run = (() => {
            this.recursiveCaptureUrls(storage_menu);
            if (this.isLogged()) {
                AnalizeUrl(this.current_url.value);
            } else {
                // console.log('no loged!');
            }
        })();
    },
    deps: [
        'sStorage',
        'cSession',
        '$location',
        'sModal',
        '$q',
        '$http',
        'fEnv',
        '$interval',
        'fUser'
    ]
});
