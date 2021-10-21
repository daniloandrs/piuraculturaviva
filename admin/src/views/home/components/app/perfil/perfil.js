import { dnComponent } from '../../../../../../dine.js';

export default dnComponent({
    name: 'perfil',
    fn: function (scope, cSession, sStorage, cApi, pTranslate, fApi) {
        scope.mainObj = sStorage.get(cSession.USER);
        // Capi.
        console.log(scope.mainObj)
        scope.onInit = () => {
            getDatos()
            if (scope.mainObj) {
                scope.profileImage = cApi.STORAGE + scope.mainObj.profile_image;
            }
        };

        scope.isClient = sStorage.get(cSession.MENU).nombre === 'Cliente'
        pTranslate.use(scope.isClient ? 'en' : 'sp')

        let getDatos = () => {

            fApi.getdata('cliente/auth/datos').then(res => {

                scope.datos_cliente = res.info
            })
        }
    },
    templateUrl: './src/views/home/components/app/perfil/perfil.html',
    stylesUrl: './src/views/home/components/app/perfil/perfil.css',
    deps: [
        '$scope',
        'cSession',
        'sStorage',
        'cApi',
        'pTranslate',
        'fApi',
    ]
});