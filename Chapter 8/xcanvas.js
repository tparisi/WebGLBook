(function(){
// Andrea Giammarchi - Mit Style License
var extend = {
    // Circle methods
    circle:function(aX, aY, aDiameter){
        this.ellipse(aX, aY, aDiameter, aDiameter);
    },
    fillCircle:function(aX, aY, aDiameter){
        this.beginPath();
        this.circle(aX, aY, aDiameter);
        this.fill();
    },
    strokeCircle:function(aX, aY, aDiameter){
        this.beginPath();
        this.circle(aX, aY, aDiameter);
        this.stroke();
    },
    // Ellipse methods
    ellipse:function(aX, aY, aWidth, aHeight){
        var hB = (aWidth / 2) * .5522848,
            vB = (aHeight / 2) * .5522848,
            eX = aX + aWidth,
            eY = aY + aHeight,
            mX = aX + aWidth / 2,
            mY = aY + aHeight / 2;
        this.moveTo(aX, mY);
        this.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
        this.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
        this.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
        this.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
        this.closePath();
    },
    fillEllipse:function(aX, aY, aWidth, aHeight){
        this.beginPath();
        this.ellipse(aX, aY, aWidth, aHeight);
        this.fill();
    },
    strokeEllipse:function(aX, aY, aWidth, aHeight){
        this.beginPath();
        this.ellipse(aX, aY, aWidth, aHeight);
        this.stroke();
    },
    polygon:function(pts) {
        var npts = pts.length;
        if (npts & 1) npts--;
        npts /= 2;
        if (npts <= 1)
          return;

        this.moveTo (pts[0], pts[1]);
        for (var n = 1; n < npts; n++)
          this.lineTo (pts[n*2+0], pts[n*2+1]);
    },
    fillPolygon:function(pts) {
        this.beginPath ();
        this.polygon (pts);
        this.fill ();
    },
    strokePolygon:function(pts) {
        this.beginPath ();
        this.polygon (pts);
        this.stroke ();
    },
    boxedArc: function(x, y, w, h, startAngle, sweepAngle, counterClockWise) {
        this.save ();
        this.scale (w / h, h / w);
        this.arc (x+w/2, y+h/2, w/2, startAngle, startAngle + sweepAngle, counterClockWise);
        this.restore ();
    },
    fillBoxedArc: function(x, y, w, h, startAngle, sweepAngle) {
        this.beginPath ();
        this.boxedArc (x, y, w, h, startAngle, sweepAngle, counterClockWise);
        this.fill ();
    },
    strokeBoxedArc: function(x, y, w, h, startAngle, sweepAngle, counterClockWise) {
        this.beginPath ();
        this.boxedArc (x, y, w, h, startAngle, sweepAngle, counterClockWise);
        this.stroke ();
    }
};

for(var key in extend)
    CanvasRenderingContext2D.prototype[key] = extend[key];

var quirks = {
    measureText: function(str) {
        return this.mozMeasureText(str);
    },
    fillText: function(str, x, y) {
        this.beginPath ();
        this.drawText (str, x, y);
        this.fill ();
    },
    strokeText: function (str, x, y) {
        this.beginPath ();
        this.drawText (str, x, y);
        this.stroke ();
    },
    drawText: function (str, x, y) {
        if (this.font)
            this.mozTextStyle = this.font;

        if (this.textAlignment == 'center')
            x -= this.measureText (str) / 2;
        else if (this.textAlignment == 'right')
            x = this.width - this.measureText(str);

        this.save ();
        this.translate (x, y);
        this.mozPathText (str);
        this.restore ();
    }
};

for(var key in quirks) {
    if (!CanvasRenderingContext2D.prototype[key]) {
        CanvasRenderingContext2D.prototype[key] = quirks[key];
    }
}

if(!this.G_vmlCanvasManager)
    G_vmlCanvasManager = {init:function(){}, initElement:function(el){return el}};
})();
