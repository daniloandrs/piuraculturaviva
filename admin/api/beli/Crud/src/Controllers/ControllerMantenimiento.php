<?php  
namespace Beli\Crud\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Afinidad;

class ControllerMantenimiento extends Controller{

    protected $crud;

    public function index(Request $request){
        try{
            $records = null;
            $model = $request->get('model');
            $type = $request->get('type');
            switch ($type) {
                case 'select':
                   $records = self::crud($model)->get();
                    break;
                case null:
                    $records = self::crud($model,'getdata')->get();
                    break;
                case 'alldata':
                    $records = self::crud($model,'alldata')->get();
                    break;
            }
            return self::informacion($records,true);    
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
        
    }

    public function show(Request $request)
    {
        try{
            $registry = null;
            $model = $request->get('model');
            $id = (int) $request->get('id_model');
            $type = $request->get('type');
            switch ($type) {
                case 'select':
                   $registry = self::crud($model)->find($id);
                    break;
                case null:
                    $registry = self::crud($model,'getdata')->find($id);
                    break;
                case 'alldata':
                    $registry = self::crud($model,'alldata')->find($id);
                    break;
            }
            if($registry) {
                return self::informacion($registry,true);
            }
            return self::informacion("No se encontro el registro");
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }

    
    public function store(Request $request)
    {
        try{
            $model = $request->get('model');
            
            $data = $request->get('data');
            
            self::model($model);

            if($this->crud->validate($data)){

                $registro = $this->crud->agregar($data);
                
                if(is_null($registro)){
                    
                    return self::mensajeOperacion($model,'crear');
                
                }else{
                    
                    return self::mensajeOperacion(self::getName($model),'Creado',true,$registro->id);
                
                }

            }else{
                
                return self::validacion($this->crud->errors());
            
            }
        }catch(\Exception $e){
            
            return self::personalizado($e->getMessage());   
        
        }
    }

    

    public function update(Request $request)
    {
        try{
            $model = $request->get('model');
            $data = self::unsetKeys($request->get('data'));
            $id = $request->get('id_model');

            $class = self::model($model);
            $registro = $class::find($id);

            if($registro){

                self::HideRules($model,$registro,$data);
                
                if(empty($class::$rules)){
                
                    return self::personalizado("No se realizo ninguna modificación",true);
                
                }else{

                    if($class::validate($data)){
                        
                        $result = $registro->actualizar($data);
                        
                        if(is_null($result)){
                            
                            return self::mensajeOperacion(self::getName($model),'modificar');
                        
                        }else{
                        
                            return self::mensajeOperacion(self::getName($model),'Modificado',true,$result->id);
                        }

                    }else{
                        
                        return self::validacion($class::errors());
                    } 
                }
            }
            return self::personalizado("El registro que intenta actualizar ha sido inhabilitado por otro usuario, recargue la página para listar nuevamente los registros");
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }

    public function destroy(Request $request)
    {
        try{
            $model = $request->get('model');
            $id = $request->get('id_model');       
            if($model=='afinidad'){
                $registry = Afinidad::find($id);
            }else{
                //esta validación arroja un error undefined offset 0 cuando valida el modelo afinidad
                //por eso agregue esa condicón , si hay otra solución explicar :c
                $registry = self::crud($model)->find($id);
            }
            if($registry){
               $name = self::getName($model);
                if(self::validateDelete($model,$id))
                {
                    return self::mensajeValidar($name);
                }
                $registry->delete();
                return self::mensajeOperacion($name,'Inhabilitado',true); 
            }
            return self::personalizado("El registro que intenta eliminar ha sido inhabilitado por otro usuario, recargue la página para listar nuevamente los registros");
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());   
        }
    }
 
    public function restore(Request $request)
    {
        try{
            $model = $request->get('model');
            $id = $request->get('id_model');
            $registry = self::crud($model,'trashed')->find($id);
            if($registry){
                $registry->restore();
                return self::mensajeOperacion(self::getName($model),'Restaurado',true); 
            }
            return self::personalizado("El registro que intenta restaurar ha sido habilitado por otro usuario, recargue la página para listar nuevamente los registros inhabilitados");
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }

    public function trashed(Request $request){
        try{
            $model = $request->get('model');
            $registrys = self::crud($model,'getdata')->onlyTrashed()->get();
            return self::informacion($registrys,true);
        }catch(\Exception $e){
            return self::personalizado($e->getMessage());
        }
    }

}