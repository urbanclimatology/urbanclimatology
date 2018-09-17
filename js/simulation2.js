var balls = [];
for (var i = 1; i <= 0; i++) {
    balls.push({});
}
var perfect_ball = {};
var simulation;
var target;
var targetBox;
var Hit;
var noHit;
var simulation;
let scale = 50;
let g = 9.81*scale;
let duration = 1400;
var svg;
let start
let field;

let startSimulation2 = function(){

    balls.forEach(function(ball){
        ball.shape = svg.append("circle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", 10)
            .style("opacity", 0);
        ball.animate = ballAnimation;


    });
    perfect_ball.shape = svg.append("circle")
        .attr("cx", 209)
        .attr("cy", 851)
        .attr("r", 5)
        .style("opacity", 1);

    perfect_ball.shape = svg.append("circle")
        .attr("cx", start.x)
        .attr("cy", start.y)
        .attr("r", 50)
        .style("opacity", 1);
    perfect_ball.animate = ballAnimation;



    balls.forEach(function(ball){
        ball.shape.style("opacity", 1);
    });

    perfect_vx = 20;
    perfect_vy = 8;
    variance_x = perfect_vx/3;
    variance_y = perfect_vx/3;

    perfect_ball.vx = perfect_vx * scale;
    perfect_ball.vy = perfect_vy * scale;


    balls.forEach(function(ball){
        ball.vx = ((perfect_vx-variance_x/2)+Math.random() * (variance_x)) * scale;
        ball.vy = ((perfect_vy-variance_y/2)+Math.random() * (variance_y)) * scale;
    });


    balls.forEach(function(ball) {
        ball.animate(duration);
    });

    perfect_ball.animate(duration);

    d3.transition("ballAnimation").on("end", function(){
        perfect_ball.shape.style("opacity", 1);
        console.log("animationEnd");
    });
    targetBox = new collisionBox(target);

}

let ballAnimation = function(duration){
    let ball = this;
    ball.x_start = start.x;
    ball.y_start = start.y;

    ball.shape.transition("ballAnimation").duration(duration).ease(d3.easeLinear).attrTween("cx", function () {
        return function (t) {
            tsec = t * duration/1000;
            let x = ball.x_start + ball.vx * tsec;
            let y = ball.y_start + (-ball.vy * tsec + 1 / 2 * g * tsec * tsec);

            console.log(targetBox);
            console.log("Ball",new collisionBox(ball.shape));

            if(targetBox.intersects(new collisionBox(ball.shape))){
                Hit.style("opacity", 1);
                ball.style("opacity", 0);
                console.log("hit");
            }

            return x;
        }
    }).attrTween("cy", function () {
        return function (t) {
            tsec = t * duration / 1000;
            let y = ball.y_start + (-ball.vy * tsec + 1 / 2 * g * tsec * tsec);
            return y;
        }
    });






d3.xml("svg/Burg.svg").then(function(xml){
    var importedSvg = document.importNode(xml.documentElement, true);

    simulation = d3.select('.simulation-space');

    simulation.each(function() {
            this.appendChild(importedSvg);
        });

    // Field
    svg = simulation.select("svg");

    field = simulation.select("#Background").node().getBBox();
    start = getRealCoordinates(svg.select("#Flugobjekt"));

    var x = d3.scaleLinear().range([0, field.width - start.x-10]);
    var y = d3.scaleLinear().range([0, -field.height + (field.height-start.y+10) ]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.close); })
        .y(function(d) { return y(d.close); });

    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(" + start.x + "," + start.y + ")")
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
        .attr("transform", "translate(" + start.x + "," + start.y + ")")
        .call(d3.axisLeft(y));


    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + start.x + " ,"+ field.height+")")
        .style("text-anchor", "middle")
        .text("X");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 10)
        .attr("x",0 - (50))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Z");

    // target
    target = svg.select("#Burg");
    Hit = svg.select("#Feedback_failed").style("opacity", 0);
    noHit = svg.select("#Feedback_passed").style("opacity", 0);

    console.log(svg.node().getBBox());


});


