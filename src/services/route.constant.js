import {
    dnInjectable
} from '../../dine.js';

dnInjectable({
    name: 'cSession',
    module: 'mdServices',
    fn: {
        MENU: 'dine_beneficencia_menu',
        USER: 'dine_beneficencia_user',
        TOKEN: 'dine_beneficencia_token',
        RUTAS: 'dine_beneficencia_rutas',
        ACCESS: 'dine_beneficencia_access',
        MAX_TIME: 'dine_beneficencia_max_time',
    }
});

dnInjectable({
    name: 'cApi',
    module: 'mdServices',
    fn: {
        SERVER: "./admin/api/public/api/",
        STORAGE: "./admin/api/storage/app/",
        TOKEN: "dine_beneficencia_token",
        IMAGE: './api/storage/app/avatars/avatar.png',
        SHARED_URL : 'https://piuraculturaviva.com/admin/api/public/api/shared/'
    }
});

dnInjectable({
    name: 'cLogin',
    module: 'mdServices',
    fn: {
        AUTH: "./api/public/api/auth",
        PASSWORDRESET: "../../beneficencia/api/public/api/password/reset"
    }
});

dnInjectable({
    name: 'cFirebase',
    module: 'mdServices',
    fn: {
        
        apiKey: "AIzaSyANN7SIAVlre32m3mqa3hil6yN20h8tG_U",
        authDomain: "piuraculturaviva.firebaseapp.com",
        databaseURL: "https://piuraculturaviva.firebaseio.com",
        projectId: "piuraculturaviva",
        storageBucket: "piuraculturaviva.appspot.com",
        messagingSenderId: "205125267955",
    }
});

