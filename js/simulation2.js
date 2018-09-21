let Simulation2 = function() {
    let parent = new BaseSimulation();
    let nr_steps = 4;
    let duration;
    let svg = parent.getSvg;
    let start = parent.getStart;
    var nr_balls = 20;


    let perfect_vx = 25;
    let perfect_vy = 20;
    let playField = parent.getPlayField;
    start_variance = 8;
    var variance = function(step){
        return start_variance/(step+1)^1.5;
    };

    let initRandomBalls = function(balls, nr_balls,nr_steps, step, parent_vx,parent_vy){
        if(step == nr_steps){
            return [];
        }
        for (let ball_index = 0; ball_index < nr_balls; ball_index++) {
            parent_speed_x = parent_vx;
            parent_speed_y = parent_vy;
            balls[ball_index] = new Ball((step+1) + "_" + (ball_index+1), parent_speed_x, parent_speed_y,10,"black",true,variance(step));
            balls[ball_index].children = initRandomBalls(balls[ball_index].children,nr_balls,nr_steps,step+1,balls[ball_index].vx,balls[ball_index].vy);
        }
        return balls;
    };

    let initRandomBallsShape = function(balls_data,step){
        return playField().selectAll("BallCircle")  // For new circle, go through the update process
            .data(balls_data)
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
                handleMouseOver(this, ball_data);
                for(temp_step = step; temp_step >= 0; temp_step--){
                    console.log(temp_step,step,1/(step+1-temp_step));
                    playField().selectAll(".BallCircleLevel"+(temp_step)).style("opacity", 1/(step+2-temp_step));
                }
                playField().selectAll(".BallCircleLevel"+(step)).on("click", function (ball_data) {
                    handleMouseOver(this, ball_data);
                });
                playField().selectAll(".circleCurve").style("opacity", 0.1);
                balls_children = initRandomBallsShape(ball_data.children,step+1);

                parent.ballAnimation(initPerfectBall(step), duration * (step+2),false);
                parent.ballAnimation(balls_children, duration * (step+2),false)
            });
    }

    let initPerfectBall = function(step){
        return playField().selectAll("BallCircle")  // For new circle, go through the update process
            .data([{
                id: "perfect_ball_"+step,
                vx: perfect_vx,
                vy: perfect_vy,
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

    this.start = function () {

        console.log(parent.getStart().x,parent.getTargetBox().x1);
        let duration_total = ((parent.getTargetBox().x1-parent.getStart().x)/parent.getScale())/perfect_vx;
        duration = duration_total/nr_steps;

        balls_data = initRandomBalls([],nr_balls,nr_steps,0,perfect_vx,perfect_vy);

        parent.ballAnimation(initRandomBallsShape(balls_data,0), duration,false);
        parent.ballAnimation(initPerfectBall(0), duration,false);


        d3.transition("ballAnimation").on("end", function () {

        });

    }

    // Create Event Handlers for mouse
    function handleMouseOver(shape, ball_data) {  // Add interactivity

        // Use D3 to select element, change color and size
        d3.select(shape)
            .attr("fill", "orange")
            .attr("r", function (ball_data) {
                return ball_data.r * 2;
            })
            .append("g")

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

    function handleMouseOut(shape, d) {
        // Use D3 to select element, change color back to normal
        d3.select(shape)
            .attr("fill", "black")
            .attr("r", function (d) {
                return d.r;
            });

        // Select text by id and then remove
        d3.select("#t" + d.id).remove();  // Remove text location
    }
    this.init = parent.init;
}
simulation2 = new Simulation2();
