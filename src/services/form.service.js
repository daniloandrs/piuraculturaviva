import {
    dnInjectable
} from '../../dine.js';

dnInjectable({ 
    name: 'sForm',
    module: 'mdServices',
    fn: function (filter,fApi) {

        let ParseDate = date_string => {
            return new Date(filter('date')(date_string, 'yyyy-MM-dd', 'America/Lima')  );
        };

        let ParseString = date => {
            return filter('date')(date, 'yyyy-MM-dd HH:mm', 'America/Lima');
        };

        let ParseStringDate = date => {
            return filter('date')(date, 'yyyy-MM-dd', 'America/Lima');
        };

        let ParseStringTime = date => {
            return filter('date')(date, 'HH:mm', 'America/Lima');
        };

        this.now = function () {
            let date = new Date();
            return filter('date')(date, 'yyyy-MM-dd HH:mm', 'America/Lima');
        };

        this.hoy = function (){
            let hoy = new Date(filter('date')(new Date(), 'yyyy-MM-dd 00:00','America/Lima'));
            return hoy;
        };
        
        this.hoy_string = () => {
            return ParseStringDate(this.hoy());
        };


        this.momentNow = () => {
            moment.locale('es');
            return +moment();
        };
    
        this.timeAgo = (date) => {
            moment.locale('es');
            return moment(date).fromNow();
        };
        
        this.parseString = date => {
            return ParseString(date);
        };

        this.parseStringTime = date => {
            return ParseStringTime(date);
        };

        this.parseStringDate = date => {
            return ParseStringDate(date);
        };

        this.year = function () {
            let date = new Date();
            return parseInt(filter('date')(date, 'yyyy', 'America/Lima'));
        };

        this.parseDate = date_string => {
            return ParseDate(date_string);
        };

        this.searchArray = (array, value, key = 'id') => {
            let index_selected = -1;
            angular.forEach(array, (item, index) => {
                if (item[key] == value)
                    return index_selected = index;
            });
            return index_selected;
        };

        this.searchObjectArray = (array, value, key = 'id') => {
            var index = this.searchArray(array, value, key);
            return index >= 0 ? array[index] : null;
        };

        this.executeFunctionArray = (list, callback) => {
            angular.forEach(list, (value, key) => {
                callback(value, key);
            });
        };

        this.removeProperties = (object, properties) => {
            if (typeof object !== 'object') return;
            angular.forEach(properties, property => delete object[property]);
        };

        let Validate = object => {
            let clone_object = Object.assign({}, object);
            angular.forEach(clone_object, function (value, key) {
                if (angular.isDate(value)) {
                    if (key.indexOf("hora") >= 0)
                        return clone_object[key] = filter('date')(value, 'HH:mm', 'America/Lima');
                    else
                        return clone_object[key] = filter('date')(value, 'yyyy-MM-dd', 'America/Lima');
                }
                if (angular.isUndefined(value))
                    return clone_object[key] = "";
                if (angular.isObject(value))
                    return clone_object[key] = Validate(value);
            });
            return clone_object;
        };

        this.validate = (dataForm) => {
            return Validate(dataForm);
        };

        this.parse = (itemData) => {
            angular.forEach(itemData, function (value, key) {
                if (
                    key.indexOf("fecha") >= 0 ||
                    key.indexOf("hora") >= 0
                ) {
                    if (navigator.userAgent.search("Chrome") >= 0) {
                        if (key.indexOf("hora") >= 0) {
                            var tiempo = new Date(filter('date')('1970-01-01 ' + value, 'HH:mm', 'America/Lima'));
                            itemData[key] = tiempo;
                        } else {
                            var fecha = new Date(filter('date')(value, 'yyyy/MM/dd', 'America/Lima'));
                            itemData[key] = fecha;
                        }
                    } else {
                        itemData[key] = filter('date')(value, 'yyyy/MM/dd', 'America/Lima');
                    }
                }
            });
        };

        this.validateChangeInput = (type, value, min_value, max_value = 99999) => {
            if (value == undefined)
                return;
            if (value < min_value)
                value = min_value;
            if (value > max_value)
                value = max_value;
            return type === 'integer' ? parseInt(value) : parseFloat(value);
        };

        this.round = (number, decimals) => {
            return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
        };

        this.parseFloat = (data) => {
            data.monto = Number(data.monto);
            return angular.copy(data);
        }

        this.miIp  = async () => {

            let query = await fApi.getPublic('https://api.ipify.org?format=json');

           return query.ip;

        }  
    },
    deps: [
        '$filter','fApi'
    ]
});