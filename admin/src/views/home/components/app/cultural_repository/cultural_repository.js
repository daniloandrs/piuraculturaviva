
import { dnComponent } from '../../../../../../../dine.js';

export default dnComponent({
    
    name: 'culturalRepository',

    fn: function (scope, fApi, fCrud, sModal, sStorage, sForm, cApi, location) {
        
        scope.path = cApi.STORAGE;

        scope.forms = {
            formMember : null
        };

        scope.subCategoriesList = [];

        scope.categoriaModel = {};
        
        scope.thumbnail_options = {
            dimentions: {
                width: 240000,
                height: 1800000,
                size:10240000
            }
        };

        scope.logo_options = {
            dimentions: {
                width: 150,
                height: 150,
            }
        };

        scope.ObjectMember = {};
        
        let getMembers = async () => {
            
            let query = await fApi.get('member/get_members');

            scope.memberList = query.success ? query.info : [];

            scope.$apply();
  
        }  

        let Category = async () => {

            let query = await fApi.get('member/categoryList');

            scope.categoryList = query.success ? query.info : [];

            scope.$apply();
        }
 
        scope.getSubcategories = async () => {

            setTimeout(async () => {

                let data = {
                    category_id : scope.categoriaModel.id
                };
                
                let query = await fApi.post('category/sub_category',data);
    
                scope.subCategoriesList = query.success ? query.info : [];
                
                scope.$apply();
                
            }, 100);
 
        };

        scope.clear = () => {

            scope.ObjectMember = {};
            
            scope.default_logo = null;

            scope.default_thumbnail = null;

            scope.subCategoriesList.forEach(item => item.select = false);

            scope.forms.formMember.$setPristine();
        }


        scope.profile = (member) => {

            sStorage.set('member',member);

            location.path(`/repositorio_cultural/profile`);
        }
        
        scope.openModal = (create = true, item = null ) => {

            scope.clear();

            if (create) {
                
                scope.titleModal = 'Nuevo Miembro';
                
            } else {

                scope.ObjectMember = angular.copy(item);
            }

            sModal.open('modal-member');
                  
        }

        scope.editMember = async (member) => {

            console.log(member);

            scope.clear();
             
            scope.ObjectMember = angular.copy(member);

            scope.default_thumbnail = scope.path + member.thumbnail;

            scope.default_logo      = scope.path + member.logo;

            let category_id = member.sub_category_member?.[0]?.category.id;

            scope.categoriaModel.id = category_id;

            let data = {
                category_id : scope.categoriaModel.id
            };

            let query = await fApi.post('category/sub_category',data);
    
            scope.subCategoriesList = query.success ? query.info : [];

            scope.$apply();

            scope.subCategoriesList.forEach( sub => {
                    
                let data = member.sub_category_member.find(item => item.id == sub.id);

                if(data !== undefined )
                    sub.select = true;
                else
                    sub.select = false;
                
            });

            sModal.open('modal-member');

        }
        
        scope.deleteMember = (member) => {
            
            sModal.question('¿Seguro que desea eliminar este Perfil?', async () => {
                  
                scope.loading = true;

                let res = await fApi.post('member/delete',
                    {
                        member_id : member.id
                    }  
                );
                
                PostTransaction(res);
                
                scope.loading =false;
                
                scope.$apply();
            });
        }

        let PostTransaction = async (res) => {

            if (res.success) {
            
                await getMembers();

                scope.spin_form = false;
                
                scope.clear();

                sModal.close('modal-member');
                
                sModal.success(res.message);

            } else {

                scope.spin_form = false;
 
                sModal.error(query.errors);
            }

        }

        scope.getIdsSubCatgorySelect = () => {
            
            let array = [];

            let tmp = scope.subCategoriesList.filter(item => item.select);

            tmp.forEach( element => {

                array.push(element.id);
            });

            return array;
        };

        scope.createMember = async () => {

            let query;

            let create = scope.ObjectMember.id ? false : true;

            scope.ObjectMember.mySubCategories = scope.getIdsSubCatgorySelect();

            scope.spin_form = true;

            if (create)
                query = await fApi.image('member/create',scope.ObjectMember);
            else
                query = await fApi.image('member/update',scope.ObjectMember);
            
            PostTransaction(query);

            
        };


        /**watch */

        scope.$watch('ObjectMember.name', newValue => {
            
            if (newValue)
                scope.ObjectMember.url = sForm.createUrl(newValue);
                  
        });

        scope.onInit =  async () => {
            
            scope.loading = true;

            await getMembers();

            await Category();

            scope.loading = false;
 
        }; 
    },  

    templateUrl: './src/views/home/components/app/cultural_repository/cultural_repository.html',
    stylesUrl: './src/views/home/components/app/cultural_repository/cultural_repository.css',
    deps: [
        '$scope',
        'fApi',
        'fCrud',
        'sModal',
        'sStorage',
        'sForm',
        'cApi',
        '$location'
    ]
});