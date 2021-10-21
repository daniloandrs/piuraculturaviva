<?php

namespace Beli\Roles\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Beli\Roles\Models\Menu;
use Beli\Roles\Models\Opcion;
use Beli\Roles\Models\Item;

class ControllerItem extends Controller
{
    /**
     * [Asignar o Quitar item a un menu]
     * @param  Request $request [description]
     * @return [type]           [json]
     */
    public function giveItemMenu(Request $request){
        try{
            $menu_id = $request->get('menu_id');
            $item_id = $request->get('item_id');
            $menu = self::crud('menu','alldata')->find($menu_id);
            $flag_respuesta = true;

            if($menu->items()->where('item_id',$item_id)->first()){
                $flag_respuesta = false;
            }
            $menu->items()->toggle($item_id);
            if($flag_respuesta){
              return self::mensajeOperacion('Item','asignado',true);
            }else{
              return self::mensajeOperacion('Item','quitado',true);
            }
        }catch(\Exception $e){
            return self::response_exception($e->getMessage(),500);
        }
        
    }
    function getInfoMenu(Menu $menu){
        $items = $menu->items;
        $opciones = Opcion::with('items')->get();
        $ops = [];
        //No Asignados
        $op_no_asignados['nombre'] = 'Items Generales';
        $op_no_asignados['icono'] = 'tasks';
        $items_no = Item::where('opcion_id',null)->get();
        foreach ($items_no as $value) {
            $value->check = false;
            $value->active = 0;
            foreach ($items as $val) {
                if($value->id == $val->id){
                    $value->check = true;
                    $value->active = 1;
                    $value->addHidden('pivot');
                }
            }
        }
        $op_no_asignados['items'] = $items_no;
        
        $ops[] = $op_no_asignados;
        foreach ($opciones as $opcion) {
            foreach ($opcion->items as $item) {
                $item->active = 0;
                $item->active = false;
                foreach ($items as $val) {
                    if($item->id == $val->id){
                        $item->active = 1;
                        $item->check = true;
                        $item->addHidden('pivot');
                    }
                }
            }
            $ops[] = $opcion;
        }
        return self::informacion($ops, true);
    }
}
