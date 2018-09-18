let collisionBox = function(node){
    let coordinates = getRealCoordinates(node);
    this.x1 = coordinates.x;
    this.y1 = coordinates.y;

    this.x2 = this.x1 + node.getBBox().width;
    this.y2 = this.y1 + node.getBBox().height;

    this.intersects = function(other) {
        let x1 = Math.max(this.x1,other.x1);
        let x2 = Math.min(this.x2,other.x2);
        let y1 = Math.max(this.y1,other.y1);
        let y2 = Math.min(this.y2,other.y2);

        return x1 < x2 && y1 < y2;
    }
}

let getRealCoordinates = function(node){
    return {
        x:node.getCTM().a*(node.getCTM().e) + node.getBBox().x,
        y:node.getCTM().d*(node.getCTM().f) + node.getBBox().y
    }
}