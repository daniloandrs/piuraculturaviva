
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    name: 'commentsBook',
    fn: function (scope, fApi, fCrud, sModal, sFirebase) {
        
        scope.objectSlider = {};

        let modelComments = 'book';

        let getComments = async () => {

            let query = await fApi.get(`comment/get_comments/${modelComments}/1`);

            scope.listComments = query.success ? query.info : [];
            
            scope.$apply();
        }

        let PostTransactionComment = async (res) => {
            if (res.success) {
                sModal.success(res.message);
                
               await getComments();
            } else {
                if (res.errors) scope.errors = res.errors;
            
                if (res.message) sModal.error(res.message);
            }  
        };  
        
        scope.approvedComment = async (comment) => {

            comment.spinner = true;
   
            comment.status = true;

            let query  = await fApi.post('comment/approved', comment);

            PostTransactionComment(query);

            comment.spinner = false;
            
        } 

        scope.notApprovedComment = async (comment) => {

            comment.spinner = true;

            comment.status = false;

            await fApi.post('comment/not_approved', comment);

            comment.spinner = false;

            await getComments();

            sModal.success('Comentario esperando aprobación.');

        }

        scope.deleteComment = async (comment) => {

            comment.spinner_delete = true;

            await fApi.delete('comment', comment.id);
       
            comment.spinner_delete = false;

            await getComments();

            sModal.success('Comentario eliminado correctamente.');

        }

        scope.cleanForm = () => {
         
            scope.errors = null;
         
        };

        scope.onInit = async () => {

            scope.loading = true;
            
            await getComments();
            
            scope.loading = false;

            scope.$apply();
        };
    },
    templateUrl: './src/views/home/components/app/mi_book/comments/comments.html',
    stylesUrl: './src/views/home/components/app/mi_book/comments/comments.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sFirebase'
    ]
});