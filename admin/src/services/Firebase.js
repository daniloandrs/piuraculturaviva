import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'sMyFirebase',
    module: 'mdServices',
    fn: function (firebaseRef, firebaseArray) {

        return {
            // notificationsNews: firebaseRef.notificationsNews ? firebaseArray(firebaseRef.notificationsNews) : undefined,
            // notificationsOlds: firebaseRef.notificationsOlds ? firebaseArray(firebaseRef.notificationsOlds) : undefined,
            // mailboxNews: firebaseRef.mailboxNews ? firebaseArray(firebaseRef.mailboxNews) : undefined,
            // mailboxOlds: firebaseRef.mailboxOlds ? firebaseArray(firebaseRef.mailboxOlds) : undefined

            notificaciones_leidas: firebaseRef.notificaciones_leidas ? firebaseArray(firebaseRef.notificaciones_leidas) : undefined,
            notificaciones_no_leidas: firebaseRef.notificaciones_no_leidas ? firebaseArray(firebaseRef.notificaciones_no_leidas) : undefined,
        };

    },
    deps: [
        '$firebaseRef',
        '$firebaseArray'
    ]
});
