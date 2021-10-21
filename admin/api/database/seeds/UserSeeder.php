<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       		DB::table('users')->insert([
                'nick'      => 'beli',
                'email'		=> 'beli@gmail.com',
                'password'  => bcrypt('beli'),
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);

            DB::table('users')->insert([
                'nick'      => 'admin',
                'email'     => 'joseph@gmail.com',
                'password'  => bcrypt('admin'),
                'created_at' => Carbon::now()->format('Y-m-d H:i:s')
            ]);
    }
}
