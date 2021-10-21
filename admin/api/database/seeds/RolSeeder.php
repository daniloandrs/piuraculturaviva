<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $menus = [
                ['sa','Super Administrador',0],//1
                //['admin','Administrador',1],//2
                //['standar','Usuario del Sistema',3]//3
            ];
        foreach ($menus as $value) {
            DB::table('rol')->insert([
                'nick' => $value[0],
                'nombre'    => $value[1],
                'nivel'        => $value[2],
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
        }
    }
}
