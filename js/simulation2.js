let Simulation2 = function() {
    let parent = new BaseSimulation();
    let nr_steps = 4;
    let duration;
    let svg = parent.getSvg;
    let start_pos = parent.getStart;
    let nr_balls = 50;
    let balls_data = [];

    let perfect_vx = 25;
    let perfect_vy = 22;
    let playField = parent.getPlayField;
    let start_variance = 10;
    let perfect_ball;

    let variance = function(step){
        return start_variance/(step+1);
    };

    let initRandomBalls = function(balls, nr_balls,nr_steps, step, startx, starty, parent_vx,parent_vy, randomize = true){
        if(step == nr_steps){
            return [];
        }
        for (let ball_index = 0; ball_index < nr_balls; ball_index++) {
            parent_speed_x = parent_vx;
            parent_speed_y = parent_vy;
            balls[ball_index] = new Ball((step+1) + "_" + (ball_index+1), startx, starty, parent_speed_x, parent_speed_y,7,"black",randomize,variance(step),step);
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
        return playField().select("#BallCircles").selectAll("BallCircle")
            .data(step_balls_data)
            .enter()
            .append("circle")
            .attr("id", function (ball_data) {
                return "BallCircle"+ball_data.id;
            })
            .attr("class", "BallCircleLevel"+(step))
            .attr("cx", step_balls_data.y)
            .attr("cy", step_balls_data.y)
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
                ball_data.selected = true;

                if(step == nr_steps-1) {
                    console.log("Finished");
                    return;
                }
                handleMouseOver(this, ball_data);
                for(temp_step = step; temp_step >= 0; temp_step--){
                    playField().selectAll(".BallCircleLevel"+(temp_step)).style("opacity", 1/(step+2-temp_step));
                }
                playField().selectAll(".BallCircleLevel"+(step)).on("click", function (ball_data) {});

                let SelectedCurve = playField().select("#BallCurves #Curve"+ball_data.id);
                let SelectedCurves = playField().select("#SelectedBallCurves");
                SelectedCurves.node().appendChild(SelectedCurve.node().cloneNode(true));
                playField().selectAll("#BallCurves").style("opacity",0.8);
                playField().selectAll("#SelectedBallCurves circle").style("opacity",1);

                let SelectedBall = playField().select("#BallCircle"+ball_data.id);
                let SelectedBalls = playField().select("#SelectedBalls");
                SelectedBalls.node().prepend(SelectedBall.node().cloneNode(true));
                playField().selectAll("#SelectedBalls circle").style("opacity",1).style("fill","green").attr("r", ball_data.r * 1.5);


                playField().append("g").attr("id","BallCurves");
                //playField().append("g").attr("id","PerfectBallCurve");

                if(step == nr_steps-2){
                    children_data = ball_data.children([], 1,nr_steps, step+1, ball_data.x, ball_data.y, ball_data.vx, calculateVerticalSpeed(ball_data.vy,ball_data.time),false);
                }else{
                    children_data = ball_data.children([], nr_balls,nr_steps, step+1, ball_data.x, ball_data.y, ball_data.vx, calculateVerticalSpeed(ball_data.vy,ball_data.time),true);
                }
                ball_data.children_data = children_data;
                balls_children = initRandomBallsShape(children_data,step+1);

                let new_perfect_ball = initPerfectBall(step+1,perfect_ball.x,perfect_ball.y,perfect_ball.vy,perfect_ball.time);
                parent.ballAnimation(new_perfect_ball, duration,false,endCallback);
                parent.ballAnimation(balls_children, duration,false,endCallback)
            });
    }

    let initPerfectBall = function(step,startx,starty,start_vy,time){
        perfect_ball = new Ball("perfect_ball_"+step,startx,starty,perfect_vx,calculateVerticalSpeed(start_vy,time),10,"black");
        perfect_ball.type = "perfect_ball";
        return playField().selectAll("BallCircle")
            .data([perfect_ball])
            .enter()
            .append("circle")
            .attr("class","PerfectBall")
            .attr("cx", startx)
            .attr("cy", starty)
            .attr("r", function (d) {
                return d.r
            })
            .attr("fill", "red")
            .style("opacity", 0)
            .on("mouseover", function (ball_data) {
                d3.select(this)
                    .attr("r", function (ball_data) {
                        return ball_data.r * 2;
                    });
                playField().append("text")
                    .attr('text-anchor', 'middle')
                    .attr("fill", "black")
                    .attr("x", ball_data.x)
                    .attr("y", ball_data.y + ball_data.r * 4)
                    .attr('id', 't' + ball_data.id)
                    .text(function () {
                        return "Picture " + (step+1) + " of the actual shoot";
                    });
            }).on("mouseout", function (ball_data) {
                handleMouseOut(this, ball_data);
                d3.select(this).attr("fill", "red");
            })
    }

    this.start = function (steps,balls) {
        nr_steps = ++steps;
        nr_balls = balls;
        let duration_total = ((parent.getTargetBox().x1-parent.getStart().x)/parent.getScale())/perfect_vx;
        duration = duration_total/nr_steps;

        balls_data = initRandomBalls([],nr_balls,nr_steps,0,start_pos().cx,start_pos().cy,perfect_vx,perfect_vy);

        parent.ballAnimation(initRandomBallsShape(balls_data,0), duration,false,endCallback);
        parent.ballAnimation(initPerfectBall(0,start_pos().cx,start_pos().cy,perfect_vy,0), duration,false,endCallback);
    }

    function handleMouseOver(shape, ball_data) {
        d3.select(shape)
            .attr("fill", "orange")
            .attr("r", function (ball_data) {
                return ball_data.r * 2;
            });

        playField().select("#Curve"+ball_data.id).selectAll(".CircleCurve").style("opacity", 1);

        playField().append("text")
            .attr('text-anchor', 'middle')
            .attr("fill", "black")
            .attr("x", ball_data.x)
            .attr("y", ball_data.y + ball_data.r * 4)
            .attr('id', 't' + ball_data.id)

            .text(function () {
                return "Ball: " + ball_data.id + " x="+Math.ceil(ball_data.x)+" z="+Math.ceil(ball_data.y);
            });


        d3.select(shape)
            .each(function () {
                shape.parentNode.appendChild(shape);
            });
    }

    function handleMouseOut(shape, ball_data) {
        d3.select(shape)
            .attr("fill", "black")
            .attr("r", function (ball_data) {
                return ball_data.r;
            });

        d3.select("#t" + ball_data.id).remove();

        playField().select("#Curve"+ball_data.id).selectAll(".CircleCurve").style("opacity", 0.2);
    }
    this.init = parent.init;

    let endCallback = function(ball){
        if(ball.type != "perfect_ball" && ball.step+1 == nr_steps) {
            let content = "";
            if(ball.hit){
                content = "Congratulations, you scored a hit. You may download the data of your shot for further processing.";
            }else{
                content = "Unfortunately, you missed. You may download the data of your shot for further processing.";
            }
            let excelExport = new Simulation2ExcelExport(ball,balls_data,nr_steps,duration,perfect_ball);
            displayModal("Result",content, excelExport.export,ball);
        }else if(ball.type == "perfect_ball"){
            playField().node().appendChild(parent.getCamera().node().cloneNode(true));
            let camera = playField().select("#OriginalCamera");

            camera.attr("id","Camera"+ball.step)
                .style("opacity", 0.7)
                .attr("transform","translate("+ball.x+","+ball.y+")");
            playField().selectAll(".PerfectBall").style("opacity", 1);
        }
    }
}
simulation2 = new Simulation2();
