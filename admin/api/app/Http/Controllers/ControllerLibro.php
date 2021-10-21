<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use App\Libro;
use App\Helpers\Utilities;

class ControllerLibro extends Controller
{
    
    public function getLibro (Request $request) {

        $key_post = $request->get('key_post');

        $post = Libro::where('key_post','=',$key_post)->first();

        $post->libro_galeria;  
        
        return self::informacion($post,true);

    }

    public function createBackground (Request $request) {

        $post_id = $request->get('post_id');
            
        $post    = Libro::find($post_id);

        if($request->hasFile('image')) {
            
            $path   = 'posts/'.$post->id;

            $image = $request->file('image');
            
            \Storage::delete($post->background_image);
            
            $src = (new Utilities)->saveFile($image,$path);
            
            $post->update(['background_image' => $src]);

        }
        
        return self::informacion('Realizado correctamente.',true);

    }

    public function createBackgroundMobile (Request $request) {

        $post_id = $request->get('post_id');
            
        $post    = Libro::find($post_id);  

        if($request->hasFile('image')) {
             
            $path   = 'posts/'.$post->id;

            $image = $request->file('image');
            
            \Storage::delete($post->background_image_mobile);
            
            $src = (new Utilities)->saveFile($image,$path);
            
            $post->update(['background_image_mobile' => $src]);

        }
        
        return self::informacion('Realizado correctamente.',true);

    }

    public function saveText (Request $request) {
  
        try {

            DB::beginTransaction(); 
            
                $post_id = $request->get('post_id');
                    
                $post    = Libro::find($post_id);

                $post->update([
                    'description' => $request->get('description')
                ]);

            DB::commit(); 

            return self::personalizado('Registrado correctamente.',true);
            
        } catch (\Exception $e) {
                
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }

    }
}
