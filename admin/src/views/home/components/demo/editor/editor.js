import {
    dnComponent
} from '../../../../../../dine.js';

export default dnComponent({
    name: 'demoEditor',
    fn: function (scope, fApi, fCrud, sModal) {

        let Model = 'editor';

        scope.formUsuario = null;

        scope.object = {};
        scope.bandera = false;

        scope.spin = false;

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

            [{ 'size': ['small', false, 'large', 'huge'] }], 

            , // custom dropdown
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
            [{ 'align': 'left'}, { 'align': 'center'}, {'align': 'right'}],

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

        let ListEvent = () => {
            scope.listData = [];
            scope.loading = fCrud.getdata(Model)
                .then(res => scope.listData = res.success ? res.info : [])
            console.log('scope.listData :>> ', scope.listData);
        };

        scope.saveEditor = () => {

            scope.object.content = quill.root.innerHTML;

            console.log('scope.object :>> ', scope.object);

            let operation = (scope.object.id == null) ? 'create' : 'update';
            scope.loading_modal = fCrud.executeCreateOrUpdate(Model, scope.object, operation, PostTransaction);
            
        }

        let PostTransaction = res => {
            if (res.success) {
                sModal.success(res.message);
                ListEvent();
            } else {
                if (res.errors) scope.errors = res.errors;
                if (res.message) sModal.error(res.message);
            }
        };


        scope.loadEdit = (row) => {
            console.log('row :>> ', row);
            scope.object = row;
            quill.root.innerHTML = row.content;
        }

        scope.onInit = () => {
            ListEvent();
        };
    },
    templateUrl: './src/views/home/components/demo/editor/editor.html',
    stylesUrl: './src/views/home/components/demo/editor/editor.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal'
    ]
});