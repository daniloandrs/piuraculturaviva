import { dnBootstrap } from '../dine.js';
import App from './app/module.js';

import './factories/user.factory.js';
import './factories/env.service.js';
import './factories/api.factory.js';
import './factories/crud.factory.js';
import './factories/toast.factory.js';

import './services/route.constant.js';
import './services/storage.service.js';
import './services/utilities.service.js';
import './services/middleware.service.js';
import './services/root.service.js';
import './services/key.service.js';
import './services/firebase.service.js';
import './services/Firebase.js';
import './services/form.service.js';
import './services/calendar.service.js';
dnBootstrap({
    name: App,
    component: 'main'
});