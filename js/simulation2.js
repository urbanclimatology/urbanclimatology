var balls = [];
for (var i = 1; i <= 10; i++) {
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
let duration = 600;
var svg;
let start
let field;

// Create Event Handlers for mouse
function handleMouseOver() {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this)
        .attr("fill", "orange")
        .attr("r", function(d) { return console.log(d); });


    // Specify where to put label of text
    svg.append("text")
        .attr("id","t" + this.id)  // Create an id for text so we can select it later for removing on mouseout
        .attr("cx",this.cx  - 30)
        .attr("cy",this.cy  - 15)
        .text(this.id + " " + this.cx + " " + this.cy);
}

function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this)
        .attr("fill", "black")
        .attr("r", 10);

    // Select text by id and then remove
    //d3.select("#t" + this.id).remove();  // Remove text location
}


let startSimulation2 = function(){

    balls.forEach(function(ball, i){
        ball.shape = svg.selectAll("circle").data([{stupid:"things"}]).enter().append("circle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", 10)
            .attr("id",i)
            .style("opacity", 0)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
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
        .attr("r", 10)
        .attr("fill","red")
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

let ballAnimation = function(duration) {
    let ball = this;
    ball.x_start = start.x;
    ball.y_start = start.y;

    ball.shape.transition("ballAnimation").duration(duration).ease(d3.easeLinear).attrTween("cx", function () {
        return function (t) {
            tsec = t * duration / 1000;
            return ball.x_start + ball.vx * tsec;
        }
    }).attrTween("cy", function () {
        return function (t) {
            tsec = t * duration / 1000;
            return ball.y_start + (-ball.vy * tsec + 1 / 2 * g * tsec * tsec);
        }
    }).styleTween("opacity", function () {
        return function () {
            if (targetBox.intersects(new collisionBox(ball.shape))) {
                Hit.style("opacity", 1);
                console.log("hit");

                return "0";
            }
            return "1";
        }
    });
}






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
    Hit = svg.select("#Feedback_passed").style("opacity", 0);
    noHit = svg.select("#Feedback_failed").style("opacity", 0);

});


