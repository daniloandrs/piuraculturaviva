import { dnInjectable } from '../../dine.js';

export default dnInjectable({
    name: 'fToast',
    module: 'mdFactories',
    fn: function (rootScope) {
        
        return {
            
            push : function(data) {

                switch(data.type) {
                
                    case 'success':
                        toastr.success(data.body, data.title);
                        break;
                    case 'info':
                        toastr.info(data.body, data.title);
                        break;
                    case 'warning':
                        toastr.warning(data.body, data.title);
                        break;
                    case 'error':
                        toastr.error(data.body, data.title);
                        break;
                }
            }
        }
    },
    deps: ['$rootScope']
});
