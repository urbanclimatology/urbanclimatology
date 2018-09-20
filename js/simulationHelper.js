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
