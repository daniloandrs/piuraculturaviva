<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Member;
use App\Photo;
use App\Helpers\Utilities;
use DB;
use Carbon\Carbon;

class ControllerPhoto extends Controller
{
    public function createGallery (Request $request) {

        try {   
            
            DB::beginTransaction();

            $member_id = $request->get('member_id');
            
            $member  = Member::find($member_id);

            if ($request->hasFile('files')) {

                $images  = $request->file('files');  
            
                $data = [];

                foreach($images as $image) {
                
                    /**
                     * Ruta carpeta  : photo/members/member_id/image_name.extension
                    */
                    
                    $path = 'photo/members/'.$member->id;

                    $url = (new Utilities)->saveFile($image,$path);
                    
                    $data [] = ['member_id' => $member->id, 'url' => $url, 'created_at' => Carbon::now(),'description' => $request->get('description')];

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

            $data = [];

            $photo_id = $request->get('photo_id');
            
            $photo    = Photo::find($photo_id);

            if($request->hasFile('image')) {
                
                $path = 'photo/members/'.$photo->member_id;

				$image = $request->file('image');
				
				\Storage::delete($photo->url);
				
                $url = (new Utilities)->saveFile($image,$path);
                
                $data['url'] = $url;
                
            }
            
            $data['description'] = $request->get('description');

            $photo->update($data);
            
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

                $photo_id = $request->get('photo_id');
                
                $photo    = Photo::find($photo_id);

                if(is_null($photo))
                    return self::personalizado("Esta imagen ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($photo->url);
                
                $photo->delete();

            DB::commit();
            
           	return self::personalizado("Imagen eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }
}
