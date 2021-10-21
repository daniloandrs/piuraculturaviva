/*
 DineJS for AngularJS v1.6.8
 @author: Jamie Mendoza in Andheuris
*/
const dnBootstrap = params => {
    const component = document.querySelector(params.component);
    if (component) {
        angular
            .element(document)
            .ready(() => {
                angular
                    .bootstrap(component, [params.name]);
            });
    } else {

    }
};

const dnController = () => {

};

const dnModule = (name, deps, options) => {
    if (deps) {
        const app = angular.module(name, deps);
        if (options) {
            if (options.config) app.config(options.config);
            if (options.run) app.run(options.run);
        }
    } else {
        return angular.module(name);
    }
    return name;
};

const addingTemplateAndStyles = (params, options, dirName) => {
    if (params.templateUrl) {
        options.templateUrl = params.templateUrl;

        const head = document.querySelector('head');
        let link;
        if (params.stylesUrl) {
            link = document.createElement('link');
            link.href = params.stylesUrl;
            link.rel = 'stylesheet';
        } else if (params.styles) {
            link = document.createElement('style');
            const node = document.createTextNode(params.styles || '');
            link.appendChild(node);
        }
        if (link) {
            link.setAttribute('component', dirName);
            head.appendChild(link);
        }
    } else if (params.template) {
        if (params.stylesUrl) {
            options.template = params.template;
            const head = document.querySelector('head');
            const link = document.createElement('link');
            link.href = params.stylesUrl;
            link.rel = 'stylesheet';
            link.setAttribute('component', dirName);
            head.appendChild(link);
        } else {
            options.template = `
                <style>${params.styles}</style>
                ${params.template}
            `;
        }
    } else if ((params.styles || params.stylesUrl) && (!params.template && !params.templateUrl)) {
        const head = document.querySelector('head');
        let link;
        if (params.stylesUrl) {
            link = document.createElement('link');
            link.href = params.stylesUrl;
            link.rel = 'stylesheet';
        } else {
            link = document.createElement('style');
            const node = document.createTextNode(params.styles || '');
            link.appendChild(node);
        }
        link.setAttribute('component', dirName);
        head.appendChild(link);
    }
};

const dnComponent = params => {
    let nameCapitalize = params.name.charAt(0).toUpperCase() + params.name.slice(1);
    const modName = `md${nameCapitalize}`,
        dirName = `dn${nameCapitalize}`;

    params.fn.$inject = params.deps;

    function fnComponent() {
        const options = {
            controller: params.fn,
            // bindings: params.scope
        };
        angular.forEach(params.others, (value, key) => {
            if (key === 'bind') key += 'ings';
            options[key] = value;
        });
        addingTemplateAndStyles(params, options, dirName);
        return options;
    };

    angular
        .module(modName, [])
        .component(dirName, new fnComponent());

    return modName;
};

const dnInjectable = params => {
    const type = params.name.charAt(0),
        module = dnModule(params.module);
    params.fn.$inject = params.deps;
    switch (type) {
        case 's':
            module.service(params.name, params.fn);
            break;
        case 'f':
            module.factory(params.name, params.fn);
            break;
        case 'c':
            module.constant(params.name, params.fn);
            break;
        case 'p':
            const fn = params.fn.private;
            fn.prototype.$get = params.fn.public;
            fn.prototype.$get.$inject = params.fn.deps;

            module.provider(params.name, fn);
            break;
    }
    return params.name;
};

const dnConfig = params => {
    if (params && params.fn) {
        params.fn.$inject = params.deps;
        return params.fn;
    }
};

const dnRun = params => {
    return dnConfig(params);
};

const dnPipe = params => {
    let nameCapitalize = params.name.charAt(0).toUpperCase() + params.name.slice(1),
        dirName = `f${nameCapitalize}`;
    if (params && params.fn) {
        const module = dnModule(params.module);
        params.fn.$inject = params.deps;
        module.filter(dirName, params.fn);
        return dirName;
    }
};

const dnDirective = params => {
    let nameCapitalize = params.name.charAt(0).toUpperCase() + params.name.slice(1),
        modName = `md${nameCapitalize}`,
        dirName = `d${nameCapitalize}`,
        module = params.module ? angular.module(params.module) : angular.module(modName, []);

    const fn = function (...deps) {
        const options = {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.dnElement = element;
                scope.dnAttrs = attrs;
                params.fn.apply(scope, deps);
            }
        };
        if (params.others) {
            options.transclude = params.others.transclude || false;
            options.replace = params.others.replace || false;
            options.scope = params.others.bind || false
        }
        addingTemplateAndStyles(params, options, dirName);
        return options;
    };
    fn.$inject = params.deps;
    module
        .directive(dirName, fn);
    return modName;
};

dnInjectable({
    name: 'pRouting',
    module: dnModule('mdExtends', []),
    fn: {
        private: function () {
            this.init = (route, segments) => {
                if (route) {
                    angular.forEach(segments, (component, url) => {
                        route
                            .when(url, url);
                        if (angular.isArray(component)) {
                            const segment = component[0];
                            const childs = component[1];
                            route
                                .segment(url, {
                                    template: `<dn-${segment}></dn-${segment}>`
                                });
                            let i = 0;
                            angular.forEach(childs, (childComponent, childUrl) => {
                                route
                                    .when(childUrl, `${url}.${childUrl}`);
                                route
                                    .within(url)
                                    .segment(childUrl, {
                                        default: i === 0,
                                        template: `<dn-${childComponent}></dn-${childComponent}>`
                                    });
                                i++;
                            });
                        } else {
                            route
                                .segment(url, {
                                    template: `<dn-${component}></dn-${component}>`
                                });
                        }
                    });
                }
            };
        },
        public: (root) => {
            return {
                change: (callback) => {
                    root.$on('$routeChangeStart', (e, next, prev) => {
                        callback({
                            event: e,
                            next: next,
                            prev: prev
                        });
                    });
                }
            };
        },
        deps: ['$rootScope']
    }
});


const dnSidebar = dnComponent({
    name: 'sidebar',
    fn: function (scope, sRoot, fUser, sStorage, cSession, location, element, cApi) {
        
        scope.selected = -1;
        scope.lastSelected = -1;
        scope.showOption = -1;

        scope.exit = () => {
            let token = sStorage.get(cSession.TOKEN);
            fUser.logout({
                token: token
            }, res => {
                sStorage.clear();
                location.path('');
            });
        };
        scope.listMenu = sStorage.get(cSession.MENU);
        scope.close = () => {
            if (element[0]) {
                let elem = angular.element('#toggle-sidebar');
                elem.prop('checked', false);
            }
        };
        scope.toggleSidebar = () => {
            scope.state_sidebar = sRoot.get('state-sidebar');
            return scope.state_sidebar;
        };
        
        scope.select= index => {
            scope.selected = index; 
        };

        scope.expanded = index => {
            if (scope.lastSelected != -1){
                if (scope.lastSelected != index)
                    $('#collapse_'+scope.lastSelected).removeClass( "show")
            }
            scope.lastSelected = index;
        }

        const Run = (() => {
            const user = sStorage.get(cSession.USER);
            scope.user = user;
            scope.menu = sStorage.get(cSession.MENU);
            scope.profileImage = {
                'background-image': `url(${cApi.STORAGE + user.profile_image})`
            };
        })();
    },
    deps: [
        "$scope",
        "sRoot",
        'fUser',
        'sStorage',
        'cSession',
        '$location',
        '$element',
        'cApi'
    ],
    // templateUrl: './src/components/system/sidebar/sidebar.html',
    // stylesUrl: './src/components/system/sidebar/sidebar.css',
    template: `<div class="dn-sidebar" ng:init="onInit()">
    <!-- <label for="toggle-sidebar" class="btn btn-info btn-icon btn-round button-sidebar btn-lg">
        <i class="fa fa-th-large"></i>
    </label> -->
    <input class="" type="checkbox" id="toggle-sidebar">
    <div class="sidebar-overlay" tabindex="1" ng:focus="close()">
        <div class="sidebar" tabindex="2">
            <div class="sidebar-header">
                <label for="toggle-profile">
                    <!-- <img class="profile-photo" src="./assets/img/sidebar/profile.png" alt=""> -->
                    <div class="profile-photo" ng:style="profileImage" d-lightbox-open></div>
                </label>
                <input type="checkbox" id="toggle-profile">
                <div class="menu-profile" tabindex="1">
                    <a class="dropdown-item" href="#/cuenta">
                        <i class="fa fa-image"></i> Cambiar Foto</a>
                    <a class="dropdown-item" href="#/perfil">
                        <i class="fa fa-user"></i> Ver Perfil</a>
                    <a class="dropdown-item" href="" ng:click="exit()">
                        <i class="fa fa-sign-out-alt"></i> Salir</a>
                </div>
                <h4 ng:bind="user.nick"></h4>
                <span ng:bind="menu.nombre"></span>
                <img src="./assets/img/background/computer_generated_image_of_the_mc3a6rsk_triple_e_class_cropped.jpg"
                    alt="">
            </div>
            <div class="sidebar-body">
                <ul class="sidebar-list">
                    <dn-none ng:repeat="opcion in listMenu.opciones|orderBy: 'nombre'">
               
                        <li> 
                            <a style="background: #ffffff;border-right: solid 5px;" 
                            data-toggle="collapse" data-target="#collapse_{{$index}}" 
                            aria-expanded="false" class="dropdown-toggle" href="" ng:click="expanded($index)">
                                <i class="fa fa-{{opcion.icono}}"></i>
                                &nbsp;&nbsp;&nbsp{{opcion.nombre|uppercase}}
                            </a>
                            <ul class="collapse sub-item" id="collapse_{{$index}}" ng:class="{hide:$index != lastSelected}">
                                <li ng:repeat="item in opcion.items|orderBy: 'nombre'" >
                                    <a class="sub-href" 
                                    href="#/{{item.url}}" ng:click="select($index)" 
                                    ng:class="{'_active':$index == selected}">
                                        <i class="fa fa-angle-double-right"></i>
                                        <span ng:bind="item.nombre"></span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </dn-none>
                </ul>
            </div>
        </div>
    </div>
</div>`,
    styles: `.dn-sidebar {
    --h-navbar: 62px;
}
.dn-sidebar .sidebar{
    position: fixed;
    text-align: center;
    width: 308px;
    height: 100%;
    background-color: #fff;
    top: 0;
    left: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    transition: .3s;
    z-index: 1;
    outline: none;
}
/* scrollbar */
.dn-sidebar .sidebar-overlay .sidebar::-webkit-scrollbar {
    width: 5px;
}
.dn-sidebar .sidebar-overlay .sidebar::-webkit-scrollbar-thumb {
    background-color: #cacaca;
    border-radius: 2px;
}

#toggle-sidebar:checked + .sidebar-overlay .sidebar {
    left: -300px;
    visibility: hidden;
}

.dn-sidebar .button-sidebar {
    display: none;
}

/* header */
.sidebar-header {
    padding-top: 62px;
    position: relative;
}
.sidebar-header label {
    display: block;
    margin: 0;
}
.sidebar-header .profile-photo {
    position: absolute;
    top: 77px;
    right: 15px;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border: 2px solid #fff;

    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
}
.sidebar-header h4, .sidebar-header span {
    color: #fff;
    position: absolute;
    margin-left: 15px;
}
.sidebar-header h4 {
    font-size: 14px;
    bottom: 20px;
}
.sidebar-header span {
    font-size: 11px;
    bottom: 15px;
}
.sidebar-header #toggle-profile {
    display: none;
}
.sidebar-header .menu-profile {
    position: absolute;
    text-align: left;
    width: 160px;
    min-height: 100px;
    top: 142px;
    right: 15px;
    background-color: #fff;
    visibility: hidden;
    opacity: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1060;
    transition: all .3s;
    padding: 5px 0;
}
.sidebar-header .menu-profile::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    top: -10px;
    right: 20px;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
    border-bottom: 5px solid #fff;
    border-right: 5px solid transparent;
}
.dropdown-toggle::after {
    margin-left: auto;
}
.sub-item {
    list-style: none;
    padding-inline-start: 0px;
}

.sub-href {
    background:#f3f4f5;
    padding-left:35px !important;
}

.sidebar-header #toggle-profile:checked + .menu-profile {
    visibility: visible;
    opacity: 1;
}
.sidebar-header .menu-profile a {
    font-size: 13px;
    padding-top: .6rem;
    padding-bottom: .6rem;
    padding-left: 18px;
    margin-top: 5px;
    color: #666;
}
.sidebar-header .menu-profile a:active {
    background-color: #ACACAC;
}
.sidebar-header .menu-profile a i {
    font-size: 17px;
    margin-right: 7px;
    line-height: 10px;
}
._active {
    border-left: solid #4CAF50;
}
/*  */

/* body */
.sidebar-body {
    /* padding: 0 20px; */
}
.sidebar-body .sidebar-list {
    list-style: none;
    padding-left: 0;
    text-align: left;
}
.sidebar-body .sidebar-list li {
    display: list-item;
}
.sidebar-body .sidebar-list .header {
    background: #eee;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 16px;
    text-transform: uppercase;
}
.sidebar-body .sidebar-list a {
    color: #747474;
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    width: 100%;
    //padding: 10px 13px;
    padding: 15px 17px;
    text-decoration: none;
    transition: all .5s;
}
.sidebar-body .sidebar-list a:active {
    background-color: #ACACAC;
}
.sidebar-body .sidebar-list a i {
    margin-top: 7px;
    font-size: 18px;
}
.sidebar-body .sidebar-list a span {
    margin: 7px 0 7px 12px;
    color: #333;
    /* font-weight: bold; */
    font-size: 13px;
    overflow: hidden;
}

#toggle-sidebar {
    display: none;
}

@media screen and (max-width: 991px) {

    .sidebar-header {
        padding-top: 0;
    }

    .sidebar-header .profile-photo {
        top: 20px;
    }

    .dn-sidebar .sidebar-overlay {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        margin-bottom: 0;
        z-index: 1050;
        visibility: hidden;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);
    }

    #toggle-sidebar:checked + .sidebar-overlay .sidebar {
        left: 0;
        visibility: visible;
    }
    
    #toggle-sidebar:checked + .sidebar-overlay {
        visibility: visible;
        opacity: 1;
        transition: .3s;
    }
    
    .dn-sidebar .sidebar-overlay .sidebar {
        position: fixed;
        background-color: #fff;
        width: 300px;
        height: calc(100% - --h-navbar);
        top: var(--h-navbar);
        left: -100%;
        z-index: 1051;
        overflow-y: auto;
        transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);
    }

    /* toggle */
    .dn-sidebar .button-sidebar {
        position: absolute;
        bottom: 30px;
        left: 30px;
        display: block;
        z-index: 1;
    }

    #toggle-sidebar:checked {
        display: none;
    }
    .sidebar-header .menu-profile {
        top: 85px;
    }
}
`
});

const dnBreadcrumb = dnComponent({
    name: 'breadcrumb',
    fn: function (scope, sRoot) {
        scope.loadData = () => {
            const url = sRoot.get('url');
            return url;
        };
        scope.$watch('loadData()', before => {
            if (before) {
                const NSimbols = before.split('/').length - 1;
                let SlashBegin = 0;
                scope.list_routes = [];
                for (let i = 0; i < NSimbols; i++) {
                    let SlashEnd = before.indexOf('/', SlashBegin + 1);
                    SlashEnd = SlashEnd === -1 ? before.length : SlashEnd;
                    let Word = before.substring(SlashBegin + 1, SlashEnd);
                    scope.list_routes.push({
                        name: Word,
                        url: '#/home'
                    });
                    SlashBegin = SlashEnd;
                }
            }
        });
    },
    deps: ['$scope', 'sRoot'],
    // templateUrl: './src/components/system/bread/breadcrumb.html',
    // templateCss: './src/components/system/bread/breadcrumb.css'
    template: `<div class="dn-breadcrumb">
    <div class="container-fluid no-padding">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" ng:repeat="row in list_routes" ng:class="{ 'active': $last }">
                <a href="{{row.url}}" ng:bind="row.name" ng:if="!$last"></a>
                <span ng:bind="row.name" ng:if="$last"></span>
            </li>
        </ol>
    </div>
</div>`,
    styles: `.dn-breadcrumb {

}
.dn-breadcrumb .breadcrumb {
    background-color: transparent;
}
.dn-breadcrumb li {
    text-transform: capitalize;
}`
});

const dnHeader = dnComponent({
    name: 'header',
    fn: function (scope, sMiddleware) {
        scope.allowed_routes = sMiddleware.allowed_routes;
        const basePath = '/home';
        const blackList = [
            '/ventas'
        ];

        scope.back = () => {
            window.history.back();
        };

        scope.current_url = sMiddleware.current_url;

        let JoinUrls = (array, key) => {
            let url;
            if (angular.isArray(array)) {
                let temp_array = array.slice(0, key + 1);
                url = temp_array.join('/');
            }
            return url;
        };

        let CreateBread = compound_path => {
            let separator = '/';
            let array_urls = compound_path.split(separator);

            scope.breadcrumb = [];

            let route = scope.allowed_routes[basePath];
            if (compound_path !== basePath && route) scope.breadcrumb.push({
                name: route.name,
                icon: route.icon,
                url: basePath
            });

            angular.forEach(array_urls, (value, key) => {
                let url_joined = JoinUrls(array_urls, key);
                let path = scope.allowed_routes[url_joined];
                if (path) {
                    let route = {
                        name: path.name,
                        icon: path.icon,
                        url: separator + value
                    }
                    scope.breadcrumb.push(route);
                }
            });
        };

        scope.$watch('current_url.value', before => {
            scope.ignore = blackList.indexOf(before) !== -1;
            if (scope.ignore) {

            } else {
                scope.name_route = scope.allowed_routes[before];
                sMiddleware.changeRouteMask(mask => {
                    return mask
                });
                if (before) CreateBread(before);
            }
        });
    },
    deps: [
        '$scope',
        'sMiddleware'
    ],
    // templateUrl: './src/components/system/header/header.html',
    // stylesUrl: './src/components/system/header/header.css'
    template: `<div class="dn-header" ng:if="!ignore">
    <div class="row">
        <div class="col-md-6 fix-col">
            <div class="container-fluid container-title">
                <button class="btn btn-icon btn-link" ng:click="back()">
                    <i class="fa fa-arrow-left"></i>
                </button>
                <button class="btn btn-icon btn-link btn-header-icon">
                    <i ng:class="name_route.icon"></i>
                </button>
                <small dir-html-compile="name_route.masked"></small>
            </div>
        </div>
        <div class="col-md-6 fix-col">
            <div class="container-fluid container-breadcrumb">
                <small>
                    <a ng:href="{{!$last ? '#' + route.url : ''}}" ng:repeat="route in breadcrumb">
                        <span ng:bind="route.name"></span>
                        <i class="fas fa-caret-right"></i>
                    </a>
                </small>
            </div>
        </div>
    </div>
</div>`,
    styles: `.dn-header {
        background-color:  #00C1D5;
        color: #fff;
        padding: 0 16px;
        margin-bottom: 10px;
        border-radius: 5px;
    }
    .dn-header .container-fluid {
        display: flex;
        align-items: center;
    }
    .dn-header .container-fluid.container-title {
        justify-content: flex-start;
    }
    .dn-header .container-fluid.container-breadcrumb {
        height: 58px;
        justify-content: flex-end;
    }
    .dn-header .container-fluid.container-breadcrumb small {
        text-transform: capitalize;
        word-break: break-all;
    }
    .dn-header .container-fluid.container-breadcrumb a {
        color: #fff;
        text-decoration: none;
    }
    .dn-header .container-fluid.container-breadcrumb a i.fas {
        vertical-align: middle;
        margin: 0 5px;
    }
    .dn-header .container-fluid.container-breadcrumb a:last-child {
        /*color: #6c757d!important;*/
        cursor: default;
    }
    .dn-header .container-fluid.container-breadcrumb a:last-child i.fas {
        display: none;
    }
    .dn-header .btn-header-icon {
        margin: 0 0 0 20px;
        cursor: default !important;
    }
    .dn-header small {
        text-transform: capitalize;
        cursor: default;
    }
    .dn-header .btn i {
        font-size: 16px;
        color: #fff;
    }
    @media screen and (max-width: 414px) { 
        .dn-header {
            padding: 0;
        }
        .dn-header .container-fluid.container-breadcrumb {
            justify-content: center !important;
        }
    }`
});

const dnNotifications = dnComponent({
    name: 'notifications',
    fn: function (scope, ffirebase, timeout, interval, modal, env, system_notifications, q, fapi) {

        let Events = {
            added: 'child_added',
            moved: 'child_moved',
            removed: 'child_removed',
            changed: 'child_changed'
        },
            TimeLife__backup = 2000,
            TimeLife = TimeLife__backup,
            ConfirmationPendding = false,
            sound = new Audio('./assets/sounds/Popcorn.ogg'),
            IntervalCleaner;

        scope.messagesArray = [];
        // scope.messagesSystemArray = [];
        // scope.mailbox = ffirebase.notificaciones_no_leidas;
        scope.notifications = ffirebase.notificaciones_no_leidas;
        scope.notificaciones_leidas = ffirebase.notificaciones_leidas;

        let ActionsForNewMessage = message => {
            scope.messagesArray.push(message);
            sound.play();
        };
        scope.notifications.$watch(evt => {
            if (evt.event === Events.added) {
                scope.notifications.sort();
                let message = scope.notifications.$getRecord(evt.key);
                let message_clean = {
                    id: message.id,
                    asunto: message.asunto,
                    emisor: message.emisor,
                    fecha: message.fecha,
                    mensaje: message.mensaje,
                    removed: false
                };
                ActionsForNewMessage(message);
            }
        });

        scope.closeMail = index => {
            if (index) {
                scope.messagesArray[index].removed = true;
                timeout(() => {
                    scope.messagesArray.splice(index, 1);
                }, 200);
            } else {
                if (scope.messagesArray[0]) scope.messagesArray[0].removed = true;
                timeout(() => {
                    scope.messagesArray.shift();
                }, 200);
            }
        };

        let CreateNewInterval = () => {
            IntervalCleaner = interval(() => {
                scope.closeMail();
            }, TimeLife, scope.messagesArray.length);
        };

        let CancelInterval = () => {
            interval.cancel(IntervalCleaner);
        };

        scope.closeAllMails = () => {
            CancelInterval();
            TimeLife = 200;
            CreateNewInterval();
            // scope.messagesArray = []
        };

        scope.$watch('messagesArray', before => {
            CancelInterval();
            if (before.length > 0 && !scope.messagesArray[0].removed) {
                CreateNewInterval();
            } else {

            }
            if (scope.messagesArray.length > 3) {
                let message_clean = {
                    id: undefined,
                    asunto: `Tienes ${scope.messagesArray.length} mensajes sin leer`,
                    emisor: 'Último mensaje',
                    fecha: scope.messagesArray[0] ? scope.messagesArray[0].fecha : undefined,
                    removed: false
                };
                scope.messagesArray = [];
                scope.messagesArray.push(message_clean);
            }
        }, true);

        let checkedRead = item => {
            if (item.leido) return

            scope.notifications.$remove(item).then(() => {
                let new_item = angular.copy(item)
                new_item.leido = true
                scope.notificaciones_leidas.$add(new_item);
            })
        }

        scope.openMail = mail => {
            if (!mail.id) return

            scope.current_message = angular.copy(mail);

            modal.open('modal-show-message', () => {
                checkedRead(mail);
            });
        };
    },
    deps: [
        '$scope',
        'sMyFirebase',
        '$timeout',
        '$interval',
        'sModal',

        // '$env',
        // // 'system_notifications.service',
        // '$q',
        // 'sApi',
        // 'sMyFirebase',
    ],
    // templateUrl: './src/components/system/notifications/notifications.html',
    // stylesUrl: './src/components/system/notifications/notifications.css',
    template: `<div class="notification-app">
    <div class="notifications-container" ng:if="messagesArray.length > 0">
        <div class="notifications-body" ng:mouseenter="hoverNotification(true)" ng:mouseleave="hoverNotification(false)">
            <ul class="list-unstyled">
                <li class="message" ng:repeat="mail in messagesArray" ng:class="{'removed':mail.removed}">
                    <div class="container-fluid">
                        <div class="row" ng:click="openMail(mail)">
                            <div class="col-2 message-icon">
                                <img class="img" src="./assets/img/pedidos/mantel.jpg" alt="">
                            </div>
                            <div class="col-10 message-content">
                                <strong ng:bind="mail.asunto"></strong>
                                <small class="text-muted"></small>
                                <small>
                                    <span ng:bind="mail.emisor"></span> ha notificado
                                    <span am-time-ago="mail.fecha | amFromUnix"></span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-icon btn-link btn-close" ng:click="closeMail($index)">
                        <i class="fa fa-times"></i>
                    </button>
                </li>
            </ul>
        </div>
        <div class="notifications-footer">
            <button class="btn btn-link btn-icon btn-sm" ng:click="closeAllMails()">
                <i class="fa fa-times"></i>
            </button>
        </div>
    </div>
</div>


<dn-modal name="modal-show-message" size="lg" title-modal="Detalles del mensaje - {{current_message.emisor}}">
    <div class="modal-mailbox">
        <div class="general-preview-content">
            <div ng:if="current_message" d-html-compile="current_message.mensaje"></div>
        </div>
    </div>
</dn-modal>`,
    styles: `.notification-app {
    position: fixed;
    width: 290px;
    /* border: 1px solid green; */
    /* min-height: 40%; */
    bottom: 10px;
    right: 10px;
    z-index: 1060;
}
.notification-app .notification-container {
    
}
.notification-app .notifications-footer {
    padding: 10px;
    padding-bottom: 15px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    width: 100%;
    /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); */
}
.notification-app .notifications-footer::before {
    content: 'Grinvel Notifications';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #eee;
    /* background-color: rgba(0,0,0, .9); */
    top: 0;
    left: 0;
    color: #000;
    font-size: 10px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-style: solid;
    border-width: 1px;
    border-bottom-color: rgba(0, 0, 0, .07);
    border-left-color: rgba(0, 0, 0, .07);
    border-right-color: rgba(0, 0, 0, .07);
    border-top: none;
}
.notification-app .notifications-footer button {
    margin: 0;
    margin-left: 5px;
}
.notification-app .notifications-footer i {
    color: #676566;
    font-size: 12px;
}

.notification-app .notifications-body {
    position: absolute;
    width: 100%;
    /* height: 100%; */
    /* border: 1px solid red; */
    background-color: #eee;
    bottom: 50px;
    left: 0;
    padding: 7px;
    padding-bottom: 0;
    border-style: solid;
    border-width: 1px;
    border-top-color: rgba(0, 0, 0, .07);
    border-left-color: rgba(0, 0, 0, .07);
    border-right-color: rgba(0, 0, 0, .07);
    border-bottom: none;
    /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); */
}
.notification-app .notifications-body ul {
    margin-bottom: 0;
}
.notification-app .notifications-body .message {
    position: relative;
    left: 0;
    width: 100%;
    min-height: 90px;
    padding: 7px;
    margin-bottom: 10px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
}
.notification-app .notifications-body .message.removed {
    opacity: 0;
    left: -50px;
}
.notification-app .notifications-body .message .message-icon {
    padding: 0;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7px;

}
.notification-app .notifications-body .message .message-content small,
.notification-app .notifications-body .message .message-button-open small {
    display: block;
    font-size: 10px;
}
.notification-app .notifications-body .message .message-button-open {
    padding: 10px;
    padding-bottom: 5px;
    border-top: 1px solid #f1f1f1;
    margin-top: 7px;
}
.notification-app .notifications-body .message .message-button-open small {
    cursor: pointer;
}
.notification-app .notifications-body .message .btn-close {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    margin: 0;
}`
});

const mdSystem = dnModule('mdSystem', [
    dnSidebar,
    dnBreadcrumb,
    dnHeader,
    dnNotifications,
]);

const mdModal = dnComponent({
    name: 'modal',
    fn: function () {

    },
    // templateUrl: './src/components/user/swal/modal.html',
    template: `<div id="modal_{{$ctrl.name}}" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" data-focus="false">
    <div class="modal-dialog modal-{{$ctrl.size}} mx-auto" ng:class="'scale-' + $ctrl.scale">
        <div class="modal-content">
            <div class="modal-header-custom fix-col justify-content-center">
                <button type="button" class="btn btn-link btn-icon btn-sm btn-close-modal" data-dismiss="modal">
                    <i class="fa fa-times"></i>
                </button>
                <div class="title title-up">{{$ctrl.titleModal}}</div>
            </div>
            <div class="modal-body">
                <ng-transclude></ng-transclude>
            </div>
        </div>
    </div>
</div>`,
    others: {
        transclude: true,
        bindings: {
            name: "@",
            titleModal: "@",
            size: "@",
            scale: '='
        }
    }
});


const mdModalFrame = dnComponent({
    name: 'modalFrame',
    fn: function () {

    },
    // templateUrl: './src/components/user/swal/modal.html',
    template: 
    `
    <div class="modal fade" id="modalYT_{{$ctrl.name}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false">
        
        <div class="modal-dialog modal-lg" role="document">

            <div class="modal-content">

                <div class="modal-body mb-0 p-0">

                    <ng-transclude></ng-transclude>

                </div>

            </div>

        </div>

    </div>
    `,
    
    styles : 
    `
        .modal .modal-content {
            box-shadow: none !important;
            background-color : #007bff00;
        }
    `
    ,
    others: {
        transclude: true,
        bindings: {
            name: "@",
        }
    }
});

const mdSwal = dnComponent({
    name: 'swal',
    // templateUrl: './src/components/user/swal/swal.html',
    // stylesUrl: './src/components/user/swal/swal.css',
    template: `<div class="dn-swal" ng:class="{'active': properties.state}" tabindex="0" ng:focus="close()">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 col-sm-5 mx-auto">
                <div class="card card-main" tabindex="1">
                    <div class="card-header" ng:class="'bg-' + properties.type"></div>
                    <div class="card-body body-modal">
                        <div ng:if="properties.type">
                            <div class="icon d-flex justify-content-center" d-html-compile="getDynamicallTemplate()"></div>
                            <div class="text-center type-text" ng:switch="properties.type">
                                <small ng:switch:when="warning">operación interrumpida</small>
                                <small ng:switch:when="error">operación fallida</small>
                                <small ng:switch:when="success">operación exitosa</small>
                                <small ng:switch:when="info">información</small>
                                <small ng:switch:when="question">pregunta</small>
                                <br>
                                <strong ng:if="properties.content" class="type-text-secondary" d-html-compile="properties.content"></strong>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center justify-content-center">
                        <form name="form-swal" ng:submit="close()">
                            <button type="submit" ng:click="accept()" class="btn btn-primary" ng:if="properties.type === 'question'"
                                ng:disabled="requests.length > 0" id="button-accept">Aceptar</button>
                            <button type="submit" class="btn btn-default" id="button-cancel">Cerrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
    styles: `/* ALL STYLES FOR COMPONENT */

    .dn-swal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        opacity: 0;
        visibility: hidden;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1), visibility 0.3s cubic-bezier(0.55, 0, 0.1, 1);
        transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1), visibility 0.3s cubic-bezier(0.55, 0, 0.1, 1);
        z-index: 1070000000000000000000000000;
        outline: none;
    }
    .dn-swal .card.card-main {
        box-shadow: 0 10px 50px 0 rgba(0, 0, 0, .5) !important;
        border: none;
    }
    .dn-swal .card.card-main:focus {
        outline: none;
    }
    .dn-swal.active {
        opacity: 1;
        visibility: visible;
    }
    .dn-swal .card {
        margin-top: 50px;
    }
    .dn-swal .card-body.body-modal {
        max-height: 71vh;
        overflow-y: auto;
        background-color: #EEEEEE;
    }
    .dn-swal .card-body.body-modal .type-text {
        font-weight: bold;
        text-transform: uppercase;
    }
    .dn-swal .card-body.body-modal .type-text-secondary {
        font-size: 70%;
        margin-top: 10px;
        margin-bottom: 20px;
        display: block;
        font-size: 9.8px !important;
    }
    .dn-swal .card-body.body-modal .icon {
        padding-bottom: 1.25rem;
    }
    .dn-swal .card-body.body-modal .icon span i {
        font-size: 70px;
    }
    .dn-swal .card-body.body-modal .icon span.warning {
        color: #FFB236
    }
    .dn-swal .card-body.body-modal .icon span.error {
        color: #FF3636
    }
    .dn-swal .card-body.body-modal .icon span.success {
        color: #42CB6F
    }
    .dn-swal .card-body.body-modal .icon span.information {
        color: #4BB5FF
    }
    .dn-swal .card-body.body-modal .icon span.question {
        color: #888888
    }
    .dn-swal .card-header.bg-success {
        background-color: #42CB6F !important
    }
    .dn-swal .card-header.bg-error {
        background-color: #FF3636 !important
    }
    .dn-swal .card-header.bg-info {
        background-color: #4BB5FF !important
    }
    .dn-swal .card-header.bg-question {
        background-color: #888888 !important
    }
    .dn-swal .card-footer {
        min-height: 58px;
    }
    .dn-swal .card-header {
        min-height: 20px;
    }
    .dn-swal .card-footer {
        margin-top: 0;
        box-shadow: 0 -5px 10px rgba(0, 0, 0, .10);
        background-color: #fff !important;
    }
    .dn-swal .card-header::after {
        content: none;
    }
    .dn-swal .card-footer .btn {
        margin-right: 10px;
    }
    body.hideScroll::-webkit-scrollbar,
    .modal-open::-webkit-scrollbar {
        background-color: rgba(0, 0, 0, 0.3);
    }
    
    /* MODAL BT */
    .modal .modal-content {
        box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 
                    0 24px 38px 3px rgba(0,0,0,.14), 
                    0 9px 46px 8px rgba(0,0,0,.12) !important;
    }
    .modal-open {
        overflow-y: auto;
    }
    .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.3);
    }
    .modal-backdrop.show {
        opacity: 1;
    }
    .modal .title {
        text-transform: uppercase;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .btn-close-modal {
        position: absolute !important;
        right: 14px;
        top: 4px;
    }
    .modal .modal-header-ire {
        min-height: 58px;
        padding: 0 24px;
    }
    .modal-sm .title {
        text-align: left;
    }
    .modal-full {
        position: absolute;
        top: 0;
        margin: 0;
    }
    /*.modal-full .modal-content {
        position: absolute;
        min-width: 100vw !important;
        min-height: 100vh !important;
    }*/
    
    .modal .modal-dialog.scale-1 { max-width: calc(8.33% - 56px) }
    .modal .modal-dialog.scale-2 { max-width: calc(16.66% - 56px) }
    .modal .modal-dialog.scale-3 { max-width: calc(25% - 56px) }
    .modal .modal-dialog.scale-4 { max-width: calc(33.33% - 56px) }
    .modal .modal-dialog.scale-5 { max-width: calc(41.66% - 56px) }
    .modal .modal-dialog.scale-6 { max-width: calc(50% - 56px) }
    .modal .modal-dialog.scale-7 { max-width: calc(58.33% - 56px) }
    .modal .modal-dialog.scale-8 { max-width: calc(66.66% - 56px) }
    .modal .modal-dialog.scale-9 { max-width: calc(75% - 56px) }
    .modal .modal-dialog.scale-10 { max-width: calc(83.33% - 56px) }
    .modal .modal-dialog.scale-11 { max-width: calc(91.66% - 56px) }
    .modal .modal-dialog.scale-12 { max-width: calc(100% - 56px) }
    
    .modal-backdrop {
        z-index: 1070 !important;
    }
    .modal {
        z-index: 1071 !important;
    }
    
    .modal-content .modal-header-custom {
        min-height: 58px;
        padding: 0 58px;
        align-content: center;
        box-shadow: 0 5px 10px rgba(0, 0, 0, .10);
        z-index: 1;
        position: relative;
    }
    .modal-content .modal-body {
        padding-top: 16px;
        background-color: #fff;
    }
    @media screen and (max-width: 991px) {}
    @media screen and (max-width: 414px) { 
        .modal-dialog {
            margin-left: 8px !important;
            margin-right: 8px !important;
        }
        .modal .modal-dialog.scale-1,
        .modal .modal-dialog.scale-2,
        .modal .modal-dialog.scale-3,
        .modal .modal-dialog.scale-4,
        .modal .modal-dialog.scale-5,
        .modal .modal-dialog.scale-6,
        .modal .modal-dialog.scale-7,
        .modal .modal-dialog.scale-8,
        .modal .modal-dialog.scale-9,
        .modal .modal-dialog.scale-10,
        .modal .modal-dialog.scale-11,
        .modal .modal-dialog.scale-12 {
    
            max-width: initial;
            width: 100%;
        }
    }`,
    fn: function (scope, modal, http, timeout) {

        let Body = angular.element('body');
        scope.properties = modal.properties;
        scope.requests = http.pendingRequests;
        scope.changeState = state => scope.properties.state = state;
        scope.getDynamicallTemplate = () => {
            let template = '';
            switch (scope.properties.type) {
                case 'warning':
                    template = '<span class="warning"><i class="fa fa-exclamation-triangle"></i></span>';
                    break;
                case 'error':
                    template = '<span class="error"><i class="fa fa-times"></i></span>';
                    break;
                case 'success':
                    template = '<span class="success"><i class="fa fa-thumbs-up"></i></span>';
                    break;
                case 'info':
                    template = '<span class="information"><i class="fas fa-info"></i></span>';
                    break;
                case 'question':
                    template = '<span class="question"><i class="fa fa-info-circle"></i></span>';
                    break;
            }
            return template;
        };
        scope.accept = () => {
            let props = scope.properties;
            let method = props.methodAccept;
            if (method) {
                method(props.params);
                modal.close();
            }
        };
        scope.close = () => {
            if (scope.requests.length === 0) {
                let props = scope.properties;
                let method = props.methodClosed;
                if (method) method();
                modal.close();
            }
        };
        scope.$watch('properties', (before, after) => {
            if (before.state) {
                // Body.addClass('hideScroll');
                timeout(() => {
                    let accept = angular.element('#button-accept')[0],
                        cancel = angular.element('#button-cancel')[0];
                    if (accept) accept.focus();
                    else cancel.focus();
                }, 400);
            } else {
                // Body.removeClass('hideScroll');
            }
        }, true);
    },
    deps: [
        '$scope',
        'sModal',
        '$http',
        '$timeout'
    ]
});

dnInjectable({
    name: 'sModal',
    module: 'mdSwal',
    fn: function (timeout) {
        this.properties = {
            state: false,
            type: undefined,
            content: undefined,
            methodAccept: undefined,
            methodClosed: undefined,
            params: undefined
        };
        let OpenTypes = content => {
            this.properties.content = content;
            this.properties.state = true;
        };

        this.success = (content,method) => {
            this.properties.type = 'success';
            this.properties.methodClosed = method ? method : undefined;
            OpenTypes(content);
        };
        this.warning = (content, method) => {
            this.properties.type = 'warning';
            this.properties.methodClosed = method ? method : undefined;
            OpenTypes(content);
        };
        this.info = (content, method) => {
            this.properties.type = 'info';
            this.properties.methodClosed = method ? method : undefined;
            OpenTypes(content);
        };
        this.error = (content,method)=> {
            this.properties.type = 'error';
            this.properties.methodClosed = method ? method : undefined;
            OpenTypes(content);
        };
        this.question = (content, method, ...params) => {
            this.properties.type = 'question';
            this.properties.params = params;
            this.properties.methodAccept = method;
            OpenTypes(content);
        };

        this.openIframe = (name,method) => {
            this.closeIframe(name);
            timeout(() => {
                let modal_element = angular.element('#modalYT_' + name);
                modal_element.modal('show');
                if (method) {
                    modal_element.on('hide.bs.modal', () => {
                        method();
                        modal_element.off('hide.bs.modal');
                    });
                }
            }, 400);
        };

        this.closeIframe = (name) => {
            if (name) {
                let modal_element = angular.element('#modalYT_' + name);
                modal_element.modal('hide');
            }
        };

        this.open = (name, method) => {
            this.close(name);
            timeout(() => {
                let modal_element = angular.element('#modal_' + name);
                modal_element.modal('show');
                if (method) {
                    modal_element.on('hide.bs.modal', () => {
                        method();
                        modal_element.off('hide.bs.modal');
                    });
                } 
                modal_element.on('shown.bs.modal', () => {
                    let element = angular.element('#modal_' + name + ' input:first')
                    if (element.length > 0)
                        element.select()
                    else
                        angular.element('#modal_' + name + ' .ire-focus').focus()

                });
            }, 400);
        };
        this.close = (name) => {
            let modal_app = angular.element('.modal-app');
            this.properties.state = false;
            modal_app.blur();
            if (name) {
                let modal_element = angular.element('#modal_' + name);
                modal_element.modal('hide');
            }
        };

        this.closeModalFiltro = () => {
            var div = document.getElementsByClassName("dropdown-menu");
            div[2].classList.remove("show");
            div[2].classList.add("hide");
        }; 

    },
    deps: [
        '$timeout'
    ]
});

const dnImboxList = dnComponent({
    name: 'imboxlist',
    fn: function () {
        this.icon = 'inbox';
        this.name = 'No se encontraron registros';
        if (this.spin == null) {
            this._valid = true;
        }
    },
    // templateUrl: './src/components/user/inputs/inputlist/inputlist.html',
    template: `<div class="dn-imboxlist" ng:init="onInit()">
    <center ng-show="$ctrl.spin">
        <strong class="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style="font-size:60px;"></strong>
    </center>
    <div ng-show="$ctrl.list.length == 0 && $ctrl.spin==false || $ctrl._valid && $ctrl.list.length == 0">
        <p class="text-center">
            <i class="fa fa-5x fa-{{$ctrl.icon}}"></i>
            <h4 class="text-center">{{$ctrl.name}}</h4>
        </p>
    </div>
</div>`,
    deps: [],
    others: {
        bind: {
            'list': '=',
            'spin': '=',
            'name': '@',
            'icon': '@'
        }
    }
});
const dnInputArea = dnComponent({
    name: 'inputarea',
    fn: function () {
        this.default_rows = 6;
        this.default_cols = 60;
        this.valid = () => {
            if (this.error) {
                this.error = null;
            }
        }
    },
    // templateUrl: './src/components/user/inputs/inputarea/inputarea.html',
    template: `
    <style>
        textarea.form-control {
            height: 300px;
        }
    </style>
    <div class="dn-input-area">
    <div class="form-group">
        <label>
            {{($ctrl.nglabel?$ctrl.nglabel:$ctrl.label)}}
            <span style="color:red;">{{($ctrl.ngreq?$ctrl.ngreq:$ctrl.req)?"*":""}}</span>
        </label>
        <textarea cols="{{$ctrl.cols ? $ctrl.cols : $ctrl.default_cols}}" rows="{{$ctrl.rows ? $ctrl.rows : $ctrl.default_rows}}"
            class="form-control" ng:model="$ctrl.model" ng:required="($ctrl.ngreq?$ctrl.ngreq:$ctrl.req)?true:false"
            name="{{$ctrl.name}}" maxlength="{{$ctrl.ngmaxl?$ctrl.ngmaxl:$ctrl.maxl}}" minlength="{{$ctrl.ngminl?$ctrl.ngminl:$ctrl.minl}}"
            placeholder="{{$ctrl.ngholder?$ctrl.ngholder:$ctrl.holder}}" pattern="{{$ctrl.ngregex?$ctrl.ngregex:$ctrl.regex}}"
            ng:change="$ctrl.valid();" ng:disabled="$ctrl.disabled">
        </textarea>
        <dn-validation input="$ctrl.form" minl="El texto debe contener al menos {{$ctrl.ngminl?$ctrl.minl:$ctrl.minl}} caracteres."
            pat="{{$ctrl.ngpat?$ctrl.ngpat:$ctrl.pat}}" error="$ctrl.error">
        </dn-validation>
    </div>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',

            name: '@',

            req: '@',
            ngreq: '=',

            holder: '@',
            ngholder: '=',

            minl: '@',
            ngminl: '=',

            maxl: '@',
            ngmaxl: '=',

            regex: '@',
            ngregex: '=',

            pat: '@',
            ngpat: '=',

            rows: '@',
            cols: '@',

            model: '=',
            error: '=',
            form: '=',
            disabled: '='
        }
    }
});
const dnInputDate = dnComponent({
    name: 'inputdate',
    fn: function () {
        this.default_regex = ("(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))").toString();
        this.default_min = '1900-01-01';
        this.default_max = '2100-01-01';
        this.default_pat = "La fecha ingresada no es correcta.";
        this.default_type = 'date';
        this.default_disabled = false;

        this.valid = () => {
            if (this.error) {
                this.error = null;
            }
        }
    },
    // templateUrl: './src/components/user/inputs/inputdate/inputdate.html',
    template: `<div class="dn-input-date">
    <div class="form-group">
        <label>
            {{($ctrl.nglabel?$ctrl.nglabel:$ctrl.label)}}
            <span style="color:red;">{{($ctrl.ngreq?$ctrl.ngreq:$ctrl.req)?"*":""}}</span>
        </label>
        <input type="{{$ctrl.type ? $ctrl.type : $ctrl.default_type}}" class="form-control" ng:model="$ctrl.model"
            ng:required="($ctrl.ngreq ? $ctrl.ngreq : $ctrl.req) ? true : false" name="{{$ctrl.name}}" max="{{$ctrl.ngmax ? $ctrl.ngmax : $ctrl.max ? $ctrl.max : $ctrl.default_max}}"
            min="{{$ctrl.ngmin ? $ctrl.ngmin : $ctrl.min ? $ctrl.min : $ctrl.default_min}}" pattern="{{$ctrl.ngregex?$ctrl.ngregex:$ctrl.regex?$ctrl.regex:$ctrl.default_regex}}"
            ng:change="$ctrl.change();" ng:disabled = " $ctrl.disabled ? $ctrl.disabled : $ctrl.default_disabled">
        <dn-validation 
            input="$ctrl.form" 
            min="{{'La fecha ingresada debe ser igual o posterior a '}} {{$ctrl.ngmin ? $ctrl.ngmin : $ctrl.min ? $ctrl.min : $ctrl.default_min}}."
            max="{{'La fecha ingresada debe ser igual o anterior a las '}} {{$ctrl.ngmax ? $ctrl.ngmax : $ctrl.max ? $ctrl.max : $ctrl.default_max}}."
            pat="{{($ctrl.ngpat) ? $ctrl.ngpat : $ctrl.pat ? $ctrl.pat : $ctrl.default_pat}}" error="$ctrl.error">
        </dn-validation>
    </div>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',

            name: '@',

            req: '@',
            ngreq: '=',

            min: '@',
            ngmin: '=',

            max: '@',
            ngmax: '=',

            regex: '@',
            ngregex: '=',

            pat: '@',
            ngpat: '=',

            type: '@',
            model: '=',
            error: '=',
            form: '=',
            change: '&',
            disabled : '='
        }
    }
});
const dnInputDecimal = dnComponent({
    name: 'inputdecimal',
    fn: function () {
        this.default_regex = ("^[0-9]+(\\.[0-9]{1,2})?$").toString();
        this.default_min = 0.01;
        this.default_max = 999999.99;
        this.default_pat = "Solo se aceptan números con 2 decimales como maximo.";
    },
    // templateUrl: './src/components/user/inputs/inputdecimal/inputdecimal.html',
    template: `<div class="dn-input-decimal">
        <dn-inputnumber label="{{$ctrl.label}}" nglabel="$ctrl.nglabel" name="{{$ctrl.name}}" req="{{$ctrl.req}}" ngreq="$ctrl.ngreq"
            holder="{{$ctrl.holder}}" ngholder="$ctrl.ngholder" min="{{$ctrl.min ? $ctrl.min : $ctrl.default_min}}" ngmin="$ctrl.ngmin"
            max="{{$ctrl.max ? $ctrl.max : $ctrl.default_max}}" ngmax="$ctrl.ngmax" regex="{{$ctrl.regex ? $ctrl.regex : $ctrl.default_regex}}"
            ngregex="$ctrl.ngregex" pat="{{$ctrl.pat ? $ctrl.pat : $ctrl.default_pat}}" ngpat="$ctrl.ngpat" step="any"
            model="$ctrl.model" error="$ctrl.error" form="$ctrl.form" disabled="$ctrl.disabled">
        </dn-inputnumber>
    </div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',

            name: '@',

            req: '@',
            ngreq: '=',

            holder: '@',
            ngholder: '=',

            min: '@',
            ngmin: '=',

            max: '@',
            ngmax: '=',

            regex: '@',
            ngregex: '=',

            pat: '@',
            ngpat: '=',

            step: '@',
            model: '=',
            error: '=',
            form: '=',
            disabled:'='
        }
    }
});
const dnInputEmail = dnComponent({
    name: 'inputemail',
    fn: function () {
        this.default_regex = ("[a-zA-Z0-9._\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,4}").toString();
        this.default_maxl = 50;
        this.default_pat = "ejemplo minombre@dominio.com";
    },
    // templateUrl: './src/components/user/inputs/inputemail/inputemail.html',
    template: `<div class="dn-input-email">
    <dn-inputtext label="{{$ctrl.label}}" nglabel="$ctrl.nglabel" name="{{$ctrl.name}}" req="{{$ctrl.req}}" ngreq="$ctrl.ngreq"
        holder="{{$ctrl.holder}}" ngholder="$ctrl.ngholder" minl="{{$ctrl.minl}}" ngminl="$ctrl.ngminl" maxl="{{$ctrl.maxl ? $ctrl.maxl : $ctrl.default_maxl}}"
        ngmaxl="$ctrl.ngmaxl" regex="{{$ctrl.regex ? $ctrl.regex : $ctrl.default_regex}}" ngregex="$ctrl.ngregex" pat="{{$ctrl.pat ? $ctrl.pat : $ctrl.default_pat}}"
        ngpat="$ctrl.ngpat" type="email" model="$ctrl.model" error="$ctrl.error" form="$ctrl.form" disabled="$ctrl.disabled">
    </dn-inputtext>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',

            name: '@',

            req: '@',
            ngreq: '=',

            holder: '@',
            ngholder: '=',

            min: '@',
            ngmin: '=',

            max: '@',
            ngmax: '=',

            regex: '@',
            ngregex: '=',

            pat: '@',
            ngpat: '=',

            type: '@',
            model: '=',
            error: '=',
            form: '=',
            disabled: '='
        }
    }
});
const dnInputNumber = dnComponent({
    name: 'inputnumber',
    fn: function () {
        this.default_regex = ("[0-9]{0,10}").toString();
        this.default_min = 0;
        this.default_max = 999999;
        this.default_pat = "Por favor ingrese un número valido.";
        this.default_step = null;
        this.valid = () => {
            if (this.error) {
                this.error = null;
            }
        };
    },
    // templateUrl: './src/components/user/inputs/inputnumber/inputnumber.html',
    template: `<div class="dn-input-number">
    <div class="form-group">
        <label ng:if="$ctrl.label || $ctrl.nglabel">
            {{($ctrl.nglabel?$ctrl.nglabel:$ctrl.label)}}
            <span style="color:red;">{{($ctrl.ngreq ? $ctrl.ngreq : $ctrl.req)?"*":""}}</span>
        </label>
        <input dir-validate-max-lenght type="number" step="{{$ctrl.step ? $ctrl.step : $ctrl.default_step}}" class="form-control"
            ng:model="$ctrl.model" ng:required="($ctrl.ngreq ? $ctrl.ngreq : $ctrl.req) ? true : false" name="{{$ctrl.name}}"
            max="{{	$ctrl.ngmax ? $ctrl.ngmax : $ctrl.max ? $ctrl.max : $ctrl.default_max}}" min="{{$ctrl.ngmin ? $ctrl.ngmin : $ctrl.min ? $ctrl.min : $ctrl.default_min}}"
            placeholder="{{$ctrl.ngholder ? $ctrl.ngholder : ($ctrl.holder ? $ctrl.holder : null)}}" pattern="{{$ctrl.ngregex ? $ctrl.ngregex : $ctrl.regex ? $ctrl.regex : $ctrl.default_regex}}"
            ng:change="$ctrl.valid();" ng:disabled="$ctrl.disabled">
        <dn-validation input="$ctrl.form" min="El número debe ser mayor o igual a {{$ctrl.min ? $ctrl.min : $ctrl.default_min}}."
            max="El número debe ser menor o igual a {{$ctrl.max ? $ctrl.max : $ctrl.default_max}}" pat="{{$ctrl.ngpat ? $ctrl.ngpat : $ctrl.pat ? $ctrl.pat : $ctrl.default_pat}}"
            error="$ctrl.error">
        </dn-validation>
    </div>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',

            name: '@',

            req: '@',
            ngreq: '=',

            holder: '@',
            ngholder: '=',

            min: '@',
            ngmin: '=',

            max: '@',
            ngmax: '=',

            regex: '@',
            ngregex: '=',

            pat: '@',
            ngpat: '=',

            step: '@',
            model: '=',
            error: '=',
            form: '=',
            disabled:'=',
        }
    }
});
const dnInputPassword = dnComponent({
    name: 'inputpassword',
    fn: function () {
        this.default_regex = ("((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$").toString();
        this.default_maxl = 50;
        this.default_minl = 8;
        this.default_pat = "Incluya Mayúsculas, Minúsculas, Números / Caracteres especiales";
    },
    // templateUrl: './src/components/user/inputs/inputpassword/inputpassword.html',
    template: `<div class="dn-input-password">
    <dn-inputtext label="{{$ctrl.label}}" nglabel="$ctrl.nglabel" name="{{$ctrl.name}}" req="{{$ctrl.req}}" ngreq="$ctrl.ngreq"
        holder="{{$ctrl.holder}}" ngholder="$ctrl.ngholder" minl="{{$ctrl.minl}}" ngminl="$ctrl.ngminl" maxl="{{$ctrl.maxl ? $ctrl.maxl : $ctrl.default_maxl}}"
        ngmaxl="$ctrl.ngmaxl" regex="{{$ctrl.regex ? $ctrl.regex : $ctrl.default_regex}}" ngregex="$ctrl.ngregex" pat="{{$ctrl.pat ? $ctrl.pat : $ctrl.default_pat}}"
        ngpat="$ctrl.ngpat" type="password" model="$ctrl.model" error="$ctrl.error" form="$ctrl.form">
    </dn-inputtext>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',

            name: '@',

            req: '@',
            ngreq: '=',

            holder: '@',
            ngholder: '=',

            min: '@',
            ngmin: '=',

            max: '@',
            ngmax: '=',

            regex: '@',
            ngregex: '=',

            pat: '@',
            ngpat: '=',

            type: '@',
            model: '=',
            error: '=',
            form: '=',
        }
    }
});

const dnInputSearch = dnComponent({
    name: 'inputsearch',
    fn: function () {
        this.name = "Buscar";
        this._visible = true;
        if (this.span == 'false') {
            this._visible = false;
        }
    },
    template: 
        `<div class="input-group">
        <input type="text" class="form-control" ng-model="$ctrl.model" placeholder="{{$ctrl.name}}">
        <small class="input-group-addon">
        <i class="glyphicon glyphicon-search"></i>
        </small>
        </div>
        <div ng-show="$ctrl._visible">
        <small class="label label-info">Nota:</small>
        <label style="color:#8a6d3b">
        <em>La búsqueda es sensible a tildes.</em>
        </label>
        </div>`
    ,
    deps: [],
    others: {
        bind: {
            model: '=',
            name: '@',
            span: '@'
        }
    }
})

const dnInputSelect = dnComponent({
    name: 'inputselect',
    fn: function () {
        this.default_text = "Seleccionar";
        this.default_key = "nombre";
        this.default_id = "id";
    },
    // templateUrl: './src/components/user/inputs/inputselect/inputselect.html',
    template: `<div class="dn-input-select">
    <div class="form-group">
        <label ng:if="$ctrl.nglabel || $ctrl.label">
            {{($ctrl.nglabel?$ctrl.nglabel:$ctrl.label)}}
            <span style="color:red;">
                {{($ctrl.ngreq?$ctrl.ngreq:$ctrl.req)?"*":""}}
            </span>
        </label>
        <select name="{{$ctrl.name}}" class="form-control" ng:model="$ctrl.model" ng:options="($ctrl.id == '*') 
                        ? item 
                        :  item[
                                ($ctrl.id) ? $ctrl.id : $ctrl.default_id
                            ] 
                        as item[
                            ($ctrl.key) ? $ctrl.key : $ctrl.default_key
                        ] 
                        for item 
                        in $ctrl.list"
            ng:required="($ctrl.ngreq ? $ctrl.ngreq : $ctrl.req) ? true : false"  ng:click="$ctrl.click();" ng:change="$ctrl.change();">
            <option value="">{{$ctrl.ngdefault ? $ctrl.ngdefault : $ctrl.default ? $ctrl.default : $ctrl.default_text}}</option>
        </select>
        <dn-validation input="$ctrl.form" error="$ctrl.error"></dn-validation>
    </div>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',
            name: '@',
            req: '@',
            ngreq: '=',
            default: '@',
            ngdefault: '=',
            key: '@',
            id: '@',
            model: '=',
            list: '=',
            error: '=',
            form: '=',
            change: '&',
            click:'&',
        }
    }
});

const dnInputText = dnComponent({
    name: 'inputtext',
    fn: function (scope, timeout) {
        this.default_regex = ("[A-Za-z0-9-ZñÑáéíóúÁÉÍÓÚ .-]+").toString();
        this.default_maxl = 50;
        this.default_pat = "No se admiten caracteres especiales.";
        this.default_type = 'text';
        this.valid = () => {
            if (this.error) {
                this.error = null;
            }
        };
        scope.onInit = () => {
            scope.directives = {
                accept: this.accept,
                others: this.directives,
                maxlength: this.maxl,

            };
            let AddValidations = (validations) => {
                let form = this.form;
                angular.forEach(validations, (value) => {
                    form.$validators[value.name] = (a, b, c) => {
                        var isValid = value.validate(a);
                        console.log(value.name, isValid);
                        return isValid;
                    };
                });
            };
            timeout(() => {
                let form = this.form;
                scope.$watch('$ctrl.validations', (recent, old) => {
                    angular.forEach(old, (item) => {
                        delete form.$validators[item.name];
                        delete form.$$parentForm.$error[item.name];
                    });
                    angular.forEach(recent, (item) => {
                        delete form.$validators[item.name];
                        delete form.$$parentForm.$error[item.name];
                    });
                    AddValidations(recent);
                    if (form && form.$validate) form.$validate();
                });
            });

        };
    },
    // templateUrl: './src/components/user/inputs/inputtext/inputtext.html',
    template: `<div class="dn-input-text">
    <div class="form-group" ng:init="onInit()">
        <label ng:if="$ctrl.nglabel || $ctrl.label">
            {{($ctrl.nglabel?$ctrl.nglabel:$ctrl.label)}}
            <span class="text-danger">{{($ctrl.ngreq?$ctrl.ngreq:$ctrl.req)?"*":""}}</span>
        </label>
        <input type="{{$ctrl.type ? $ctrl.type : $ctrl.default_type}}" class="form-control" ng:model="$ctrl.model"
            ng:required="$ctrl.ngreq===undefined?$ctrl.req:$ctrl.ngreq" name="{{$ctrl.name}}" maxlength="{{$ctrl.ngmaxl?$ctrl.ngmaxl:$ctrl.maxl?$ctrl.maxl:$ctrl.default_maxl}}"
            minlength="{{$ctrl.ngminl?$ctrl.ngminl:$ctrl.minl}}" placeholder="{{$ctrl.ngholder?$ctrl.ngholder:($ctrl.holder?$ctrl.holder:null)}}"
            pattern="{{$ctrl.ngregex?$ctrl.ngregex:$ctrl.regex?$ctrl.regex:$ctrl.default_regex}}" ng:change="$ctrl.valid();"
            set-directives-to-inputs directives-accept="directives" ng:disabled="$ctrl.disabled" spellcheck="false">
        <dn-validation input="$ctrl.form" minl="El texto debe contener al menos {{$ctrl.ngminl?$ctrl.minl:$ctrl.minl}} caracteres."
            pat="{{($ctrl.ngpat)?$ctrl.ngpat:$ctrl.pat?$ctrl.pat:$ctrl.default_pat}}" error="$ctrl.error">
        </dn-validation>
        <small ng:repeat="item in $ctrl.validations" ng:show="$ctrl.form.$error[item.name]" class="row col-12 text-danger">{{item.message}}</small>
    </div>
</div>`,
    deps: ['$scope', '$timeout'],
    others: {
        bind: {
            label: '@',
            nglabel: '=',
            name: '@',
            req: '@',
            ngreq: '=',
            holder: '@',
            ngholder: '=',
            minl: '@',
            ngminl: '=',
            maxl: '@',
            ngmaxl: '=',
            regex: '@',
            ngregex: '=',
            pat: '@',
            ngpat: '=',
            type: '@',
            model: '=',
            error: '=',
            form: '=',
            accept: '@',
            directives: '=dirs',
            disabled: '=',
            validations: '=' 
        }
    }
});
const dnInputTime = dnComponent({
    name: 'inputtime',
    fn: function () {
        this.default_regex = (".*").toString();
        this.default_min = '00:00';
        this.default_max = '23:59';
        this.default_pat = "Ingrese una hora correcta.";
        this.default_type = "time";
        this.default_disabled = false;
    },
    // templateUrl: './src/components/user/inputs/ininputtime/inputtime.html',
    template: `<div class="dn-input-time">
    <dn-inputdate label="{{$ctrl.label}}" nglabel="$ctrl.nglabel" name="{{$ctrl.name}}" req="{{$ctrl.req}}" ngreq="$ctrl.ngreq"
        min="{{$ctrl.min ? $ctrl.min : $ctrl.default_min}}" ngmin="$ctrl.ngmin" max="{{$ctrl.max ? $ctrl.max : $ctrl.default_max}}"
        ngmax="$ctrl.ngmax" regex="{{$ctrl.default_regex}}" pat="{{$ctrl.default_pat}}" type="{{$ctrl.default_type}}"
        model="$ctrl.model"  change="$ctrl.change();" error="$ctrl.error" form="$ctrl.form" disabled = "$ctrl.disabled ? $ctrl.disabled : $ctrl.default_disabled">
    </dn-inputdate>
</div>`,
    deps: [],
    others: {
        bind: {
            label: '@',
            nglabel: '=',
            name: '@',
            req: '@',
            ngreq: '=',
            min: '@',
            ngmin: '=',
            max: '@',
            ngmax: '=',
            type: "@",
            model: '=',
            error: '=',
            form: '=',
            change: '&',
            disabled: '='
        }
    }
});
const dnSmallAlert = dnComponent({
    name: 'smallalert',
    fn: function () {
        this.icon = 'inbox';
        this.name = 'No se encontraron registros';
        if (this.spin == null) {
            this._valid = true;
        }
    },
    // templateUrl: './src/components/user/inputs/smallalert/smallalert.html',
    template: `<div class="dn-smallalert" ng:init="onInit()">
    <div class="beli-alert" ng-show="$ctrl.error">
        <small ng-bind="$ctrl.error"></small>
    </div>
</div>`,
    deps: [],
    others: {
        bind: {
            error: '='
        }
    }
});
const dnValidation = dnComponent({
    name: 'validation',
    fn: function (scope) {
        scope.isObject = angular.isObject;
    },
    // templateUrl: './src/components/user/inputs/validation/validation.html',
    template: `<div class="dn-validation" ng:init="onInit()">
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.required && $ctrl.input.$dirty">*El campo es
        requerido</small>
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.minlength">
        * {{ ($ctrl.minl == undefined) ? "El valor ingresado es muy pequeño." : $ctrl.minl }}
    </small>
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.maxlength">
        * {{ ($ctrl.maxl == undefined) ? "El valor ingresado es muy grande." : $ctrl.maxl }}
    </small>
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.pattern">
        * {{ ($ctrl.pat == undefined) ? "El formato ingresado no coincide con el solicitado.": $ctrl.pat }}
    </small>
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.min">
        * {{ ($ctrl.min == undefined) ? "El número ingresado es muy pequeño." : $ctrl.min }}
    </small>
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.max">
        * {{ ($ctrl.max == undefined) ? "El número ingresado es muy grande." : $ctrl.max }}
    </small>
    <small class="row col-12 text-danger" ng:if="$ctrl.input.$error.number">
        *Ingrese un número por favor.
    </small>
    <small ng:repeat="err in $ctrl.error track by $index" class="row col-12 text-danger">*{{err}}</small>
</div>`,
    deps: ['$scope'],
    others: {
        bind: {
            input: '=',
            maxl: '@',
            minl: '@',
            min: '@',
            max: '@',
            pat: '@',
            regex: '@',
            error: '='
        }
    }
});

const mdButtonSubmit = dnComponent({
    name: 'buttonSubmit',
    fn: function (scope, http) {
        scope.requests = http.pendingRequests;
    },
    others: {
        bind: {
            icon: '@',
            label: '@',
            form: '=',
            spinner: '='
        },
    },
    deps: ['$scope', '$http'],
    // templateUrl: './src/components/user/forms/button-submit/button-submit.html'
    template: `<div class="dn-button-submit" style="display: inline-block;">
    <button type="submit" ng:disabled="requests.length > 0 || $ctrl.form.$invalid" class="btn btn-info" d-spinner="$ctrl.spinner"
        options="{ scale: 'min' }">
        <i ng:class="$ctrl.icon"></i>
        <span ng:bind="$ctrl.label"></span>
    </button>
</div>`
});
const mdSelectBox = dnComponent({
    name: 'selectBox',
    fn: function (scope, timeout) {
        scope.params = {
            displayList: scope.options && scope.options.displayList || 'nombre',
            displayLabel: scope.options && scope.options.displayLabel || 'nombre',
            key: scope.options && scope.options.key || 'id',
            searchField: scope.options && scope.options.searchField || 'nombre',
            exports: scope.options && scope.options.exports,
            template: scope.options && scope.options.template,
            selectionLimit: scope.options && scope.options.selectionLimit,
            textLabel: scope.options && scope.options.textLabel || '[ seleccionar ]',
            selected: scope.options && scope.options.selected,
            disabled: scope.options && scope.options.disabled,
            resumeString: scope.options && scope.options.resumeString
        };
        scope.multiple = attrs.multiple !== undefined;
        scope.model = scope.model || (scope.multiple ? [] : undefined);
        scope.modelBackup = angular.copy(scope.model);

        let BeforeItem;
        const BuildCustomItem = item => {
            let result,
                build_item = {};
            if (!scope.params.exports) build_item = angular.copy(item);
            else if (scope.params.resumeString) {
                build_item = item[scope.params.resumeString];
            } else {
                for (let key of scope.params.exports) {
                    build_item[key] = item[key];
                }
            }
            delete build_item.selected;
            result = build_item;
            return result;
        };
        const addItemToModel = item => {
            item.selected = true;
            scope.model.push(BuildCustomItem(item));
            scope.modelBackup.push(item);
        };
        scope.selectItem = (item, markAll) => {
            if (scope.multiple) {
                if (item) {
                    if (!scope.params.selectionLimit || scope.modelBackup.length < scope.params.selectionLimit && !item.disabled) {
                        item.selected = true;
                        scope.model.push(BuildCustomItem(item));
                        scope.modelBackup.push(item);
                    }
                } else {
                    if (markAll) {
                        angular.forEach(scope.innerList, item => {
                            if (item.selected) {

                            } else {
                                if (!item.disabled) {
                                    if (scope.params.selectionLimit) {
                                        if (scope.modelBackup.length < scope.params.selectionLimit) {
                                            addItemToModel(item);
                                        }
                                    } else {
                                        addItemToModel(item);
                                    }
                                }
                            }
                        });
                    } else {
                        angular.forEach(scope.innerList, item => {
                            item.selected = false;
                        });
                        scope.modelBackup = [];
                        scope.model = [];
                    }
                }
            } else {
                if (item && !item.disabled) {
                    if (BeforeItem) BeforeItem.selected = false;
                    scope.model = BuildCustomItem(item);
                    scope.modelBackup = item;
                    BeforeItem = item;
                    if (scope.onSelect) scope.onSelect();
                }
            }
        };
        scope.removeItem = (item) => {
            let index,
                key = item[scope.params.key];
            if (scope.multiple) {
                angular.forEach(scope.modelBackup, (item_finded, key) => {
                    if (item_finded[scope.params.key] === item[scope.params.key]) {
                        index = key;
                        return;
                    }
                });
                if (index !== undefined) {
                    scope.model.splice(index, 1);
                    scope.modelBackup.splice(index, 1);
                }
                scope.innerList[key].selected = false;
            } else {
                scope.model = undefined;
                scope.modelBackup = undefined;
                scope.innerList[key].selected = false;
            }
        };
        const SelectAndDisableItems = () => {
            angular.forEach(scope.innerList, item => {
                if (scope.params.disabled) {
                    for (const key of scope.params.disabled) {
                        if (key === item[scope.params.key]) item.disabled = true;
                    }
                }
                if (scope.params.selected) {
                    for (const key of scope.params.selected) {
                        if (key === item[scope.params.key]) scope.selectItem(item);
                    }
                }
            });
        };
        const Run = (() => {
            angular.element('#drop-' + scope.nameModel);
        })();

        scope.fixClosed = evt => {
            if (scope.multiple) {
                evt.stopPropagation();
            }
        };
        scope.close = () => { };
        scope.onkeypress = (evt) => {
            switch (evt.keyCode) {
                case 13: // Enter
                    let keys = Object.keys(scope.filterredList);
                    if (keys.length > 0) {
                        scope.selectItem(scope.filterredList[keys[scope.pointer]]);
                        scope.pointer = 0;
                        scope.close()
                    }
                    break;
                case 27:
                    break;
                case 38: // Up
                    if (scope.pointer != 0) scope.pointer--
                    break;
                case 40: // Down
                    if (scope.pointer != Object.keys(scope.filterredList).length - 1) scope.pointer++
                    break;
                default:
                    scope.pointer = 0;
            }
        }
        element.on('show.bs.dropdown', () => {
            timeout(() => {
                scope.pointer = 0;
                let input_search = angular.element('#search-' + scope.nameModel);
                if (input_search) input_search.select();
            }, 50);
        });
        scope.$watch('list', recent => {
            if (recent) {
                scope.innerList = {};
                angular.forEach(recent, item => {
                    scope.innerList[item[scope.params.key]] = angular.copy(item);
                });
                if (recent.length > 0 && scope.params.selected) SelectAndDisableItems();
            }
        }, true);
    },
    deps: ['$scope', '$timeout'],
    // templateUrl: './src/components/user/forms/select-box/select-box.html',
    // stylesUrl: './src/components/user/forms/select-box/select-box.css'
    template: `<div class="dn-select-box">
    <div class="dropdown form-group">
        <div class="form-control dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="drop-{{nameModel}}">
            <span ng:if="!model.id || model.length === 0" ng:bind="params.textLabel"></span>
            <span ng:if="!multiple" ng:bind="model[params.displayLabel]"></span>
            <span ng:if="model.length > 0">
                <strong ng:bind="model.length"></strong> seleccionado(s)
            </span>
        </div>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" ng:click="fixClosed($event)" role="menu">
            <div class="select-box-container">
                <div class="select-box-header">
                    <span class="select-box-description">Seleccione los items en la lista</span>
                    <div class="form-group">
                        <input type="text" class="form-control" ng:model="search" id="search-{{nameModel}}" placeholder="Escriba para filtrar"
                            autocomplete="off" ng:keyup="onkeypress($event)" form="select_box_form">
                    </div>
                </div>
                <div class="select-box-body">
                    <ul class="list-unstyled" ng:if="multiple && model.length > 0">
                        <span class="select-box-title">seleccionados</span>
                        <li class="list-item active-item" ng:repeat="item in modelBackup | filter:search track by $index">
                            <button type="button" class="btn btn-icon btn-sm btn-item" ng:click="removeItem(item)"><i
                                    class="fa fa-times"></i></button>
                            <span ng:bind="item[params.displayList]"></span>
                        </li>
                    </ul>
                    <span class="select-box-title" ng:if="multiple">todos</span>
                    <ul class="list-unstyled">
                        <li class="list-item" ng:repeat="item in filterredList = ( innerList | filterObject:search:params.searchField ) track by $index"
                            ng:click="selectItem(item)" ng:if="!item.selected" ng:class="{ 'disabled': item.disabled, 'active': pointer == $index }">
                            <div ng:if="params.template" dir-html-compile="params.template"></div>
                            <span ng:if="!params.template" ng:bind="item[params.displayList]"></span>
                        </li>
                        <li class="list-item list-item-footer">
                            <button type="button" class="btn btn-success btn-icon" ng:click="selectItem(null, true)">
                                <i class="fa fa-check-square"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-icon" ng:click="selectItem(null, false)">
                                <i class="fa fa-square"></i>
                            </button>
                        </li>
                    </ul>
                    <div app-spinner="spinner"></div>
                </div>
            </div>
        </div>
    </div>
</div>`,
    styles: `.dn-select-box {

    }
    .dn-select-box .dropdown.form-group .form-control {
        border-color: #979797;
    }
    .dn-select-box .dropdown-menu {
        padding: 0;
        min-width: 300px;
        transform: none !important;
        top: 100% !important;
        margin-bottom: 20px;
        width: 100%;
    }
    .dn-select-box .dropdown-menu.show {
        margin: 5px 0;
    }
    .dn-select-box li.active {
        border-color: #B2EBF2;
        background-color: #f1f1f1;
    }
    .dn-select-box .dropdown-toggle:after {
        float: right;
        margin-top: 6px;
        font-size: 14px;
    }
    
    .dn-select-box .select-box-container {
        /*padding: 5px;*/
        /*margin: 5px;*/
    }
    .dn-select-box button.btn {
        margin: 0;
    }
    .dn-select-box .select-box-header {
        /* border-bottom: 1px solid #f1f1f1; */
        /*margin-bottom: 5px;*/
        /*padding: 15px;*/
        overflow: hidden;
        background-color: #F8F8F8;
        border-bottom: 1px solid #E9E9E9;
    }
    .dn-select-box .select-box-header .select-box-description {
        display: block;
        padding: 10px 15px;
        padding-bottom: 10px;
        font-weight: bold;
        font-size: 10px !important;
        border-bottom: 1px solid #E9E9E9;
    }
    .dn-select-box .select-box-header .form-group {
        margin-bottom: 0;
        margin: 15px;
    }
    .dn-select-box .select-box-foot.fix-col {
        border-top: 1px solid #f1f1f1;
        padding: 10px 0 5px 0;
    }
    .dn-select-box .select-box-foot.fix-col button.btn {
        font-size: 8px !important;
    }
    .dn-select-box button.btn i {
        font-size: 10px !important;
    }
    .dn-select-box .dropdown.form-group {
        margin-bottom: 0;
    }
    .dn-select-box ul {
        margin: 0;
    }
    .dn-select-box .select-box-body {
        max-height: 40vh;
        overflow: auto;
    }
    /* .dn-select-box ul.scrolled {
        margin-bottom: 5px;
    } */
    .dn-select-box .select-box-body .select-box-title {
        display: block;
        text-align: center;
        font-size: 8px !important;
        font-weight: bold;
        text-transform: uppercase;
        /*margin: 5px 0;*/
        margin-top: 8px;
        padding-bottom: 5px;
        /*border-bottom: 1px solid #f1f1f1;*/
    }
    .dn-select-box ul {
        border-bottom: 1px solid #E9E9E9;
    }
    .dn-select-box ul li.list-item {
        display: block;
        /*margin: 5px 0;*/
        padding: 10px 40px;
        /*border-radius: 3px;*/
        border-top: 1px solid #E9E9E9;
        transition: all .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
    }
    .dn-select-box ul li.list-item-footer {
        display: flex !important;
        justify-content: flex-end;
    }
    .dn-select-box ul li.list-item-footer button {
        margin-left: 10px;
    }
    .dn-select-box ul li.list-item.disabled {
        cursor: not-allowed;
        opacity: .5;
    }
    .dn-select-box ul li.list-item span.empty {
        font-size: 10px !important;
    }
    .dn-select-box ul li.list-item:hover {
        /*border-color: #B2EBF2;*/
        background-color: #f1f1f1;
    }
    .dn-select-box ul li.list-item label {
        margin-bottom: 0 !important;
        display: flex;
        align-items: center;
    }
    .dn-select-box ul li.list-item.active-item span {
        /* font-size: 10px !important; */
    }
    .dn-select-box ul li.list-item button.btn-item {
        margin-right: 10px;
        background-color: #F6F6F6;
        color: #000;
        border: 1px solid #c5c5c5;
        height: 25px;
        min-width: 25px;
        width: 25px;
    }
    .dn-select-box ul li.list-item button.btn-item i {
        font-size: 10px;
        margin: 0;
    }
    .dn-select-box ul li.list-item input {
        margin-right: 10px;
    }
    .dn-select-box .separator::before {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #f1f1f1;
    }`
});

dnPipe({
    name: 'customSelectBox',
    module: 'mdSelectBox',
    fn: function () {
        let filtering = (item, search, searchField) => {
            let property_lower = angular.lowercase(item[searchField]),
                search_lower = angular.lowercase(search);
            if (property_lower) return property_lower.indexOf(search_lower) !== -1;
            else console.error('searchField: propiedad "' + searchField + '" no se encontró');
        };

        let reduce_array = (acumulator, item) => {
            acumulator.push(item);
            return acumulator;
        };

        return (object, search, searchField) => {
            if (!search) return object;
            let result;
            if (object) {
                result = Object.keys(object)
                    .filter(key => filtering(object[key], search, searchField))
                    .reduce((acumulator, key) => reduce_array(acumulator, object[key]), []);
            }
            return result;
        }
    }
});
const mdDatePicker = dnComponent({
    name: 'datePicker',
    fn: function (scope, sdates, filter, timeout, smoment) {
        let MomentToday = smoment();
        let DefaultBackup;
        let CacheDates = {},
            CacheDates__saved = (date_object, dates_array) => {
                let date = moment(date_object, sdates.format);
                if (dates_array) {
                    CacheDates[date.year() + '/' + sdates.addCeroToNumber(date.month())] = dates_array;
                }
                return CacheDates[date.year() + '/' + sdates.addCeroToNumber(date.month())];
            };

        scope.name_months = sdates.name_months;
        scope.name_days = sdates.name_days;

        let ChangeGeneralDate = generate_output => {
            scope.dates = CacheDates__saved(scope.general_date) || CacheDates__saved(scope.general_date, sdates.getDays(scope.general_date));

            let pre_out_m = smoment(scope.general_date, sdates.format);
            scope.output = {
                string: generate_output ? pre_out_m.format(sdates.format) : scope.output.string,
                inspect: pre_out_m.toObject()
            };
            if (generate_output) {
                scope.$ctrl.model = scope.output.string;
            }
        };

        scope.next = () => {
            scope.general_date = smoment(scope.general_date, sdates.format).add(1, 'month');
            ChangeGeneralDate();
        };

        scope.prev = () => {
            scope.general_date = smoment(scope.general_date, sdates.format).subtract(1, 'month');
            ChangeGeneralDate();
        };

        let TravelWeekCallback = (year, month, callback) => {
            timeout(() => {
                let month_array = CacheDates[year + '/' + month];
                angular.forEach(month_array, week => {
                    angular.forEach(week.content_week, date => {
                        if (callback) callback(date);
                    });
                });
            });
        };

        let MarkDate = (date, type) => {
            if (type) {
                TravelWeekCallback(date.year, date.month, date_travel => {
                    if (!date_travel.disabled) {
                        if (date.year === date_travel.year && date.month === date_travel.month && date.number === date_travel.number) {
                            date_travel[type] = true;
                            scope.old_selected = date_travel;
                        }
                    }
                });
            } else {
                angular.forEach(date, (date_value, types) => {
                    TravelWeekCallback(date_value.year, date_value.month, date_travel => {
                        if (!date_travel.disabled) {
                            if (date_value.year === date_travel.year && date_value.month === date_travel.month && date_value.number === date_travel.number) {
                                date_travel[types] = true;
                            }
                        }
                    });
                });
            }
        };

        scope.goToDate = date => {
            if (scope.old_selected) scope.old_selected.selected = false;
            scope.general_date = smoment().year(date.year).month(date.month).date(date.number);
            MarkDate(date, 'selected');
            ChangeGeneralDate(true);
        };

        scope.goReturn = () => {
            if (DefaultBackup) {
                scope.general_date = smoment(DefaultBackup, sdates.format);
                ChangeGeneralDate();
            }
        };

        scope.goToday = () => {
            scope.general_date = MomentToday;
            ChangeGeneralDate();
        };

        scope.openDropdown = () => {
            $('#dropdownMenuButton').dropdown('toggle')
        };

        scope.fixClosed = evt => {
            evt.stopPropagation();
        };

        let Run = (() => {
            timeout(() => {
                DefaultBackup = scope.$ctrl.model;
                scope.general_date = DefaultBackup || MomentToday;
                let today = MomentToday,
                    today_obj = today.toObject(),
                    selected = smoment(scope.$ctrl.model, sdates.format).toObject();

                CacheDates__saved(today, sdates.getDays(today));
                MarkDate({
                    today: {
                        year: today_obj.years,
                        month: sdates.addCeroToNumber(today_obj.months),
                        number: sdates.addCeroToNumber(today_obj.date)
                    },
                    default: {
                        year: selected.years,
                        month: sdates.addCeroToNumber(selected.months),
                        number: sdates.addCeroToNumber(selected.date)
                    }
                });
                ChangeGeneralDate(true);
            }, 0);
        })();

        scope.$watch('output.string', recent => {
            let is_valid = sdates.validateDateFormat(recent);
            if (is_valid) {
                scope.general_date = recent;
                let go_date = smoment(recent, sdates.format).toObject();
                scope.goToDate({
                    year: go_date.years,
                    month: sdates.addCeroToNumber(go_date.months),
                    number: sdates.addCeroToNumber(go_date.date)
                });
                ChangeGeneralDate();
            }
            if (scope.$ctrl.form) scope.$ctrl.form.formName.$setValidity('formatDate', is_valid);
        });
    },
    others: {
        bind: {
            model: '=ngModel',
            formName: '@',
            form: '='
        },
    },
    deps: [
        '$scope',
        'sDates',
        '$filter',
        '$timeout',
        'moment'
    ],
    // templateUrl: './src/components/user/forms/date-picker/date-picker.html',
    // stylesUrl: './src/components/user/forms/date-picker/date-picker.css'
    template: `<div class="dn-date-picker">
    <div class="dropdown input-group">
        <span type="button" class="input-group-addon dropdown-toggle" style="padding: 10px;" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-calendar-alt"></i>
        </span>
        <input type="text" class="form-control" ng:model="output.string" required name="formName">
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" ng:click="fixClosed($event)">
            <div class="date-picker-container border">
                <div class="date-picker-header">
                    <div class="row">
                        <div class="col-6 fix-col justify-content-center">
                            <button class="btn btn-simple" ng:bind="output.inspect.years + ' ' + name_months[output.inspect.months].name"></button>
                        </div>
                        <div class="col-6 fix-col justify-content-end">
                            <button class="btn btn-icon btn-sm btn-link" ng:click="goReturn()"><i class="fa fa-undo"></i></button>
                            <button class="btn btn-icon btn-sm btn-link btn-info" ng:click="prev()"><i class="fa fa-chevron-left"></i></button>
                            <button class="btn btn-icon btn-sm btn-link btn-danger" ng:click="goToday()"><i class="fa fa-circle"></i></button>
                            <button class="btn btn-icon btn-sm btn-link btn-info" ng:click="next()"><i class="fa fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
                <table>
                    <tr>
                        <th>SEM</th>
                        <th ng:repeat="day in name_days" ng:bind="day.pref | uppercase" style="border: none;"></th>
                    </tr>
                    <tr ng:repeat="row_date in dates">
                        <td class="td-week">
                            <button class="btn btn-icon" ng:bind="row_date.number_week"></button>
                        </td>
                        <td ng:repeat="date in row_date.content_week track by $index">
                            <button class="btn btn-icon" ng:bind="date.number" ng:click="goToDate(date)" ng:class="{ 'monday': $first, 'selected': date.selected, 'today': date.today, 'default': date.default, 'disabled': date.disabled, 'sunday': $last }"></button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>`,
    styles: `.dn-date-picker {

    }
    .dn-date-picker .dropdown-menu {
        padding: 0;
    }
    
    .dn-date-picker .date-picker-container {
        padding: 5px;
        margin: 5px;
    }
    .dn-date-picker .date-picker-container .date-picker-header {
        margin-bottom: 10px;
    }
    .dn-date-picker th {
        font-size: 10px;
        text-align: center;
        padding-bottom: 10px;
    }
    .dn-date-picker table button.btn,
    .dn-date-picker table button.btn:active {
        margin: 2px;
        background-color: #F6F6F6;
        color: #000;
        border: 1px solid #c5c5c5;
        overflow: visible;
        transition: all .2s linear;
    }
    .dn-date-picker table td button.selected,
    .dn-date-picker table td button.selected:active {
        background-color: #007FFF !important;
        border-color: #003eff !important;
        color: #fff !important;
        
    }
    .dn-date-picker table td button.today {
        background-color: #FFECB3;
        border-color: #FFA000;
        color: #212121;
        font-weight: bold;
    }
    .dn-date-picker table td button.today::before,
    .dn-date-picker table td button.default::before {
        font-weight: normal;
        position: absolute;
        top: -5px;
        right: -5px;
        background: #E91E63;
        color: #fff;
        font-size: 8px;
        padding: 3px;
        border-radius: 3px;
        text-transform: lowercase;
    }
    .dn-date-picker table td button.today::before {
        content: 'hoy';
    }
    .dn-date-picker table td button.default {
        background-color: #C8E6C9;
        border-color: #388E3C;
        color: #212121;
        font-weight: bold;
    }
    .dn-date-picker table td button.default::before {
        content: 'inicio';
    }
    .dn-date-picker table td button.monday {
        margin-left: 5px;
    }
    .dn-date-picker table td button.sunday {
        color: #E91E63;
    }
    .dn-date-picker table td button.disabled {
        border: none;
    }
    .dn-date-picker table button.disabled:hover {
        background-color: #BBDEFB;
        box-shadow: none;
    }
    .dn-date-picker table td.td-week {
        background-color: #BBDEFB;
    }
    .dn-date-picker  td.td-week button.btn {
        background-color: transparent;
        border: none;
        cursor: default;
    }
    .dn-date-picker table td.td-week button.btn:hover {
        background-color: transparent;
        box-shadow: none;
    }
    .dn-date-picker table td.td-week button.btn:active {
        color: #212121;
        border: none;
    }
    .dn-date-picker .input-group-addon.dropdown-toggle {
        -webkit-appearance: none !important;
    }`
});

dnInjectable({
    name: 'sDates',
    module: 'mdDatePicker',
    fn: function (smoment) {
        this.format = 'YYYY/MM/DD';
        let MomentObject = smoment();

        this.name_months = [{
            id: 1,
            name: 'enero',
            pref: 'ene'
        },
        {
            id: 2,
            name: 'febrero',
            pref: 'feb'
        },
        {
            id: 3,
            name: 'marzo',
            pref: 'mar'
        },
        {
            id: 4,
            name: 'abril',
            pref: 'abr'
        },
        {
            id: 5,
            name: 'mayo',
            pref: 'may'
        },
        {
            id: 6,
            name: 'junio',
            pref: 'jun'
        },
        {
            id: 7,
            name: 'julio',
            pref: 'jul'
        },
        {
            id: 8,
            name: 'agosto',
            pref: 'ago'
        },
        {
            id: 9,
            name: 'septiembre',
            pref: 'sept'
        },
        {
            id: 10,
            name: 'octubre',
            pref: 'oct'
        },
        {
            id: 11,
            name: 'noviembre',
            pref: 'nov'
        },
        {
            id: 12,
            name: 'diciembre',
            pref: 'dic'
        }
        ];

        this.name_days = [{
            id: 1,
            name: 'lunes',
            pref: 'lun'
        },
        {
            id: 2,
            name: 'martes',
            pref: 'mar'
        },
        {
            id: 3,
            name: 'miércoles',
            pref: 'mié'
        },
        {
            id: 4,
            name: 'jueves',
            pref: 'jue'
        },
        {
            id: 5,
            name: 'viernes',
            pref: 'vie'
        },
        {
            id: 6,
            name: 'sábado',
            pref: 'sáb'
        },
        {
            id: 7,
            name: 'domingo',
            pref: 'dom'
        }
        ];

        this.validateDateFormat = date_string => {
            return smoment(date_string, this.format, true).isValid();
        };

        this.buildYears = () => {
            let years = [];
            for (let i = 1900; i < 2099; i++) {
                years.push(i);
            }
            return years;
        };

        this.addCeroToNumber = number => {
            return number < 10 ? '0' + number : '' + number;
        };

        this.getDays = date_param => {
            let custom_date = this.validateDateFormat(date_param) ? date_param : MomentObject,
                CurrentDate = {
                    begin: smoment(custom_date, this.format).startOf('month'),
                    end: smoment(custom_date, this.format).endOf('month'),
                },
                PreMonth = {
                    end: smoment(custom_date, this.format).subtract(1, 'month').endOf('month'),
                },
                NextMonth = {
                    begin: smoment(custom_date, this.format).add(1, 'month').startOf('month'),
                },
                AuxDates = [],
                count_date = 1;
            for (let i = 0; i < 6; i++) {
                let week = [];
                let number_week = 0;
                for (let j = 0; j < 7; j++) {
                    let temp_date = j + this.name_days.length * i + 2;
                    let curr_day = CurrentDate.begin.day(),
                        alpha;
                    if (curr_day === 0) {
                        curr_day = 7;
                    } else if (curr_day === 1) {
                        curr_day = 8;
                    }
                    if (temp_date > curr_day) {
                        if (count_date <= CurrentDate.end.date()) {
                            let ins_object = {
                                year: CurrentDate.begin.year(),
                                month: this.addCeroToNumber(CurrentDate.begin.month()),
                                number: this.addCeroToNumber(count_date)
                            };
                            alpha = ins_object;
                            week.push(ins_object);
                        } else {
                            let next_date = count_date - CurrentDate.end.date();
                            let ins_object = {
                                year: NextMonth.begin.year(),
                                month: this.addCeroToNumber(NextMonth.begin.month()),
                                number: this.addCeroToNumber(next_date),
                                disabled: true
                            };
                            alpha = ins_object;
                            week.push(ins_object);
                        }
                        count_date++;
                    } else {
                        let prev_date = PreMonth.end.date() - Math.abs((j - curr_day + 2));
                        let ins_object = {
                            year: PreMonth.end.year(),
                            month: this.addCeroToNumber(PreMonth.end.month()),
                            number: this.addCeroToNumber(prev_date),
                            disabled: true
                        };
                        alpha = ins_object;
                        week.push(ins_object);
                    }
                    if (j === 0) number_week = smoment().year(alpha.year).month(alpha.month).date(alpha.number).week();
                }
                AuxDates.push({
                    content_week: week,
                    number_week: number_week
                });
            }
            return AuxDates;
        };
    },
    deps: ['moment']
});

const dnForms = dnModule('mdForms', [
    mdButtonSubmit,
    mdSelectBox,
    mdDatePicker,
]);
const dnLightbox = dnComponent({
    name: 'lightbox',
    fn: function (scope, sLightBox) {
        scope.paramsParent = sLightBox.params;
        scope.showLightBox = false;
        scope.scales = {
            current: 1,
            variation: .34,
            timesZoomOut: {
                max: 1,
                current: 0
            },
            timesZoomIn: {
                max: 4,
                current: 0
            }
        };
        scope.imageLightboxStyles = {};
        const updateScale = () => {
            scope.imageLightboxStyles.transform = 'scale(' + scope.scales.current + ')';
        };

        scope.zoomOut = () => {
            if (scope.scales.timesZoomOut.current <= scope.scales.timesZoomOut.max) {
                scope.scales.current -= scope.scales.variation;
                updateScale();
                if (scope.scales.timesZoomIn.current > 0) scope.scales.timesZoomIn.current--;
                else scope.scales.timesZoomOut.current++;
            }
        };

        scope.zoomIn = () => {
            if (scope.scales.timesZoomIn.current <= scope.scales.timesZoomIn.max) {
                scope.scales.current += scope.scales.variation;
                updateScale();
                if (scope.scales.timesZoomOut.current > 0) scope.scales.timesZoomOut.current--;
                else scope.scales.timesZoomIn.current++;
            }
        };

        scope.reset = () => {
            scope.scales.current = 1;
            updateScale();
            scope.scales.timesZoomOut.current = 1;
            scope.scales.timesZoomIn.current = 1;
        };

        scope.prev = () => {
            if (scope.currentPosition > 0) {
                scope.currentPosition--;
                scope.reset();
            }
        };
        scope.next = () => {
            if (scope.currentPosition < scope.imagesURLs.length - 1) {
                scope.currentPosition++;
                scope.reset();
            }
        };

        const Run = (() => {
            updateScale();
        })();

        scope.changeState = state => {
            sLightBox.params.state = state;
            if (!state) {
                scope.reset();
            }
        };

        const openSingleImage = recent => {
            scope.currentImage = recent.image;
        };

        const openMultipleImage = recent => {
            const position = scope.imagesURLs.indexOf(recent.image);
            scope.currentPosition = position;
        };

        scope.$watch('paramsParent', recent => {
            if (recent) {
                if (recent.templateFinded) {
                    const template = angular.element(recent.templateFinded);
                    const images = template.find('img');
                    scope.imagesURLs = [];
                    angular.forEach(images, image => {
                        scope.imagesURLs.push(image.src);
                    });
                } else {
                    scope.imagesURLs = undefined;
                }
                if (recent.state) {
                    if (scope.scales.current !== -1) {
                        scope.reset();
                        if (scope.imagesURLs) {
                            openMultipleImage(recent);
                        } else {
                            openSingleImage(recent);
                        }
                    }
                }
                scope.showLightBox = recent.state;
                const body = document.querySelector('body');
                if (scope.showLightBox) {
                    body.style.overflowY = 'hidden';
                } else {
                    body.style.overflowY = 'initial';
                }
            }
        }, true);
    },
    deps: [
        '$scope',
        'sLightbox'
    ],
    others: {
        bind: {
            image: '='
        }
    },
    // templateUrl: './src/components/user/lightbox/lightbox.html',
    // stylesUrl: './src/components/user/lightbox/lightbox.css'
    template: `<div class="dn-lightbox" ng:class="{ 'show': showLightBox }">
    <div class="lightbox-header" tabindex="2">
        <div class="lightbox-title">
            <i class="fa fa-times" app:tooltip="Cerrar" ng:click="changeState(false)"></i>
        </div>
        <div class="lightbox-actions">
<!--             <i class="fa fa-download" app:tooltip="Descargar"></i>
 -->        </div>
    </div>
    <div class="lightbox-container" tabindex="1" ng:style="containerStyles" ng:focus="changeState(false)">
        <div class="lightbox-body">
            <img ng:if="imagesURLs" class="img" ng:src="{{imagesURLs[currentPosition]}}" alt="" ng:style="imageLightboxStyles"
                tabindex="2">
            <img ng:if="!imagesURLs" class="img" ng:src="{{currentImage}}" alt="" ng:style="imageLightboxStyles"
                tabindex="2">
        </div>
    </div>
    <div class="lightbox-footer" tabindex="2">
        <button ng:if="imagesURLs" type="button" class="btn bg-danger btn-icon" ng:click="prev()" ng:class="{ 'disabled': currentPosition <= 0 }"><i
                class="fa fa-arrow-left"></i></button>
        <div class="btn-group">
            <button type="button" class="btn bg-info btn-icon" ng:click="zoomOut()" ng:class="{ 'disabled': scales.timesZoomOut.current > scales.timesZoomOut.max }"><i
                    class="fa fa-minus"></i></button>
            <button type="button" class="btn bg-info btn-icon" ng:click="reset()" ng:class="{ 'disabled': scales.current === 1 }"><i
                    class="fa fa-search"></i></button>
            <button type="button" class="btn bg-info btn-icon" ng:click="zoomIn()" ng:class="{ 'disabled': scales.timesZoomIn.current > scales.timesZoomIn.max }"><i
                    class="fa fa-plus"></i></button>
        </div>
        <button ng:if="imagesURLs" type="button" class="btn bg-danger btn-icon" ng:click="next()" ng:class="{ 'disabled': currentPosition >= imagesURLs.length - 1 }"><i
                class="fa fa-arrow-right"></i></button>
    </div>
</div>`,
    styles: `.dn-lightbox {
        --space-top: 62px;
        --space-bottom: 60px;
        --background-container: rgba(255, 255, 255, .85);
        --background-header: rgba(255, 0, 0, 0.4);
        --background-body: rgba(0, 0, 0, 0.85);
        --color-text: #5f6368;
        --transition-smoth: cubic-bezier(0.25, 0.46, 0.45, 0.94);    
    }
    .dn-lightbox .lightbox-container {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: var(--background-container);
        top: 0;
        left: 0;
        color: var(--color-text);
        padding-top: var(--space-top);
        padding-bottom: var(--space-bottom);
        z-index: 1090;
        visibility: hidden;
        opacity: 0;
        /* transform: scale(0); */
        /* transform-origin: 600px 400px; */
        transition: all .3s var(--transition-smoth);
    }
    .dn-lightbox.show .lightbox-container {
        visibility: visible;
        opacity: 1;
        /* transform: scale(1); */
    }
    .dn-lightbox .lightbox-header {
        position: fixed;
        top: 0;
        width: 100%;
        height: var(--space-top);
        /* background-color: var(--background-header); */
        background-color: white;
        color: var(--color-text);
        display: flex;
        justify-content: space-between;
        padding: 0 25px;
        /* border-bottom: #dadce0 1px solid; */
        /* box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15); */
        z-index: 109000000;
        outline: none;
        visibility: hidden;
        opacity: 0;
        transition: all .3s var(--transition-smoth);
    }
    .dn-lightbox.show .lightbox-header {
        visibility: visible;
        opacity: 1;
        z-index: 109000000;
        
    }
    .dn-lightbox .lightbox-header i {
        /* padding: 10px; */
        border-radius: 50%;
        width: 33px;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color .3s var(--transition-smoth);
    }
    .dn-lightbox .lightbox-header i:hover {
        background-color: rgba(0, 0, 0, .1);
    }
    .dn-lightbox .lightbox-header .lightbox-title,
    .dn-lightbox .lightbox-header .lightbox-actions {
        display: flex;
    }
    .dn-lightbox .lightbox-header .lightbox-title {
        align-items: center;
    }
    .dn-lightbox .lightbox-header .lightbox-actions {
        align-items: center;
    }
    .dn-lightbox .lightbox-container .lightbox-body {
        position: absolute;
        width: 100%;
        height: calc(100% - var(--space-top) - var(--space-bottom));
        display: flex;
        justify-content: center;
        align-items: center;
        /* background-color: var(--background-body); */
        z-index: 1;
        outline: none;
    }
    .dn-lightbox .lightbox-container .lightbox-body img {
        display: block;
        max-width: 90%;
        max-height: 90%;
        transition: transform .3s var(--transition-smoth);
        box-shadow: 0px 5px 25px 0px rgba(0, 0, 0, 0.2);
        outline: none;
    }
    .dn-lightbox.show .lightbox-container .lightbox-body img {
        
    }
    .dn-lightbox .lightbox-footer {
        position: fixed;
        width: 100%;
        height: 60px;
        background-color: var(--background-container);
        z-index: 1091;
        display: flex;
        justify-content: space-around;
        align-items: center;
        bottom: 0;
        left: 0;
        padding: 0 25px;
        outline: none;
    
        visibility: hidden;
        opacity: 0;
        transition: all .3s var(--transition-smoth);
    }
    .dn-lightbox.show .lightbox-footer {
        visibility: visible;
        opacity: 1;
    }
    .dn-lightbox .lightbox-footer .btn-group {
        /* border: 1px solid #c5c5c5; */
        border-radius: .25rem;
    }
    .dn-lightbox .lightbox-footer .btn {
        /* color: var(--color-text); */
        margin: 0;
        /* background-color: #F6F6F6; */
    }
    .dn-lightbox .lightbox-footer .btn i {
        font-size: 10px !important;
    }`
});

dnInjectable({
    name: 'sLightbox',
    module: 'mdLightbox',
    fn: function () {
        this.params = {
            state: false,
            image: undefined,
            templateFinded: undefined
        };
        this.open = (image, template) => {
            this.params.state = true;
            this.params.image = image;
            this.params.templateFinded = template;
        };
        this.setTemplateFind = name => {
            console.log(name);
            this.templateFinded = name;
        };
    }
});

dnDirective({
    name: 'lightboxOpen',
    module: 'mdLightbox',
    fn: function (sLightBox, timeout) {
        const regexp = /(url\(("?'?)|("?'?)\))/g;
        timeout(() => {
            this.dnElement.on('click', () => {
                this.$apply(() => {
                    let src = this.dnElement[0].src || this.dnElement[0].style['background-image'].replace(regexp, '');
                    if (src) sLightBox.open(src);
                    else this.dnElement.off('click');
                });
            });
        }, 0);
    },
    deps: [
        'sLightbox',
        '$timeout'
    ]
});
const dnPaginator = dnComponent({
    name: 'paginator',
    fn: function (scope, sKey, element) {
        scope.default_page = 1;
        scope.page = {
            pointer: 0,
            interval: scope.interval || 10
        };

        scope.previous = function () {
            if (scope.page.pointer - scope.page.interval >= 0) {
                scope.page.pointer -= scope.page.interval;
            }
        };

        scope.next = function () {
            if (scope.page.pointer + scope.page.interval <= scope.page.size) {
                scope.page.pointer += scope.page.interval;
            }
        };

        scope.previousElement = function () {
            if (scope.page.pointer - scope.page.interval >= 0) {
                scope.page.pointer -= scope.page.interval;
            }
        };

        scope.nextElement = function () {
            if (scope.page.pointer + scope.page.interval <= scope.page.size) {
                scope.page.pointer += scope.page.interval;
            }
        };

        scope.disablePrev = function () {
            return scope.page.pointer === 0;
        };

        scope.disableNext = function () {
            return scope.page.pointer + scope.page.interval >= scope.page.size;
        };

        scope.buttonsPagination = (currentPage, pages) => {
            let quantity = 9;
            let result = [];

            if (pages < quantity) {
                for (let index = 0; index < pages; index++) {
                    result.push(index + 1);
                }
            } else {
                if (currentPage < quantity - 4) {
                    for (let index = 0; index < quantity - 2; index++) {
                        result.push(index + 1);
                    }
                    result.push('...', pages);
                } else if (currentPage >= quantity - 4 && currentPage <= pages - 5) {
                    result.push(1, '...');
                    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
                        result.push(index);
                    }
                    result.push('...', pages);
                } else {
                    result.push(1, '...');
                    for (let index = pages - 6; index <= pages; index++) {
                        result.push(index);
                    }
                }
            }
            return result;
        };

        scope.goToPage = button => {
            if (typeof button === 'number') scope.page.pointer = (button - 1) * scope.page.interval;
        };

        scope.$watch('page', (recent, old) => {
            if (recent.filter !== old.filter || recent.pages < old.pages) scope.page.pointer = 0;
        }, true);

        scope.onInit = () => {
            scope.indexElement = 0;
            sKey.set({
                'CURSOR_RIGHT': () => {
                    console.log('CURSOR_RIGHT', element)
                    scope.next()
                },
                'CURSOR_LEFT': () => {
                    console.log('CURSOR_LEFT', element)
                    scope.previous()
                },
            });
        };

        scope.initFocus = () => { 

        };
    },
    deps: ['$scope', 'sKey', '$element'],
    // templateUrl: './src/components/user/paginator/paginator.html',
    // stylesUrl: './src/components/user/paginator/paginator.css'
    template: `<div class="dn-paginator">
    <div class="container-fluid paginator-content" ng:if="page.pages > 1" ng:class="scale" ng:init="onInit()">
        <div class="row paginator-row">
            <div class="col-md-8 fix-col justify-content-start paginator-controls">
                <button type="button" class="btn btn-link btn-icon" ng:click="previous()" ng:disabled="disablePrev()">
                    <i class="fa fa-chevron-left"></i>
                </button>
                <!-- start -->
                <div class="paginator-numeric">
                    <button type="button" class="btn btn-icon" ng:repeat="button in buttonsPagination(page.currentPage, page.pages) track by $index"
                        ng:class="button === page.currentPage ? 'btn-info' : 'btn-link'" ng:click="goToPage(button)">
                        <span ng:if="button !== '...'" ng:bind="button"></span>
                        <i ng:show="button === '...'" class="fa fa-ellipsis-h"></i>
                    </button>
                </div>
                <div class="paginator-select-page fix-col">
                    <button type="button" class="btn btn-link btn-icon" ng:bind="page.currentPage + ' / ' + page.pages"></button>
                </div>
                <!-- end -->
                <button type="button" class="btn btn-link btn-icon" ng:click="next()" ng:disabled="disableNext()">
                    <i class="fa fa-chevron-right"></i>
                </button>
            </div>
            <div class="col-md-4 paginator-info fix-col justify-content-end">
                <button type="button" class="btn btn-link" type="button">Mostrando
                    <strong ng:bind="page.pointer + 1"></strong> a
                    <strong ng:bind="page.pointer + page.interval"></strong> de
                    <strong ng:bind="page.size"></strong> elementos
                </button>
            </div>
        </div>
    </div>
    <div class="alert alert-danger alert-table" ng:if="page.pages === 0">
        <strong>Aviso</strong> No hay datos para mostrar.
    </div>
</div>`,
    styles: `.dn-paginator {
    
    }
    .dn-paginator .paginator-content {
        margin-top: 20px;
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: 3px;
    }
    .dn-paginator .paginator-controls button span {
        font-size: 12px !important;
    }
    .dn-paginator .paginator-controls button.btn-info {
        color: #fff !important;
    }
    .dn-paginator .paginator-select-page {
        display: none;
    }
    .dn-paginator .form-group {
        width: 40px; 
        margin-right: 10px;
    }
    .dn-paginator .form-group .form-control {
        padding: 10px 0;
        text-align: center;
    }
    
    /* NO INFORMATION */
    .dn-paginator .medium .paginator-row,
    .dn-paginator .small .paginator-row {
        justify-content: center;
    }
    .dn-paginator .medium .paginator-controls,
    .dn-paginator .small .paginator-controls {
        justify-content: center !important;
    }
    .dn-paginator .medium .paginator-info,
    .dn-paginator .small .paginator-info {
        display: none;
    }
    .dn-paginator .medium .paginator-numeric,
    .dn-paginator .small .paginator-numeric {
        display: inline-flex;
    }
    
    .dn-paginator .small .paginator-numeric {
        display: none;
    }
    .dn-paginator .small .paginator-select-page {
        display: flex;
    }
    
    @media screen and (max-width: 991px) {
        .dn-paginator .paginator-row {
            justify-content: center;
        }
        .dn-paginator .paginator-controls {
            justify-content: center !important;
        }
        .dn-paginator .paginator-info {
            display: none;
        }
        .dn-paginator .paginator-numeric {
            display: inline-flex;
        }
    }
    @media screen and (max-width: 650px) { 
        .dn-paginator .paginator-numeric {
            display: none;
        }
        .dn-paginator .paginator-select-page {
            display: flex;
        }
    }`
});

dnPipe({
    name: 'paginate',
    module: 'mdPaginator',
    fn: function (sFilter) {
        const CalculatePages = (size, interval) => {
            let pages = 0;
            const rest = size % interval;
            pages = parseInt(size / interval);
            if (rest > 0) pages++;
            return pages;
        };
        return (array, page, search) => {
            if (page && array) {
                array = sFilter('filter')(array, search);
                page.size = array.length;
                page.filter = search;
                page.pages = CalculatePages(page.size, page.interval);
                page.currentPage = page.pointer / page.interval + 1;
                return array.slice(page.pointer, page.pointer + page.interval);
            }
        }
    },
    deps: ['$filter']
});
const dnPopover = dnComponent({
    name: 'popover',
    fn: function (timeout) {
        let nameAttrFind, parent, target;
        timeout(() => {
            nameAttrFind = 'popover-target';
            parent = element.parent();
            target = parent.find(`[${nameAttrFind}="${scope.target}"]`);
            Run();
        });

        scope.showPopover = false;
        scope.placement = scope.placement || 'top';

        const triggers_map = {
            click: {
                on: 'click',
                off: 'click'
            },
            hover: {
                on: 'mouseenter',
                off: 'mouseleave'
            },
            focus: {
                on: 'focus',
                off: 'blur'
            }
        };
        const triggerOn = triggers_map[scope.trigger].on,
            triggerOff = triggers_map[scope.trigger].off;

        const calculateAndSetPositions = evt => {
            const container = element.find('.popover-container');
            let meters = {
                target: {
                    width: target.outerWidth(),
                    height: target.outerHeight(),
                    top: evt.target.offsetTop,
                    left: evt.target.offsetLeft
                },
                popover: {
                    width: container.outerWidth(),
                    height: container.outerHeight()
                },
            };
            return meters;
        };

        const applyPositions = evt => {
            const positions = calculateAndSetPositions(evt);
            scope.stylePosition = {};
            let top, left;
            switch (scope.placement) {
                case 'top':
                    top = positions.target.top - positions.popover.height + 'px';
                    if (scope.middle || scope.middle === undefined) left = positions.target.left + positions.target.width / 2 - positions.popover.width / 2 + 'px';
                    else left = positions.target.left;
                    break;
                case 'bottom':
                    top = positions.target.top + positions.target.height + 'px';
                    if (scope.middle || scope.middle === undefined) left = positions.target.left + positions.target.width / 2 - positions.popover.width / 2 + 'px';
                    else left = positions.target.left;
                    break;
                case 'left':
                    left = positions.target.left - positions.popover.width + 'px';
                    if (scope.middle || scope.middle === undefined) top = positions.target.top + positions.target.height / 2 - positions.popover.height / 2 + 'px';
                    else top = positions.target.top;
                    break;
                case 'right':
                    left = positions.target.left + positions.target.width + 'px';
                    if (scope.middle || scope.middle === undefined) top = positions.target.top + positions.target.height / 2 - positions.popover.height / 2 + 'px';
                    else top = positions.target.top;
                    break;
            }
            scope.stylePosition.top = top;
            scope.stylePosition.left = left;
        };

        const Run = () => {
            target.on(triggerOn, evt => {
                scope.$apply(() => {
                    applyPositions(evt);
                    scope.showPopover = (scope.trigger === 'click') ? !scope.showPopover : true;
                });
            });
            if (scope.trigger !== 'click') {
                target.on(triggerOff, evt => {
                    scope.$apply(() => {
                        scope.showPopover = false;
                    });
                });
            }
        };
    },
    deps: ['$timeout'],
    // templateUrl: './src/components/user/popover/popover.html',
    // stylesUrl: './src/components/user/popover/popover.css'
    template: `<div class="dn-popover {{placement}}" ng:class="{ 'show': showPopover }">
    <div class="popover-container" ng:style="stylePosition" ng:class="scale">
        <ng-transclude></ng-transclude>
        <span class="arrow" ng:class="{ 'middle': middle || middle === undefined }"></span>
    </div>
</div>`,
    styles: `.dn-popover {
    
    }
    .dn-popover .popover-container {
        position: absolute;
        max-width: 276px;
        width: max-content;
        line-height: 15px;
        background-color: #fff;
        /* border: 1px solid #3f51b5; */
        border-radius: 4px;
        z-index: 1050;
        word-wrap: break-word;
        text-align: left;
        white-space: normal;
        text-transform: none;
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
        font-size: 11px;
        margin-bottom: 20px;
    
        /* animation */
        visibility: hidden;
        opacity: 0;
        transform: translateY(0);
        transition: all .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    /* test */
    .dn-popover .popover-container.medium {
        max-width: 600px;
    }
    .dn-popover .popover-content {
        padding: 15px;
        padding-top: 7px;
        color: initial;
    }
    .dn-popover .popover-container .popover-title {
        margin-top: 7px;
        color: #434A54;
        /* color: #fff; */
        font-weight: bold;
        padding: 10px 15px;
    }
    .dn-popover .arrow {
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background-color: white;
        /* border: 1px solid #3f51b5; */
    }
    .dn-popover.right .arrow {
        top: 5px;
        left: -9px;
        transform: rotateZ(45deg);
        border-top: none;
        border-right: none;
    }
    .dn-popover.right .arrow.middle {
        top: 50%;
        left: -17.5px;
        transform: rotateZ(45deg) translateY(-50%);
    }
    .dn-popover.bottom .arrow {
        top: -9px;
        left: 5px;
        transform: rotateZ(45deg);
        border-right: none;
        border-bottom: none;
    }
    .dn-popover.bottom .arrow.middle {
        top: -3.5px;
        left: 50%;
        transform: rotateZ(45deg) translateX(-50%);
    }
    .dn-popover.top .arrow {
        bottom: -10px;
        left: 6px;
        transform: rotateZ(45deg);
        border-top: none;
        border-left: none;
    }
    .dn-popover.top .arrow.middle {
        bottom: -17px;
        left: 50%;
        transform: rotateZ(45deg) translateX(-50%);
    }
    .dn-popover.left .arrow {
        top: 7px;
        right: -10px;
        transform: rotateZ(45deg);
        border-bottom: none;
        border-left: none;
    }
    .dn-popover.left .arrow.middle {
        top: 50%;
        right: -3px;
        transform: rotateZ(45deg) translateY(-50%);
    }
    
    /* show hide */
    .dn-popover.show .popover-container {
        visibility: visible;
        opacity: 1;
    }
    .dn-popover.bottom.show .popover-container {
        transform: translateY(15px);
    }
    .dn-popover.top.show .popover-container {
        transform: translateY(-15px);
    }
    .dn-popover.left.show .popover-container {
        transform: translateX(-15px);
    }
    .dn-popover.right.show .popover-container {
        transform: translateX(15px);
    }
    @media screen and (max-width: 414px) {
        .dn-popover .popover-container.medium {
            max-width: 100%;
        }
    }`
});

const dnTranslate = dnDirective({
    name: 'translate',
    fn: function (sTranslate) {
        // console.log(sTranslate)
        this.translateObject = sTranslate.translateObject;
    },
    deps: ['pTranslate'],
    template: '<any ng:bind="translateObject.translations[code]"></any>',
    others: {
        bind: {
            code: '@dTranslate'
        }
    }
});

dnInjectable({
    name: 'pTranslate',
    module: 'mdTranslate',
    fn: {
        private: function () {
            this.translationsMapped = {};
            this.translateObject = {
                lang: 'sp',
                translations: undefined
            };
        },
        public: function () {
            return Object.assign({}, {
                translateObject: this.translateObject,
                use: language_key => {
                    let key = language_key || 'sp';
                    this.translateObject.lang = key;
                    this.translateObject.translations = this.translationsMapped[key];
                }
            });
        },
        deps: ['$rootScope']
    }
});
const dnTooltip = dnDirective({
    name: 'tooltip',
    fn: function (compile, timeout) {
        let scope = this;
        const tooltipParent = scope.dnElement.parent();
        let tooltipCompile;
        scope.position = scope.dnAttrs.tooltipPos || 'bottom';
        scope.showTooltip = false;
        scope.compiled = false;

        scope.dnElement.on('mouseenter', evt => {
            scope.$apply(() => {
                applyPositions();
                scope.showTooltip = true;
            });
        });

        scope.dnElement.on('mouseleave', evt => {
            scope.$apply(() => {
                scope.showTooltip = false;
            });
        });

        const calculateAndSetPositions = () => {
            const container = tooltipCompile.find('.tooltip-container');
            let meters = {
                target: {
                    width: scope.dnElement.outerWidth(),
                    height: scope.dnElement.outerHeight(),
                    top: scope.dnElement[0].offsetTop,
                    left: scope.dnElement[0].offsetLeft
                },
                tooltip: {
                    width: container.outerWidth(),
                    height: container.outerHeight()
                },
            };
            return meters;
        };

        const applyPositions = () => {
            const positions = calculateAndSetPositions();
            scope.stylePosition = {};
            let top, left;
            switch (scope.position) {
                case 'top':
                    top = positions.target.top - positions.tooltip.height + 'px';
                    left = positions.target.left + positions.target.width / 2 - positions.tooltip.width / 2 + 'px';
                    break;
                case 'bottom':
                    top = positions.target.top + positions.target.height + 'px';
                    left = positions.target.left + positions.target.width / 2 - positions.tooltip.width / 2 + 'px';
                    break;
                case 'left':
                    left = positions.target.left - positions.tooltip.width + 'px';
                    top = positions.target.top + positions.target.height / 2 - positions.tooltip.height / 2 + 'px';
                    break;
                case 'right':
                    left = positions.target.left + positions.target.width + 'px';
                    top = positions.target.top + positions.target.height / 2 - positions.tooltip.height / 2 + 'px';
                    break;
            }
            scope.stylePosition.top = top;
            scope.stylePosition.left = left;
        };

        const Run = (() => {
            const template = `
				<div class="dn-tooltip" ng:class="{ 'show': showTooltip }">
					<div class="tooltip-container" ng:class="position" ng:style="stylePosition">
						<span ng:bind="message"></span>
					</div>
				</div>
				`;
            tooltipCompile = compile(template)(scope);
            tooltipParent.append(tooltipCompile);
            timeout(() => {
                if (scope.dnAttrs.tooltipOpen !== undefined) {
                    applyPositions();
                    scope.showTooltip = true;
                }
            }, 100);
        })();
    },
    deps: ['$compile', '$timeout'],
    // stylesUrl: './src/components/user/tooltip/tooltip.css',
    styles: `.dn-tooltip {
    
    }
    .dn-tooltip .tooltip-container {
        position: absolute;
        max-width: 200px;
        width: max-content;
        line-height: 14px;
        background-color: #747474;
        border-radius: 4px;
        padding: 7px 8px 5px 8px;
        z-index: 1050;
        word-wrap: break-word;
        text-align: center;
        white-space: normal;
    
        /* animation */
        visibility: hidden;
        opacity: 0;
        transform: translateY(0);
        transition: all .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .dn-tooltip.show .tooltip-container {
        visibility: visible;
        opacity: 1;
    }
    .dn-tooltip.show .tooltip-container.bottom {
        transform: translateY(10px);
    }
    .dn-tooltip.show .tooltip-container.top {
        transform: translateY(-10px);
    }
    .dn-tooltip.show .tooltip-container.left {
        transform: translateX(-10px);
    }
    .dn-tooltip.show .tooltip-container.right {
        transform: translateX(10px);
    }
    .dn-tooltip .tooltip-container span {
        font-size: 10px !important;
        font-weight: initial;
        text-transform: initial;
        color: #fff;
        display: block;
    }`,
    others: {
        bind: {
            message: '@dTooltip'
        }
    }
});
const dnSpinner = dnDirective({
    name: 'spinner',
    fn: function () {
        let ParsintStatus = 'promiseState.$$state.status',
            Parent = angular.element(this.dnElement.parent());
        this.$watch(ParsintStatus, recent => {
            // console.log(recent);
            if (!this.options || !this.options.scale) {
                switch (recent) {
                    case 1:
                        Parent.removeClass('parent-attrs');
                        break;
                    case 0:
                        Parent.addClass('parent-attrs');
                        break;
                }
            }
        });
    },
    others: {
        transclude: true,
        bind: {
            promiseState: '=dSpinner',
            options: '='
        }
    },
    // templateUrl: './src/components/user/spinner/spinner.html',
    // stylesUrl: './src/components/user/spinner/spinner.css'
    template: `<div class="dn-spinner" ng:class="'scale-' + (options.scale || 'default')">
	<div class="spinner-container text-center" ng:if="promiseState.$$state.status === 0" ng:class="'container-' + (options.scale || 'default')">
		<div class="background-spinner flex-{{options.direction}}">
			<i class="fa-spin" ng:class="options.icon || 'fa fa-spinner'"></i>
			<small ng:if="options.scale !== 'min' && options.message !== ''"><span ng:bind="options.message || 'cargando'"></span></small>
		</div>
	</div>
	<ng-transclude></ng-transclude>
</div>`,
    styles: `.dn-spinner {
    
    }
    .dn-spinner .spinner-container.container-default {
        display: flex;
        justify-content: center;
        align-items: center;
    
        position: absolute;
        background-color: rgba(255, 255, 255, .9);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 3;
    }
    
    .dn-spinner .spinner-container.container-max {
        display: flex;
        justify-content: center;
        align-items: center;
    
        background-color: rgba(0, 0, 0, 0.5);
    
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1050;
    }
    .dn-spinner .spinner-container.container-max .background-spinner,
    .dn-spinner .spinner-container.container-default .background-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;   
    }
    .dn-spinner .spinner-container.container-max .background-spinner {
        position: absolute;
        min-width: 150px;
        height: 150px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);
    }
    .dn-spinner .spinner-container .background-spinner small {
        font-size: 10px !important;
        margin: 0 20px;
    }
    
    .dn-spinner .spinner-container.container-min {
        display: inline-block;
    }
    .dn-spinner .spinner-container.container-min i {
        font-size: initial;
        margin: 0 10px 0 0;;
    }
    
    .dn-spinner .spinner-container i {
        font-size: 30px; /* 40px */
        margin: 20px;
    }
    
    .parent-attrs {
        position: relative;
        min-height: 200px;
    }`
});
const dnUploaderfile = dnComponent({
    name: 'uploaderfile',
    fn: function (scope, sLightbox, sce, sModal, cApi, root) {
        scope.file_model = '';
        let ImageDataBackup = './assets/img/uploader/upload-1.png';
        let ListFilesModel = [];

        let MegasConvertion = bytes => {
            if (bytes) {
                let kilobyte = 1024;
                let res = bytes / kilobyte;
                return res.toFixed(0, 3);
            }
        };

        let ResizeImage = (file, max_width, max_height, callback) => {
            let image = new Image();
            let Reader = new FileReader();
            Reader.readAsDataURL(file);
            Reader.onloadend = e => {
                image.src = Reader.result;
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                let MaxWidth = max_width;
                let MaxHeight = max_height;

                image.onload = () => {
                    let width = image.width;
                    let height = image.height;

                    if (width > height) {
                        if (width > MaxWidth) {
                            height *= MaxWidth / width;
                            width = MaxWidth;
                        }
                    } else {
                        if (height > MaxHeight) {
                            width *= MaxHeight / height;
                            height = MaxHeight;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, width, height);

                    canvas.toBlob(blob => {
                        let properties = {
                            type: file.type,
                            lastModified: file.lastModified,
                            lastModifiedDate: file.lastModifiedDate,
                            name: file.name,
                            webkitRelativePath: file.webkitRelativePath
                        };
                        let file_resized = new File([blob], file.name, properties);
                        callback(file_resized);
                    }, "image/jpeg", 0.95);
                };
            };
        };

        let ProccessImage = file => {
            let data__result;
            let data__image;
            let Reader = new FileReader();
            Reader.readAsDataURL(file);
            Reader.onloadend = () => {
                scope.$apply(() => {
                    data__result = Reader.result;
                    let image = new Image();
                    image.src = Reader.result;
                    image.onload = () => {
                        scope.$apply(() => {
                            let width = image.width;
                            let height = image.height;
                            data__image = {
                                name: file.name,
                                size: MegasConvertion(file.size) + ' kylobyes',
                                type: 'imagen',
                                width: width,
                                height: height
                            };
                            let validation;
                            if (width <= scope.dimentions__max.width && height <= scope.dimentions__max.height && HaveSizeValid(file.size, file.type)) {
                                validation = {
                                    success: true,
                                    message: 'La imagen es correcta.'
                                };
                                if (scope.options.multiple) {
                                    ListFilesModel.push(file);
                                    this.model = ListFilesModel;
                                } else {
                                    this.model = file;
                                }
                            } else {
                                if (!scope.options.multiple) {
                                    this.model = undefined;
                                }
                                validation = {
                                    error: true,
                                    message: 'La imagen excede las dimensiones máximas y no será enviada.'
                                };
                            }
                            let data__final = {
                                result: data__result,
                                attrs: data__image,
                                validation: validation
                            };
                            if (scope.options.multiple) {
                                scope.list__files.push(data__final);
                            } else {
                                scope.file__current = data__final;
                            }
                        });
                    };
                });
            };
            Reader.onloadstart = () => {

            };
        };

        scope.getIconOtherFile = (type, otherType) => {
            let icon;
            if (type) {
                switch (type) {
                    case 'application/javascript':
                        icon = 'file-alt'
                        break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        icon = 'file-word'
                        break;
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        icon = 'file-excel'
                        break;
                    case 'application/x-zip-compressed':
                        icon = 'file-archive'
                        break;
                    case 'text/plain':
                        icon = 'font'
                        break;
                    case 'application/pdf':
                        icon = 'file-pdf'
                        break;
                    case 'video/mp4':
                        icon = 'file-video'
                        break;
                    default:
                        icon = 'file'
                        break;
                }
            } else {
                switch (otherType) {
                    case 'javascript':
                        icon = 'file-alt'
                        break;
                    case 'word':
                        icon = 'file-word'
                        break;
                    case 'excel':
                        icon = 'file-excel'
                        break;
                    case 'zip':
                        icon = 'file-archive'
                        break;
                    case 'text':
                        icon = 'font'
                        break;
                    case 'pdf':
                        icon = 'file-pdf'
                        break;
                    case 'video':
                        icon = 'file-video'
                        break;
                    default:
                        icon = 'file'
                        break;
                }
            }
            return icon;
        };

        let ProccessOtherFile = file => {
            let data__result;
            let Reader = new FileReader();
            Reader.readAsDataURL(file);
            Reader.onload = () => {
                scope.$apply(() => {
                    data__result = Reader.result;
                    let data__file = {
                        name: file.name,
                        size: MegasConvertion(file.size) + ' kylobyes',
                        type: scope.getIconOtherFile(file.type)
                    };
                    // source: file
                    let data__final = {
                        result: data__result,
                        attrs: data__file
                    };
                    if (scope.options.multiple) {
                        if (HaveSizeValid(file.size, file.type)) {
                            data__final.validation = {
                                success: true,
                                message: 'El archivo es correcto.'
                            }
                            ListFilesModel.push(file);
                        } else {
                            data__final.validation = {
                                error: true,
                                message: 'El archivo excede el peso máximo y no será enviado.'
                            }
                        }
                        scope.list__files.push(data__final);
                    } else {
                        if (HaveSizeValid(file.size, file.type)) {
                            this.model = file;
                            data__final.validation = {
                                success: true,
                                message: 'El arcivo es correcto.'
                            };
                            scope.file__current = data__final;
                            
                        } else {
                            data__final.validation = {
                                success: false,
                                message: 'El archivo excede el peso.'
                            };
                            scope.file__current = data__final;
                            sModal.warning('El archivo seleccionado excede el peso máximo de kilobytes.');
                        }
                    }
                });
            };
            Reader.onloadstart = () => {

            };
        };

        let HaveSizeValid = (bytes, type) => {
            let size = parseInt(MegasConvertion(bytes));
            return size <= scope.dimentions__max.size;
        };

        scope.check_eventUser = (index, one) => {
            if (this.checkMethod) this.checkMethod.fn(index, one)
        }

        scope.anular_check_eventUser = (index, one) => {
            if (this.anularCheckMethod) this.anularCheckMethod.fn(index, one)
        }

        scope.download_file_eventUser = (index, one) => {
            if (this.downloadFileMethod) this.downloadFileMethod.fn(index, one)
        }

        scope.remove__event = (index, attrs) => {
            angular.forEach(ListFilesModel, (value, key) => {
                if (value.name === attrs.name) {
                    ListFilesModel.splice(key, 1);
                    this.model = ListFilesModel;
                }
            });
            scope.list__files.splice(index, 1);
        };

        scope.preview__event = file => {
            if (file.result.indexOf('image') !== -1) {
                // box.open({ nombre: file.attrs.name + ' - ' + file.attrs.size, url: file.result });
            } else {
                let url_file = file.result;
                scope.modal__current_file = sce.trustAsResourceUrl(url_file);
                sModal.open('uploaderfile');
            }
        };

        scope.preview__event_single = image => {
            let result = angular.isObject(image) ? image.result : image;
            box.open({
                nombre: angular.isObject(image) ? image.attrs.name + ' - ' + image.attrs.size : image,
                url: result
            });
        };

        scope.clean__event = () => {
            
            this.model = undefined;
            scope.file__current = undefined;
            scope.content__default = this.default;
            scope.list__files = []
            ListFilesModel = []
        };

        scope.remove__eventUser = (index, file) => {
            if (this.removeMethod) this.removeMethod.fn(index, file, this.removeMethod.typeId, this.removeMethod.typeKey)
        }

        scope.validateClean = () => {
            let bloq = true;
            if (scope.file__current) {
                bloq = false;
            }
            // scope.file__current && scope.file__current.validation && scope.file__current.validation.success && 
            if (!this.model) {
                bloq = true;
            }

            return bloq;
        };

        let IterateArrayOfFiles = files => {
            let options = this.options;
            angular.forEach(files, (value, key) => {
                if (value.type.indexOf('image') !== -1) {
                    if (options && options.resize) {
                        ResizeImage(value, options.resize.width, options.resize.height, ProccessImage);
                    } else {
                        ProccessImage(value);
                    }
                } else if (value.type.indexOf('image') === -1 && scope.options.type === 'all-files') {
                    ProccessOtherFile(value);
                }
            });
        };

        scope.options_drop = {
            dragging: e => {
                
            },
            drop: (e, elem, model) => {
                IterateArrayOfFiles(model);
            }
        };

        scope.$watch('file_model', before => {
            if (before) {
                if (scope.options.multiple) {
                    IterateArrayOfFiles(before);
                } else {
                    let options = this.options;
                    if (before.type.indexOf('image') !== -1) {
                        if (options && options.resize) {
                            ResizeImage(before, options.resize.width, options.resize.height, ProccessImage);
                        } else {
                            ProccessImage(before);
                        }
                    } else if (before.type.indexOf('image') === -1 && scope.options.type === 'all-files') {
                        ProccessOtherFile(before);
                    } else {
                        ProccessOtherFile(before);
                    }
                } 
            }
        });

        scope.$watch('$ctrl.default', before => {
            if (before) {
                scope.content__default = before;
                scope.nameFileDefault = scope.content__default && this.type !== 'image' ?
                    typeof scope.content__default === 'string' ?
                        scope.content__default.replace(cApi.STORAGE, '') :
                        scope.content__default :
                    undefined;
            }
        });

        scope.$watch('$ctrl.model', before => {
            if (before == null) {
                scope.clean__event();
            }
        });
        
        scope.$watch('$ctrl.default', (newValue,oldValue) => {
            if (newValue == '' ) {
                scope.nameFileDefault = '';
            }
        });
        
        root.$on('upload-file', (data, value) => {
            if (this.multiple) {
                scope.clean__event()
                scope.list__files = []
                // if(scope.content__default) scope.content__default.push(value.res.info.archivos)
                const res = value.res.info.archivos
                scope.content__default = res
                // if (angular.isArray(scope.content__default) && angular.isArray(res)) {
                //     res.forEach(item => {
                //         scope.content__default.push(item)
                //     })
                // }
                 console.log(scope.content__default, value.res.info.archivos)
            }
        })

        root.$on('clear', (data, value) => {
            scope.file__current = null
        })

        scope.onInit = () => {
            //IterateArrayOfFiles(this.default);
            scope.dimentions__max = {
                width: this.options && this.options.dimentions && this.options.dimentions.width ? this.options.dimentions.width : 2400,
                height: this.options && this.options.dimentions && this.options.dimentions.height ? this.options.dimentions.height : 3600,
                size: this.options && this.options.dimentions && this.options.dimentions.size ? this.options.dimentions.size : 4096
            };
            scope.list__files = [];
            scope.content__default = this.default;
            scope.nameFileDefault = scope.content__default && this.type !== 'image' ?
                typeof scope.content__default === 'string' ?
                    scope.content__default.replace(cApi.STORAGE, '') :
                    scope.content__default :
                undefined;
            scope.image__data_result = ImageDataBackup;
            scope.options = {
                type: this.type ? this.type : 'all-files',
                multiple: this.multiple
            };
            scope.storagePath = cApi.STORAGE;
            scope.isDraft = this.isDraft
        };
    },
    deps: ['$scope', 'sLightbox', '$sce', 'sModal', 'cApi', '$rootScope'],
    others: {
        bind: {
            model: '=',
            nameModel: '@model',
            type: '@',
            title:'@',
            multiple: '=',
            options: '=',
            default: '=',
            removeMethod: '=',
            previewMethod: '=',
            checkMethod: '=',
            anularCheckMethod: '=',
            downloadFileMethod: '=',
            isDraft: '='
        }
    },
    // templateUrl: './src/components/user/uploaderfile/uploaderfile.html',
    // stylesUrl: './src/components/user/uploaderfile/uploaderfile.css'
    template: `<div class="dn-uploaderfile" ng:init="onInit()">
    <!-- {{$ctrl.model}} -->
    <div ng:if="options.multiple" class="text-center">
        <div style="min-height:10em !important;" class="area-input bg-white" ng:class="{ 'label-full': options.multiple }" dir-drop-element="options_drop">
            <label for="{{$ctrl.nameModel}}" class="btn btn-success" style="margin-bottom:2em !important;">
                <span ng:show="options.type === 'image'">{{ $ctrl.title ? $ctrl.title : 'Elegir imágenes' }}</span>
                <span ng:hide="options.type === 'image'">{{ $ctrl.title ? $ctrl.title : 'Elegir archivos' }}</span>
                <i ng:if="one.attrs.type === 'imagen'" class="fa fa-images"></i>
                <i ng:if="one.attrs.type !== 'imagen'" class="fa fa-file"></i>
                
            </label>
            <br>
            <div class="card col-md-3"
                style="background-color: white; box-shadow: 0 0 0 0 white!important;"
                ng:repeat="one in list__files" ng:class="{ 'row-error': one.validation.error }"">
                    <div class="area-input bg-white fix-col justify-content-center" ng:class="{ 'label-error': one.validation.error && !$ctrl.model, 'label-success': one.validation.success && $ctrl.model }">
                    
                    <i class="default-icon fa fa-cloud-upload-alt" ng:if="!one && !nameFileDefault"></i>
                    <i class="default-icon fa fa-{{getIconOtherFile(undefined, $ctrl.type)}}" ng:if="nameFileDefault && !one"></i>
                    <div class="single-file" ng:if="one">
                        <div class="icons">
                            <i class="text-success fa fa-check-circle" ng:if="one.validation.success && $ctrl.model"></i>
                            <i class="text-danger fa fa-ban" ng:if="one.validation.error && !$ctrl.model" ></i>
                            <i class="text-danger fa fa-times-circle" style="cursor:pointer; left:95% !important" d:tooltip="Eliminar Archivo" ng:click="remove__event($index, one.attrs)">
                            </i>
                            
                        </div>

                        <img ng:if="one.attrs.type === 'imagen'" class="img img-simple" ng:src="{{one.result}}"
                                    alt="{{one.attrs.name}}" d-lightbox-open>
                        <i style="font-size: 20px;" class="fa fa-{{one.attrs.type}}" ng:if="one.attrs.type !== 'imagen'"
                            ng:click="preview__event(one)"></i>
                        
                        <div class="dimentions text-center" ng:if="one.attrs">
                            
                            <small class="d-block" ng:bind="one.attrs.name || nameFileDefault"></small>
                            <span ng:bind="one.attrs.size"></span>
                        </div>

                        <div class="alert alert-danger" style="padding:2px; margin:0;" role="alert" ng:if="one.validation.error && one" d:tooltip="{{one.validation.message}}" >
                                <i class="fa fa-info" style="font-size:15px" ></i>
                        </div>
                    </div>
                    
                </div>
            </div>
<!--
            <div class="table-responsive">
                <table class="table table-andheuris table-bordered">
                    <tbody>
                        <tr ng:repeat="one in list__files" ng:class="{ 'row-error': one.validation.error }">
                            <td>
                                <div class="icons">
                                    <i class="text-success fa fa-check-circle" ng:if="one.validation.success"></i>
                                    <i class="text-danger fa fa-ban" ng:if="one.validation.error"></i>
                                </div>
                            </td>
                            <td class="content-mini-img">
                                <img ng:if="one.attrs.type === 'imagen'" class="img img-multiple" ng:src="{{one.result}}"
                                    alt="{{one.attrs.name}}" d-lightbox-open>
                                <i style="font-size: 20px;" class="fa fa-{{one.attrs.type}}" ng:if="one.attrs.type !== 'imagen'"
                                    ng:click="preview__event(one)"></i>
                            </td>
                            <td style="width: 55%">
                                <div class="dimentions">
                                    <span ng:bind="one.attrs.name"></span>
                                </div>
                            </td>
                            <td>
                                <div class="dimentions">
                                    <span ng:if="one.attrs.type === 'imagen'" ng:bind="one.attrs.width + 'x' + one.attrs.height"></span>
                                </div>
                            </td>
                            <td>
                                <div class="dimentions text-center" ng:if="one.attrs">
                                    <span ng:bind="one.attrs.size"></span>
                                </div>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger btn-sm btn-icon" d:tooltip="Eliminar Archivo"
                                    ng:click="remove__event($index, one.attrs)">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                        <tr ng:repeat="one in content__default track by one.id">
                            <td>
                                <div class="icons">
                                    <i class="text-success fa fa-check-circle"></i>
                                </div>
                            </td>
                            <td class="content-mini-img">
                                <img class="img img-multiple" ng:src="{{storagePath + one.ruta}}" alt="{{one.ruta}}"
                                    d-lightbox-open>
                            </td>
                            <td style="width: 55%">
                                <div class="dimentions">
                                    <span ng:bind="one.name"></span>
                                </div>
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                            <td ng:if="!isDraft">
                                <button class="btn btn-warning btn-sm btn-icon" d:tooltip="Descargar" tooltip:pos="bottom"
                                    ng:click="download_file_eventUser($index, one)">
                                    <i class="fas fa-file-download"></i>
                                </button>
                                <button type="button" class="btn btn-danger btn-sm btn-icon" ng:click="remove__eventUser($index, one)"
                                    d:tooltip="Eliminar Archivo">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                            <td ng:if="isDraft">
                                 {{one | json}} 
                                <button class="btn btn-warning btn-sm btn-icon" d:tooltip="Descargar" tooltip:pos="bottom"
                                    ng:click="download_file_eventUser($index, one)">
                                    <i class="fas fa-file-download"></i>
                                </button>
                                <button class="btn btn-success btn-sm btn-icon" d:tooltip="Verificar Archivo" ng:if="!one.aprobado"
                                    tooltip:pos="bottom" ng:click="check_eventUser($index, one)">
                                    <i class="fa fa-check"></i>
                                </button>
                                <button class="btn btn-danger btn-sm btn-icon" d:tooltip="Anular verificación Archivo"
                                    ng:if="one.aprobado" tooltip:pos="bottom" ng:click="anular_check_eventUser($index, one)">
                                    <i class="fa fa-ban"></i>
                                </button>
                                <button type="button" class="btn btn-danger btn-sm btn-icon" ng:click="remove__eventUser($index, one)"
                                    d:tooltip="Eliminar Archivo">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            -->
        </div>
    </div>
    <div ng:if="!options.multiple" class="text-center">
        <div class="area-input bg-white fix-col justify-content-center" ng:class="{ 'label-error': file__current.validation.error && !$ctrl.model, 'label-success': file__current.validation.success && $ctrl.model }">
            <i class="default-icon fa fa-{{file__current.attrs.type}}" ng:if="file__current.attrs.type !== 'imagen'"></i>
            <i class="default-icon fa fa-cloud-upload-alt" ng:if="!file__current && !nameFileDefault"></i>
            <i class="default-icon fa fa-{{getIconOtherFile(undefined, $ctrl.type)}}" ng:if="nameFileDefault && !file__current"></i>
            <div class="single-file" ng:if="file__current">
                <div class="icons">
                    <i class="text-success fa fa-check-circle" ng:if="file__current.validation.success && $ctrl.model"></i>
                    <i class="text-danger fa fa-ban" ng:if="file__current.validation.error && !$ctrl.model"></i>
                </div>
                <img class="img img-simple" d-lightbox-open ng:if="file__current.attrs.type === 'imagen'" ng:src="{{file__current.result}}"
                    alt="{{file__current.attrs.name}}">
            </div>
            <img ng:if="!file__current && content__default" d-lightbox-open class="img img-simple" ng:src="{{content__default}}"
                alt="">
            <div class="hover-area-input fix-col justify-content-center">
                <label for="{{$ctrl.nameModel}}" class="btn btn-info">
                    <i class="fa fa-upload"></i>
                    <small>Elegir archivo</small>
                </label>
            </div>
        </div>
        <div ng:if="file__current && file__current.attrs.type !== 'imagen' || nameFileDefault">
            <!-- <br> -->
            <small class="d-block" ng:bind="file__current.attrs.name || nameFileDefault">
                   
            </small>
            <!-- <br> -->
        </div>
        <button class="btn btn-link clean btn-sm" ng:click="clean__event()" ng:disabled="validateClean()"><i class="fa fa-eraser"></i>
            Limpiar</button>
    </div>

    <div class="alert alert-danger" role="alert" ng:if="file__current.validation.error && file__current">
        <div class="container text-center">
            <strong>Alerta!</strong>
            <small ng:bind="file__current.validation.message"></small>
            <br>
            <div class="dimentions text-center" ng:if="file__current.attrs">
                <small>TAMAÑO ACTUAL</small>
                <span ng:bind="file__current.attrs.width + ' y ' + file__current.attrs.height"></span>
                <br>
                <span ng:bind="file__current.attrs.size"></span>
            </div>
        </div>
    </div>
    <div class="form-group">
        <input type="file" class="form-control" d-uploaderfile-events file-model="file_model" name-model="$ctrl.nameModel"
            options="options">
        <!-- webkitdirectory="webkitdirectory" -->
    </div>
</div>
<dn-modal name="uploaderfile" title="Vista Previa" size="lg">
    <div class="file-preview text-center">
        <iframe ng:src="{{modal__current_file}}"></iframe>
    </div>
</dn-modal>`,
    styles: `.dn-uploaderfile {

    }
        .dn-uploaderfile small {
            font-size: 80%;
        }
        .dn-uploaderfile .area-input {
            position: relative;
            /* width: 230px; */
            height: 130px;
            padding: 5px;
            margin: 0 auto;
            margin-bottom: 10px;
            border: 2px dashed lightgray;
            box-sizing: content-box;
        }
            .dn-uploaderfile .area-input.label-error {
                border-color: rgba(255, 54, 54, 0.8);
            }
            .dn-uploaderfile .area-input.label-success {
                border-color: rgba(24, 206, 15, 0.8);
            }
            .dn-uploaderfile .area-input.label-full {
                /* width: 100%; */
                height: 100%;
            }
            .dn-uploaderfile .area-input.label-full .img-multiple {
                position: initial;
                max-width: 80px;
                max-height: 40px;
            }
            .dn-uploaderfile .area-input i.default-icon {
                font-size: 60px;
                color: gray;
                opacity: 1;
            }
            .dn-uploaderfile .table-responsive {
                width: 100%;
                background-color: #fff;
            }
            .dn-uploaderfile .table td {
                text-transform: lowercase;
            }
    
            .dn-uploaderfile .area-input .single-file .icons i {
                position: absolute;
                top: -15px;
                left: -15px;
                font-size: 20px;
                padding: 5px;
                border-radius: 20px;
                background-color: #fff;
                z-index: 1;
            }
    
        .dn-uploaderfile .clean {
            border: 2px solid rgba(0, 0, 0, .15);
            border-radius: 2px;
        }
    
        .dn-uploaderfile .dimentions span {
            display: block;
            /* font-weight: bold; */
            font-size: 11px;
        }
        
        .dn-uploaderfile h6 {
            margin: 40px;
        }
        .dn-uploaderfile input {
            display: none;
        }
        .dn-uploaderfile .area-input .img-simple {
            position: absolute;
            top: 50%;
            left: 50%;
            max-width: 95%;
            max-height: 95%;
            transform: translate(-50%, -50%);
        }
    
        .modal-app .img-preview {
            max-height: 72vh;
        }
        .overlay iframe.preview-file {
            width: 100%;
            min-height: 72vh;
            display: block;
            border: none;
        }
    
        .dn-uploaderfile .table .row-error {
            background-color: rgba(255, 54, 54, 0.2);
        }
        .dn-uploaderfile .table .row-success {
            background-color: rgba(24, 206, 15, 0.2);
        }
    
        .dn-uploaderfile .table td h6 {
            margin: 0;
        }
    
        .dn-uploaderfile .table {
            margin-bottom: 0;
            border-bottom: 1px solid rgb(128, 128, 128, .2);
        }
    
        .dn-uploaderfile .area-input .hover-area-input {
            position: absolute;
            width: calc(100% - 12px);
            height: 60px;
            color: #fff;
            background-color: rgba(0, 0, 0, .5);
            bottom: 6px;
            left: 6px;
            margin-bottom: 0;
            visibility: hidden;
            opacity: 0;
            transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
            .dn-uploaderfile .area-input:hover .hover-area-input {
                visibility: visible;
                opacity: 1;
            }
            .dn-uploaderfile .area-input .hover-area-input small { margin-left: 10px; }
    
            .file-preview iframe {
                width: 100%;
                border: none;
                background-color: #fff;
                padding: 10px;
                min-height: 70vh;
            }
    
    .content-mini-img {
        cursor: pointer;
    }
    
    @media screen and (max-width: 991px) {
        .modal-app .img-preview {
            max-height: 58vh;
        }
    }`
});

dnDirective({
    name: 'uploaderfileEvents',
    module: 'mdUploaderfile',
    fn: function (timeout) {
        this.dnAttrs.$set('id', this.nameModel);
        if (this.options) {
            // console.log(this.options.type)
            switch (this.options.type) {
                case 'image':
                    this.dnAttrs.$set('accept', 'image/*');
                    break;
                case 'pdf':
                    this.dnAttrs.$set('accept', 'application/pdf');
                    break;
                case 'excel':
                    this.dnAttrs.$set('accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    break;
            }
        }
        if (this.options && this.options.multiple) {
            this.dnAttrs.$set('multiple', true);
        }
        this.dnElement.change(event => {
            this.$apply(() => {
                let files;
                if (this.options && this.options.multiple) {
                    files = event.target.files;
                } else {
                    files = event.target.files[0];
                }
                this.fileModel = files;
                timeout(() => {
                    this.dnElement.val('');
                });
            });
        });
    },
    deps: ['$timeout'],
    others: {
        bind: {
            fileModel: '=',
            options: '=',
            nameModel: '='
        }
    }
});

dnInjectable({
    name: 'sManagerFiles',
    module: 'mdUploaderfile',
    fn: function (sce) {
        this.toDataUrl = (file, callback) => {
            const filereader = new FileReader()
            filereader.readAsDataURL(file)
            filereader.onloadend = e => {
                // console.log(filereader.result)
                callback(sce.trustAsResourceUrl(filereader.result))
            }
        }
    },
    deps: ['$sce']
})

const dnChart = dnComponent({
    name: 'chart',
    fn: function (scope, timeout) {
        let Cursor = (graph) => {
            return Object.assign({}, {
                pan: true,
                fullWidth: true,
                valueLineEnabled: true,
                valueLineBalloonEnabled: true,
                cursorColor: "#258cbb",
                limitToGraph: graph,
                cursorAlpha: 0.05,
                valueLineAlpha: 0.2,
                valueZoomable: true
            });
        };

        let Scrollbar = (graph) => {
            return Object.assign({}, {
                graph: graph,
                oppositeAxis: false,
                offset: 30,
                scrollbarHeight: 80,
                backgroundAlpha: 0,
                selectedBackgroundAlpha: 0.1,
                selectedBackgroundColor: "#888888",
                graphFillAlpha: 0,
                graphLineAlpha: 0.5,
                selectedGraphFillAlpha: 0,
                selectedGraphLineAlpha: 1,
                autoGridCount: true,
                color: "#AAAAAA"
            });
        };

        let ValueScrollbar = () => {
            return Object.assign({}, {
                oppositeAxis: false,
                offset: 50,
                scrollbarHeight: 10
            });
        };


        let UpdateData = data => {
            scope._chart.dataProvider = data || [];
            scope._chart.validateData();
        };

        let UpdateOptions = options => {
            Object.keys(scope._chart.events).forEach(name_event => scope._chart.events[name_event] = []);

            var listeners = options.listeners || [];
            listeners.forEach((listener) => {
                var name_event = Object.keys(listener)[0];
                scope._chart.addListener(name_event, listener[name_event]);
            });

            if (options.value) {
                scope._chart.graphs[0].valueField = options.value.name || "value";
                scope._chart.valueAxes[0].title = options.value.label || "";
            }

            if (options.key) {
                scope._chart.categoryField = options.key.name || "key";
                scope._chart.categoryAxis.title = options.key.label || "";
                scope._chart.categoryAxis.position = options.key.position || "bottom";
            }

            if (options.balloon) {
                scope._chart.graphs[0].balloonText = options.balloon.html || "[[value]]";
                scope._chart.balloonDateFormat = options.balloon.dateFormat || "MMM DD, YYYY";
            }

            scope._chart.chartCursor = options.chartCursor ? Cursor(type) : scope._chart.chartCursor;

            if (options.chartScrollbar)
                scope._chart.chartScrollbar = Scrollbar(scope.$ctrl.type);

            if (options.valueScrollbar)
                scope._chart.valueScrollbar = ValueScrollbar();

            scope._chart.mouseWheelZoomEnabled = options.mouseWheelZoomEnabled;

            options.margins = options.margins || {};

            Object.keys(options.margins).forEach(position => {
                scope._chart.autoMargins = options.margins[position] >= 0;
                if (scope._chart.autoMargins)
                    scope._chart["margin" + position] = options.margins[position];
            });

            scope._chart.export = {
                enabled: options.export && true,
            };

            if (!scope._chart.export.enabled && !options.margins.Right)
                scope._chart.marginRight = 20;

            scope._chart.validateNow();
        };

        let GetChart = type => {
            switch (type) {
                case "ire-chart-1":
                    return {
                        graphs: [{
                            id: type,
                            balloon: {
                                drop: true,
                                adjustBorderColor: false,
                                color: "#ffffff"
                            },
                            bullet: "round",
                            bulletBorderAlpha: 1,
                            bulletColor: "#FFFFFF",
                            bulletSize: 5,
                            hideBulletsCount: 50,
                            lineThickness: 2,
                            useLineColorForBulletBorder: true,
                            valueField: "value",
                            balloonText: "<span style='font-size:18px;'>[[value]]</span>"
                        }],
                        chartCursor: Cursor(type),
                        categoryAxis: {
                            parseDates: true,
                            dashLength: 1,
                            minorGridEnabled: true
                        },
                    };
                    break;
                case "ire-chart-2":
                    return {
                        graphs: [{
                            id: type,
                            fillAlphas: 1,
                            lineAlpha: 0.2,
                            type: "column",
                            valueField: "value"
                        }],
                        depth3D: 30,
                        angle: 40,
                        rotate: false,
                        categoryField: "key",
                        categoryAxis: {
                            gridPosition: "start",
                            fillAlpha: 0.05,
                            position: "left"
                        },
                    };
                    break;
                case "ire-chart-3":
                    return {
                        graphs: [{
                            id: type,
                            valueField: "value",
                            fillAlphas: 0.5,
                        }],
                        chartCursor: Cursor(type),
                        valueAxes: [{
                            axisAlpha: 0,
                            position: "left",
                        }],
                        categoryAxis: {
                            parseDates: true,
                            axisAlpha: 0,
                            minHorizontalGap: 25,
                            gridAlpha: 0,
                            tickLength: 0,
                            dateFormats: [{
                                period: 'fff',
                                format: 'JJ:NN:SS'
                            }, {
                                period: 'ss',
                                format: 'JJ:NN:SS'
                            }, {
                                period: 'mm',
                                format: 'JJ:NN'
                            }, {
                                period: 'hh',
                                format: 'JJ:NN'
                            }, {
                                period: 'DD',
                                format: 'DD'
                            }, {
                                period: 'WW',
                                format: 'DD'
                            }, {
                                period: 'MM',
                                format: 'MMM'
                            }, {
                                period: 'YYYY',
                                format: 'YYYY'
                            }]
                        },
                        chartScrollbar: {},
                    };
                    break;
                default:
                    return {};
            }
        };

        this.default_options = {
            margins: {
                Top: 10,
                Bottom: 10,
                Left: 10,
                Right: 10,
            },
        };
        this.default_height = 500;
        this.default_chart_id = 'chart_id' + (Math.random() * 1000).toFixed(0);
        this.default_title = 'Gráfico';

        let MainObject = {
            type: "serial",
            theme: "light",
            autoMargins: true,
            dataDateFormat: "YYYY-MM-DD",
            valueAxes: [{
                id: "v1",
                axisAlpha: 0,
                position: "left",
                ignoreAxesWidth: true
            }],
            balloon: {
                borderThickness: 1,
                shadowAlpha: 0
            },
            categoryField: "key",
            categoryAxis: {
                parseDates: true,
                dashLength: 1,
                minorGridEnabled: true
            },
            export: {
                enabled: true
            },
            dataProvider: [],
        };

        scope.getChartId = () => {
            return scope.$ctrl.chartId ? scope.$ctrl.chartId : this.default_chart_id;
        };

        scope.getHeigth = () => {
            return scope.$ctrl.height ? scope.$ctrl.height : scope.$ctrl.default_height;
        };

        scope.$watch('$ctrl.data', (data) => {
            if (scope._chart)
                UpdateData(data);
        });

        scope.$watch('$ctrl.options', (options) => {
            if (scope._chart)
                UpdateOptions(options);
        });

        scope.onInit = () => {
            timeout(() => {
                console.log('Making Chart: ' + scope.getChartId());
                let ChartProperties = Object.assign({}, MainObject, GetChart(scope.$ctrl.type));
                scope._chart = IreCharts.makeChart(scope.getChartId(), ChartProperties);
                UpdateOptions(scope.$ctrl.options || this.default_options);
                UpdateData(scope.$ctrl.data);
                console.log('Finished Chart: ' + scope.getChartId());
            });
        };
    },
    others: {
        bind: {
            chartId: '@',
            title: '@',
            type: '@',
            data: '=',
            options: '=',
            height: '@',
        }
    },
    // templateUrl: "./src/components/user/ire-charts/ire-charts.component.html",
    // stylesUrl: "./src/components/user/ire-charts/ire-charts.component.css",
    template: `<div class="ire-chart" ng:init="onInit()" style="{{'height: ' + (getHeigth()) + 'px;'}}">
    <div class="ire-chart-container">
        <div class="ire-chart-title">
            <h4 class="no-margin"><i class="fa fa-bar-chart"></i> {{$ctrl.title ? $ctrl.title : $ctrl.default_title}}</h4>
            <div class="clearfix"></div>
        </div>
        <div id="{{getChartId()}}" class="ire-chart-body" style="{{'height: ' + (getHeigth() - 100) + 'px;'}}"></div>
    </div>
</div>`,
    styles: `.ire-chart {
        width: 100%;
        height: 200px;
        margin-bottom: 10px;
        display: inline-block;
    }
    
    .ire-chart-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 0;
        padding: 15px;
        background: #fff;
        border: 1px solid #E6E9ED;
        -webkit-column-break-inside: avoid;
        -moz-column-break-inside: avoid;
        column-break-inside: avoid;
        opacity: 1;
        transition: all .2s ease;
    }
    
    .ire-chart-title {
        border-bottom: 2px solid #E6E9ED;
        padding: 5px;
        margin-bottom: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .ire-chart-body {
        flex: 1;
    }
    `,
    deps: [
        '$scope',
        '$timeout',
    ]
});
const dnStackedChart = dnComponent({
    name: 'stackedChart',
    fn: function (scope, timeout) {
        let Cursor = (graph) => {
            return Object.assign({}, {
                pan: true,
                fullWidth: true,
                valueLineEnabled: true,
                valueLineBalloonEnabled: true,
                cursorColor: "#258cbb",
                limitToGraph: graph,
                cursorAlpha: 0.05,
                valueLineAlpha: 0.2,
                valueZoomable: true
            });
        };

        let Scrollbar = (graph) => {
            return Object.assign({}, {
                graph: graph,
                oppositeAxis: false,
                offset: 30,
                scrollbarHeight: 80,
                backgroundAlpha: 0,
                selectedBackgroundAlpha: 0.1,
                selectedBackgroundColor: "#888888",
                graphFillAlpha: 0,
                graphLineAlpha: 0.5,
                selectedGraphFillAlpha: 0,
                selectedGraphLineAlpha: 1,
                autoGridCount: true,
                color: "#AAAAAA"
            });
        };

        let ValueScrollbar = () => {
            return Object.assign({}, {
                oppositeAxis: false,
                offset: 50,
                scrollbarHeight: 10
            });
        };


        let UpdateData = data => {
            scope._chart.dataProvider = data || [];
            scope._chart.validateData();
        };

        let UpdateOptions = options => {
            Object.keys(scope._chart.events).forEach(name_event => scope._chart.events[name_event] = []);

            var listeners = options.listeners || [];
            listeners.forEach((listener) => {
                var name_event = Object.keys(listener)[0];
                scope._chart.addListener(name_event, listener[name_event]);
            });

            if (options.value) {
                scope._chart.graphs[0].valueField = options.value.name || "value";
                scope._chart.valueAxes[0].title = options.value.label || "";
            }

            if (options.key) {
                scope._chart.categoryField = options.key.name || "key";
                scope._chart.categoryAxis.title = options.key.label || "";
                scope._chart.categoryAxis.position = options.key.position || "bottom";
            }

            if (options.balloon) {
                scope._chart.graphs[0].balloonText = options.balloon.html || "[[value]]";
                scope._chart.balloonDateFormat = options.balloon.dateFormat || "MMM DD, YYYY";
            }

            scope._chart.chartCursor = options.chartCursor ? Cursor(type) : scope._chart.chartCursor;

            if (options.chartScrollbar)
                scope._chart.chartScrollbar = Scrollbar(scope.$ctrl.type);

            if (options.valueScrollbar)
                scope._chart.valueScrollbar = ValueScrollbar();

            scope._chart.mouseWheelZoomEnabled = options.mouseWheelZoomEnabled;

            options.margins = options.margins || {};

            Object.keys(options.margins).forEach(position => {
                scope._chart.autoMargins = options.margins[position] >= 0;
                if (scope._chart.autoMargins)
                    scope._chart["margin" + position] = options.margins[position];
            });

            scope._chart.export = {
                enabled: options.export && true,
            };

            if (!scope._chart.export.enabled && !options.margins.Right)
                scope._chart.marginRight = 20;

            scope._chart.validateNow();
        };

        this.default_options = {
            margins: {
                Top: 10,
                Bottom: 10,
                Left: 10,
                Right: 10,
            },
        };
        this.default_height = 500;
        this.default_chart_id = 'chart_id' + (Math.random() * 1000).toFixed(0);
        this.default_title = 'Gráfico';

        let MainObject = {
            "type": "serial",
            "theme": "none",
            "legend": {
                "horizontalGap": 10,
                "maxColumns": 5,
                "position": "top",
                "useGraphSettings": true,
                "markerSize": 10
            },
            "dataProvider": [],
            "valueAxes": [{
                "stackType": "regular",
                "axisAlpha": 0.3,
                "gridAlpha": 0
            }],
            "graphs": [],
            "categoryField": "id",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "left"
            },
            "export": {
                "enabled": true
            }
        };

        scope.getChartId = () => {
            return scope.$ctrl.chartId ? scope.$ctrl.chartId : this.default_chart_id;
        };

        scope.getHeigth = () => {
            return scope.$ctrl.height ? scope.$ctrl.height : scope.$ctrl.default_height;
        };

        scope.$watch('$ctrl.data', (data) => {
            if (scope._chart)
                UpdateData(data);
        });

        scope.$watch('$ctrl.options', (options) => {
            if (scope._chart)
                UpdateOptions(options);
        });

        scope.$watch('$ctrl.graphs', (graphs) => {
            if (scope._chart) {
                scope._chart.graphs = graphs;
                var graph = new IreCharts.IreGraph();
                graph.valueField = "total";
                graph.labelText = "Total: [[total]]";
                graph.visibleInLegend = false;
                graph.showBalloon = false;
                graph.lineAlpha = 0;
                graph.fontSize = 15;
                scope._chart.addGraph(graph);
                scope._chart.animateAgain();
                scope._chart.validateData();
            }
        });

        scope.onInit = () => {
            timeout(() => {
                console.log('Making Chart: ' + scope.getChartId());
                let ChartProperties = Object.assign({}, MainObject);
                scope._chart = IreCharts.makeChart(scope.getChartId(), ChartProperties);
                UpdateOptions(scope.$ctrl.options || this.default_options);
                UpdateData(scope.$ctrl.data);
                console.log('Finished Chart: ' + scope.getChartId());
            });
        };
    },
    others: {
        bind: {
            chartId: '@',
            title: '@',
            data: '=',
            graphs: '=',
            options: '=',
            height: '@',
        }
    },
    // templateUrl: "./src/components/user/ire-charts/ic-stacked-chart/ic-stacked-chart.component.html",
    // stylesUrl: "./src/components/user/ire-charts/ic-stacked-chart/ic-stacked-chart.component.css",
    template: `<div class="ire-chart" ng:init="onInit()" style="{{'height: ' + (getHeigth()) + 'px;'}}">
    <div class="ire-chart-container">
        <div class="ire-chart-title">
            <h4 class="no-margin"><i class="fa fa-bar-chart"></i> {{$ctrl.title ? $ctrl.title : $ctrl.default_title}}</h4>
            <div class="clearfix"></div>
        </div>
        <div id="{{getChartId()}}" class="ire-chart-body" style="{{'height: ' + (getHeigth() - 100) + 'px;'}}"></div>
    </div>
</div>`,
    // styles: ``,
    deps: [
        '$scope',
        '$timeout',
    ]
});

const dnDropzone = dnDirective({
    name: 'dropzone',
    fn:function (scope, element, attrs) {
        var config, dropzone;
        config = scope[attrs.dropzone];
        dropzone = new Dropzone(element[0], config.options);
        angular.forEach(config.eventHandlers, function (handler, event) {
          dropzone.on(event, handler);
        });
    },
    
});

const dnResize = dnDirective({
    name : 'viewResize',
    fn : function ( window ) {

        let scope = this;

        scope.width = window.innerWidth;
    
        let resizeImg = () => {

            scope.width = window.innerWidth;
            
            if (scope.width < 500 ) {
                
                if (scope.imgs !== undefined ) {

                    if (scope.imgs.mobile) { 

                        if (scope.dnAttrs.dViewResize == "background") {

                            scope.dnElement[0].style = `background-image: url('${scope.imgs.mobile}');`;

                        } else {

                            scope.dnElement[0].src = scope.imgs.mobile;
                        }
                    }
                        
                }    

            }

            if (scope.width >= 500 && scope.width <= 1024) {
                
                if (scope.imgs !== undefined ) {

                    if (scope.imgs.tablet)  {
                        
                        if (scope.dnAttrs.dViewResize == "background") {

                            scope.dnElement[0].style = `background-image: url('${scope.imgs.tablet}');`;

                        } else {

                            scope.dnElement[0].src = scope.imgs.tablet;
                        }

                    } else {
                        
                        if (scope.dnAttrs.dViewResize == "background") {

                            scope.dnElement[0].style = `background-image: url('${scope.imgs.web}');`;

                        } else {

                            scope.dnElement[0].src = scope.imgs.web;
                        }
                    }

                }    

            }

            if (scope.width > 1024 ) {
                
                if (scope.imgs !== undefined ) {

                    if (scope.imgs.web) {

                        if (scope.dnAttrs.dViewResize == "background") {

                            scope.dnElement[0].style = `background-image: url('${scope.imgs.web}');`;

                        } else {

                            scope.dnElement[0].src = scope.imgs.web;
                        }

                    }

                }    

            }

        }

        angular.element(window).bind('resize', function () {
            
            resizeImg();
            
            scope.$digest();
        });

        resizeImg();
   
    },
    deps: ['$window'],
    others: {
        bind: {
            imgs: '=',
        }
    },
    
});

const dnYoutube = dnDirective({
    name :'youtube',
    fn : function (sce) {
        
        let scope = this;
        
        scope.getUrl = () => {
            return sce.trustAsResourceUrl("https://www.youtube.com/embed/" + scope.dnAttrs.code);
        }

        /*
        scope.getUrl = () => {
            return sce.trustAsResourceUrl(scope.dnAttrs.code);
        }
        */
    },
    deps : ['$sce'],
    
    template : 
        `
            <div class="v-container">
                <iframe style="overflow:hidden;height:100%;width:100%"
                        width="100%" 
                        height="100%" 
                        ng:src="{{getUrl();}}" 
                        d:iframe-load frame-load="$ctrl.load();"
                        frameborder="0" allowfullscreen>
                </iframe>
            </div>
        `,   
    styles : `
        .v-container {
            position: relative;
            padding-bottom: 56.25%; /* proporción 16:9 */
            padding-top: 25px;
            height: 0;
        }
        
        .v-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `, 
    others : {
        bind : {
            code : '@',
            load : '&'
        }
    }
    
});

const dnIframeLoad = dnDirective({
    
    name :'iframeLoad',

    fn: function () {
        
        let scope = this;
        scope.dnElement.on('load', function () {
           scope.frameLoad();
        });
    },
    others : {
        bind : {
            frameLoad : '&'
        }
    }

});

const dnIframeComponent = dnComponent({
    name: 'iframeComponent',
    fn: function (scope, sce) {

        scope.trustSrc = (url) => {
            return sce.trustAsResourceUrl(url);
        }
        
    },

    others: {
        bind: {
            url     : '=',
            title   : '=',
            load    : '=',
            width   : '@',
            height  : '@',
            loadFrame : '&'
        }
    },
    template: `   
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
            <iframe  
                width="{{$ctrl.width}}" height="{{$ctrl.height}}" 
                ng:src="{{trustSrc($ctrl.url);}}"
                d:iframe-load frame-load="$ctrl.loadFrame();"
                frameborder="0" border="0" allowtransparency="false"
                allowfullscreen
            >
            </iframe>       
        </div>
        `,
    deps: [
        '$scope',
        '$sce',
    ]
});

const dnSpinnerView = dnComponent({
    name : 'spinnerView',
    fn: function () {},
    template :`
        <div class="col-12 text-center spinner-contain">                  
            <div class="mi-spin">
                <i class=" fa fa-spin fa-spinner"></i>
                Cargando ... 
            </div>
        </div>
    `,
    styles : `
        .spinner-contain {
            min-height: 20em;
            display: flex;
        }

        .mi-spin {
            margin: auto;
        }

    `
});

const mdUser = dnModule('mdUser', [
    mdModal,
    mdModalFrame,
    mdSwal,
    dnImboxList,
    dnInputArea,
    dnInputDate,
    dnInputDecimal,
    dnInputEmail,
    dnInputNumber,
    dnInputPassword,
    dnInputSearch,
    dnInputSelect,
    dnInputText,
    dnInputTime,
    dnSmallAlert,
    dnValidation,
    dnForms,
    dnLightbox,
    dnPaginator,
    dnPopover,
    dnTranslate,
    dnTooltip,
    dnSpinner,
    dnUploaderfile,
    dnChart,  
    dnStackedChart,
    dnDropzone,
    dnResize,
    dnYoutube,
    dnIframeLoad,
    dnIframeComponent,
    dnSpinnerView
]);

export default dnModule('mdComponents', [
    mdSystem,
    mdUser
]);