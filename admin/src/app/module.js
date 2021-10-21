import { dnModule } from '../../dine.js';

import Run from './run.js';
import Config from './config.js';

import mdViews from '../views/views.module.js';
import mdServices from '../services/services.module.js';
import mdFactories from '../factories/factories.module.js';
import mdComponents from '../components.js';

export default dnModule(
    'mdMain',
    [
        'ngSanitize',
        'ngRoute',
        'route-segment',
        'view-segment',
        mdViews,
        mdServices,
        mdFactories,
        mdComponents,
        'mdExtends',
        'ngResource',
        'base64',
        'angularMoment',
        'angular-pdf-thumbnail',
        'firebase',
        'uiSwitch',
        'angularUtils.directives.dirPagination',
        'doubleScrollBars',
        'mgo-angular-wizard',
        'ui.select',
        'dropzone',
        'ngDragDrop',
        'textAngular',
        'satellizer',
        'thatisuday.dropzone',
        'input.search.module',
        'html.compile',
        'sPrint.app',
        'mdColorPicker',
        'ngMaterial',
        'ngCookies',
        'ngMessages'
    ],
    {
        config: Config,
        run: Run
    }); 