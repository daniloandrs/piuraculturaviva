<?php

use Illuminate\Database\Seeder;

class RolUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('rol_user')->insert([
                'rol_id' => 1,
                'user_id' => 1
            ]);
    }
}
