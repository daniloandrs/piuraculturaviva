
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    name: 'othersBook',
    fn: function (scope, fApi, fCrud, sModal, sFirebase, textAngularManager) {
        
        scope.objectBackground;
        scope.objectBackgroundMobile;
        scope.objectPost = {};

        scope.path = './api/storage/app/';

        scope.image_options = {
            dimentions: {
                width: 24000,
                height: 180000,
                size:1024000
            }
        };

        var toolbarOptions = [

            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],

            [{
                'header': 1
            }, {
                'header': 2
            }], // custom button values
            [{
                'list': 'ordered'
            }, {
                'list': 'bullet'
            }],
            [{
                'script': 'sub'
            }, {
                'script': 'super'
            }], // superscript/subscript
            [{
                'indent': '-1'
            }, {
                'indent': '+1'
            }], // outdent/indent
            [{
                'direction': 'rtl'
            }], // text direction

            [{
                'size': ['small', false, 'large', 'huge']
            }], // custom dropdown
            [{
                'header': [1, 2, 3, 4, 5, 6, false]
            }],
            ['link', 'image', 'video', 'formula'],


            [{
                'color': []
            }, {
                'background': []
            }], // dropdown with defaults from theme
            [{
                'font': []
            }],
            [{
                'align': []
            }],

            ['clean'] // remove formatting button
        ];

        var quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                imageResize: {
                    displaySize: true
                }
            },
        });

        let Post = async () => {

            let post = {
                key_post : 'my_book'
            }

            let query = await fApi.post('libro/get_libro',post);

            scope.post = query.success ? query.info : [];

            scope.default_background = scope.path + scope.post.background_image;

            scope.default_background_mobile = scope.path + scope.post.background_image_mobile;

            scope.objectBackground = {
                post_id : scope.post.id,
                image : undefined
            };
            
            scope.objectBackgroundMobile = {
                post_id : scope.post.id,
                image : undefined
            };

            quill.root.innerHTML =  scope.post.description;

            scope.$apply();
        }
  
        scope.createOrUpdateBackground = async () => {
            
            scope.spin_background = true;

            scope.objectBackground.post_id = scope.post.id;

            let query = await fApi.image('libro/background_create',scope.objectBackground);

            if (query.success) {

                await Post();

                scope.spin_background = false;

                sModal.success(query.info);

                scope.$apply();
            }   

        };

        scope.createOrUpdateBackgroundMobile = async () => {

            scope.spin_background_mobile = true;

            scope.objectBackgroundMobile.post_id = scope.post.id;

            let query = await fApi.image('libro/background_mobile_create',scope.objectBackgroundMobile);

            if (query.success) {

                await Post();

                scope.spin_background_mobile = false;

                sModal.success(query.info);

                scope.$apply();
            }   
        };

        scope.saveText = async () => {
            
            scope.objectPost.content = quill.root.innerHTML;

            console.log(scope.objectPost);
            
            
            let query = await fApi.post('libro/save_text',{
                
                post_id : scope.post.id,
                description : scope.objectPost.content
            });  

            if (query.success) {
                sModal.success(query.message);
            }
        }
   
        scope.showTab = (id, subId, option) => {

            document.getElementById(id + "-content").className += " active";
            document.getElementById(subId + "-content").className = "tab-pane fade show";
    
        }

        scope.cleanForm = () => {
         
            scope.errors = null;
         
        };

        scope.onInit = async () => {

            scope.loading = true;

            await Post();

            scope.loading =false;

        };
    },
    templateUrl: './src/views/home/components/app/mi_book/others/others.html',
    stylesUrl: './src/views/home/components/app/mi_book/others/others.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sFirebase',
        'textAngularManager'
    ]
});