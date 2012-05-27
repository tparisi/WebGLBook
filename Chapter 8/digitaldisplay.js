// Original code shared in the public domain on the 'net by <anonymous>
// Further work by vjt@openssl.it - http://sindro.me/
//
function DigitalDisplay (options)
{
  var element = options.element;
  var width = options.width || 300;

  var Color = {
    placeholders: options.placeholders || 'Gray',
    digits:       options.digits       || 'Gray'
  };

  var xScale = options.xScale || 0.6;
  var yScale = options.yScale || 0.8;

  var context = TBE.GetElement2DContext (element);

  var DigitsSegments = [
    // 
    //     1
    //     --
    //  2 |  | 4
    //     --  8
    // 16 |  | 32
    //     --  
    //     64
    1 | 2 | 4 | 16 | 32 | 64,
    4 | 32,
    1 | 4 | 8 | 16 | 64,
    1 | 4 | 8 | 32 | 64,
    2 | 4 | 8 | 32,
    1 | 2 | 8 | 32 | 64,
    1 | 2 | 8 | 16 | 32 | 64,
    1 | 4 | 32,
    1 | 2 | 4 | 8 | 16 | 32 | 64,
    1 | 2 | 4 | 8 | 32 | 64
  ];

  this.clear = function ()
  {
    TBE.ClearCanvas (element);
  }
  
  this.drawNumber = function (value, len, y, height)
  {
    var segs = createSegments (height);
    var fixv = Math.round (value);
    var decv = (value - fixv) * 100;

    context.fillStyle = Color.placeholders;
    context.globalAlpha = 0.15;

    // Compute the increment for each digit.
    var incr = height * xScale;

    // offset relative to mid point of width
    var off = ((width - (incr * len)) / 2.0);

    // Draw shadow display
    for (var n = 0; n < len; n++)
    {
      drawSingleDigit (segs, 127, off, y);
      off += incr;
    }

    context.fillStyle = Color.digits;
    context.globalAlpha = 0.80;
    for (var n = 0; n < len; n++)
    {
      off -= incr;
      drawSingleDigit (segs, DigitsSegments[(fixv % 10)], off, y);
      fixv = Math.floor (fixv / 10.0);
      // Perform the check here so we output a 0
      if (fixv == 0)
        break;
    }
  }

  function drawSingleDigit (segs, bits, x, y)
  {
    for (var n = 0; n < 7; n++)
    {
      if (bits & (1 << n))
      context.fillPolygon (offsetPolygon (x, y, segs[n]));
    }
  }

  function createSegments (height)
  {
    var _x = function (xx) { return xx * height * xScale; }
    var _y = function (yy) { return yy * height * yScale; }
    var segments =
    [ // 1 Upper --
      [
        _x (0.28), _y (0.08),
        _x (1.00), _y (0.08),
        _x (0.88), _y (0.15),
        _x (0.38), _y (0.15),
        _x (0.28), _y (0.08)
      ],
      // 2 Left Upper |
      [
        _x (0.30), _y (0.49),
        _x (0.18), _y (0.52),
        _x (0.26), _y (0.10),
        _x (0.36), _y (0.17),
        _x (0.30), _y (0.49)
      ],
      // 4 Right Upper |
      [
        _x (1.00), _y (0.10),
        _x (0.93), _y (0.52),
        _x (0.84), _y (0.49),
        _x (0.90), _y (0.17),
        _x (1.00), _y (0.11)
      ],
      // 8 Middle --
      [
        _x (0.20), _y (0.54),
        _x (0.31), _y (0.50),
        _x (0.83), _y (0.50),
        _x (0.90), _y (0.54),
        _x (0.82), _y (0.56),
        _x (0.29), _y (0.56),
        _x (0.20), _y (0.54)
      ],
      // 16 Left Lower |
      [
        _x (0.22), _y (0.91),
        _x (0.10), _y (0.98),
        _x (0.17), _y (0.55),
        _x (0.28), _y (0.59),
        _x (0.22), _y (0.91)
      ],
      // 32 Right Lower |
      [
        _x (0.92), _y (0.55),
        _x (0.87), _y (0.98),
        _x (0.78), _y (0.92),
        _x (0.82), _y (0.59),
        _x (0.92), _y (0.55)
      ],
      // 64 Lower --
      [
        _x (0.74), _y (0.93),
        _x (0.84), _y (1.00),
        _x (0.13), _y (1.00),
        _x (0.22), _y (0.93),
        _x (0.74), _y (0.93)
      ]
    ];

    return segments;
  }

  function offsetPolygon (x, y, points)
  {
    var npoints = points.length;
    if (npoints & 1)
      npoints--;
    var result = new Array ();
    for (var n = 0; n < npoints / 2; n++)
    {
      result[n*2+0] = x + points[n*2+0];
      result[n*2+1] = y + points[n*2+1];
    }
    return result;
  }
}
