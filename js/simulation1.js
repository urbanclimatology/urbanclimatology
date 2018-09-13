var ball;
var target;
var targetBox;
var Hit;
var noHit;

let collisionBox = function(shape){
    let ctm = shape.node().getCTM();
    this.x1 = ctm.a*(ctm.e + shape.node().getBBox().x);
    this.y1 = ctm.d*(ctm.f + shape.node().getBBox().y);

    this.x2 = this.x1 + shape.node().getBBox().width;
    this.y2 = this.y1 + shape.node().getBBox().height;

    console.log(this.x1,this.x2,this.y1,this.y2);

    console.log(shape.node().getCTM());
    console.log(shape.node().getScreenCTM());

    this.intersects = function(other) {
        let x1 = Math.max(this.x1,other.x1);
        let x2 = Math.min(this.x2,other.x2);
        let y1 = Math.max(this.y1,other.y1);
        let y2 = Math.min(this.y2,other.y2);

        return x1 < x2 && y1 < y2;
    }
}

let startSimulation = function(){

    let scale = 100;

    ball.attr("transform", "translate( -200 ,180)");
    Hit.style("opacity", 0);
    noHit.style("opacity", 0);

    let x_start = ball.node().getCTM().e;
    let y_start = ball.node().getCTM().f;



    let g = 9.81*scale;

    let vx = $("#horizontalSpeed").val() * scale;
    let vy = $("#verticalSpeed").val() * scale;
    ball.style("opacity", 1);

    console.log(vx,vy);
    targetBox = new collisionBox(target);

    ball.transition("shoot").duration(10000).ease(d3.easeLinear).attrTween("transform", function () {
        return function (t) {
            tsec = t*10;
            let x = x_start + vx * tsec;
            let y = y_start + (-vy * tsec + 1/2*g*tsec*tsec);

            if(targetBox.intersects(new collisionBox(ball))){
                Hit.style("opacity", 1);
                ball.style("opacity", 0);
                ball.interrupt("shoot");
            }
            if(x > 2000 || y > 2000){
                ball.interrupt("shoot");
                noHit.style("opacity", 1);
            }
            return "translate("+x+","+y+")";
        }});
}



d3.xml("svg/complete/Burg.svg").then(function(xml){

    var importedSvg = document.importNode(xml.documentElement, true);

    let simulation = d3.select('.simulation-space');

    simulation.each(function() {
            this.appendChild(importedSvg);
        });

    // Field
    let svg = simulation.select("svg").attr("width", "100%");

    console.log(svg);
    // ball
    ball = svg.select("#Flugobjekt");
    ball.style("opacity", 0);

    // target
    target = svg.select("#Burg");
    Hit = svg.select("#Ja").style("opacity", 0);
    noHit = svg.select("#Nein").style("opacity", 0);



});


