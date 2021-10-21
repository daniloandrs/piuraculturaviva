import { dnDirective, dnPipe } from '../../dine.js';

dnDirective({
    name: 'htmlCompile',
    module: 'mdServices',
    fn: function (compile) {
        let scope = this;
        scope.$watch(scope.dnAttrs.dHtmlCompile, function (newValue, oldValue) {
            scope.dnElement.html(newValue);
            compile(scope.dnElement.contents())(scope);
        });
    },
    deps: [
        '$compile'
    ]
});

dnPipe({
    name: 'CutMessage',
    module: 'mdServices',
    fn: function () {
        return (text) => {
            if (!text) return text;
            let max = 33;
            let message = text.substr(0, max);
            if (text.length > max) message += '...';
            return message;
        }
    }
});
