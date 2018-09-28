let Simulation1 = function() {
    let parent = new BaseSimulation();
    let playField = parent.getPlayField;
    let startPos = parent.getStart;

    this.start = function (vx, vy) {

        let duration = (parent.getField().width/parent.getScale())/vx;
        parent.hideFeedback();
        let ball_data = new Ball("Ball1", startPos().cx,startPos().cy, vx, vy, 10,"black",false);
        let ball = playField().select("#BallCircles").selectAll("BallCircle")
            .data([ball_data])
            .enter()
            .append("circle")
            .attr("cx", function (ball_data) {
                return ball_data.startx;
            })
            .attr("cy", function (ball_data) {
                return ball_data.starty;
            })
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
        let model_x = Math.round(ball.vx * 100) / 100;
        let model_y = Math.round(ball.vy * 100)/100;

        result = "</br></br><p>";
        result += 'Set horizontal speed \\(u_{0}\\) in m/s: '+model_x+"</br>";
        result += 'Set horizontal speed \\(w_{0}\\) in m/s: '+model_y+"</br></br>";
        result += 'Resulting Model:</br>';
        result += "$$\\binom{x(t)}{z(t)}=\\binom{u_{0} * t}{w_{0} - \\frac{1}{2}gt^{2}}=\\binom{"+model_x+" * t}{"+model_y+" - \\frac{1}{2}gt^{2}}$$";
        result += "</p>";

        let content = "";
        if(ball.hit){
            content = "Congratulations, you scored a hit. You may download the data of your shot for further processing."+result;
        }else{
            content = "Unfortunately, you missed. You may download the data of your shot for further processing."+result;
        }
        displayModal("Result",content, function(ball){excelExport(ball)},ball,false);
    }

    let excelExport = function(ball){
        console.log(ball);

        let data = [
            [{
                value: 'Total Time Elapsed',
                type: 'string'
            }, {
                value: ball.time,
                type: 'number'
            }],
            [{
                value: 'Successfull Hit',
                type: 'string'
            }, {
                value: ball.hit,
                type: 'string'
            }],
            [{}],
            [{
                value: 't in s',
                type: 'string'
            },{
                value: 'x(t) in m',
                type: 'string'
            },{
                value: 'y(t) in m',
                type: 'string'
            },{
                value: 'u(t) in m/s',
                type: 'string'
            },{
                value: 'w(t) in m/s',
                type: 'string'
            }]
        ];

        let step = 0.1;
        let t=-step;
        while(t<ball.time){
            t=t+step;
            if(t>ball.time){
                t=ball.time;
            }
            data_step =
                [{
                    value: t,
                    type: 'number'
                },{
                    value: calculateRealHorizontalPosition(ball.vx,t),
                    type: 'number'
                },{
                    value: -1*calculateRealVerticalPosition(ball.vy,t),
                    type: 'number'
                },{
                    value: ball.vx,
                    type: 'number'
                },{
                    value: ball.vy - 9.81 * t,
                    type: 'number'
                }];
            data.push(data_step);
        }


        const config = {
            filename: 'ExportWeatherSimulation1',
            sheet: {
                data: data
            }
        };

        zipcelx(config);
    }


}

simulation1 = new Simulation1();

