
import { dnComponent } from '../../../dine.js';


export default dnComponent({
    
    name: 'culturalRepository',

    fn: function (scope, fApi,location, route, routeParams, sStorage, cApi) {

        scope.paramsName = routeParams.item;
        
        scope.filterObject = {};

        scope.path = cApi.STORAGE;

        let Categories = async () => {

            let query = await fApi.get('page/get_categories');

            scope.categoryList = query.success ? query.info : [];
             
            scope.$apply();

        };

        let getMembers = async (data = {}) => {

            let query = await fApi.post('page/get_members',data);

            scope.memberList = query.success ? query.info : [];
            
            scope.$apply();
        };  

        scope.filterCategory = async () => {

            scope.loader = true;

            await getMembers(scope.filterObject);

            scope.loader = false;

            scope.$apply();

        }


        let getSubCategories = async (category_id) => {

            let res = await fApi.get('page/sub_categories/' + category_id);

            scope.subCategoryList = res.success ? res.info : [];

            scope.$apply();

        };


        scope.$watch('filterObject.category_id',async newValue => {
            
            if (newValue) {

                await getSubCategories(newValue);
            }
        })

        scope.gotoProfile = (item) => {
            
            location.path(`perfil/${item.url}`);
            
        };

        let getFilterPages = () => {

            let filters = sStorage.get('cultural_repository');

            if (filters) {

                scope.filterObjectTmp = {
                    category_id : filters.category_id,
                    sub_category_id  : filters.sub_category_id
                };

                /*
                await getSubCategories(scope.filterObject.category_id);

                scope.filterObject.sub_category_id  = filters.sub_category_id;

                scope.$apply();
                */

                sStorage.remove('cultural_repository');

            }

        };

        scope.OnInit = async () => {

            scope.loader = true;

            await Categories();

            scope.$apply();

            getFilterPages();

            await getMembers(scope.filterObjectTmp);

            scope.loader = false;
            
            scope.$apply();

        };

    },
    
    templateUrl: './src/views/cultural_repository/cultural_repository.html',
    stylesUrl: './src/views/cultural_repository/cultural_repository.css',
    deps: [
        '$scope',
        'fApi',
        '$location',
        '$route',
        '$routeParams',
        'sStorage',
        'cApi'
    ]
});