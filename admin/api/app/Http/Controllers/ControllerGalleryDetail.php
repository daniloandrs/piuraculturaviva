<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\Utilities;
use App\GalleryDetail;
use Carbon\Carbon;
use App\Gallery;  
use DB;

class ControllerGalleryDetail extends Controller   
{
    
    public function GetList (Request $request) {

        $gallery = Gallery::find($request->get('gallery_id'));

        $gallery->photos;

        return self::informacion($gallery->photos,true);
    } 
    
    public function createGallery (Request $request) {

        try {   
            
            DB::beginTransaction();

            $gallery_id = $request->get('gallery_id');
            
            $gallery  = Gallery::find($gallery_id);

            if ($request->hasFile('files')) {

                $images  = $request->file('files');  
            
                $data = [];

                foreach($images as $image) {
                
                    /**
                     * Ruta carpeta  : galerias/gallery_id/fotos/image_name.extension
                    */

                    $path = 'galerias/'.$gallery->id.'/'.'fotos';

                    $url_image = (new Utilities)->saveFile($image,$path);
                    
                    $data [] = ['gallery_id' => $gallery->id, 'url_image' => $url_image, 'created_at' => Carbon::now()];

                }  

                $galery = GalleryDetail::insert($data);
                
            }

            DB::commit();
           	
            return self::personalizado('Agregado correctamente.',true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
    }


    public function updateGallery (Request $request) {

        try {

            DB::beginTransaction();

            $data = [];

            $gallery_id = $request->get('gallery_id');
            
            $gallery    = GalleryDetail::find($gallery_id);

            if($request->hasFile('image')) {
                
                /**
                 * Ruta carpeta  : galerias/gallery_id/fotos/image_name.extension
                */

                $path = 'galerias/'.$gallery->gallery_id.'/'.'fotos';

				$image = $request->file('image');
				
				\Storage::delete($gallery->url_image);
				
                $url_image = (new Utilities)->saveFile($image,$path);
                
                $data['url_image'] = $url_image;
                
            }
            
            $gallery->update($data);
            
            DB::commit();
           	
            return self::personalizado('Actualizado correctamente.',true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }


    public function deleteGallery (Request $request) {

        try {

            DB::beginTransaction();

                $gallery_id = $request->get('gallery_id');
                
                $gallery    = GalleryDetail::find($gallery_id);

                if(is_null($gallery))
                    return self::personalizado("Esta imagen ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($gallery->url_image);
                
                $gallery->delete();

            DB::commit();
            
           	return self::personalizado("Imagen eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }

}
