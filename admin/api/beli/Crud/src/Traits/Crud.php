<?php
namespace Beli\Crud\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Crud
{

    protected $except = ['password','api_token','id'];

    /**
     * [instance : funcion para obtener una instancia del modelo]
     * @param  [type] $model [cadena que contiene el valor de la clase en beli.php]
     * @return [type]        [instancia de una clase]
     */
    public function instance($model)
    {
        self::model($model,false);
        return $this->crud;
    }
    
    /**
     * [model : Obtener una instancia de la clase]
     * @param  [type] $model [cadena que contiene el valor de la clase en beli.php]
     * @return [type]        [instancia de una clase]
     */
    public function model($model,$apply = true)
    {
        $class = config('beli.models.'.$model);
        $this->crud = new $class();
        if($apply){
            $this->crud->getdata = (isset($class::$getdata))
                                ?   $class::$getdata
                                :   null;
            $this->crud->alldata = (isset($class::$alldata))
                                    ?   $class::$alldata
                                    :   null;
            $this->crud->deletes = (isset($class::$deletes))
                                    ?   $class::$deletes
                                    :   null;
            $this->crud->sort_order = (isset($class::$sort_order))
                                    ?   $class::$sort_order
                                    :   null;
        }
        return $class;
    }
    /**
     * [crud : funcion para obtener una instancia del modelo, con los registros ordenados]
     * @param  [type] $model [cadena que contiene el valor de la clase en beli.php]
     * @param  [type] $type  [tipo de operación a ejecutar]
     * @return [type]        [instancia de una clase]
     */
    public function crud($model,$type = null)
    {
        self::model($model,true);
        self::executeOrdered();
        switch ($type) {
            /**
             * Intancia sin filtros , para el caso de SELECT
             */
            case null:
                return $this->crud;
            break;
            /**
             * Instancia con/sin filtros según se encuentre definido la propiedad $getdata en el modelo
             */
            case 'getdata':  
                    if(!is_null($this->crud->getdata)){
                      return $this->crud->with($this->crud->getdata);  
                    }else{
                        return $this->crud;
                    }
            break;
            /**
             * Instancia con/sin filtros según se encuentre definido la propiedad $alldata en el modelo
             */
            case 'alldata':
                    if(!is_null($this->crud->alldata)){
                        return $this->crud->with($this->crud->alldata);
                    }else{
                        return $this->crud;
                    }
            break;
            /**
             * Instancia con filtros , ejecuta el metodo para listar los registros eliminados
             */
            case 'trashed':
                    return $this->crud->onlyTrashed();
            break;
        }
    }
    /**
     * [getName : Obtener el Alias del modelo definido en beli.php]
     * @param  [type] $model [cadena que contiene el valor de la clase en beli.php]
     * @return [type]        [cadena]
     */
    public function getName($model)
    {
        $name = config('beli.views.'.$model);
        return $name;
    }
    /**
     * [validateDelete : Valida si el registro debe ser eliminado o no]
     * @param  [type] $model [cadena que contiene el valor de la clase en beli.php]
     * @param  [type] $id    [id del registro a eliminar]
     * @return [type]        [eliminar = false ,  no eliminar = true]
     */
    public function validateDelete($model,$id)
    {
        self::model($model);
        $registry = $this->crud->with($this->crud->deletes)->find($id);
        $count = 0;
        foreach ($this->crud->deletes as $key => $value) {
                $count = $count + count($registry->$value);
        }
        if($count>0)
        {
            return true;
        }
        return false; 
    }
    /**
     * [hideRules : Oculta las reglas de validación de los campos del formulario que no hayan sido alterados]
     * @param  [type] $model    [cadena que contiene el valor de la clase en beli.php]
     * @param  [type] $registry [registro a procesar]
     * @param  [type] $data     [data del formulario]
     * @return [type]           [null]
     */
    public function hideRules($model,$registry,$data){
        $class = self::model($model);
        $class = new $class();
        $fields = self::getKeys($data);
        self::hiddenKeyRules($class,$fields);
        foreach ($fields as $value) {
            $key = $value['key'];
            if($registry->$key == $data[$key]){
                unset($class::$rules[$key]);
            }
        }
    }
    /**
     * [getKeys : Obtener las claves de la data del formulario]
     * @param  [type] $data [data del fomrulario]
     * @return [type]       [collect]
     */
    public function getKeys($data)
    {
        $keys = collect();
        foreach($data as $key => $value){
            $keys->push(['key'=>$key]);
        }
        return $keys;
    }

    /**
     * [hiddenKeyRules : Ocultar reglas que no coincidan con las claves del formulario]
     * @param  [type] $class  [Modelo a actualizar]
     * @param  [type] $fields [claves en el formulario]
     * @return [type]         []
     */
    public function hiddenKeyRules($class,$fields)
    {
        $fields_model = $class->getFillable();
        foreach ($fields_model as $value) {
            if(is_null($fields->where('key',$value)->first())){
                unset($class::$rules[$value]);
            }
        }
    }

    /**
     * [unsetKeys : Ocultar claves sensibles]
     * @param  [type] $data [datos del fomulario]
     * @return [type]       []
     */
    public function unsetKeys($data)
    {
        foreach ($this->except as $value) {
            unset($data[$value]);
        }
        return $data;
    }


    /**
     * [executeOrdered : Ordena los registros según se haya definido en la propiedad $sort_order del modelo]
     * @return [type] [null]
     */
    public function executeOrdered()
    {
        if(!is_null($this->crud->sort_order)){
            $this->crud->addGlobalScope('order', function (Builder $builder) {
                $builder->orderBy($this->crud->sort_order[0],$this->crud->sort_order[1]);
            });
        }
    }
 

}
