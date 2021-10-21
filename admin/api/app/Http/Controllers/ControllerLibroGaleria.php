<?php

namespace App\Http\Controllers;

use DB;
use App\Libro;
use App\LibroGaleria;
use Carbon\Carbon;
use App\Helpers\Utilities;
use Illuminate\Http\Request;

class ControllerLibroGaleria extends Controller
{ 
    
    public function createGallery (Request $request) {

        try {   
            
            DB::beginTransaction();

            $post_id = $request->get('libro_id');
            
            $post    = Libro::find($post_id);

            if ($request->hasFile('files')) {

                $images  = $request->file('files');  
            
                $data = [];

                foreach($images as $image) {
                
                    /**
                     * Ruta carpeta  : galeria/post_id/image_name.extension
                    */
                    
                    $path = 'galeria/'.$post->id;

                    $src = (new Utilities)->saveFile($image,$path);
                    
                    $data [] = ['libro_id' => $post->id, 'src' => $src, 'created_at' => Carbon::now()];

                }

                $galery = Photo::insert($data);
                
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

            $gallery_id = $request->get('gallery_id');
            
            $gallery    = LibroGaleria::find($gallery_id);

            if($request->hasFile('image')) {
                
                $path   = 'galeria/'.$gallery->post_id;

				$image = $request->file('image');
				
				\Storage::delete($gallery->src);
				
                $src = (new Utilities)->saveFile($image,$path);
                
                $gallery->update(['src' => $src]);
            }
            
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
                
                $gallery    = LibroGaleria::find($gallery_id);

                if(is_null($gallery))
                    return self::personalizado("Esta imagen ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($gallery->src);
                
                $gallery->delete();

            DB::commit();
            
           	return self::personalizado("Imagen eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }
}
