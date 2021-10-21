<?php

namespace App\Helpers;

use Carbon\Carbon;

class Utilities { 

    function saveFile($file,$carpeta_name)  {

        $extension  = $file->extension();
        
        $today      = Carbon::now()->format('dmy-hi');
        
        $fullName   = $file->getClientOriginalName(); 
        
        $name       = explode('.',$fullName)[0];
        
        $url        = $file->storeAs($carpeta_name , $name.'-'.$today.'.'.$extension);
        
        return $url;
    
    }

    function Parse ($data) {
        
        $tmp = [];

        foreach ($data as $key => $value) {

            $tmp[$key] = $data[$key] == "null" ? null : $data[$key];
        }

        return $tmp;
    }

}