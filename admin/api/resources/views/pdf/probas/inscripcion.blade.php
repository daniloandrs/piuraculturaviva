<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title> Documento de Contrato - PROBAS </title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  
</head>
<body style="background: #ffffff">

    <style>
        
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 10.5pt;
            margin: 20px;
        }
    </style>

    <table>
        <tr>
            <td class="text-center">
                <div style="margin-right: 30px; margin-bottom: 15px">
                    <img src="{{asset('../storage/escudo.png')}}" alt=""  height="100" width="90" >
                </div>
            </td>
            <td class="text-center" style="font-size:14pt !important;padding-left:30px;padding-right:30px;">
                <strong style="font-size:14pt !important;">{{$beneficencia['institucion']}}</strong>
            </td>
            <td class="text-center">
                <div style="margin-right: 30px; margin-bottom: 15px">
                    <img src="{{asset('../storage/logo.jpg')}}" alt=""  height="100" width="90" >
                </div>
            </td>
        <tr>
    </table>
    
    <div>
        <table>
            <tbody>
                <tr>
                    <td colspan="3" class="text-center" style="padding:15px !important">
                        <strong>
                            CONTRATO DE BONO DE AHORROS PARA SEPELIO - {{$tipo_servicio['nombre']}}
                        </strong>
                    </td>
                </tr>
        
                <tr>
                    <td colspan="3" class="text-center" style="padding:15px !important">
                        <strong>CONTRATO N° {{$contrato['numero_contrato']}} </strong>
                    </td>
                </tr>
        
                
                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                            Conste por el presente documento, el Contrato que suscribe de una parte la {{$beneficencia['institucion']}} 
                            <strong>SERVISEPF-PROBAS</strong>, representada por su Gerente General {{$beneficencia['gerente']}}
                            con domicilio legal en {{$beneficencia['domicilio_fiscal']}}, a quién en adelante se le denominará 
                            <strong>"LA BENEFICENCIA" </strong> y de la otra parte el Sr(a) {{$persona['nombres']}} {{$persona['apellidos']}} 
                            con DNI N° {{$persona['dni']}} domicilio en {{$persona['direccion']}}, a quién en adelante se le denominará 
                            <strong>"EL TITULAR"</strong>, en los términos y condiciones siguientes :
                        </p>
                    </td>
                </tr>

                <!-- Cláusuluas-->
                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>PRIMERA.- EL PROGRAMA DE BONO DE AHORROS PARA SEPELIO-{{$tipo_servicio['nombre']}} </strong> es una modalidad de 
                        acceso a los Servicios Funerarios que brinda <strong>LA BENEFICENCIA </strong> a los miembros de la colectividad que
                        que deseen asegurar o preveer oportunamente dicho servicio, <strong>EL BONO</strong> es <strong>TRANSFERIBLE.</strong>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>SEGUNDA.- </strong>Los Servicios Funerarios será otorgados al <strong>TITULAR </strong> y/o 
                        <strong>BENEFICIARIO</strong> por <strong>TRANSFERENCIA.</strong>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>TERCERA.- LA BENEFICENCIA</strong> a través del <strong>{{$tipo_servicio['nombre']}}</strong>,
                        otorgará al <strong>TITULAR</strong> y/o <strong>BENEFICIARIO</strong> por <strong>TRANSFERENCIA</strong>,
                        el siguiente Servicio Funerario :
                        <ul>
                            @foreach ($tipo_servicio['beneficios'] as $aux )
                                <li type="disc"> {{$aux['nombre']}}</li>
                            @endforeach
                        </ul>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>CUARTA.- El TITULAR</strong> al acogerse al <strong>{{$tipo_servicio['nombre']}}</strong>,
                        se compromete a cancelar la cantidad de S/. {{$contrato['monto_total']}} ( {{$contrato['monto_total_letras']}} ) 
                        en cuotas mensuales de S/. {{$contrato['cuota_mensual']}} cada una.
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>QUINTA.-</strong> En caso de fallecimiento del <strong>TITULAR</strong> anter de haber
                        cancelado el importe total del presente <strong>CONTRATO</strong>, del monto de las cuotas aportadas, 
                        previa la deduccion del {{$tipo_servicio['parametros']['porcentaje_gastos_administrativos']}}% por Gastos 
                        Administrativos, constituyen un <strong>FONDO</strong> acumulado a  su favor, los deudos solo aportarán 
                        el <strong>SALDO</strong> para acceder al Servicio Funerario y será de la siguiente manera:
                        <p>
                        
                        <p>
                        <strong>EL SALDO</strong> a cancelar como <strong>"DEUDOR GARANTE"</strong> ,se deberá abonar
                        el 50% al momento de solicitar el Servicio de Sepelio y el otro 50% en (06) cuotas mensuales, 
                        firmando las Letras de Cambio correspondientes como garantia, firmada la {{$beneficencia['institucion']}}. En 
                        caso  de inncumplimiento se aplicará lo dispuesto en Ley de Cementerios y su Reglamento.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>SEXTA.-</strong> Los pagos de las cuotas se realizarán a elección del <strong>AFILIADO</strong>, 
                        ya sea en las propias oficinas de <strong>SERVISEPF</strong> a partir de la fecha de este Contrato, 
                        o a travéz de personas debidamente autorizadas por la institución a su domicilio.
                        <p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>SÉTIMA.- EL TITULAR</strong> en cualquier momento y estando al día en el pago de sus cuotas, 
                        podrá resolver a su solicitud el presente Contrato, tendrá derecho a la devolución de sus aportaciones
                        previa la deducción del 
                        {{ intval($tipo_servicio['parametros']['porcentaje_gastos_administrativos']) }}% por Gastos 
                        Administrativos, se realizarán en un plazo máximo de <strong> 30 días.</strong>
                        <p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>OCTAVA.- EL TITULAR,</strong> podrá <strong>TRANSFERIR</strong> su <strong>BONO, </strong>
                        previa comunicación y firma de la <strong>AUTORIZACIÓN</strong> correspondiente.
                        <p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>NOVENA.-</strong> de presentarse calamidades colectivas y otros de fuerza mayor, 
                        <strong>EL {{$tipo_servicio['nombre']}}</strong> suspedita su obligación a las circunstancias 
                        fortuitas.
                        <p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>DECIMA.- EL TITULAR,</strong> recibirá una vez cancelado el monto total del Contrato  
                        <strong>EL BONO</strong> y/o <strong>CERTIFICACIÓN</strong> de su cancelación, que le permite el uso 
                        del Servicio Funerario cuando lo requiera.
                        <p>
                    </td>
                </tr>

                <tr>
                    <td colspan="3" class="text-justify">
                        <p>
                        <strong>DECIMA PRIMERA.-</strong> Para los efectos legales, ambas partes se someten expresa y 
                        exclusivamente a la jurisdicción de la Provincia de Piura.
                        <p>
                    </td>
                </tr>
                
                
                <tr>
                    <td colspan="2" class="text-justify" style="padding-top:40px !important; padding-bottom:90px !important;">
                        <p>
                            Piura, {{$fecha_inscripcion}}
                        <p>
                    </td>
                </tr>

                <tr>
                    <td class="text-center" style="padding-top:10px !important; padding-bottom:10px !important;">
                        __________________________________________
                    </td>
                    <td></td>
                    <td class="text-center" style="padding-top:10px !important; padding-bottom:10px !important;">
                        __________________________________________
                    </td>
                </tr>

                <tr>
                    <td class="text-center">
                       <strong>{{$beneficencia['institucion']}}</strong>
                    </td>
                    <td></td>
                    <td class="text-center" >
                        <strong>El Contratante </strong>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>

</body>
</html> 