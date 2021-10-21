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
        'view-segment',
        mdViews,
        mdServices,
        mdFactories,
        mdComponents,
        'mdExtends',
        'ngResource',
        'base64',
        'angularMoment',
        'firebase',
        'angularUtils.directives.dirPagination',
        'ngSanitize', 
        'dropzone',
        'ngDragDrop',
        'textAngular',
        'satellizer',
        'thatisuday.dropzone',
        'html.compile',
        'lightgallery.module',
        'copyToClipboard.module',
        'updateMeta',
        'ui.rCalendar',
        //'mwl.calendar', 'ui.bootstrap'
    ],
    {
        config: Config,
        run: Run
    }); 