
import { dnComponent } from '../../../dine.js';


export default dnComponent({
    
    name: 'myBook',

    fn: function (scope, sce, sFirebase, fToast, sForm, fApi, timeout,cApi ) {

        scope.loader;

        scope.formComment;
    
        scope.commentObject = {};

        scope.defaultProfile = './assets/img/login/avatar.svg';
        
        scope.inMobile;
         
        scope.path    = cApi.STORAGE;

        scope.misImgs = {
            
            mobile : './assets/img/PIURA-2032-EVENTO_MOBILE.png',
            web : './assets/img/PIURA-2032-EVENTO.png'
        }


        const CONFIG = {
        
            postID  : 'my_book',

            firebaseCollection :  'comments',

        }

        let Post = async () => {

            let json = {
                key_post : 'my_book'
            };

            let query = await fApi.post('page/getPost',json);

            scope.post = query.success ? query.info : {};
            
            scope.photos = scope.proccessImages(scope.post.libro_galeria);

            scope.misImgs = {
            
                mobile : scope.path + scope.post.background_image_mobile,
                web : scope.path + scope.post.background_image
            }

            scope.description = scope.post.description;
            
            scope.$apply();

        }

        scope.proccessImages = (array) => {

            let photos = [];

            angular.forEach(array, value => {

                photos.push({
                    fullres : scope.path + value.src,
                    thumbnail : scope.path + value.src,
                });
            });

            for (var i = 0; i < photos.length; i++) {
                photos[i].fullres = sce.trustAsResourceUrl(photos[i].fullres);
            }

            return photos;

        };

        let modelComments = 'book';

        let getCommentsBook = async () => {

            let query = await fApi.get(`page/get_comments/${modelComments}/${scope.IP}/${scope.post.id}`);

            scope.listcomments = query.success ? query.info : [];

            scope.$apply();
        }

        scope.clearForm = () => {

            scope.commentObject = {};

            scope.formComment ? scope.formComment?.$setPristine() : {};
        }

        scope.timeAgo = (date) => sForm.timeAgo(date);

        scope.newComment = async () => {

            scope.spin_form = true;
            
            scope.commentObject.status = false;
            
            scope.commentObject.model = modelComments;

            scope.commentObject.IP = scope.IP; 

            scope.commentObject.item_id = scope.post?.id;

            let query = await fApi.post('page/send_comment',scope.commentObject);

            scope.spin_form = false;
            
            if (query.success) {

                fToast.push({ title: 'Éxito', body : query.message , type: 'success' });
            
            } else {

                fToast.push({ title: 'Éxito', body : query.message  , type: 'error' });
            
            }
   
            scope.clearForm();  
            
            await getCommentsBook();

            scope.$apply();

        } 


        scope.download =  () => {
            
            scope.spin_book = true;

            fApi.download('download/book',{},'pdf','mi_file',false)

            .then( res => {

                scope.spin_book = false;

                scope.$apply();

            }).catch( error => {
                
                scope.spin_book = false;
                
                scope.$apply();
            });
        }

        scope.timeAgo = (date) => sForm.timeAgo(date);

        scope.clearForm = () => {

            scope.commentObject = {};

            scope.formComment ? scope.formComment?.$setPristine() : {};

        }

        let inMobile = () => {

            var width = window.innerWidth;

            if (width < 500 ) {
            
                scope.inMobile = true; 
            } else {

                scope.inMobile = false; 
            }

            scope.$apply();
        }

        $(window).resize(function(){
            
            inMobile();

            scope.$apply();
 
        });

        scope.onInit = async () => {
            
            scope.loader = true;
            
            scope.IP = await sForm.miIp();

            await Post();

            await getCommentsBook();

            
            timeout(() => {

                scope.target = $('#loop');

                scope.target.owlCarousel({
                    center: true,
                    loop:true,
                    margin:10,
                    nav: true,
                    autoplay: false,
                    prevArrow: '.b2home_prev',
                    nextArrow: '.b2home_next',
                    items: 1,
                    slideBy: 1,
                    prevArrow: '.b2home_prev',
                    nextArrow: '.b2home_next',
                    autoHeight : true,
                });
                
                
            },100);

            inMobile();

            scope.loader = false;

            scope.$apply();
        };

        scope.onInit();

    },
    
    templateUrl: './src/views/my_book/my_book.html',
    stylesUrl: './src/views/my_book/my_book.css',
    deps: [
        '$scope',
        '$sce',
        'sFirebase',
        'fToast',
        'sForm',
        'fApi',
        '$timeout',
        'cApi'
    ]
});