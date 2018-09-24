let Simulation2 = function() {
    let parent = new BaseSimulation();
    let nr_steps = 4;
    let duration;
    let svg = parent.getSvg;
    let start = parent.getStart;
    let nr_balls = 50;
    let balls_data = [];

    let perfect_vx = 25;
    let perfect_vy = 22;
    let playField = parent.getPlayField;
    let start_variance = 10;
    var variance = function(step){
        return start_variance/Math.pow(step+1,2);
    };

    let initRandomBalls = function(balls, nr_balls,nr_steps, step, parent_vx,parent_vy, randomize = true){
        if(step == nr_steps){
            return [];
        }
        for (let ball_index = 0; ball_index < nr_balls; ball_index++) {
            parent_speed_x = parent_vx;
            parent_speed_y = parent_vy;
            balls[ball_index] = new Ball((step+1) + "_" + (ball_index+1), parent_speed_x, parent_speed_y,10,"black",randomize,variance(step),step);
            balls[ball_index].children = initRandomBalls;
        }
        return balls;
    };

    let initRandomBallsShape = function(step_balls_data,step){
        playField().select("#BallCurves").selectAll("BallCurve")
            .data(step_balls_data)
            .enter()
            .append("g")
            .attr("id",function (ball_data) {
                return "Curve"+ball_data.id
            });
        return playField().select("#Circles").selectAll("BallCircle")
            .data(step_balls_data)
            .enter()
            .append("circle")
            .attr("class", "BallCircleLevel"+(step))
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", function (ball_data) {
                return ball_data.r
            })
            .on("mouseover", function (ball_data) {
                handleMouseOver(this, ball_data)
            })
            .on("mouseout", function (ball_data) {
                handleMouseOut(this, ball_data)
            })
            .on("click", function (ball_data) {
                if(step == nr_steps-1) {
                    console.log("Finished");
                    return;
                }
                handleMouseOver(this, ball_data);
                for(temp_step = step; temp_step >= 0; temp_step--){
                    playField().selectAll(".BallCircleLevel"+(temp_step)).style("opacity", 1/((step+2-temp_step)));
                }
                playField().selectAll(".BallCircleLevel"+(step)).on("click", function (ball_data) {});
                playField().selectAll("#BallCurves").remove();
                playField().append("g").attr("id","BallCurves");
                playField().append("g").attr("id","PerfectBallCurve");

                if(step == nr_steps-2){
                    children_data = ball_data.children([], 1,nr_steps, step+1, ball_data.vx, ball_data.vy,false);
                }else{
                    children_data = ball_data.children([], nr_balls,nr_steps, step+1, ball_data.vx, ball_data.vy,true);
                }
                ball_data.children_data = children_data;
                balls_children = initRandomBallsShape(children_data,step+1);

                parent.ballAnimation(initPerfectBall(step), duration * (step+2),false,endCallback);
                parent.ballAnimation(balls_children, duration * (step+2),false,endCallback)
            });
    }

    let initPerfectBall = function(step){
        return playField().selectAll("BallCircle")  // For new circle, go through the update process
            .data([{
                id: "perfect_ball_"+step,
                vx: perfect_vx,
                vy: perfect_vy,
                type: "perfect_ball",
                r: 10,
            }])
            .enter()
            .append("circle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", function (d) {
                return d.r
            })
            .attr("fill", "red")
            .style("opacity", 1);
    }

    this.start = function (steps,balls) {
        nr_steps = ++steps;
        nr_balls = balls;
        let duration_total = ((parent.getTargetBox().x1-parent.getStart().x)/parent.getScale())/perfect_vx;
        duration = duration_total/nr_steps;

        balls_data = initRandomBalls([],nr_balls,nr_steps,0,perfect_vx,perfect_vy);

        parent.ballAnimation(initRandomBallsShape(balls_data,0), duration,false,endCallback);
        parent.ballAnimation(initPerfectBall(0), duration,false,endCallback);
    }

    let endCallback = function(ball,i,shape){
        console.log(ball);
        if(ball.type != "perfect_ball" && ball.step+1 == nr_steps) {
            let content = "";
            if(ball.hit){
                content = "Congratulations, you scored a hit. You may download the data of your shot for further processing.";
            }else{
                content = "Unfortunately, you missed. You may download the data of your shot for further processing.";
            }
            displayModal("Result",content, function(ball){excelExport(ball)},ball);
        }
    }

    // Create Event Handlers for mouse
    function handleMouseOver(shape, ball_data) {  // Add interactivity

        // Use D3 to select element, change color and size
        d3.select(shape)
            .attr("fill", "orange")
            .attr("r", function (ball_data) {
                return ball_data.r * 2;
            });

        playField().select("#Curve"+ball_data.id).selectAll(".CircleCurve").style("opacity", 1);

        playField().append("text")
            .attr('text-anchor', 'middle')
            .attr("fill", "black")
            .attr("x", shape.cx.baseVal.value)
            .attr("y", shape.cy.baseVal.value + ball_data.r * 4)
            .attr('id', 't' + ball_data.id)

            .text(function () {
                return "Ball: " + ball_data.id
            });


        d3.select(shape)
            .each(function () {
                shape.parentNode.appendChild(shape);
            });
    }

    function handleMouseOut(shape, ball_data) {
        // Use D3 to select element, change color back to normal
        d3.select(shape)
            .attr("fill", "black")
            .attr("r", function (ball_data) {
                return ball_data.r;
            });

        // Select text by id and then remove
        d3.select("#t" + ball_data.id).remove();  // Remove text location

        playField().select("#Curve"+ball_data.id).selectAll(".CircleCurve").style("opacity", 0.2);
    }
    this.init = parent.init;
}
simulation2 = new Simulation2();
