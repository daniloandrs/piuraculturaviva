
function lightgalleryDirective () {

    return {

      restrict: 'A',
      
      link: function(scope, element, attrs) {

        if (scope.$last) {
          element.parent().lightGallery();
        }
      }

    };

  }

  angular
  .module('lightgallery.module',[])
  .directive('lightgallery', lightgalleryDirective);