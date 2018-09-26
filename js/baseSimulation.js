function BaseSimulation() {

    var targetBox;
    var Hit;
    var noHit;
    var camera;
    var scale;
    var svg;
    var field;
    var play_field;
    let g = 9.81;
    let start;

    this.init = function () {
        if($(".simulation-space").children().length > 0){
            initSVG();
            return;
        }

        d3.xml("svg/Burg.svg").then(function (xml) {
            let importedSvg = document.importNode(xml.documentElement, true);
            let simulation = d3.select(".simulation-space");
            simulation.each(function () {
                this.appendChild(importedSvg);
            });

            initSVG();
        })

    };

    let initSVG = function(){
        svg = d3.select(".simulation-space svg");
        start = getRealCoordinates(svg.select("#Flugobjekt").node());
        targetBox = new collisionBox(svg.select("#Burg").node());
        field = d3.select("#Background").node().getBBox();

        Hit = svg.select("#Feedback_passed").style("opacity", 0);
        noHit = svg.select("#Feedback_failed").style("opacity", 0);
        camera = svg.select(".Camera").style("opacity", 0);

        d3.selectAll("circle").interrupt("ballAnimation");
        svg.select("#Playfield").remove();
        play_field = svg.append("g").attr("id","Playfield");
        play_field.append("g").attr("id","BallCurves");
        play_field.append("g").attr("id","PerfectBallCurve");
        play_field.append("g").attr("id","Circles");


        initAxis();
    }

    let initAxis = function(){
        let x_axis_length_pixels = field.width - start.x - 100;
        let x_axis_domain = 110;
        scale = x_axis_length_pixels/x_axis_domain;
        let y_axis_length_pixels = -start.y;
        let y_axis_domain = -y_axis_length_pixels/scale;

        let x = d3.scaleLinear().range([0, x_axis_length_pixels]).domain([0,x_axis_domain]);
        let y = d3.scaleLinear().range([0, y_axis_length_pixels]).domain([0,y_axis_domain]);;

        let axis = svg.select("#Axis");
        if(axis.empty()){
            axis = svg.append("g").attr("id","Axis");
            //x Axis
            axis.append("g")
                .attr("transform", "translate(" + start.cx + "," + start.cy + ")")
                .call(d3.axisBottom(x).ticks(10).tickSize(y_axis_length_pixels)
                    .tickFormat(function(d){return d;}))
                .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#aaa").attr("stroke-dasharray", "2,2");
            axis.append("text")
                .attr("transform",
                    "translate(" + (start.cx + x_axis_length_pixels/2) + "," + (start.y2+20) + ")")
                .style("text-anchor", "middle")
                .text("Distance (x) in m");

            //y Axis
            axis.append("g")
                .attr("transform", "translate(" + start.cx + "," + start.cy + ")")
                .call(d3.axisLeft(y).ticks(6).tickSize(-x_axis_length_pixels)
                    .tickFormat(function(d){return d;}))
                .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#aaa").attr("stroke-dasharray", "2,2")
            axis.append("text")
                .attr("transform",
                    "translate(" + (start.cx-30) + "," + (start.cy + y_axis_length_pixels/2) + "), rotate(-90)")
                .style("text-anchor", "middle")
                .text("Distance (z) in m");
        }

    };

    this.ballAnimation = function (ball_shapes, duration, handle_hit = true, end_callback = null) {
        ball_shapes.transition("ballAnimation").duration(duration*1000).ease(d3.easeLinear)
        .attrTween("cx", function (ball) {
            return function (t) {
                let tsec = t * duration ;
                return calculateHorizontalPosition(start.cx,ball.vx,tsec,scale);
            }
        }).attrTween("cy", function (ball) {
            return function (t) {
                let tsec = t * duration;
                return calculateVerticalPosition(start.cy,ball.vy,tsec,scale);
            }
        }).styleTween("opacity", function (ball) {
            var self = this;
            return function (t) {
                tsec = t * duration;
                ball.hit = false;
                ball.time = tsec;
                ball.x = calculateHorizontalPosition(start.cx,ball.vx,tsec,scale);
                ball.y = calculateVerticalPosition(start.cy,ball.vy,tsec,scale);

                if(ball.type == "perfect_ball"){
                    /**
                    play_field.select("#PerfectBallCurve").append("circle")
                        .attr("class", "circleCurve")
                        .attr("cx", x)
                        .attr("cy", y)
                        .attr("r", 1)
                        .style("fill","red")
                        .attr("opacity",0.8);**/
                    return "0";
                }else{
                    play_field.select("#Curve"+ball.id).append("circle")
                        .attr("class", "CircleCurve")
                        .attr("cx", ball.x)
                        .attr("cy", ball.y)
                        .attr("r", 1)
                        .attr("opacity",0.2);
                }

                if(!handle_hit){
                    if (targetBox.intersects(new collisionBox(self))) {
                        ball.hit = true;
                    }
                    return "1";
                }

                if(x > field.width+ball.r || y > field.height+ball.r ){
                    noHit.style("opacity", 1);
                    ball_shapes.interrupt("ballAnimation");
                    return "0";
                }
                if (targetBox.intersects(new collisionBox(self))) {
                    Hit.style("opacity", 1);
                    ball.hit = true;
                    ball_shapes.interrupt("ballAnimation");
                    return "0";
                }

                return "1";
            }
        }).on("end", function (ball) {
            if(end_callback){
                end_callback(ball);
            }
        }).on("interrupt", function (ball) {
            if (end_callback) {
                end_callback(ball);
            }
        });
    }

    this.hideFeedback = function(){
        Hit.style("opacity", 0);
        noHit.style("opacity", 0);
    }

    this.isHit = function(){
        return Hit.style("opacity");
    }

    this.getSvg = function(){
        return svg;
    }

    this.getPlayField = function(){
        return play_field;
    }
    this.getField = function(){
        return field;
    }
    this.getStart = function(){
        return start;
    }
    this.getScale = function(){
        return scale;
    }
    this.getTargetBox = function(){
        return targetBox;
    }
    this.getCamera = function(){
        return camera;
    }
}

