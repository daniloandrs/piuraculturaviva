/* AngularJS directives for double scroll bars by @przno, v0.1.4, https://github.com/przno/double-scroll-bars, MIT license */
!function(a){
    "use strict";
    a.module("doubleScrollBars",[])
    .directive("doubleScrollBarHorizontal",["$timeout","$dsb","$$dsbStorage",
    function(a,b,c){
        return{
            restrict:"A",
            transclude:!0,
            scope:{doubleScrollBarHorizontal:"@",id:"@"},
            template:
                "<div> "+
                    "<div style=\"overflow-y:hidden;\" data-ng-style=\"{height:nativeScrollBarHeight}\"> "+
                        "<div style=\"overflow-y:hidden;position:relative;top:-1px;\" "+
                            "data-ng-style=\"{'overflow-x':doubleScrollBarHorizontal=='always'?'scroll':'auto',height:scrollBarElementHeight}\">"+
                            "<div data-ng-style=\"{width:wrapper2scrollWidth,height:scrollBarElementHeight}\"/>"+
                            "</div>"+
                        "</div>"+
                    "<div data-ng-style=\"{'overflow-x':doubleScrollBarHorizontal=='always'?'scroll':'auto'}\" style=\"max-height:30em;\">  "+
                        "<div data-ng-transclude/> "+
                        "</div>"+
                    "</div>"+
                "</div>",
            link:function(d,e){
                d.nativeScrollBarHeight=b.getSize()+"px",
                d.scrollBarElementHeight=parseInt(b.getSize()+1)+"px",
                d.wrapper2scrollWidth="0px";var f=e.children().eq(0),
                g=f.children().eq(0).children().eq(0),
                h=f.children().eq(1),i=g[0],j=h[0];g.on("scroll",function(){
                    j.scrollLeft=i.scrollLeft}
                ),
                h.on("scroll",function(){
                    i.scrollLeft=j.scrollLeft
                });
                var k=!0;
                d.$watch(function(){
                    return d.wrapper2scrollWidth=j.scrollWidth+"px"
                },
                function(){
                    a(function(){
                        d.$apply(),
                        k&&(i.scrollLeft=c.get(d.id)||0,j.scrollLeft=c.get(d.id)||0,k=!1)})}),
                        d.$on("$destroy",function(){
                            void 0!==d.id&&c.set(d.id,i.scrollLeft)
                        }
                        )
                    }
                }}])
                .service("$$dsbStorage",function(){
                    var a={};
                    return{
                        get:function(b)
                        {return a[b]},
                        set:function(b,c){
                            a[b]=c}
                        }
                    })
                .service("$dsb",function(){
                    function a(){
                        var a=document.createElement("div"),
                        b=document.createElement("div");
                        a.style.width="100%",
                        a.style.height="200px",
                        b.style.width="200px",
                        b.style.height="150px",
                        b.style.position="absolute",
                        b.style.top="0",
                        b.style.left="0",
                        b.style.visibility="hidden",
                        b.style.overflow="hidden",
                        b.appendChild(a),
                        document.body.appendChild(b);
                        var c=a.offsetWidth;
                        b.style.overflow="scroll";
                        var d=b.clientWidth;
                        return document.body.removeChild(b),
                        c-d
                    }
                    var b;return{
                        getSize:function(){
                            return b=b||a()
                        }
                    }
                }
                )
            }
            (angular);
