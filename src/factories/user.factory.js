import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'fUser',
    module: 'mdFactories',
    fn: function (resource, cLogin, cApi) {
        return resource(
            null,
            { token: '@token' },
            {
                login: { method: 'POST', url: cLogin.AUTH },
                logout: { method: 'POST', url: cApi.SERVER + 'logout?api_token=:token' },
                passwordReset: {method: 'POST', url: cLogin.PASSWORDRESET}
            }
        );
    },
    deps: [
        '$resource',
        'cLogin',
        'cApi'
    ]
});