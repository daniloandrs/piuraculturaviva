<?php

namespace App\Http\Controllers;

use DB;
use App\Blog;
use Carbon\Carbon;
use App\Helpers\Utilities;
use Illuminate\Http\Request;

class ControllerBlog extends Controller {

    public function createBlog (Request $request) {
    
        try {
            
            DB::beginTransaction();
            
            $data =  [
                'visits'    => 0,
                'title'     => $request->get('title'),
                'content'   => $request->get('content'),
                'author'    => $request->get('author'),
                'url'       => $request->get('url'),
                'subtitle'  => $request->get('subtitle'),
                'publication_date' => Carbon::createFromFormat('Y-m-d H:i', $request->get('publication_date_tmp'))
            ];

            $blog  = Blog::create($data);

            if ($request->hasFile('image')) {

                $path      = 'blog/'.$blog->id;

                $image     = $request->file('image');

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $blog->background_image = $background_image;
            
            } 
            
            $blog->update();

            DB::commit(); 
                
            return self::personalizado('Entrada creada correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function updateBlog (Request $request) {

        try {
            
            DB::beginTransaction();
            
            $blog_id = $request->get('id');

            $blog = Blog::find($blog_id);

            $data =  [
                $blog->title   = $request->get('title'),
                $blog->content = $request->get('content'),
                $blog->subtitle= $request->get('subtitle'),
                $blog->author  = $request->get('author'),
                $blog->url     = $request->get('url'),
                $blog->publication_date = Carbon::createFromFormat('Y-m-d H:i', $request->get('publication_date_tmp'))
            ];

            if ($request->hasFile('image')) {

                $path      = 'blog/'.$blog->id;

                \Storage::delete($blog->background_image);

                $image     = $request->file('image');

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $blog->background_image = $background_image;

            } 
          
            $blog->update();
            
            DB::commit(); 
                
            return self::personalizado('Entrada creada correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function deleteBlog (Request $request) {
        
        try {

            DB::beginTransaction();

                $blog_id = $request->get('blog_id');
                
                $blog    = Blog::find($blog_id);

                if(is_null($blog))
                    return self::personalizado("Esta Entrada ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($blog->background_image);
                
                $blog->delete();

            DB::commit();
            
           	return self::personalizado("Entrada eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }

}
