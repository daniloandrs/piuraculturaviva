<?php

namespace Beli\Crud\Traits;


trait BaseCrud
{
	
	public static function agregar($parametros){
		\DB::beginTransaction();
		$registro = self::agregarRegistro($parametros);
		if (!$registro) {
			return $registro;
		}else{
			try{
	        }catch(\Exception $e){
	            \DB::rollback();
	            return false;
	        }
	        \DB::commit();
	        return $registro;
		}
	}

	public static function agregarRegistro($parametros){
		\DB::beginTransaction(); 
		try{
			$creado = self::create($parametros); 
		}catch(\Exception $e){
			\DB::rollback();
			return false;
		}
		\DB::commit(); 
		return $creado;
	}

	public function actualizar($parametros){

		\DB::beginTransaction();
		try{
			$this->update($parametros);
		}catch(Exception $e){
			\DB::rollback();
			return false;
		}
		\DB::commit();
		return $this;
	}

}