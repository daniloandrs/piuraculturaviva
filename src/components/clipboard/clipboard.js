
function copyToClipboardDirective () {

    return {

        restrict: 'A',
      
        link: function (scope, elem, attrs) {
            elem.click(function () {
                if (attrs.copyToClipboard) {
                    var $temp_input = $("<input>");
                    $("body").append($temp_input);
                    $temp_input.val(attrs.copyToClipboard).select();
                    document.execCommand("copy");
                    $temp_input.remove();
                }
            });
        }

    };

  }

  angular
  .module('copyToClipboard.module',[])
  .directive('copyToClipboard', copyToClipboardDirective);