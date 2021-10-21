import { dnRun } from '../../dine.js';

export default dnRun({
    fn: function (routing, sMiddleware, location, sStorage, cSession, http, sRoot, amMoment) {

        amMoment.changeLocale('es');
        routing.change(params => {
            sMiddleware.interceptUrl(params.event, params.next);
            sMiddleware.current_url.value = location.url();

            let token = sStorage.get(cSession.TOKEN);
            if (token) {
                http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            }
            sRoot.set('url', location.url());
            mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWxvYW5kcmVzIiwiYSI6ImNrMWp1YTE5YTB4NWQzYnBrd2p3dGw3anIifQ.8YOv0In4gCAydVr7HpIGnw';
        });

    },
    deps: [
        'pRouting',
        'sMiddleware',
        '$location',
        'sStorage',
        'cSession',
        '$http',
        'sRoot',
        'amMoment',
    ]
});