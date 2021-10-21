<?php

namespace App\Export;

use App\Alquiler;
use Carbon\Carbon;
use App\EstadoAlquiler;
use App\DetalleAlquiler;
use Maatwebsite\Excel\Facades\Excel;

class RentalsCanceledExport {
     

    public static  function  createReport($name_file,$request) {
        
        $dateInit = Carbon::parse($request->get('dateInit'),'America/lima')->format('Y-m-d 00:00:00');
        $dateEnd  = Carbon::parse( $request->get('dateEnd'),'America/lima')->format('Y-m-d 23:59:59');
        
        $query = Alquiler::query();
        
        $query->where('estado_alquiler_id',EstadoAlquiler::ANULADO);

        if ($dateInit && $dateEnd) {
            $query->whereBetween('fecha',[$dateInit,$dateEnd]);
        }
        
        $rentList = $query->get();
    
        foreach ($rentList as $rent) {
            
            $detalle_alquiler = DetalleAlquiler::where('alquiler_id',$rent->id)->withTrashed()->get();
            
            $names = $detalle_alquiler->implode('habitacion.nombre', '-');

            $rent->rooms_name = $names;
        }

        Excel::create($name_file, function($excel) use($name_file, $rentList) {

            $excel->sheet($name_file, function($sheet) use($rentList) {

                $sheet->row(1, [
                    'Habitación',
                    'Fecha de Alquiler',
                    'Total a Pagar',
                ])
                ->cell('A1:K1', function($cell) {
                    $cell->setFontWeight('bold');
                    $cell->setFontSize(13);
                });
                
                foreach($rentList as $index => $detail) {
                    $sheet->row( $index + 2, [
                        $detail->rooms_name,
                        $detail->fecha,
                        $detail->total
                    ]); 
                }

            });

        })->export('xlsx');
    } 
}