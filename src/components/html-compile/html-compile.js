(function () {

    'use strict';

    function HtmlCompileDirective(compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // FOR MANY USES
                scope.$watch(attrs.dirHtmlCompile, function (newValue, oldValue) {
                    element.html(newValue);
                    compile(element.contents())(scope);
                });
            }
        }
    }
    HtmlCompileDirective.$inject = [
        "$compile"
    ];
    angular
        .module('html.compile',[])
        .directive('dirHtmlCompile', HtmlCompileDirective);

})();