import { dnInjectable } from '../../dine.js';

dnInjectable({
    name: 'sPrint',
    module: 'mdServices',
    fn: function () {
        let PrintHtml = item => {
            let Width = item.options.width || "240px", FontSize = item.options.font_size || "12px";
            let Lane__zero = "<script>function printPage(){setTimeout(function(){window.print();window.close();},0)}</script>"
            let Lane__first = "<html lang='es'><head>" + Lane__zero;
            let Lane__two = "<meta charset='utf-8'/><style>body{width:" + Width + ";font-size:" + FontSize + ";text-align:center;padding:0;margin:0;margin-left:8px;font-stretch:ultra-condensed}pre{white-space:pre-wrap;margin:0;font-family:MS Gothic;}.text-left{text-align:left}.text-right{text-align:right}h2,h3,h4,h5{margin:0;font-weight:normal}</style></head><body onload='printPage();'>";
            let Lane__Three = "</body></html>";
            let htitle = "<title>" + item.name + "</title>";
            let w = window.open('', item.name, 'height=300,width=' + Width, true);
            w.document.write(Lane__first + htitle + Lane__two + item.content + Lane__Three);
            w.document.close();
            w.focus();
        };
    
        let PrintPDF = item => {
            let iframe = "<iframe width='100%' height='100%' src='data:application/pdf;base64," + item.content + "'></iframe>"
            let x = window.open();
            x.document.open();
            x.document.write(iframe);
            x.document.close();
        };
    
        this.print = item => {
            switch (item.options.type) {
                case 'application/pdf':
                    PrintPDF(item);
                    break;
                case 'text/html':
                    PrintHtml(item);
                    break;
                default:
                    console.error('IrePrint', item.type + ' no reconocido.');
            }
        };
    
        this.printAll = items => {
            angular.forEach(items, item => this.print(item));
        };
    }
});
