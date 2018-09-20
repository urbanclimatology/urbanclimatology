let Simulation1 = function() {
    let parent = new BaseSimulation();
    let duration = 5000;
    let svg = parent.getSvg;
    let start = parent.getStart;

    this.start = function (vx, vy) {
        parent.hideFeedback();

        let ball = svg().selectAll("BallCircle")  // For new circle, go through the update process
            .data([new Ball("Ball1", vx, vy, false)])
            .enter()
            .append("circle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", function (d) {
                return d.r
            })
            .attr("fill", "red")
            .style("opacity", 1);

        parent.ballAnimation(ball, duration);

        d3.transition("ballAnimation").on("end", function () {
        });
    }

    this.init = parent.init;
}

simulation1 = new Simulation1();
