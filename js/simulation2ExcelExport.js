let Simulation2ExcelExport = function(p_ball,p_balls_data,p_nr_steps,p_duration,p_perfect_ball,p_scale,p_start, p_perfect_vx, p_perfect_vy) {
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

    let labels_per_ball = [{
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
    }];

    let nr_labels = labels_per_ball.length;

    let addHeaderPart = function(data){
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
            value: 'Euklidsche Distanz to last target picture',
            type: 'string'
        }, {
            value: ball.distanceToOtherBall(perfect_ball),
            type: 'string'
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

    let doForAllBalls = function(data,row,t,todo){
        balls = balls_data;
        while(balls && balls.length) {
            selected_ball = {};
            balls.forEach(function(ball){
                if(ball.selected){
                    selected_ball = ball;
                }
                todo(row,ball,t);
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
        doForAllBalls(data,labels,0,function(labels,ball,t){
            labels.push({
                value: 'Ball ' + ball.id,
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
        doForAllBalls(data,labels,0,function(labels,ball,t){
            labels_per_ball.forEach(function(label){
                labels.push(label);
            })
        });
        data.push(labels);

        return data;
    };

    this.export = function(){
        console.log(ball,balls_data,nr_steps,duration);

        let data = [];
        data = addHeaderPart(data);
        data = addStepLabels(data);
        data = addBallLabels(data);
        data = addLabels(data);

        let increment = duration/4;
        let t=-increment;
        let increment_step = 0;
        while(t<total_duration){
            t=t+increment;
            if(t>total_duration){
                t=total_duration;
            }

            row = [{
                value: t,
                type: 'number'
            }];

            console.log("Abs",Math.abs(t % duration) )
            if(Math.abs(t % duration) < duration/100){
                t = duration*increment_step;
                increment_step++;
                row.push({
                    value: calculateAbsolutRealHorizontalPosition(perfect_vx,t,abs_start.x,abs_start.x,scale),
                    type: 'number'
                });
                row.push({
                    value: calculateAbsolutRealVerticalPosition(perfect_vy,t,abs_start.y,abs_start.y,scale),
                    type: 'number'
                });
            }
            else {
                row.push({});
                row.push({});
            }


            doForAllBalls(data,row,t,function(row,ball,t){
                rel_t = t - ball.step*duration;
                if( rel_t >= 0 && rel_t <= duration ){
                    row.push({
                        value: calculateAbsolutRealHorizontalPosition(ball.vx,rel_t,abs_start.x,ball.start_x,scale),
                        type: 'number'
                    });
                    row.push({
                        value: calculateAbsolutRealVerticalPosition(ball.vy,rel_t,abs_start.y,ball.start_y,scale),
                        type: 'number'
                    });
                    row.push({
                        value: ball.vx,
                        type: 'number'
                    });
                    row.push({
                        value: ball.vy - 9.81 * t,
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

