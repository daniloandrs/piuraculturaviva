import { dnRun } from '../../dine.js';

export default dnRun({
    fn: function (amMoment,ngMeta) {

        amMoment.changeLocale('es');
     
    },
    deps: [
        'amMoment'
    ]
});