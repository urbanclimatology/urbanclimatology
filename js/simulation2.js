let Simulation2 = function() {
    let parent = new BaseSimulation();
    let duration = 800;
    let svg = parent.getSvg;
    let start = parent.getStart;

    let nr_balls = 50;
    var balls_data = [];

    let perfect_vx = 25;
    let perfect_vy = 20;


    for (let i = 1; i <= nr_balls; i++) {
        let ball = new Ball(i, perfect_vx,perfect_vy,true,10);
        for (let j = 1; j <= nr_balls; j++) {
            let childBall = Ball(i + "_" + j, ball.vx, ball.vy,true,3);
            for (let k = 1; k <= nr_balls; k++) {
                let grandChildBall = Ball(i + "_" + j + "_" + k, childBall.vx, childBall.vy,true,1);
                childBall.children.push(grandChildBall);
            }
            ball.children.push(childBall);
        }
        balls_data.push(ball);
    }


    // Create Event Handlers for mouse
    function handleMouseOver(shape, d) {  // Add interactivity

        // Use D3 to select element, change color and size
        d3.select(shape)
            .attr("fill", "orange")
            .attr("r", function (d) {
                return d.r * 2;
            })
            .append("g")

        console.log();
        svg().append("text")
            .attr('text-anchor', 'middle')
            .attr("fill", "black")
            .attr("x", shape.cx.baseVal.value)
            .attr("y", shape.cy.baseVal.value + d.r * 4)
            .attr('id', 't' + d.id)

            .text(function () {
                return "Ball: " + d.id
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


    this.start = function () {

        let balls_shapes = svg().selectAll("BallCircle")  // For new circle, go through the update process
            .data(balls_data)
            .enter()
            .append("circle")
            .attr("class", "BallCircle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", function (d) {
                return d.r
            })
            .on("mouseover", function (d) {
                handleMouseOver(this, d)
            })
            .on("mouseout", function (d) {
                handleMouseOut(this, d)
            })
            .on("click", function (d) {
                handleMouseOver(this, d);
                svg().selectAll(".BallCircle").style("opacity", 0.5);
                let balls_shapes_children = svg().selectAll("BallCircleChildren")  // For new circle, go through the update process
                    .data(d.children)
                    .enter()
                    .append("circle")
                    .attr("class", "BallCircleChildren",)
                    .attr("cx", start.x)
                    .attr("cy", start.y)
                    .attr("r", function (d) {
                        return d.r
                    })
                    .on("mouseover", function (d) {
                        handleMouseOver(this, d)
                    })
                    .on("mouseout", function (d) {
                        handleMouseOut(this, d)
                    })
                    .on("click", function (d) {
                        svg().selectAll(".BallCircle").style("opacity", 0.25);
                        svg().selectAll(".BallCircleChildren").style("opacity", 0.5);

                        handleMouseOver(this, d);
                        let balls_shapes_grand_children = svg().selectAll("BallCircleGrandChildren")  // For new circle, go through the update process
                            .data(d.children)
                            .enter()
                            .append("circle")
                            .attr("class", "BallCircleGrandChildren")
                            .attr("cx", start.x)
                            .attr("cy", start.y)
                            .attr("r", function (d) {
                                return d.r
                            })
                            .on("mouseover", function (d) {
                                handleMouseOver(this, d)
                            })
                            .on("mouseout", function (d) {
                                handleMouseOut(this, d)
                            })
                        perfect_ball_3 = svg().selectAll("BallCircle")  // For new circle, go through the update process
                            .data([{
                                id: "perfect_ball_3",
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
                        parent.ballAnimation(perfect_ball_3, duration * 3);
                        parent.ballAnimation(balls_shapes_grand_children, duration * 3)
                    });
                perfect_ball_2 = svg().selectAll("BallCircle")  // For new circle, go through the update process
                    .data([{
                        id: "perfect_ball_2",
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
                parent.ballAnimation(perfect_ball_2, duration * 2);
                parent.ballAnimation(balls_shapes_children, duration * 2)
            });


        perfect_ball = svg().selectAll("BallCircle")  // For new circle, go through the update process
            .data([{
                id: "perfect_ball",
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

        parent.ballAnimation(balls_shapes, duration);
        parent.ballAnimation(perfect_ball, duration);

        //perfect_ball.animate(perfect_ball.shape,perfect_ball,duration);

        d3.transition("ballAnimation").on("end", function () {
            perfect_ball.style("opacity", 1);
            console.log("animationEnd");
        });

    }
    this.init = parent.init;
}
simulation2 = new Simulation2();
