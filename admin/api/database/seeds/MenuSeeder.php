<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $menus = [
                ['Super Administrador',1],
                //['Administrador',2],
                //['Usuario del Sistema',3],
            ];
        foreach ($menus as $value) {
            DB::table('menu')->insert([
                'nombre'    => $value[0],
                'rol_id'        => $value[1],
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
    }
}
