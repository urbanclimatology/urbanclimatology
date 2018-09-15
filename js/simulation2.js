var balls = [];
for (var i = 1; i <= 100; i++) {
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
let duration = 1500;
var svg;


let startSimulation2 = function(){
    let ballCoordinates = getRealCoordinates(svg.select("#Flugobjekt"));
    balls.forEach(function(ball){
        ball.shape = svg.append("circle")
            .attr("cx", ballCoordinates.x)
            .attr("cy", ballCoordinates.y)
            .attr("r", 10)
            .style("opacity", 0);
        ball.animate = ballAnimation;


    });

    perfect_ball.shape = svg.append("circle")
        .attr("cx", ballCoordinates.x)
        .attr("cy", ballCoordinates.y)
        .attr("r", 20)
        .style("opacity", 0);
    perfect_ball.animate = ballAnimation;

    svg.select("#Flugobjekt").style("opacity", 0);


    balls.forEach(function(ball){
        ball.shape.style("opacity", 1);
    });

    perfect_vx = 12;
    perfect_vy = 6;
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
        console.log(perfect_ball);
    });

}

let ballAnimation = function(duration){
    let ball = this;
    coordinates = getRealCoordinates(ball.shape);
    ball.x_start = coordinates.x;
    ball.y_start = coordinates.y;
    ball.shape.transition("ballAnimation").duration(duration).ease(d3.easeLinear).attrTween("transform", function () {
        return function (t) {
            tsec = t * duration/1000;
            let x = ball.x_start + ball.vx * tsec;
            let y = ball.y_start + (-ball.vy * tsec + 1 / 2 * g * tsec * tsec);
            return "translate(" + x + "," + y + ")";
        }
    });
}



d3.xml("svg/complete/Burg.svg").then(function(xml){

    var importedSvg = document.importNode(xml.documentElement, true);

    simulation = d3.select('.simulation-space');

    simulation.each(function() {
            this.appendChild(importedSvg);
        });

    // Field
    svg = simulation.select("svg").attr("width", "100%");

    // set the ranges
    var x = d3.scaleTime().range([0, 200]);
    var y = d3.scaleLinear().range([200, 0]);

// define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(x));

    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (50) + " ," +
            (10 + 100 + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 10)
        .attr("x",0 - (50))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");



    // target
    target = svg.select("#Burg");
    Hit = svg.select("#Ja").style("opacity", 0);
    noHit = svg.select("#Nein").style("opacity", 0);



});


