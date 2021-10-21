<?php

namespace App\Helpers;

use Carbon\Carbon;

class PrintHelper {

    protected $options = [
        'with' => 40,
        'with10' => 10,
        'with5' => 5
    ];

    function __construct()
    {
        $this->line_with_asteriscs = $this->generateString('*', $this->options['with']);

        $this->line_with_equals = $this->generateString('=', $this->options['with']);

        $this->line_with_guions = $this->generateString('-', $this->options['with']);
    }

    function generateString($chars, $length)
    {
        $new_str = '';

        for ($i = 0; $i < $length; $i++)
            $new_str .= $chars;

        return $new_str;
    }

    function padLeft($string, $pad_length, $pad_string = ' ')
    {
        return str_pad($string, $pad_length, $pad_string, STR_PAD_LEFT);
    }

    function padRight($string, $pad_length, $pad_string = ' ')
    {
        return str_pad($string, $pad_length, $pad_string, STR_PAD_RIGHT);
    }

    function get_nombre_pago($string)
    {
        $limit = 25;

        $cantidad = strlen($string);

        $espacios_white = substr_count($string , ' ');

        $new_string = '';

        if ($cantidad <= $limit)
             $new_string = $this->padRight($string, $limit);
        else 
            $new_string = \substr($string, 0, $limit);

        if ($espacios_white > 0)
            $new_string .= $this->generateString(' ', $espacios_white);

        return $new_string;
    }

    function getHead($venta)
    {
        $hoy = Carbon::now()->format('d/m/Y h:i:s');

        $hotel = [
            'nombre'       => 'Hotel Lorem ipsum dolor ABCD',
            'razon_social' => 'Razón Social Prueba',
            'direccion'    => 'Calle Lorem ipsum dolor sit, 7B 15ºA'
        ];

        $html = "";

        $html .= "<pre>";

        $html .= $hotel['nombre']. "\n";

        $html .= "\n";

         $html .= $hotel['razon_social']. "\n";

        $html .= "Proyecto Hotel\n";

        $html .= $hotel['direccion'] . "\n";

        $html .= "\nFECHA: {$hoy}\n";

        $html .= "\n".$venta['documento_contable']['nombre']."\n";

        $html .= "\n";

        $html .= "</pre>";

        return $html;
    }
    
    public function getDocument ($data)
    {

        $html = $this->getHead($data['data_alquiler']['venta']);

        $html .= $this->line_with_asteriscs . "\n";

        $html .= "<pre style=\"text-align: left\">";

        
        $html .= "{$data['cliente']['nombre']}\n\n";
        
        $html .= "<span>N° documento: {$data['cliente']['dni']} </span>\n\n";
        
        /*
        $html .= $this->line_with_guions . "\n\n";
        */
        $totalVenta = 0;

        $cadena ="";

        $importe = $data['importe'];

        $data_alquiler = $data['data_alquiler'];
        
        $alquiler   = $data_alquiler['alquiler'];

        $detalle_alquiler = $alquiler['detalle_alquiler'];

        $html .= " --------- Detalle de Venta ------------ \n";

        foreach ($detalle_alquiler as $item) { 

            $habitacion    = $item['habitacion'];

            $totalVenta += number_format($item['total'],2);

            $html .= "\n";

            $cadena  =  $this->get_nombre_pago('Hab. '.$habitacion['tipo_habitacion']['nombre'].' - '.$habitacion['nombre']);

            $html   .= $cadena . " S/. ". $this->padLeft(number_format($item['total'], 2), $this->options['with5']) ."\n";

            $html .= "\n";
        }

        $html .= $this->line_with_guions."\n";

        $html .= "Total                     S/.". $this->padLeft(number_format($totalVenta, 2), $this->options['with10']) ."\n";

        $html .= "Importe                   S/.". $this->padLeft(number_format($importe, 2), $this->options['with10']) ."\n";

        $html .= "Cambio                    S/.". $this->padLeft(number_format(($importe - $totalVenta), 2), $this->options['with10']) ."\n";
        
        $html .= "\n";

        $html .= "\n" . $this->line_with_equals . "\n";

        $html .= "</pre>";

        return mb_convert_encoding($html, 'UTF-8', 'UTF-8');
    }

}
