let Simulation1 = function() {
    let parent = new BaseSimulation();
    let playField = parent.getPlayField;
    let start = parent.getStart;

    this.start = function (vx, vy) {
        let duration = (parent.getField().width/parent.getScale())/vx;
        parent.hideFeedback();

        let ball = playField().selectAll("BallCircle")  // For new circle, go through the update process
            .data([new Ball("Ball1", vx, vy, 10,"black",false)])
            .enter()
            .append("circle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", function (ball_data) {
                return ball_data.r
            })
            .attr("fill", function (ball_data) {
                return ball_data.color
            })
            .style("opacity", 1);

        parent.ballAnimation(ball, duration,true,endCallback);
    };

    this.init = function(){
        parent.init();
    }

    let endCallback = function(ball){
        displayModal("Test Titel","Test Content", function(ball){excelExport(ball)},ball);
    }
}

simulation1 = new Simulation1();

