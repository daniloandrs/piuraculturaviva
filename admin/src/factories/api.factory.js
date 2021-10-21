import {dnInjectable} from "../../dine.js";

dnInjectable({
    name: 'fApi',
    module: 'mdFactories',
    fn: function (sApi, q) {
        return {
            
            show: (route, param) => {
                return sApi.show(route, param);
            },

            getdata: route => {
                return sApi.getdata(route);
            },
            
            create: (route, data) => {
                return sApi.create(route, data);
            },
            
            delete: (route, id) => {
                return sApi.delete(route, id);
            },
            
            update: (route, data) => {
                return sApi.update(route, data);
            },
            
            restore: (route, id) => {
                return sApi.restore(route, id);
            },
            
            trashed: route => {
                return sApi.trashed(route);
            },
            
            push: (route, data) => {
                return sApi.pushModel(route, data);
            },
            remove: (route, data) => {
                return sApi.removeModel(route, data);
            },
            asigned: (route, id) => {
                return sApi.asignedModel(route, id);
            },
            unsigned: (route, id) => {
                return sApi.unsignedModel(route, id);
            },
            image: (route, data) => {
                return sApi.image(route, data);
            },
            get: route => {
                return sApi.get(route);
            },
            post: (route, data) => {
                return sApi.post(route, data);
            },
            all: (promises, callback) => {
                return q.all(promises)
                    .then(res => {
                        callback.apply(null, res);
                    });
            },
            download: function (route, data, typeFile, nombre) {
                return sApi.download(route, data, typeFile, nombre);
            },
            routeDropzone : function (route) {
                return sApi.routeDropzone(route);
            }
            
        };
    },
    deps: ['sApi', '$q']
});

dnInjectable({
    name: 'sApi',
    module: 'mdFactories',
    fn: function (sApiToken) {
        this.show = (route, param) => {
            return sApiToken.get(route + '/show/' + param);
        };
        this.getdata = route => {
            return sApiToken.get(route + '/getdata');
        };
        this.create = (route, data) => {
            return sApiToken.post(route + '/create', data);
        };
        this.update = (route, data) => {
            return sApiToken.put(route + '/update/' + data.id, data);
        };
        this.delete = (route, id) => {
            return sApiToken.delete(route + '/delete/' + id);
        };
        this.restore = (route, id) => {
            return sApiToken.delete(route + '/restore/' + id);
        };
        this.trashed = route => {
            return sApiToken.get(route + '/trashed');
        };
        this.pushModel = (route, data) => {
            return sApiToken.post(route + '/give', data);
        };
        this.removeModel = (route, data) => {
            return sApiToken.post(route + '/remove', data);
        };
        this.asignedModel = (route, id) => {
            return sApiToken.get(route + '/asigned/' + id);
        };
        this.unsignedModel = (route, id) => {
            return sApiToken.get(route + '/unsigned/' + id);
        };
        this.image = (route, data) => {
            return sApiToken.image(route + '/image', data);
        };
        this.get = (route) => {
            return sApiToken.get(route);
        };
        this.post = (route, data) => {
            return sApiToken.post(route, data);
        };
        this.download = (route, data, typeFile, nombre) => {
            return sApiToken.download(route, data, typeFile, nombre);
        };
        this.routeDropzone = (route) => {
            return sApiToken.routeDropzone(route);
        }
    },
    deps: ['sApiToken']
});

dnInjectable({
    name: 'sApiToken',
    module: 'mdFactories',
    fn: function (http, cApi, sMiddleware, queue, sStorage,cSession) {
        let server = cApi.SERVER;

        this.routeDropzone = (route) => {

            var api_token = "?api_token=" + sStorage.get(cSession.TOKEN);
            
            return  `${server}${route}${api_token}`;

        };
 
        this.get = (route) => {
            let response = http.get(server + route);
            return sMiddleware.interceptResponse(response);
        };
        this.post = (route, data) => {
            let response = http.post(server + route, data);
            return sMiddleware.interceptResponse(response);
        };
        this.put = (route, data) => {
            let response = http.put(server + route, data);
            return sMiddleware.interceptResponse(response);
        };
        this.delete = (route) => {
            let response = http.delete(server + route);
            return sMiddleware.interceptResponse(response);
        };

        this.image = (route, data) => {
            let formData = new FormData();
            angular.forEach(data, (value, key) => {
                if (key === 'archivo' && angular.isArray(value)) {
                    angular.forEach(value, (image, index) => {
                        formData.append('archivo_' + (index + 1), image);
                    });
                    formData.append('nFiles', value.length);
                } else {
                    formData.append(key, value)
                }
            });

            let response = http.post(server + route, formData, {
                headers: {
                    "Content-type": undefined,
                },
                transformRequest: angular.identity
            });
            return sMiddleware.interceptResponse(response);
        };

        this.download = function (route, data, typeFile, nombre) {
            let promise = new Promise((resolver, reject) => {
                let response = http({
                    url: server + route,
                    method: 'POST',
                    data: data,
                    body: data,
                    headers: {
                        'Content-type': 'application/json',
                    },
                    responseType: 'blob'
                });
                response.then(res => {
                    var data = res.data;
                    if (data.type !== 'application/json') {
                        var file = new Blob([data], {
                            type: typeFile
                        });
                        var fileURL = URL.createObjectURL(file);
                        var a = document.createElement('a');
                        a.href = fileURL;
                        a.target = '_blank';
                        a.download = (nombre || 'archivo') + typeFile;
                        var content_disposition = res.headers()['content-disposition'];
                        if (content_disposition && content_disposition.split('"').length >= 2)
                            a.download = content_disposition.split('"')[1];
                        else if (content_disposition && content_disposition.split('=').length > 1)
                            a.download = content_disposition.split('=')[1];
                        document.body.appendChild(a);
                        a.click();
                        resolver(response);
                    } else if ("TextDecoder" in window) {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function () {
                            var enc = new TextDecoder("utf-8");
                            let json = JSON.parse(enc.decode(reader.result));
                            resolver(json);
                        });
                        reader.readAsArrayBuffer(data);
                    }
                });
            });
            return promise;
        };
    },
    deps: ['$http', 'cApi', 'sMiddleware', '$q','sStorage','cSession']
});