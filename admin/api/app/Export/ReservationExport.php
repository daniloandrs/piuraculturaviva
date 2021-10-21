<?php

namespace App\Export;
 
use App\Reserva;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class ReservationExport {
    

    public static  function  createReport($name_file,$request) {
        
        $dateInit = Carbon::parse($request->get('dateInit'),'America/lima')->format('Y-m-d 00:00:00');
        $dateEnd  = Carbon::parse( $request->get('dateEnd'),'America/lima')->format('Y-m-d 23:59:59');
        
        $query = Reserva::query();
        
        if ($dateInit && $dateEnd) {
            $query->whereBetween('fecha',[$dateInit,$dateEnd]);
        }
        
        $reservationList = $query->with('cliente','estado_reserva','detalle_reserva.habitacion','detalle_reserva.tarifa')->get();
          
        Excel::create($name_file, function($excel) use($name_file, $reservationList) {

            $excel->sheet($name_file, function($sheet) use($reservationList) {

                $sheet->row(1, [
                    'Cliente / Huesped',
                    'Fecha de Llegada',
                    'Estado de la Reserva',
                ])
                ->cell('A1:K1', function($cell) {
                    $cell->setFontWeight('bold');
                    $cell->setFontSize(13);
                });
                
                foreach($reservationList as $index => $reservation) {
                    $sheet->row( $index + 2, [
                        $reservation->cliente->nombre,
                        $reservation->fecha,
                        $reservation->estado_reserva->nombre,
                    ]); 
                }

            });

        })->export('xlsx');
    } 
}