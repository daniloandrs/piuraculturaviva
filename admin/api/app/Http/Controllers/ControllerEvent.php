<?php

namespace App\Http\Controllers;

use DB;
use App\Event;
use Carbon\Carbon;
use App\Helpers\Utilities;
use Illuminate\Http\Request;

class ControllerEvent extends Controller {
    
    public function create (Request $request) {

        try {
             
            DB::beginTransaction();
            
            $isLive = filter_var($request->get('isLive'), FILTER_VALIDATE_BOOLEAN);

            $data =  [
                
                'title'     => $request->get('title'),
                
                'author'    => $request->get('author'),
                
                'url'       => $request->get('url') == 'null' ? null : $request->get('url'),   
                
                'color'     => $request->get('color'),

                'category_id'  => $request->get('category_id'),

                'sub_category_id' => $request->get('sub_category_id'),

                'price' => $request->get('price'),

                'url_detail'   => $request->get('url_detail') =="null" ? null : $request->get('url_detail'),
                
                'redirectTo'   => $request->get('redirectTo') == "null" ? null : $request->get('redirectTo'),

                'isLive'    => $isLive,    

                'description' => $request->get('description'),

                'location'   => $request->get('location'),
                
                'event_type_id' => $request->get('event_type_id'),
                
                'publication_date' => Carbon::createFromFormat('Y-m-d', $request->get('publication_date_tmp')),
                
                'publication_time' => Carbon::createFromFormat('Y-m-d H:i',$request->get('publication_date_tmp') .' '. $request->get('publication_time_tmp')),

                'publication_date_end' => Carbon::createFromFormat('Y-m-d', $request->get('publication_date_tmp_end')),
                
                'publication_time_end' => Carbon::createFromFormat('Y-m-d H:i',$request->get('publication_date_tmp_end') .' '. $request->get('publication_time_tmp_end'))
            ]; 
   
            $event  = Event::create($data);

            if ($request->hasFile('image')) {

                $path   = 'event/'.$event->id;

                $image  = $request->file('image');

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $event->background_image = $background_image;
            
            } 
            
            $event->update();

            DB::commit(); 
                
            return self::personalizado('Evento creado correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function update (Request $request) {

        try {
            
            DB::beginTransaction();
            
            $isLive = filter_var($request->get('isLive'), FILTER_VALIDATE_BOOLEAN);

            $event_id = $request->get('id');

            $event    = Event::find($event_id);

            $event->title   = $request->get('title');    

            $event->author  = $request->get('author');

            $event->url     = $request->get('url') == 'null' ? null : $request->get('url');

            $event->color   = $request->get('color');

            $event->description = $request->get('description');

            $event->location   = $request->get('location');
            
            $event->isLive  = $isLive;

            $event->category_id  = $request->get('category_id');

            $event->sub_category_id = $request->get('sub_category_id');

            $event->price = $request->get('price');

            $event->url_detail   = $request->get('url_detail') =="null" ? null : $request->get('url_detail');
            
            $event->redirectTo   = $request->get('redirectTo') == "null" ? null : $request->get('redirectTo');
            
            $event->event_type_id = $request->get('event_type_id');
            
            $event->publication_date = Carbon::createFromFormat('Y-m-d', $request->get('publication_date_tmp'));
            
            $event->publication_time = Carbon::createFromFormat('Y-m-d H:i',$request->get('publication_date_tmp') .' '. $request->get('publication_time_tmp'));

            $event->publication_date_end = Carbon::createFromFormat('Y-m-d', $request->get('publication_date_tmp_end'));
                
            $event->publication_time_end = Carbon::createFromFormat('Y-m-d H:i',$request->get('publication_date_tmp_end') .' '. $request->get('publication_time_tmp_end'));
        
            if ($request->hasFile('image')) {

                $path   = 'event/'.$event->id;   

                $image  = $request->file('image');

                \Storage::delete($event->background_image);

                $background_image = (new Utilities)->saveFile($image,$path);
                
                $event->background_image = $background_image;
            
            } 
            
            $event->update();

            DB::commit(); 
                
            return self::personalizado('Evento actualizado correctamente',true);

        } catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
        }
    }


    public function delete (Request $request) {
        
        try {

            DB::beginTransaction();

                $event_id = $request->get('event_id');
                
                $event   = Event::find($event_id);

                if(is_null($event))
                    return self::personalizado("Este evento ya ha sido eliminado anteriormente",true);
                
                \Storage::delete($event->background_image);
                
                $event->delete();

            DB::commit();
            
           	return self::personalizado("Evento eliminada correctamente",true);
               
        } catch (\exception $e) {

            DB::rollBack();
            
            return self::personalizado($e->getMessage(),false);
        }

    }
}
