
import { dnComponent } from '../../../dine.js';


export default dnComponent({
    
    name: 'gallery',

    fn: function (scope, fApi, cApi, sStorage, location) {
        
        scope.path = cApi.STORAGE;

        let ListGalleries = async () => {

            let res = await fApi.get('page/get_galleries');

            scope.ListGalleries = res.success ? res.info : [];

            scope.$apply();

        }

        scope.goToPhotos = (gallery) => {
            
            sStorage.set('gallery',gallery);

            location.path(`galeria/fotos`);
        }    

        let createCarousel = () => {

            scope.carrousel = $('#carousel_gallery');

            scope.carrousel.owlCarousel({
                center: true,
                margin:10,
                nav: true,
                autoplay: false,
                prevArrow: '.b2home_prev',
                nextArrow: '.b2home_next',
                slideBy: 1,
                responsive:{
                    0:{
                        items:1,
                        nav:true,
                        loop:true,
                    },
                    600:{
                        items:2,
                        nav:true,
                        loop:true
                    },
                    1000:{
                        items:4,
                        nav:true,
                        loop:true
                    }
                }
            });
                
            
        } 

        scope.OnInit = async () => {
            
            scope.loader = true;

            await ListGalleries();

            setTimeout(() => {
                
                createCarousel();
                            
            }, 100);  

            scope.loader = false;

            scope.$apply();
            
        };
  

    },
    
    templateUrl: './src/views/gallery/gallery.html',
    stylesUrl: './src/views/gallery/gallery.css',
    deps: [
        '$scope',
        'fApi',
        'cApi',
        'sStorage',
        '$location'
    ]
});