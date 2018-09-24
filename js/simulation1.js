let Simulation1 = function() {
    let parent = new BaseSimulation();
    let playField = parent.getPlayField;
    let start = parent.getStart;

    this.start = function (vx, vy) {


        let duration = (parent.getField().width/parent.getScale())/vx;
        parent.hideFeedback();

        let ball_data = new Ball("Ball1", vx, vy, 10,"black",false);
        let ball = playField().selectAll("BallCircle")  // For new circle, go through the update process
            .data([ball_data])
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
        playField().select("#BallCurves").selectAll("BallCurve")
            .data([ball_data])
            .enter()
            .append("g")
            .attr("id",function (ball_data) {
                return "Curve"+ball_data.id
            });

        parent.ballAnimation(ball, duration,true,endCallback);
    };

    this.init = function(){
        parent.init();
    }

    let endCallback = function(ball){
        let content = "";
        if(ball.hit){
            content = "Congratulations, you scored a hit. You may download the data of your shot for further processing.";
        }else{
            content = "Unfortunately, you missed. You may download the data of your shot for further processing.";
        }
        displayModal("Result",content, function(ball){excelExport(ball)},ball);
    }
}

simulation1 = new Simulation1();

