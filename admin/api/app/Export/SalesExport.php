<?php

namespace App\Export;

use App\Venta;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class SalesExport {
    

    public static  function  createReport($name_file,$request) {
        
        $dateInit = Carbon::parse($request->get('dateInit'),'America/lima')->format('Y-m-d 00:00:00');
        $dateEnd  = Carbon::parse( $request->get('dateEnd'),'America/lima')->format('Y-m-d 23:59:59');
          
        $query = Venta::query();
        
        if ($dateInit && $dateEnd)
            $query->whereBetween('fecha_emision',[$dateInit,$dateEnd]);

        $query->with(
                'cliente'
            );
 
        $sales = $query->orderBy('created_at','DESC')->get();


        Excel::create($name_file, function($excel) use($name_file,$sales){

            $excel->sheet($name_file, function($sheet) use($sales) {

                $sheet->row(1, [
                    'Fecha', 'Documento', 'Cliente', 'Total', 'Anulado'
                ])
                ->cell('A1:E1', function($cell) {
                    $cell->setFontWeight('bold');
                    $cell->setFontSize(13);
                });
                
                foreach($sales as $index => $sale) {
                    $sheet->row( $index + 2, [
                        $sale->fecha_emision, 
                        $sale->document, 
                        $sale->cliente->nombre, 
                        $sale->total, 
                        $sale->isCancel ? 'SI' : 'NO'
                    ]); 
                }

            });

        })->export('xlsx');
    } 
}