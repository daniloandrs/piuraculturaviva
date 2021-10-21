<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Slider;
use Carbon\Carbon;
use DB;
use App\Helpers\Utilities;

class ControllerSlider extends Controller {
	
	public function store (Request $request) {

		try {
			
			DB::beginTransaction();
			
			$mobile = null;

			$consulta = Slider::max('num_orden');

			$show = filter_var($request->get('show'), FILTER_VALIDATE_BOOLEAN);
		
			$orden = $consulta != null  ?  $consulta + 1 : 1;
			
			if ($request->hasFile('imagen')) {

                $imagen     = $request->file('imagen');

                $src_imagen = (new Utilities)->saveFile($imagen,'slider_image');
			} 

			if ($request->hasFile('image_mobile')) {

                $image  = $request->file('image_mobile');

                $mobile = (new Utilities)->saveFile($image,'slider_image_mobile');
			} 
			
            $data =  [
                'titulo'     => $request->get('titulo'),
                'texto'      => $request->get('texto'),
                'show'       => $show, 
                'num_orden'  => $orden,
				'src_imagen' => $src_imagen,
				'src_image_mobile' => $mobile
            ];

			Slider::create($data);

			DB::commit(); 
           	
           	return self::personalizado('Se agrego al Slider correctamente',true);

		} catch (\Exception $e) {
            
			DB::rollBack();
            
            return self::personalizado($e->getMessage());
		}
	}


	public function update (Request $request) {
		try {
			DB::beginTransaction();

			$slider = Slider::find($request->get('id'));

			$show = filter_var($request->get('show'), FILTER_VALIDATE_BOOLEAN);

            $data = (new Utilities)->Parse($request->only(['titulo','texto','btn_link','btn_titulo'])) + ['show' => $show];
			
			if($request->hasFile('imagen')){
					
				$imagen = $request->file('imagen');
				
				/*Eliminamos la imagen anterior */
				\Storage::delete($slider->src_imagen);
				
                /*guardamos la nueva imagen */
                $src_imagen = (new Utilities)->saveFile($imagen,'slider_image');
                
				$data['src_imagen']  = $src_imagen;	
			}


			if ($request->hasFile('image_mobile')) {

                $image  = $request->file('image_mobile');
				
				/*Eliminamos la imagen anterior */
				\Storage::delete($slider->src_image_mobile);
				  
                /*guardamos la nueva imagen */
				$image_mobile = (new Utilities)->saveFile($image,'slider_image_mobile');
				
				$data['src_image_mobile']  = $image_mobile ;
			} 

			$slider->update($data);

			DB::commit();
           	
           	return self::personalizado('Se actualizó el Item del Slider correctamente',true);

		} catch (\Exception $e) {

			DB::rollBack();
            
            return self::personalizado($e->getMessage());
		}
	}

	public function updateOrden(Request $request){
	
		try {
			DB::beginTransaction();
			
			$anterior = Slider::find($request->get('anterior_posicion_id'));
            
            $nuevo    = Slider::find($request->get('nueva_posicion_id'));

			$tmp_anterior = $anterior->num_orden;
            
            $tmp_nuevo    = $nuevo->num_orden;
			
			$anterior->num_orden  = $tmp_nuevo;

			$nuevo->num_orden     = $tmp_anterior;

            $anterior->update();
            
			$nuevo->update();
			
			DB::commit();
           	
           	return self::personalizado("Posición actualizada correctamente.",true);

		} catch (\Exception $e) {

			DB::rollBack();
             
            return self::personalizado($e->getMessage(),false);
		}	
	}

	public function delete ($id) {
		try {
			DB::beginTransaction(); 
			
			$slider = Slider::find($id);
			
			if(is_null($slider))
				return self::personalizado("El item ya ha sido eliminado anteriormente",true);
			
			\Storage::delete($slider->src_imagen);
			
			$slider->delete();

            DB::commit();
            
           	return self::personalizado("El Item ha sido eliminado correctamente",true);

		} catch (\Exception $e) {
            
            DB::rollBack();
            
            return self::personalizado($e->getMessage());
		}
	}
}
  