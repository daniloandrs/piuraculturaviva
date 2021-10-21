<?php

namespace App\Http\Controllers;

use DB;
use App\Post;
use App\Category;
use Carbon\Carbon;
use App\Helpers\Utilities;
use Illuminate\Http\Request;

class ControllerPost extends Controller
{
    public function createNewspaper (Request $request) {

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

            $post  = Post::create($data);

            if ($request->hasFile('image')) {

                $path      = 'noticias/'.$post->id;

                $image     = $request->file('image');

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $post->background_image = $background_image;
            
            } 
            
            $post->update();

            $sync = [];

            $myCategories = $request->get('myCategories');

            $arrmMCategories = explode(',', $myCategories);
            
            foreach ($arrmMCategories as  $value) {
                
                $sync[] =  ['category_id' => $value];
            }
   
            $post->category_post()->sync($sync);

            DB::commit(); 
                
            return self::personalizado('Noticia creada correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function updateNewspaper (Request $request) {

        try {
            
            DB::beginTransaction();
            
            $post_id = $request->get('id');

            $post = Post::find($post_id);

            $data =  [
                $post->title   = $request->get('title'),
                $post->content = $request->get('content'),
                $post->subtitle= $request->get('subtitle'),
                $post->author  = $request->get('author'),
                $post->url     = $request->get('url'),
                $post->publication_date = Carbon::createFromFormat('Y-m-d H:i', $request->get('publication_date_tmp'))
            ];

            if ($request->hasFile('image')) {

                $path      = 'noticias/'.$post->id;

                \Storage::delete($post->background_image);

                $image     = $request->file('image');

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $post->background_image = $background_image;

            } 
          
            $post->update();

            $sync = [];

            $myCategories = $request->get('myCategories');

            $arrmMCategories = explode(',', $myCategories);
            
            foreach ($arrmMCategories as  $value) {
                
                $sync[] =  ['category_id' => $value];
            }
   
            $post->category_post()->sync($sync);
            
            DB::commit(); 
                
            return self::personalizado('Noticia creada correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function deleteNewspaper (Request $request) {
        
        try {

            DB::beginTransaction();

                $post_id = $request->get('post_id');
                
                $post    = Post::find($post_id);

                if(is_null($post))
                    return self::personalizado("Esta noticia ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($post->background_image);
                
                $post->delete();

            DB::commit();
            
           	return self::personalizado("Noticia eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }


    public function categoryList () {

        $category = Category::where('category_type_id','=',Category::CATEGORY_TYPE_POST)->get();

        return self::informacion($category,true);

    }

}
