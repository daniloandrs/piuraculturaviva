
import { dnComponent } from '../../../dine.js';

export default dnComponent({
    
    name: 'home',

    fn: function (scope, cApi, fApi, timeout, fToast, rootScope, location, sStorage) {

        scope.path = cApi.STORAGE;

        scope.loader;  

        scope.forms = {}  

        scope.contactObject = {};
        
        scope.spin_form_contact = false;

        scope.misImgsContact = {};  

        scope.clearFormContact = () => {

            scope.contactObject = {};
        
            scope.forms.formContact ? scope.forms.formContact?.$setPristine() : {};

        }

        scope.shareModal = (item) => {

            let path = cApi.SHARED_URL;

            //let tmp_base = location.absUrl();

            scope.url_copy  = (path +'eventos/' + item.url_detail).trim();

            fToast.push({ title: 'Éxito', body : 'Copiado en el partapapeles. ' , type: 'success' });
            
        };   


        scope.setFecha = (fecha) => {
            return  moment(fecha).format('LLL a');
        }

        let GetEvents = async () => {

            let res = await fApi.post('page/get_events',{ take : null });

            scope.listEvents = res.success ? res.info : [];
        };


        scope.gotoCulturalRepository = (category,sub) =>  {

            let filters = {
                category_id : category.id,
                sub_category_id : sub.id
            };

            sStorage.set('cultural_repository', filters);

        };
        
        let GetBusinessData = async () => {

            let res = await fApi.get('page/get_business');

            rootScope.business = res.success ? res.info : [];

            scope.misImgsContact = {
            
                web : scope.path + rootScope.business.contact_background_image,
                mobile : scope.path + rootScope.business.contact_background_image_mobile,
            }

            rootScope.logo_navbar = scope.path  + rootScope.business.logos[0].image;

        }
   
        let GetNoticies = async () => {

            let res = await fApi.get('page/get_post');

            scope.listNoticies = res.success ? res.info : [];

        };   

        let GetSlider = async () => {
            
            let res = await fApi.get('page/get_slider');

            scope.listSlider = res.success ? res.info : [];
            
            scope.listSlider.forEach(item => {

                item.misImgs = {
            
                    web : scope.path + item.src_imagen,
                    mobile : scope.path + item.src_image_mobile
                }

            });
            
        };  

        let GetCategories = async () => {

            let res = await fApi.get('page/get_categories');

            scope.ListCategories = res.success ? res.info : [];

        }

        scope.MyStyle = function (color) {
            return {
                'border-right' : `8px solid ${color}`
            }
        }

        scope.videoLoad = () => {
            console.log('video ha cargado');
        }


        scope.sendContact = async () => {

            scope.spin_form_contact = true; 

            let query = await fApi.post('page/form_contact_send',scope.contactObject);

            if (query.success) {
                
                fToast.push({ title: 'Éxito', body : query.message , type: 'success' });
                
            } else {

                fToast.push({ title: 'Error', body : query.message , type: 'error' });
            }

            scope.spin_form_contact = false;

            scope.clearFormContact();

            scope.$apply();

        }  


        scope.Init = async () => {  
            
            scope.loader = true;

            scope.clearFormContact();

            await GetSlider();
            
            await GetCategories();
  
            await GetEvents(); 

            await GetBusinessData();

            await GetNoticies();

            $('#carousel_slider').carousel({});
            
            timeout(() => {

                scope.target_categories = $('#list-categories');

                scope.target_categories.owlCarousel({
                    center: false,
                    loop:true,
                    margin:0,
                    nav: true,
                    autoplay: false,
                    slideBy: 1,
                    navText : ["<i class='fas fa-caret-right fa-2x'></i>","<i class='fas fa-caret-right fa-2x'></i>"],
                    responsive:{
                        0:{
                            items:1,
                            nav:true,
                            loop:true,
                        },
                        600:{
                            items:2,
                            nav:true,
                            loop:true,
                        },
                        1000:{
                            items:4,
                            nav:true,
                            loop:true,
                        }
                    },
                    afterInit: function() {
                        console.log('osll')
                    }
                    
                });

                scope.target = $('#list-events');

                scope.target.owlCarousel({
                    center: false,
                    loop:false,
                    margin:0,
                    nav: true,
                    autoplay: false,
                    slideBy: 1,
                    autoHeight : false,
                    responsiveClass:true,
                    responsive:{
                        0:{
                            items:1,
                            nav:true,
                            loop:false
                        },
                        600:{
                            items:2,
                            nav:true,
                            loop:false
                        },
                        1000:{
                            items:4,
                            nav:true,
                            loop:false
                        }
                    }
                    
                });

                scope.target_2 = $('#list-blog');

                scope.target_2.owlCarousel({
                    center: false,
                    loop:false,
                    margin:40,
                    nav: true,
                    autoplay: false,
                    slideBy: 1,
                    autoHeight : false,
                    responsive:{
                        0:{
                            items:1,
                            nav:true,
                            loop:false
                        },
                        600:{
                            items:2,
                            nav:true,
                            loop:false
                        },
                        1000:{
                            items:4,
                            nav:true,
                            loop:false
                        }
                    }
                    
                });
                
                
            },100);

            scope.loader = false;

            scope.$apply();
        };

        scope.getBackgroundStyleContact = (src) => {
            return {
                'background-image':'url(' + src  + ')'
            }
        }

        scope.getBackgroundStyle = (src) => {
            return {
                'background-image':'url(' + scope.path + src  + ')'
            }
        }

    },
    
    templateUrl: './src/views/home/home.html',
    stylesUrl: './src/views/home/home.css',
    deps: [
        '$scope',
        'cApi',
        'fApi',
        '$timeout',
        'fToast',
        '$rootScope',
        '$location',
        'sStorage'
    ]
});