
import { dnComponent } from '../../../dine.js';

export default dnComponent({
    
    name: 'navbar',

    fn: function (scope, fApi, rootScope, cApi, location, timeout, sStorage) {

        scope.path = cApi.STORAGE;
        
        scope.disabledLive = true;


        let GetCategories = async () => {

            let res = await fApi.get('page/get_categories');

            scope.ListCategories = res.success ? res.info : [];

        }
  
        let getIsLive = async () => {
            
            let res = await fApi.get('page/get_is_live');

            scope.IsLive = res.success ? res.info : {};

            scope.disabledLive = (scope.IsLive == null) ?  true : false;
            
            scope.$apply();

        }  

        scope.toggle = (nav) => {

            $(".js-focus-visible").toggleClass("nav-open");
            return location.path(nav);
        }
        
        scope.gotoEvent = () => {

            if (scope.IsLive != null) {
                $(".js-focus-visible").toggleClass("nav-open");
                return location.path('eventos/'+scope.IsLive.url_detail);
            }
        }

        let GetBusinessData = async () => {

            let res = await fApi.get('page/get_business');

            rootScope.business = res.success ? res.info : [];

            rootScope.logo_navbar = scope.path  + rootScope.business.logos[0].image;

        }

        scope.gotoCulturalRepository = (category,sub, togle = null) =>  {

            let filters = {
                category_id : category.id,
                sub_category_id : sub.id
            };

            sStorage.set('cultural_repository', filters);

            scope.toggle(togle);
        };

        scope.Init = async () => {

            await GetCategories();

            await GetBusinessData();

            await getIsLive();

            timeout(() => {

                scope.target_categories = $('#navbar-list-categories');

                scope.target_categories.owlCarousel({
                    center: false,
                    loop:false,
                    margin:0,
                    nav: true,
                    autoplay: false,
                    slideBy: 1,
                    autoHeight : false,
                    responsive:{
                        0:{
                            items:1,
                            nav:true,
                            loop:false,
                            nav: true,
                        },
                        600:{
                            items:1,
                            nav:true,
                            loop:false,
                        },
                        1000:{
                            items:4,
                            nav:false,
                            loop:false,
                        }
                    }
                    
                });

            });

        }

    },

    templateUrl: './src/views/navbar/navbar.html',
    stylesUrl: './src/views/navbar/navbar.css',
    deps: [
        '$scope',
        'fApi',
        '$rootScope',
        'cApi',
        '$location',
        '$timeout',
        'sStorage'
    ]
});