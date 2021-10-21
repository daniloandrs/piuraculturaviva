import {
    dnInjectable
} from '../../dine.js';

dnInjectable({
    name: 'cSession',
    module: 'mdServices',
    fn: {
        MENU: 'dine_piura_cultura_viva_menu',
        USER: 'dine_piura_cultura_viva_user',
        TOKEN: 'dine_piura_cultura_viva_token',
        RUTAS: 'dine_piura_cultura_viva_rutas',
        ACCESS: 'dine_piura_cultura_viva_access',
        MAX_TIME: 'dine_piura_cultura_viva_max_time',
    }
});

dnInjectable({
    name: 'cApi',
    module: 'mdServices',
    fn: {
        SERVER: "./api/public/api/",
        STORAGE: "./api/storage/app/",
        TOKEN: "dine_piura_cultura_viva_token",
        IMAGE: './api/storage/app/avatars/avatar.png',
    }
});


dnInjectable({
    name: 'cLogin',
    module: 'mdServices',
    fn: {
        AUTH: "./api/public/api/auth",
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
