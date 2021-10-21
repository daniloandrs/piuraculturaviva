import {dnComponent} from "../../../dine.js";

export default dnComponent({
    name: 'login',
    fn: function (scope, location, cSession, sStorage, fUser, sModal, pTranslate, sLocal,auth) {

        
        scope.currentLang = sLocal.get('current-lang')
        pTranslate.use(scope.currentLang || 'sp')

        scope.session = sStorage.get(cSession.TOKEN);
        scope.modeUpdate = false;

        scope.login = {}

        scope.forgotPassword = () => {
            // scope.login = {};
            scope.modeUpdate = !scope.modeUpdate
        };

        scope.authenticate = function(provider) {
            auth.authenticate(provider);
        };

        scope.entry = () => {
            scope.login.currentLang = scope.currentLang;
            if (scope.modeUpdate) {
                scope.loading = true;
                fUser.passwordReset(scope.login, res => {
                    scope.loading = false;
                    if (res.success) {
                        sModal.success(res.message);
                        scope.modeUpdate = false;
                        login = {};
                    } else {
                        sModal.error(res.message);
                    }
                });

            } else {
                scope.loading = true;
                fUser.login(scope.login, res => {
                    scope.loading = false
                    if (res.success) {
                        sStorage.set(cSession.MENU, res.menu);
                        sStorage.set(cSession.USER, res.user);
                        sStorage.set(cSession.TOKEN, res.token);
                        sStorage.set(cSession.RUTAS, res.rutas);
                        sStorage.set(cSession.ACCESS, res.access);
                        location.path('/home');
                        window.location.reload()
                    } else {
                        sModal.error(res.message);
                    }
                });
            }

        };

    

        scope.onInit = () => {
            if (scope.session) {
                location.path('/home');
            }
        };
    },
    templateUrl: './src/views/login/login.html',
    stylesUrl: './src/views/login/login.css',
    deps: [
        '$scope',
        '$location',
        'cSession',
        'sStorage',
        'fUser',
        'sModal',
        'pTranslate',
        'sLocal',
        '$auth',
    ]
});