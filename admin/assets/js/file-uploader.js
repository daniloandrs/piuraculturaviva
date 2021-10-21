(function () {
    'use strict';

    angular.module('ngUploader', [
    ])
        .directive('fileUploader', FileUploader);

    function FileUploader() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                // rutaimg: '=',
                file: '=',
                foto: '='
            },
            template: "" +
                "<label class='uploader' ondragover='return false'>" +
                "<img ng-src='public/dist/images/unnamed.png' class='blueLogo' src='{{foto}}'/>" +
                "<input id='inputFile' type='file' accept='image/jpg,image/jpeg,image/png'/>" +
                "</label>",
            link: function (scope, element, attrs) {
                var settings = angular.extend({
                    overlayColor: 'rgba(255,255,255,0.5)'
                }, scope);

                var $label = element,
                    $fileInput = $label.find('input'),
                    $input = $label.find('input'),
                    $icon = $label.find('i'),
                    $img = $label.find('img');
                _setInactive();
                suscribe();

                var fileA = null;

                function suscribe() {
                    $fileInput.on('change', _handleInputChange);
                    $img.on('load', _handleImageLoaded);
                    $label.on('dragenter', _handleDragEnter);
                    $label.on('dragleave', _handleDragLeave);
                    $label.on('drop', _handleDrop);
                }

                function _handleDragEnter(e) {
                    e.preventDefault();
                    _setActive();
                }

                function _handleDragLeave(e) {
                    e.preventDefault();
                    _setInactive();
                }

                function _handleDrop(e) {
                    e.preventDefault();
                    _setInactive();
                    $fileInput[0].files = e.dataTransfer.files;
                    _handleInputChange();
                }

                function _handleImageLoaded() {
                    if (!$img.hasClass('loaded')) {
                        $img.addClass('loaded');
                    }
                    _setInactive();
                }

                //jamie
                function onloadFile(e) {
                    var img = new Image();
                    img.src = e.target.result;
                    if (img.height > 2700 || img.width > 4000) {
                        var data = {
                            message: 'La imagen es demasiado grande, se aconseja no subir imágenes con un ancho '
                                + 'mayor de 4000px y alto mayor de 2700px.'
                        };
                        // $message.openErrorMessage(data);
                        return false;
                    } else {
                        return true;
                    }
                }

                function _handleInputChange(e) {
                    var file = (undefined !== e) ? e.target.files[0] : $fileInput[0].files[0];
                    var pattern = /image-*/;
                    var reader = new FileReader();
                    if (!file.type.match(pattern)) {
                        alert('invalid format');
                        return;
                    }

                    if ($label.hasClass('loaded')) {
                        $label.removeClass('loaded');
                    }

                    reader.onload = _handleReaderLoaded;
                    reader.readAsDataURL(file);

                    fileA = file;
                }

                function _handleReaderLoaded(e) {
                    var reader = e.target;
                    if (onloadFile(e)) {
                        $img[0].src = reader.result;
                        $label.addClass('loaded');

                        scope.file = fileA;
                        scope.$apply();
                    } else {
                        document.getElementById("inputFile").value = "";
                        fileA = null;
                    }
                }

                function _setActive() {
                    $label.css('outline-color', settings.activeColor);
                    $icon.css('color', settings.activeColor);
                }

                function _setInactive() {
                    $label.css('outline-color', settings.baseColor);
                    $icon.css('color', ($img.hasClass('loaded') ? settings.overlayColor : settings.baseColor));
                }
            }
        };
    }

}());
