import { dnConfig } from "../../dine.js";

export default dnConfig({

    fn: function (location, route, firebaseRef, cfirebase) {

        location.hashPrefix('!');

        let ConfigFirebase = () => {
            
            
            firebase.initializeApp(cfirebase);

            const firestore = firebase.firestore();

            const settings = { 
            
                timestampsInSnapshots: true
            
            };
            
            firestore.settings(settings);
            
        };

        
        route
        
        .when('/',{ 
            template: '<dn-home></dn-home>' 
        })
        
        .when('/Piura-al-2032',{
            template:'<dn-my-book></dn-my-book>'
        })
        
        .when('/repositorio_cultural/',{
            template : '<dn-cultural-repository></dn-cultural-repository>'
        })
        
        .when('/perfil/:item',{
            template : '<dn-member-profile></dn-member-profile>'
        })

        .when('/galeria',{
            template : '<dn-gallery></dn-gallery>'
        })
         
        .when('/galeria/fotos',{
            template : '<dn-gallery-detail></dn-gallery-detail>'
        })

        .when('/noticias',{
            template : '<dn-post></dn-post>'
        })

        .when('/noticias/:item',{
            template : '<dn-post-detail></dn-post-detail>'
        })
        
        .when('/recorridos_virtuales',{
            template : '<dn-virtual-tours></dn-virtual-tours>'
        })

        .when('/eventos',{
            template : '<dn-event></dn-event>'
        })

        .when('/eventos/:item',{
            template : '<dn-event-detail></dn-event-detail>'
        })
       
        .when('/nosotros',{
            template : '<dn-about></dn-about>'
        })
        
        
        /*
        .when('/blog',{
            template : '<dn-blog></dn-blog>'
        })

        .when('/blog/:item',{
            template : '<dn-blog-detail></dn-blog-detail>'
        })
        */

        .when('/agenda',{
            template : '<dn-schedule></dn-schedule>'
        })

        .otherwise({  
			redirectTo:'/'
        })
        
        ConfigFirebase();
    },
    
    deps: [
        '$locationProvider',
        '$routeProvider',
        '$firebaseRefProvider',
        'cFirebase'
    ]
});