import { dnInjectable } from '../../dine.js';

export default dnInjectable({
    name: 'fEnv',
    module: 'mdFactories',
    fn: function () {
        return {
            APP_STATE_DEBUG: true,
            APP_THEME: 'default',
            APP_INTERCEPTED_URL: false,
            APP_LANG_CUR: 'es'
        }
    }
});