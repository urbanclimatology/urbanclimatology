let Simulation = function() {
    var targetBox;
    var Hit;
    var noHit;
    var scale;
    var svg;
    var field;

    let g = 9.81;
    let duration = 50000;
    let start;

    this.init = function () {
        d3.xml("svg/Burg.svg").then(function (xml) {
            let importedSvg = document.importNode(xml.documentElement, true);
            let simulation = d3.select('.simulation-space');
            simulation.each(function () {
                this.appendChild(importedSvg);
            });

            svg = simulation.select("svg");
            start = getRealCoordinates(svg.select("#Flugobjekt").node());
            targetBox = new collisionBox(svg.select("#Burg").node());
            field = simulation.select("#Background").node().getBBox();

            Hit = svg.select("#Feedback_passed").style("opacity", 0);
            noHit = svg.select("#Feedback_failed").style("opacity", 0);
            initAxis();
        })
    };

    let initAxis = function(){
        let x_axis_length_pixels = field.width - start.x - 100;
        let x_axis_domain = 110;
        scale = x_axis_length_pixels/x_axis_domain;
        let y_axis_length_pixels = -start.y;
        let y_axis_domain = -y_axis_length_pixels/scale;

        let x = d3.scaleLinear().range([0, x_axis_length_pixels]).domain([0,x_axis_domain]);
        let y = d3.scaleLinear().range([0, y_axis_length_pixels]).domain([0,y_axis_domain]);;

        //x Axis
        svg.append("g")
            .attr("transform", "translate(" + start.cx + "," + start.cy + ")")
            .call(d3.axisBottom(x).ticks(10).tickSize(y_axis_length_pixels)
                .tickFormat(function(d){return d;}))
            .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#aaa").attr("stroke-dasharray", "2,2");
        svg.append("text")
            .attr("transform",
                "translate(" + (start.cx + x_axis_length_pixels/2) + "," + (start.y2+20) + ")")
            .style("text-anchor", "middle")
            .text("Distance (x) in m");

        //y Axis
        svg.append("g")
            .attr("transform", "translate(" + start.cx + "," + start.cy + ")")
            .call(d3.axisLeft(y).ticks(6).tickSize(-x_axis_length_pixels)
                .tickFormat(function(d){return d;}))
            .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#aaa").attr("stroke-dasharray", "2,2")
        svg.append("text")
            .attr("transform",
                "translate(" + (start.cx-30) + "," + (start.cy + y_axis_length_pixels/2) + "), rotate(-90)")
            .style("text-anchor", "middle")
            .text("Distance (z) in m");
    };


    let Ball = function (index, base_vx, base_vy, randomize) {
        let vx = base_vx;
        let vy = base_vy;
        if(randomize){
            vx = ((base_vx - variance_x / 2) + Math.random() * (variance_x));
            vy = ((base_vy - variance_y / 2) + Math.random() * (variance_y));
        }

        return {
            id: index,
            vx: vx,
            vy: vy,
            r: 10,
            children: []
        }
    }

    this.startSimulation1 = function () {
        Hit.style("opacity", 0);
        noHit.style("opacity", 0);

        let ball = svg.selectAll("BallCircle")  // For new circle, go through the update process
            .data([new Ball("Ball1",$("#horizontalSpeed").val(),$("#verticalSpeed").val(),false)])
            .enter()
            .append("circle")
            .attr("cx", start.x)
            .attr("cy", start.y)
            .attr("r", function (d) {
                return d.r
            })
            .attr("fill", "red")
            .style("opacity", 1);

        ballAnimation(ball, duration);

        d3.transition("ballAnimation").on("end", function () {
        });
    }

    this.startSimulation2 = function () {
        let duration = 500;
        Hit.style("opacity", 0);
        noHit.style("opacity", 0);

        let nr_balls = 50;
        var balls_data = [];

        perfect_vx = 20;
        perfect_vy = 25;
        variance_x = perfect_vx / 2;
        variance_y = perfect_vx / 2;

        for (let i = 1; i <= nr_balls; i++) {
            let ball = new Ball(i, 5 + Math.random() * 25, 5 + Math.random() * 25,true);
            for (let j = 1; j <= nr_balls; j++) {
                let childBall = Ball(i + "_" + j, ball.vx, ball.vy,true);
                for (let k = 1; k <= nr_balls; k++) {
                    let grandChildBall = Ball(i + "_" + j + "_" + k, childBall.vx, childBall.vy,true);
                    childBall.children.push(grandChildBall);
                }
                ball.children.push(childBall);
            }
            balls_data.push(ball);
        }


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
                    .data([new Ball("perfect_ball_2",perfect_vx,perfect_vy,false)])
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
                let x = start.x + ball.vx * tsec * scale;
                if(x > field.width+ball.r){
                    noHit.style("opacity", 1);
                    ball_shapes.interrupt("ballAnimation");
                }
                return x;
            }
        }).attrTween("cy", function (ball) {
            return function (t) {
                tsec = t * duration / 1000;
                let y = start.y + (-ball.vy * tsec * scale + 1 / 2 * g * tsec * tsec * scale);
                if(y > field.height+ball.r*10){
                    noHit.style("opacity", 1);
                    ball_shapes.interrupt("ballAnimation");
                }
                return y;
            }
        }).styleTween("opacity", function () {
            self = this;
            console.log(self);
            return function () {
                if (targetBox.intersects(new collisionBox(self))) {
                    Hit.style("opacity", 1);
                    ball_shapes.interrupt("ballAnimation");
                    return "0";
                }

                return "1";
            }
        });
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


}
simulation = new Simulation();
