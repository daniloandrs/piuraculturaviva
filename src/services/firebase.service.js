import {
    dnInjectable
} from '../../dine.js';

dnInjectable({
    name: 'sFirebase',
    module: 'mdServices',
    fn: function () {

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

    deps: []
});
