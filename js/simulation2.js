let Simulation2 = function() {
    let parent = new BaseSimulation();
    let nr_steps = 4;
    let duration;
    let svg = parent.getSvg;
    let start_pos = parent.getStart;
    let nr_balls = 50;
    let balls_data = [];

    let perfect_vx = 22;
    let perfect_vy = 24;
    let playField = parent.getPlayField;
    let start_variance = 10;
    let perfect_ball;
    let last_perfect_ball = null;
    let current_selected_ball = null;
    let history_of_selected_balls = [];

    let variance = function(step){
        return start_variance/((step*0.5)+1);
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
            .attr("cx", step_balls_data.x)
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
                current_selected_ball = jQuery.extend(true, {},ball_data);
                history_of_selected_balls.push(current_selected_ball);

                playField().append("g").attr("id","BallCurves");
                //playField().append("g").attr("id","PerfectBallCurve");

                if(step == nr_steps-2){
                    children_data = ball_data.children([], 1,nr_steps, step+1, ball_data.x, ball_data.y, ball_data.vx, calculateVerticalSpeed(ball_data.vy,ball_data.time),false);
                }else{
                    children_data = ball_data.children([], nr_balls,nr_steps, step+1, ball_data.x, ball_data.y, ball_data.vx, calculateVerticalSpeed(ball_data.vy,ball_data.time),true);
                }
                ball_data.children_data = children_data;
                balls_children = initRandomBallsShape(children_data,step+1);

                last_perfect_ball = jQuery.extend(true, {},perfect_ball);

                let new_perfect_ball = initPerfectBall(step+1,perfect_ball.x,perfect_ball.y,perfect_ball.vy,perfect_ball.time);
                parent.ballAnimation(new_perfect_ball, duration,false,endCallback);
                parent.ballAnimation(balls_children, duration,false,endCallback)
            });
    }

    let initPerfectBall = function(step,startx,starty,start_vy,time){
        perfect_ball = new Ball("perfect_ball_"+step,startx,starty,perfect_vx,calculateVerticalSpeed(start_vy,time),10,"black",false,0, step);
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
        last_perfect_ball = null;
        current_selected_ball = null;
        history_of_selected_balls = [];
        duration_total = ((parent.getTargetBox().x1-parent.getStart().x)/parent.getScale())/perfect_vx;
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
            .attr("y", ball_data.y - ball_data.r * 4)
            .attr('id', 't' + ball_data.id)

            .text(function () {
                return "Ball: " + ball_data.id +
                    " x="+Math.round(calculateAbsolutRealHorizontalPosition(ball_data.vx,ball_data.time,parent.getStart().cx,ball_data.start_x,parent.getScale()))+
                    " z="+Math.round(calculateAbsolutRealVerticalPosition(ball_data.vy,ball_data.time,parent.getStart().cy,ball_data.start_y,parent.getScale()));
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
            let model_vx = Math.round(ball.vx * 100) / 100;
            let model_vy = Math.round((ball.vy + 9.81 * duration*(nr_steps-1)) * 100)/100;
            history_of_selected_balls.push(ball);
            result = "<p>";
            result += "You finished the simulation.</br></br>";

            /**    "Your selection let to the following model:</br></br>";
            result += "$$\\binom{x(t)}{z(t)}=\\binom{u_{0} * t}{w_{0} - \\frac{1}{2}gt^{2}}=\\binom{"+model_vx+" * t}{"+model_vy+" - \\frac{1}{2}gt^{2}}$$";**/

            result += 'Detected initial horizontal speed \\(u_{0}\\) in m/s: '+model_vx+"</br>";
            result += 'Detected initial vertical speed \\(w_{0}\\) in m/s: '+model_vy+"</br>";

            result += calculateEuclidianDistanceSummaryFromSelectedBalls(ball);
            result += "</p>";

            let excelExport = new Simulation2ExcelExport(ball,balls_data,nr_steps,duration,perfect_ball,parent.getScale(),parent.getStart(), perfect_vx, perfect_vy,false,true);
            let excelExport_solution = new Simulation2ExcelExport(ball,balls_data,nr_steps,duration,perfect_ball,parent.getScale(),parent.getStart(), perfect_vx, perfect_vy,true,true);

            displayModal("Result",result, excelExport.export,ball,excelExport_solution.export);
        } else if(ball.type == "perfect_ball"){
            if((ball.step+1) === 1){
                result = "<p>";
                result += "This is the first step in the simulation. You can download the data of the balls the calculate which one too chose (hopefully the one with the smallest euclidean distance).";
                let excelExport = new Simulation2ExcelExport(ball,balls_data,nr_steps,duration,perfect_ball,parent.getScale(),parent.getStart(), perfect_vx, perfect_vy,false,false);
                displayModal("Result",result, excelExport.export);
            }else if(ball.step+1 < nr_steps){

                let model_vx = Math.round(current_selected_ball.vx * 100) / 100;
                let model_vy = Math.round((current_selected_ball.vy + 9.81 * duration*(ball.step-1)) * 100)/100;



                result = "<p>";
                result += "You proceeded one step in the simulation.</br></br>";
                /**    "Your selection let to the following temporary model:</br></br>";
                result += "$$\\binom{x(t)}{z(t)}=\\binom{u_{0} * t}{w_{0} - \\frac{1}{2}gt^{2}}=\\binom{"+model_vx+" * t}{"+model_vy+" - \\frac{1}{2}gt^{2}}$$"; **/

                result += 'Initial horizontal speed of selected ball ('+current_selected_ball.id+')  \\(u_{0}\\) in m/s: '+model_vx+"</br>";
                result += 'Initial vertical speed of selected ball ('+current_selected_ball.id+') \\(w_{0}\\) in m/s: '+model_vy+"</br>";


                result += calculateEuclidianDistanceSummaryFromSelectedBalls(ball);
                result += "</p>";

                let excelExport = new Simulation2ExcelExport(current_selected_ball,balls_data,nr_steps,duration,perfect_ball,parent.getScale(),parent.getStart(), perfect_vx, perfect_vy,false,false);
                displayModal("Data of Step: "+(ball.step+1),result, excelExport.export);
            }

            playField().node().appendChild(parent.getCamera().node().cloneNode(true));
            let camera = playField().select("#OriginalCamera");

            camera.attr("id","Camera"+ball.step)
                .style("opacity", 0.7)
                .attr("transform","translate("+ball.x+","+ball.y+")");
            playField().selectAll(".PerfectBall").style("opacity", 1);

        }
    }

    let calculateEuclidianDistanceToPerfectBall = function(ball,step){
        var_ball_x = calculateAbsolutRealHorizontalPosition(ball.vx,duration,parent.getStart().cx,ball.start_x,parent.getScale());
        var_ball_y = calculateAbsolutRealVerticalPosition(ball.vy,duration,parent.getStart().cy,ball.start_y,parent.getScale());

        perfect_x = calculateAbsolutRealHorizontalPosition(perfect_vx,duration*step,parent.getStart().cx,parent.getStart().cx,parent.getScale());
        perfect_y = calculateAbsolutRealVerticalPosition(perfect_vy,duration*step,parent.getStart().cy,parent.getStart().cy,parent.getScale());

        return Math.round(Math.sqrt(Math.pow(var_ball_x-perfect_x,2)+Math.pow(var_ball_y-perfect_y,2))*100)/100;
    }

    let calculateEuclidianDistanceSummaryFromSelectedBalls = function(){
        result = "</p>";
        let sum = 0;
        let squared_sum = 0;
        history_of_selected_balls.forEach(function(ball,i){
            let distance = calculateEuclidianDistanceToPerfectBall(ball,i+1);
            result += 'Euclidean dist.from selected ball ('+ball.id+') to last target picture: '+distance+"m</br>";
            sum += distance;
            squared_sum += distance*distance;
        });

        let average_of_selected_balls = Math.round(sum/history_of_selected_balls.length*100)/100;
        let gaussian_distance = Math.round(Math.sqrt(squared_sum)*100)/100;

        result += 'Average dist. from all selected balls: '+average_of_selected_balls+"m</br>";
        result += 'Square root of squared dist. from all selected balls: '+gaussian_distance+"m</br>";

        result += "</p>";

        return result;
        console.log(result);


    }
}
simulation2 = new Simulation2();
