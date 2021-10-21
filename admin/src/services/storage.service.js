import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'sStorage',
    module: 'mdServices',
    fn: function (base64) {
        this.set = (name, item) => {
            localStorage.setItem(base64.encode(name), base64.encode(angular.toJson(item)));
        };
        this.get = name => {
            let encode = localStorage.getItem(base64.encode(name));
            if (encode == null)
                return undefined;
            let data = base64.decode(encode);
            if (data == 'undefined')
                return undefined;
            return angular.fromJson(data);
        };

        this.remove = name => {
            localStorage.removeItem(base64.encode(name));
        };

        this.clear = () => {
            localStorage.clear();
        };
        this.redirect = (url) => {
			window.location = url;
		};
    },
    deps: [
        '$base64'
    ]
});

dnInjectable({
    name: 'sLocal',
    module: 'mdServices',
    fn: function (base64, location) {
        this.set = (name, item) => {
            sessionStorage.setItem(base64.encode(name), base64.encode(angular.toJson(item)));
        };
        this.get = (name, url) => {
            let data = sessionStorage.getItem(base64.encode(name));
            if (data !== null) {
                return angular.fromJson(base64.decode(data));
            } else {
                if (url) {
                    location.path(url)
                }
                return undefined;
            }
        };
        this.remove = name => {
            sessionStorage.removeItem(base64.encode(name));
        };
        this.clear = () => {
            sessionStorage.clear();
        };
    },
    deps: [
        '$base64',
        '$location'
    ]
});