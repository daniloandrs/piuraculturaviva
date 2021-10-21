<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OpcionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $opciones = [
                ['Seguridad','lock'],
                ['Usuarios','users']
            ];
        foreach ($opciones as $value) {
            DB::table('opcion')->insert([
                'nombre'    => $value[0],
                'icono'     => $value[1],
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
    }
}
