var balls = [];
for (var i = 1; i <= 10; i++) {
    balls.push({});
}
var target;
var targetBox;
var Hit;
var noHit;


let startSimulation2 = function(){

    let scale = 50;


    balls.forEach(function(ball){
        ball.shape.attr("transform", "translate( -200 ,180)");
        ball.shape.style("opacity", 1);
        ball.x_start = ball.shape.node().getCTM().e;
        ball.y_start = ball.shape.node().getCTM().f;
    });




    let g = 9.81*scale;

    balls.forEach(function(ball){
        ball.vx = Math.floor(2+Math.random() * 4) * scale;
        ball.vy = Math.floor(2+Math.random() * 8) * scale;
    });


    balls.forEach(function(ball) {
        ball.shape.transition("shoot").duration(1000).ease(d3.easeLinear).attrTween("transform", function () {
            return function (t) {
                console.log(t);
                tsec = t * 1;
                let x = ball.x_start + ball.vx * tsec;
                let y = ball.y_start + (-ball.vy * tsec + 1 / 2 * g * tsec * tsec);

                return "translate(" + x + "," + y + ")";
            }
        });
    });
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
    balls.forEach(function(ball){
        ball.shape = svg.append("circle")
                                .attr("cx", svg.select("#Flugobjekt").node().getBBox().x)
                                .attr("cy", svg.select("#Flugobjekt").node().getBBox().y)
                                .attr("r", 10).style("opacity", 0);

    });
    svg.select("#Flugobjekt").style("opacity", 0);

    // target
    target = svg.select("#Burg");
    Hit = svg.select("#Ja").style("opacity", 0);
    noHit = svg.select("#Nein").style("opacity", 0);



});


