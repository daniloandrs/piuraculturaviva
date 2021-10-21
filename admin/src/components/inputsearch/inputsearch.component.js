(function () {

    'use strict';

    function BaseComponent(timeout,document) {

        function BaseController(scope, link, attrs) {
            
            let Run = (() => {
                scope.multiple = attrs.multiple !== undefined;
                scope._model = {
                    show: false,
                    value: scope.multiple ? [] : undefined
                };
            })();

            scope.togglePanel = () => {
                if (!scope._model.show)
                    scope.$parent.$broadcast('hide', scope.$id);
                scope._model.show = !scope._model.show;
            };

            scope.getTemplate = () => {
                let item = scope.options && scope.options.itemList ? scope.options.itemList : 'nombre';
                let template = '<small ng:bind="item.' + item + '"></small>';
                return scope.options && scope.options.templateList ? scope.options.templateList : template;
            };

            scope.select = item => {
                if (!scope.verifyAdded(item)) {
                    if (item) {
                        scope._model.show = false;
                    } else if (scope._model.value) {
                        scope._model.show = false;
                    }
                    if (scope.multiple) {
                        if (item) {
                            scope._model.value.push(item);
                        } else {
                            scope._model.value = [];
                        }

                        scope.model = scope._model.value

                    } else {
                        scope._model.value = item;
                        if (scope._model.value !== undefined)
                            scope.model = scope.options.onlyId ? scope._model.value[scope.options.onlyId] : scope._model.value
                        else
                            scope.model = undefined
                    }
                }
            };

            scope.verifyAdded = item => {
                if (scope.multiple) {
                    let found = scope._model.value.indexOf(item);
                    return found !== -1 ? 'disabled' : '';
                }
                return false;
            };

            scope.removeItem = (evt, index) => {
                evt.stopPropagation();
                scope._model.value.splice(index, 1);
            };

            scope.$watch('default', before => {
                if (before && scope.list && scope.list.length > 0) {
                    angular.forEach(scope.list, (value, key) => {
                        if (before === value.id) {
                            scope._model.value = value;
                        }
                    });
                }
            });

            scope.$watch('model', (new_value, before_value) => {
                if (!new_value)
                    return scope._model.value = scope.multiple ? [] : undefined
            })

            scope.$on('hide', function (evt, $id) {
                if (scope.$id != $id)
                    scope._model.show = false;
            });
        }

        return {
            restrict: 'E',
            templateUrl: "./src/components/external/inputsearch/inputsearch.component.html",
            link: BaseController,
            scope: {
                list: '=',
                model: '=',
                label: '@',
                options: '=',
                // focus: '=',
                orientation: '@',
                default: '='
            }
        }
    }

    BaseComponent.$inject = [
        "$timeout",'$document'
    ];

    angular
        .module("input.search.module",[])
        .directive("appInputsearch", BaseComponent);

})();