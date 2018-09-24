let collisionBox = function(node){
    let coordinates = getRealCoordinates(node);
    this.x1 = coordinates.x;
    this.y1 = coordinates.y;

    this.x2 = coordinates.x2;
    this.y2 = coordinates.y2;

    this.intersects = function(other) {
        let x1 = Math.max(this.x1,other.x1);
        let x2 = Math.min(this.x2,other.x2);
        let y1 = Math.max(this.y1,other.y1);
        let y2 = Math.min(this.y2,other.y2);

        return x1 < x2 && y1 < y2;
    }
}

let getRealCoordinates = function(node){
    x = node.getCTM().a*(node.getCTM().e) + node.getBBox().x;
    y = node.getCTM().d*(node.getCTM().f) + node.getBBox().y;
    return {
        x:x,
        y:y,
        cx:x +node.getBBox().width/2,
        cy:y +node.getBBox().height/2,
        x2:x +node.getBBox().width,
        y2:y +node.getBBox().height,
    }
}

let Ball = function (index, base_vx, base_vy, radius = 10, color="black",randomize = false, variance = 10, step = 0) {
    let vx = base_vx;
    let vy = base_vy;
    if(randomize){
        vx = generateGaussianNormal(base_vx,variance);
        vy = generateGaussianNormal(base_vy,variance);
    }

    return {
        id: index,
        vx: vx,
        vy: vy,
        r: radius,
        color: color,
        children: [],
        step: step
    }
}

// Standard Normal with Müller Transform
function generateGaussianNormal(mean, variance) {
    var u = 0, v = 0;
    while(u === 0) {
        u = Math.random();
    }
    while(v === 0) {
        v = Math.random();
    }
    z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z*variance+mean;
}

function calculateHorizontalPosition(start,speed,t,scale){
    return start + speed * t * scale
}
function calculateVerticalPosition(start,speed,t,scale){
    return start + (-speed * t + 1 / 2 * 9.81 * t * t ) * scale ;
}

function displayModal(title, content, callback_action, callback_data){
    $modal = $("#ResultsModal");
    $modal.find(".modal-title").html(title);
    $modal.find(".modal-body").html(content);
    $modal.find(".modal-action").on( "click", function() {
        callback_action(callback_data);
    });
    $modal.modal('show')
}

function excelExport(ball){
    const config = {
        filename: 'ExportWeatherSimulation1',
        sheet: {
            data: [
                [{
                    value: 't',
                    type: 'string'
                }, {
                    value: 1,
                    type: 'number'
                }, {
                    value: 2,
                    type: 'number'
                }],
                [{
                    value: 'vx',
                    type: 'string'
                }, {
                    value: ball.vx,
                    type: 'number'
                }],
                [{
                    value: 'vy',
                    type: 'string'
                }, {
                    value: ball.vy,
                    type: 'number'
                }]
            ]
        }
    };

    zipcelx(config);
}