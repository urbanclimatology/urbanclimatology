let collisionBox = function(shape){
    let coordinates = getRealCoordinates(shape);
    this.x1 = coordinates.x;
    this.y1 = coordinates.y;

    this.x2 = this.x1 + shape.node().getBBox().width;
    this.y2 = this.y1 + shape.node().getBBox().height;

    this.intersects = function(other) {
        let x1 = Math.max(this.x1,other.x1);
        let x2 = Math.min(this.x2,other.x2);
        let y1 = Math.max(this.y1,other.y1);
        let y2 = Math.min(this.y2,other.y2);

        return x1 < x2 && y1 < y2;
    }
}

let getRealCoordinates = function(shape){
    return {
        x:shape.node().getCTM().a*(shape.node().getCTM().e) + shape.node().getBBox().x,
        y:shape.node().getCTM().d*(shape.node().getCTM().f) + shape.node().getBBox().y
    }
}