<?php

use Illuminate\Database\Seeder;

class ItemMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $itemsMenu_SA = DB::table('item')->get()->pluck('id');
        foreach ($itemsMenu_SA as $value) {
            DB::table('item_menu')->insert([
                'item_id' => $value,
                'menu_id' => 1
            ]);
        }
         
    }
}
