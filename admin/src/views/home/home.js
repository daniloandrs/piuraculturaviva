import {
    dnComponent
} from '../../../dine.js';

export default dnComponent({
    name: 'home',
    fn: function (scope, middleware, root, ngroot, sModal, fApi, sLocal, sInterval, http, sStorage, cSession, fUser, location) {

        scope.middleware_info_error = middleware.middleware_info_error;
        scope.info_notify = middleware.info_notify;
        scope.isObject = angular.isObject;
        scope.replay = () => {
            middleware.replayXHR();
        };
        scope.toggleSidebar = () => {
            return root.get('state-sidebar');
        };
        let countdown,
            finished = false

        ngroot.date_format = 'dddd, DD MMMM YYYY, h:mm:ss a';

        scope.sendNotify = () => {

            scope.spin_send_notify = fApi.create('send/notify', scope.info_notify.value).then(res => {
                scope.closeModalNotify()
            })
        }

        scope.closeModalNotify = () => {
            sModal.close('send-notify-general')
        }

        function logout() {
            let token = sStorage.get(cSession.TOKEN);
            fUser.logout({
                token: token
            }, res => {
                sStorage.clear();
                location.path('');
            });
        } 

        function startCountdown() {
            sInterval.cancel(countdown)
            let limit = (sStorage.get(cSession.MAX_TIME) || 1440) * 60
            countdown = sInterval(() => {
                limit--
                scope.$broadcast('countdown', limit)
                // console.log(limit, countdown)
                if (limit === 0) {
                    sInterval.cancel(countdown)
                    finished = true
                    logout()
                }
            }, 1000)
        }

        scope.thisLoading = () => {
            let requests = http.pendingRequests
            return requests.length > 0;
        };

        scope.$watch('thisLoading()', before => {
            if (before && !finished) {
                startCountdown()
            }
        })

    },
    templateUrl: './src/views/home/home.html',
    stylesUrl: './src/views/home/home.css',
    deps: [
        '$scope',
        'sMiddleware',
        'sRoot',
        '$rootScope',
        'sModal',
        'fApi',
        'sLocal',
        '$interval',
        '$http',
        'sStorage',
        'cSession',
        'fUser',
        '$location'
    ]
});