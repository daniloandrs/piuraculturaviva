import {
    dnConfig
} from "../../dine.js";

export default dnConfig({
    fn: function (location, route, routing, firebaseRef, cfirebase, sMiddleware, sFirebase) {

        location.hashPrefix('');
        
        let ConfigFirebase = () => {

            firebase.initializeApp(cfirebase);

            let objects_url = {
                default: cfirebase.databaseURL
            };

            const firestore = firebase.firestore();

            const settings = {

                timestampsInSnapshots: true

            };

            firestore.settings(settings);

            if (sMiddleware.$get().isLogged()) {
                // objects_url.notificationsNews = sFirebase.$get().systemURL + 'news';
                // objects_url.notificationsOlds = sFirebase.$get().systemURL + 'olds';
                // objects_url.mailboxNews = sFirebase.$get().mailboxURL + 'news';
                // objects_url.mailboxOlds = sFirebase.$get().mailboxURL + 'olds';

                objects_url.notificaciones_leidas = sFirebase.$get().notificacionesLeidasUrl
                objects_url.notificaciones_no_leidas = sFirebase.$get().notificacionesNoLeidasUrl
            }
            firebaseRef.registerUrl(objects_url);
        };



        routing.init(route, {
            '/': 'login',
            '/home': [
                'home',
                {
                    '/dashboard': 'dashboard',
                    '/dashboard_admin': 'dashboard-admin',
                    '/cuenta': 'actualizar-datos',
                    '/perfil': 'perfil',
                    '/menus': 'menu', 
                    '/menus/build': 'construir-menu',
                    '/roles': 'roles',
                    '/administrar_usuarios': 'administrar-usuarios',
                    '/administrar_usuarios/cuenta': 'administrar-cuenta',
                    '/registrar_usuarios': 'registrar-usuarios',
                    
                    '/mantenimientos/tipo_categoria' : 'category-type',
                    '/mantenimientos/categoria' : 'category',
                    '/mantenimientos/categoria/sub' : 'sub-categories',
                    '/mantenimientos/tipo_evento' : 'event-type',
                    
                    '/slider': 'slider',
                    '/mi_libro': 'my-book',
                    '/mi_libro/comentarios': 'comments-book',
                    '/mi_libro/galeria': 'gallery-book',
                    '/mi_libro/otros': 'others-book',

                    '/repositorio_cultural' : 'cultural-repository',
                    '/repositorio_cultural/profile' : 'create-profile',
                    '/galeria' : 'gallery',
                    '/galeria/detalle' : 'gallery-detail',
                    '/noticias' : 'post',
                    '/recorridos_virtuales' : 'virtual-tours',
                    '/empresa': 'business',
                    '/contacto': 'business-contact',
                    '/eventos': 'event',
                    '/blog': 'blog',
                    '/nosotros': 'business-about',
                    
                }
            ]
        });

        ConfigFirebase();
    },
    deps: [
        '$locationProvider',
        '$routeSegmentProvider',
        'pRoutingProvider',

        '$firebaseRefProvider',
        'cFirebase',
        'sMiddlewareProvider',
        'sFirebaseProvider',
        'pTranslateProvider',
    ]
});