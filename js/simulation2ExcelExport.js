let Simulation2ExcelExport = function(p_ball,p_balls_data,p_nr_steps,p_duration,p_perfect_ball,p_scale,p_start, p_perfect_vx, p_perfect_vy, p_show_solution,p_show_summary) {
    let ball = p_ball;
    let scale = p_scale;
    let abs_start = p_start;
    let balls_data = p_balls_data;
    let nr_steps = p_nr_steps;
    let duration = p_duration;
    let total_duration = duration*nr_steps;
    let perfect_ball = p_perfect_ball;
    let nr_balls = balls_data.length;
    let perfect_vx = p_perfect_vx;
    let perfect_vy = p_perfect_vy;
    let show_solution = p_show_solution;
    let show_summary = p_show_summary;

    let labels_per_ball = [{
            value: 'Euclidean distance to target picture',
            type: 'string'
    },{
        value: 'x(t) in m',
        type: 'string'
    },{
        value: 'z(t) in m',
        type: 'string'
    },{
        value: 'u(t) in m/s',
        type: 'string'
    },{
        value: 'w(t) in m/s',
        type: 'string'
    }];

    let nr_labels = labels_per_ball.length;

    let addHeaderPart = function(data){
        data.push([{
            value: 'Simualation Data of Step '+(ball.step+1),
            type: 'string'
        }]);

        data.push([{}]);

        return data;
    };

    let addSummaryHeaderPart = function(data){
        data.push([{
            value: 'Results for Simualtion 2',
            type: 'string'
        }]);

        data.push([{
            value: 'Detected horizontal speed u in m/s at start',
            type: 'string'
        }, {
            value: ball.vx,
            type: 'number'
        }]);
        data.push([{
            value: 'Detected vertical speed w in m/s at start',
            type: 'string'
        }, {
            value: ball.vy + 9.81 * duration*(nr_steps-1),
            type: 'number'
        }]);
        data.push([{
            value: 'Euclidean distance to last target picture',
            type: 'string'
        }, {
            value: ball.distanceToOtherBall(perfect_ball)/scale,
            type: 'number'
        }]);

        data.push([{
            value: 'Scale factor from pixel to meter in (px/m)',
            type: 'string'
        }, {
            value: scale,
            type: 'number'
        }]);
        data.push([{
            value: 'Total Time Elapsed',
            type: 'string'
        }, {
            value: duration*nr_steps,
            type: 'number'
        }]);
        data.push([{
            value: 'Number of Steps',
            type: 'string'
        }, {
            value: nr_steps,
            type: 'number'
        }]);
        data.push([{
            value: 'Time per Step',
            type: 'string'
        }, {
            value: duration,
            type: 'number'
        }]);
        data.push([{
            value: 'Successfull Hit',
            type: 'string'
        }, {
            value: ball.hit,
            type: 'string'
        }]);

        data.push([{}]);

        return data;
    };

    let addStepLabels = function(data){
        let labels = [{},{},{}];

        for(step=1;step<=nr_steps;step++){
            labels.push({
                value: 'Step '+step,
                type: 'string'
            });

            for(i=0;i<nr_balls*nr_labels -1;i++){
                labels.push({});
            }

        }

        data.push(labels);
        return data;
    };

    let doForAllBalls = function(data,row,t,picture_step,todo){
        balls = balls_data;
        while(balls && balls.length) {
            selected_ball = {};
            balls.forEach(function(ball){
                if(ball.selected){
                    selected_ball = ball;
                }
                todo(row,ball,t,picture_step);
            });
            balls = selected_ball.children_data;
        }
    };

    let addBallLabels = function(data){
        let labels = [{}];

        labels.push({
            value: 'Ball on Pictures',
            type: 'string'
        });
        labels.push({});
        doForAllBalls(data,labels,0,false,function(labels,ball,t,picture_step){
            let label ='Ball ' + ball.id;
            if(ball.selected){
                label += " (**Selected**)"
            }
            labels.push({
                value: label,
                type: 'string'
            });
            for(i=0;i<nr_labels-1;i++){
                labels.push({});
            }
        });

        data.push(labels);


        return data;
    };

    let addLabels = function(data){
        let labels = [{
            value: 't in s',
            type: 'string'
        }];
        labels.push({
            value: 'x(t) in m',
            type: 'string'
        });
        labels.push({
            value: 'z(t) in m',
            type: 'string'
        });
        doForAllBalls(data,labels,0,false,function(labels,ball,t,pictur_step){
            labels_per_ball.forEach(function(label){
                labels.push(label);
            })
        });
        data.push(labels);

        return data;
    };

    this.export = function(){
        let data = [];
        if(show_summary){
            data = addSummaryHeaderPart(data);
        }else{
            data = addHeaderPart(data);
        }

        data = addStepLabels(data);
        data = addBallLabels(data);
        data = addLabels(data);

        let increment = duration/4;
        let t=-increment;
        let increment_step = 0;
        let picture_step = false;
        while(t<total_duration){
            t=t+increment;
            if(t>total_duration){
                t=total_duration;
            }

            row = [{
                value: t,
                type: 'number'
            }];


            if(Math.abs(t - duration*increment_step) < duration/100){
                if(t != 0){
                    picture_step = true;
                }
                t = duration*increment_step;
                increment_step++;
                row.push({
                    value: calculateAbsolutRealHorizontalPosition(perfect_vx,t,abs_start.cx,abs_start.cx,scale),
                    type: 'number'
                });
                row.push({
                    value: calculateAbsolutRealVerticalPosition(perfect_vy,t,abs_start.cy,abs_start.cy,scale),
                    type: 'number'
                });
            }
            else {
                picture_step = false;
                row.push({});
                row.push({});
            }


            doForAllBalls(data,row,t,picture_step,function(row,ball,t,picture_step){
                rel_t = t - ball.step*duration;
                if( rel_t >= 0 && (Math.abs(rel_t - duration<0.000001)) ){
                    var_ball_x = calculateAbsolutRealHorizontalPosition(ball.vx,rel_t,abs_start.cx,ball.start_x,scale);
                    var_ball_y = calculateAbsolutRealVerticalPosition(ball.vy,rel_t,abs_start.cy,ball.start_y,scale);
                    if(picture_step){
                        perfect_x = calculateAbsolutRealHorizontalPosition(perfect_vx,t,abs_start.cx,abs_start.cx,scale);
                        perfect_y = calculateAbsolutRealVerticalPosition(perfect_vy,t,abs_start.cy,abs_start.cy,scale);

                        if(show_solution){
                            row.push({
                                value: Math.sqrt(Math.pow(var_ball_x-perfect_x,2)+Math.pow(var_ball_y-perfect_y,2)),
                                type: 'number'
                            });
                        }
                        else{
                            row.push({
                                value: "** Todo Calculate Euclidian distance to Picture **",
                                type: 'string'
                            });
                        }
                    }else{
                        row.push({
                            value: "-",
                            type: 'string'
                        });
                    }
                    row.push({
                        value: var_ball_x,
                        type: 'number'
                    });
                    row.push({
                        value: var_ball_y,
                        type: 'number'
                    });
                    row.push({
                        value: ball.vx,
                        type: 'number'
                    });
                    row.push({
                        value: ball.vy - 9.81 * rel_t,
                        type: 'number'
                    });
                }
                else{
                    for(i=0;i<nr_labels;i++){
                        row.push({});
                    }
                }

            });

            data.push(row);
        }


        const config = {
            filename: 'ExportWeatherSimulation1',
            sheet: {
                data: data
            }
        };

        zipcelx(config);
    }
};

