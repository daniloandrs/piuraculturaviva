
import { dnComponent } from '../../../dine.js';


export default dnComponent({
    
    name: 'galleryDetail',

    fn: function (scope, sForm, fApi, sce, cApi, sStorage, location) {
        
        scope.path = cApi.STORAGE;

        let getPhotos = async (gallery_id) => {

            let query = await fApi.post('page/get_photos',{gallery_id : gallery_id});

            let tmp  = query.success ? query.info : {};
            
            scope.photos = scope.proccessImages(tmp);

            scope.$apply();
        }

        scope.proccessImages = (array) => {

            let photos = [];

            angular.forEach(array, value => {

                photos.push({
                    fullres : scope.path + value.url_image,
                    thumbnail : scope.path + value.url_image,
                });
            });

            for (var i = 0; i < photos.length; i++) {
                photos[i].fullres = sce.trustAsResourceUrl(photos[i].fullres);
            }

            return photos;

        };

        let Photos = async () => {

            scope.galleryTmp = sStorage.get('gallery');

            if (scope.galleryTmp) 
                sStorage.remove('gallery');

            if(scope.galleryTmp == undefined)
                location.path('galeria');
            else 
                await getPhotos(scope.galleryTmp.id);
        }
 
        scope.gotoListGallery = () => {
            location.path('galeria');
        }

        scope.OnInit = async () => {
            
            scope.loader = true;

            await Photos();

            scope.loader = false;

            scope.$apply();
            
        };
  

    },
    
    templateUrl: './src/views/gallery_detail/gallery_detail.html',
    stylesUrl: './src/views/gallery_detail/gallery_detail.css',
    deps: [
        '$scope',
        'sForm',
        'fApi',
        '$sce',
        'cApi',
        'sStorage',
        '$location'
    ]
});