<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SubCategory;

class ControllerCategory extends Controller
{
    
    public function getSubCategory (Request $request) {

        $data = SubCategory::with('category')->where('category_id','=',$request->get('category_id'))->get();

        return self::informacion($data,true);

    }
}
