let Simulation = function() {
    var perfect_ball = {};
    var simulation;
    var target;
    var targetBox;
    var Hit;
    var noHit;
    var simulation;
    let scale = 50;
    let g = 9.81 * scale;
    let duration = 500;
    var svg;
    let start;
    let field;

    let nr_balls = 50;
    var balls_data = [];

    perfect_vx = 20;
    perfect_vy = 8;
    variance_x = perfect_vx / 3;
    variance_y = perfect_vx / 3;

    let Ball = function (index, base_vx, base_vy) {
        return {
            id: index,
            vx: ((base_vx - variance_x / 2) + Math.random() * (variance_x)),
            vy: ((base_vy - variance_y / 2) + Math.random() * (variance_y)),
            r: 10,
            children: []
        }
    }


    for (let i = 1; i <= nr_balls; i++) {
        let ball = new Ball(i, 5 + Math.random() * 25, 5 + Math.random() * 25);
        for (let j = 1; j <= nr_balls; j++) {
            let childBall = Ball(i + "_" + j, ball.vx, ball.vy);
            for (let k = 1; k <= nr_balls; k++) {
                let grandChildBall = Ball(i + "_" + j + "_" + k, childBall.vx, childBall.vy);
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
        svg.append("text")
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


    this.startSimulation2 = function () {

        let balls_shapes = svg.selectAll("BallCircle")  // For new circle, go through the update process
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
                svg.selectAll(".BallCircle").style("opacity", 0.5);
                let balls_shapes_children = svg.selectAll("BallCircleChildren")  // For new circle, go through the update process
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
                        svg.selectAll(".BallCircle").style("opacity", 0.25);
                        svg.selectAll(".BallCircleChildren").style("opacity", 0.5);

                        handleMouseOver(this, d);
                        let balls_shapes_grand_children = svg.selectAll("BallCircleGrandChildren")  // For new circle, go through the update process
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
                        perfect_ball_3 = svg.selectAll("BallCircle")  // For new circle, go through the update process
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
                        ballAnimation(perfect_ball_3, duration * 3);
                        ballAnimation(balls_shapes_grand_children, duration * 3)
                    });
                perfect_ball_2 = svg.selectAll("BallCircle")  // For new circle, go through the update process
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
                ballAnimation(perfect_ball_2, duration * 2);
                ballAnimation(balls_shapes_children, duration * 2)
            });


        perfect_ball = svg.selectAll("BallCircle")  // For new circle, go through the update process
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

        targetBox = new collisionBox(target.node());

        ballAnimation(balls_shapes, duration);
        ballAnimation(perfect_ball, duration);

        //perfect_ball.animate(perfect_ball.shape,perfect_ball,duration);

        d3.transition("ballAnimation").on("end", function () {
            perfect_ball.style("opacity", 1);
            console.log("animationEnd");
        });

    }

    let ballAnimation = function (ball_shapes, duration) {

        ball_shapes.transition("ballAnimation").duration(duration).ease(d3.easeLinear).attrTween("cx", function (ball) {
            return function (t) {
                tsec = t * duration / 1000;
                return start.x + ball.vx * scale * tsec;
            }
        }).attrTween("cy", function (ball) {
            return function (t) {
                tsec = t * duration / 1000;
                return start.y + (-ball.vy * tsec * scale + 1 / 2 * g * tsec * tsec);
            }
        }).styleTween("opacity", function () {
            self = this;
            console.log(self);
            return function () {
                if (targetBox.intersects(new collisionBox(self))) {
                    Hit.style("opacity", 1);
                    console.log("hit");

                    return "0";
                }
                return "1";
            }
        });
    }

    this.init = function () {
        d3.xml("svg/Burg.svg").then(function (xml) {
            var importedSvg = document.importNode(xml.documentElement, true);

            simulation = d3.select('.simulation-space');

            simulation.each(function () {
                this.appendChild(importedSvg);
            });

            // Field
            svg = simulation.select("svg");

            field = simulation.select("#Background").node().getBBox();
            start = getRealCoordinates(svg.select("#Flugobjekt").node());

            var x = d3.scaleLinear().range([0, field.width - start.x - 10]);
            var y = d3.scaleLinear().range([0, -field.height + (field.height - start.y + 10)]);

            // define the line
            var valueline = d3.line()
                .x(function (d) {
                    return x(d.close);
                })
                .y(function (d) {
                    return y(d.close);
                });

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
                    "translate(" + start.x + " ," + field.height + ")")
                .style("text-anchor", "middle")
                .text("X");

            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - 10)
                .attr("x", 0 - (50))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Z");

            // target
            target = svg.select("#Burg");
            Hit = svg.select("#Feedback_passed").style("opacity", 0);
            noHit = svg.select("#Feedback_failed").style("opacity", 0);

        });
    }


}
simulation = new Simulation();
