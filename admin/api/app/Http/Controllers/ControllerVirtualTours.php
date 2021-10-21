<?php

namespace App\Http\Controllers;

use DB;
use App\VirtualTours;
use App\Helpers\Utilities;
use Illuminate\Http\Request;

class ControllerVirtualTours extends Controller
{
    public function create (Request $request) {

        try {
            
            DB::beginTransaction();
            
            $data =  [
                'title'             => $request->get('title'),
                'url'               => $request->get('url'),
                'background_image'  => 'empty'
            ];

            $virtual_tours  = VirtualTours::create($data);

            if ($request->hasFile('image')) {

                $path      = 'virtual_tours/'.$virtual_tours->id;

                $image     = $request->file('image');

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $virtual_tours->background_image = $background_image;
            
            } 
            
            $virtual_tours->update();

            DB::commit(); 
                
            return self::personalizado('Recorrido Virtual añadido correctamente.',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function update (Request $request) {

        try {   
            
            DB::beginTransaction();

            $virtual_tours_id = $request->get('id');
            
            $virtual_tours    = VirtualTours::find($virtual_tours_id);

            $virtual_tours->title = $request->get('title');

            $virtual_tours->url   = $request->get('url');
            
            if($request->hasFile('image')) {
                
                $path   = 'virtual_tours/'.$virtual_tours->id;

				$image = $request->file('image');
				
				\Storage::delete($virtual_tours->background_image);
				
                $background_image = (new Utilities)->saveFile($image,$path);
                
                $virtual_tours->background_image = $background_image;
            }
            
            $virtual_tours->update();

            DB::commit();
           	
            return self::personalizado('Actualizado correctamente.',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }

    public function delete (Request $request) {
        
        try {

            DB::beginTransaction();

                $virtual_tours_id  = $request->get('virtual_tours_id');
                
                $virtual_tours    = VirtualTours::find($virtual_tours_id);

                if(is_null($virtual_tours))
                    return self::personalizado("Este Recorrido Virtual ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($virtual_tours->background_image);
                
                $virtual_tours->delete();

            DB::commit();
            
           	return self::personalizado("Recorrido Virtual eliminado correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }
    }
}
