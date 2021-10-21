import {
    dnComponent
} from '../../../../../../dine.js';

export default dnComponent({
    name: 'post',
    fn: function (scope, fApi, fCrud, sModal, sForm, cApi) {

        let Model = 'post';

        scope.path = cApi.STORAGE;
        scope.object = {};
        scope.bandera = false;

        scope.forms = {
            formPost : null
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

            scope.object.myCategories = scope.getIdsCatgorySelect();

            if (scope.object.myCategories.length == 0) {
                scope.spin_form = false;
                return sModal.error('Debe seleccionar al menos una categoria, para esta noticia.');
            }

            let operation = (scope.object.id == null) ? 'create' : 'update';
            
            if (operation == 'create')
                res = await fApi.image('post/create_newspaper',scope.object);
            else
                res = await fApi.image('post/update_newspaper',scope.object);

            PostTransaction(res);
        }

        scope.setDate = (dateToFormat) => {
            return moment(dateToFormat).format("DD/MM/YYYY HH:mm a");
        };
        
        scope.deletePost = (post) => {

            sModal.question('¿Seguro que desea eliminar esta noticia?', async () => {
                
                scope.loading = true;

                let res = await fApi.post('post/delete_newspaper',
                    {
                        post_id : post.id
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
                    scope.titleModal = 'Nueva Noticia';
                    sModal.open('modal-form');
                    break;
                case 1:
                
                    scope.titleModal = 'Editar Noticia';
                    scope.object.image = 'empty';
                    scope.default_image = scope.path + data.background_image;
                    
                    scope.categoryList.forEach( category => {
                    
                        let sub_data = data.category_post.find(item => item.id == category.id);
        
                        if(sub_data !== undefined )
                            category.select = true;
                        else
                            category.select = false;
                    });

                    sModal.open('modal-form');
                    break;
                case 2:
                    sModal.question('¿Desea eliminar esta Noticia de la lista?', scope.deleteEvent);
                    break;
                case 3:
                    sModal.question('¿Desea restaurar esta Noticia de la lista?', scope.restoreEvent);
                    break;
            }

        }
        
        scope.getIdsCatgorySelect = () => {
            
            let array = [];

            let tmp = scope.categoryList.filter(item => item.select);

            tmp.forEach( element => {

                array.push(element.id);
            });

            return array;
        };

        let Category = async () => {

            let query = await fApi.get('post/category_list');

            scope.categoryList = query.success ? query.info : [];

            scope.$apply();
        }
  
        scope.cleanForm = () => {
            
            scope.errors = null;
            
            scope.object = {};
            
            scope.default_image = null;
            
            scope.categoryList.forEach(item => item.select = false);

            scope.forms.formPost.$setPristine();
        };

        scope.onInit = () => {

            ListEvent();
            
            Category();

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
    templateUrl: './src/views/home/components/app/post/post.html',
    stylesUrl: './src/views/home/components/app/post/post.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sForm',
        'cApi'
    ]
});