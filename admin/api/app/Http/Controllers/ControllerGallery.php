<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Gallery;
use App\Helpers\Utilities;

class ControllerGallery extends Controller
{
    
    public function ListGallery (Request $request) {

        $galeries = Gallery::orderBy('num_orden', 'DESC')->get();

        return self::informacion($galeries,true);
    } 

    public function createGallery (Request $request) {

        try {
            
            DB::beginTransaction();
            
            $consulta = Gallery::max('num_orden');

            $orden = $consulta != null  ?  $consulta + 1 : 1;
            
            $data =  [
                'title'     => $request->get('title'),
                'num_orden'  => $orden,
                'url_image'  => 'empty'
            ];

            $gallery  = Gallery::create($data);

            if ($request->hasFile('image')) {

                $path      = 'galerias/'.$gallery->id;

                $image     = $request->file('image');

                $url_image = (new Utilities)->saveFile($image,$path);
                
                $gallery->url_image = $url_image;
            
            } 
            
            $gallery->update();

            DB::commit(); 
                
            return self::personalizado('Se creo la Galeria correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function updateGallery (Request $request) {

        try {

            DB::beginTransaction();

            $gallery_id = $request->get('id');
            
            $gallery    = Gallery::find($gallery_id);

            $gallery->title = $request->get('title');

            if($request->hasFile('image')) {
                
                $path   = 'galerias/'.$gallery->id;

				$image = $request->file('image');
				
				\Storage::delete($gallery->url_image);
				
                $url_image = (new Utilities)->saveFile($image,$path);
                
                $gallery->url_image = $url_image;
            }
            
            $gallery->update();

            DB::commit();
           	
            return self::personalizado('Actualizado correctamente.',true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }


    public function updateOrder (Request $request) {

        try {

			DB::beginTransaction();
			 
			$previousModel  = Gallery::find($request->get('previous_position_id'));
            
            $newModel       = Gallery::find($request->get('new_position_id'));

			$tmp_previous = $previousModel->num_orden;
            
            $tmp_new      = $newModel->num_orden;
			
			$previousModel->num_orden  = $tmp_new;

			$newModel->num_orden     = $tmp_previous;

            $previousModel->update();
            
			$newModel->update();
			
			DB::commit();
           	
           	return self::personalizado("Posición actualizada correctamente.",true);

		} catch (\Exception $e) {

			DB::rollBack();
             
            return self::personalizado($e->getMessage(),false);
		}	
    }

    public function deleteGallery (Request $request) {
        
        try {

            DB::beginTransaction();

                $gallery_id = $request->get('gallery_id');
                
                $gallery    = Gallery::find($gallery_id);

                if(is_null($gallery))
                    return self::personalizado("Esta galeria ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($gallery->url_image);
                
                $gallery->delete();

            DB::commit();
            
           	return self::personalizado("Galeria eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }
}
