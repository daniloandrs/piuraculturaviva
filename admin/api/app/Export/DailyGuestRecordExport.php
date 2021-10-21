<?php

namespace App\Export;

use App\Alquiler;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class DailyGuestRecordExport {
    

    public static  function  createReport($name_file,$request) {
        
        $dateInit = Carbon::parse($request->get('dateInit'),'America/lima')->format('Y-m-d 00:00:00');
        $dateEnd  = Carbon::parse( $request->get('dateEnd'),'America/lima')->format('Y-m-d 23:59:59');
          
        $query = Alquiler::query();
        
        if ($dateInit && $dateEnd)
            $query->whereBetween('fecha',[$dateInit,$dateEnd]);

        $query->with('detalle_alquiler');
        
        $rentList = $query->orderBy('created_at','DESC')->get();

        $details = collect();

        $rentList->each( function ($item) use ($details) {
            $item->detalle_alquiler->each( function($sub) use ($details) {
                $sub->alquiler;
                $sub->habitacion;
                $sub->tarifa;
                $sub->huesped;
                $sub->huesped->sexo;
                $sub->huesped->pais;
                $sub->huesped->documento_identidad;
                $details->push($sub);
            });             
        });

        Excel::create($name_file, function($excel) use($name_file, $details) {

            $excel->sheet($name_file, function($sheet) use($details) {

                $sheet->row(1, [
                    'Huesped',
                    'Sexo',
                    'Nacionalidad',
                    'Documento de Identidad',
                    'N° Documento',
                    'Fecha Entrada',
                    'Fecha Salida',
                    'Habitación Asignada',
                    'Tarifa',
                    'Cantidad',
                    'Total',
                ])
                ->cell('A1:K1', function($cell) {
                    $cell->setFontWeight('bold');
                    $cell->setFontSize(13);
                });
                
                foreach($details as $index => $detail) {
                    $sheet->row( $index + 2, [
                        $detail->huesped->full_name,
                        $detail->huesped->sexo ? $detail->huesped->sexo->nombre : '',
                        $detail->huesped->pais ? $detail->huesped->pais->nombre : '',
                        $detail->huesped->documento_identidad->nombre,
                        $detail->huesped->nro_documento,
                        $detail->fecha_entrada,
                        $detail->fecha_salida,
                        $detail->habitacion->full_name_room,
                        $detail->tarifa->nombre,
                        $detail->cantidad,
                        $detail->total
                    ]); 
                }

            });

        })->export('xlsx');
    } 
}