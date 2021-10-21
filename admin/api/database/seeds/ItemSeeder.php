<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
                //SEGURIDAD
                    ['Menus','menus',1],
                    ['Roles','roles',1],
                //USUARIOS
                    ['Administrar','administrar_usuarios',2],
                    ['Registrar','registrar_usuarios',2],
                //No ASIGNADOS
                    ['Error 500','error500',null],
                    ['Error 404','error404',null],
                    ['Perfil','perfil',null],
                    ['Cuenta','cuenta',null],
                    ['Construir Menu','menus/build',null],
                    ['Cuenta','administrar_usuarios/cuenta',null]
                ];
        foreach ($items as $value) {
                DB::table('item')->insert([
                    'nombre' => $value[0],
                    'url' => $value[1],
                    'opcion_id' => $value[2],
                    'created_at' => Carbon::now()->format('Y-m-d H:i:s')
                    ]);
        }

    }
}
