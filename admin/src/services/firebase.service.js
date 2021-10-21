import {
    dnInjectable
} from '../../dine.js';

dnInjectable({
    name: 'sFirebase',
    module: 'mdServices',
    fn: function (sStorage, cFirebase, cSession) {

        let user = sStorage.get(cSession.USER);
        if (user) {
            this.notificacionesLeidasUrl = `${cFirebase.databaseURL}/notificaciones/${user.nick}/leidas/`;
            this.notificacionesNoLeidasUrl = `${cFirebase.databaseURL}/notificaciones/${user.nick}/no_leidas/`;
        }

        this.collection = collection => {

            return firebase.firestore().collection(collection);
        
        };
    
        this.parseList = (res) => {

            let list = [];
            
            let item;
            
            angular.forEach(res.docs, (doc, index) => {
                item = doc.data();
                item.documentID = doc.id;
                list.push(item);
            });
            return list;
        };
    },
    deps: [
        'sStorage',
        'cFirebase',
        'cSession'
    ]
});
