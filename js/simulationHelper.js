let collisionBox = function(shape){
    let ctm = shape.node().getCTM();
    this.x1 = ctm.a*(ctm.e + shape.node().getBBox().x);
    this.y1 = ctm.d*(ctm.f + shape.node().getBBox().y);

    this.x2 = this.x1 + shape.node().getBBox().width;
    this.y2 = this.y1 + shape.node().getBBox().height;

    console.log(this.x1,this.x2,this.y1,this.y2);

    console.log(shape.node().getCTM());
    console.log(shape.node().getScreenCTM());

    this.intersects = function(other) {
        let x1 = Math.max(this.x1,other.x1);
        let x2 = Math.min(this.x2,other.x2);
        let y1 = Math.max(this.y1,other.y1);
        let y2 = Math.min(this.y2,other.y2);

        return x1 < x2 && y1 < y2;
    }
}
