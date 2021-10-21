
import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({

    name: 'blog',

    fn: function (scope, fApi, fCrud, sModal, sForm, cApi) {

        let Model = 'blog';

        scope.path = cApi.STORAGE;
        scope.object = {};
        scope.bandera = false;

        scope.forms = {
            formBlog : null
        };

        scope.spin = false;

        var quill;

        var toolbarOptions = [

            ['bold', 'italic', 'underline', 'strike'],

            ['blockquote', 'code-block'],

            [{'header': 1}, { 'header': 2}],

            [{'list': 'ordered'}, {'list': 'bullet'}],

            [{ 'script': 'sub'}, {'script': 'super'}],
            
            [{'indent': '-1'}, {'indent': '+1'}],
            
            [{ 'direction': 'rtl'}],

            [{ 'size': ['small', false, 'large', 'huge'] }], 

            [{
                'header': [1, 2, 3, 4, 5, 6, false]
            }],

            ['link', 'image', 'video', 'formula'],

            [{
                'color': []
            }, {
                'background': []
            }],
            [{
                'font': []
            }],
            [{ 'align': 'left'}, { 'align': 'center'}, {'align': 'right'}],

            ['clean']
        ];

        scope.gallery_options = {
            dimentions: {
                width: 240000,
                height: 1800000,
                size:10240000
            }
        };

        let ListEvent = () => {
            scope.listData = [];
            scope.loading = fCrud.getdata(Model)
                .then(res => scope.listData = res.success ? res.info : [])         
        };

        scope.saveData = async () => {

            let res;       

            scope.spin_form = true;

            scope.object.content = quill.root.innerHTML;

            scope.object.url = sForm.createUrl(scope.object.title);
            
            let date = sForm.parseStringDate(scope.object.publication_date) + ' ' +sForm.parseStringTime(new Date());
            
            scope.object.publication_date_tmp = date;

            let operation = (scope.object.id == null) ? 'create' : 'update';
            
            if (operation == 'create')
                res = await fApi.image('blog/create_blog',scope.object);
            else
                res = await fApi.image('blog/update_blog',scope.object);

            PostTransaction(res);
        }

        scope.setDate = (dateToFormat) => {
            return moment(dateToFormat).format("DD/MM/YYYY HH:mm a");
        };
        
        scope.deleteBlog = (blog) => {

            sModal.question('¿Seguro que desea eliminar esta entrada?', async () => {
                
                scope.loading = true;

                let res = await fApi.post('blog/delete_blog',
                    {
                        blog_id : blog.id
                    }  
                );
                
                PostTransaction(res);

            });

        }

        let PostTransaction = res => {
            if (res.success) {
                ListEvent();
                sModal.close('modal-form');
                sModal.success(res.message);
                scope.spin_form = false;
                scope.loading = false;
            } else {
                if (res.errors) scope.errors = res.errors;
                if (res.message) sModal.error(res.message);
                scope.spin_form = false;
            }
        };

        scope.openModal = (type , data) => {

            scope.cleanForm();
            if (data) {
                scope.object = angular.copy(data);
                scope.object.publication_date =  sForm.parseDate(moment(data.publication_date).format('YYYY/MM/DD')) ;
                quill.root.innerHTML = data.content;
            }
            switch (type) {
                case 0:
                    quill.root.innerHTML = '';
                    scope.titleModal = 'Nueva Entrada';
                    sModal.open('modal-form');
                    break;
                case 1:
                
                    scope.titleModal = 'Editar Entrada';
                    scope.object.image = 'empty';
                    scope.default_image = scope.path + data.background_image;

                    sModal.open('modal-form');
                    break;
                case 2:
                    sModal.question('¿Desea eliminar esta Entrada de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar esta Entrada de la lista?', scope.restoreEvent);
                    break;
            }

        }

        scope.cleanForm = () => {
            
            scope.errors = null;
            
            scope.object = {};
            
            scope.default_image = null;
            
            scope.forms.formBlog.$setPristine();
        };

        scope.onInit = () => {

            ListEvent();
  
            setTimeout(() => {
                quill = new Quill('#editor', {
                    theme: 'snow',
                    modules: {
                        toolbar: toolbarOptions,
                        imageResize: {
                            displaySize: true
                        }
                    },
                });
            }, 100);

           
        };
    },
    templateUrl: './src/views/home/components/app/blog/blog.html',
    stylesUrl: './src/views/home/components/app/blog/blog.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sForm',
        'cApi'
    ]
});