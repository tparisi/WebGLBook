// TBE JS library - General utility methods
//
var TBE = {
  CreateCanvasElement: function ()
  {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    return canvas;
  },

  CreateSquareCanvasElement: function (size)
  {
    var canvas = TBE.CreateCanvasElement ();

    canvas.setAttribute ('width', size);
    canvas.setAttribute ('height', size);

    return canvas;
  },

  // Get a Canvas context, given an element.
  // Accepts either an element ID or a DOM object.
  //
  GetElement2DContext: function (element)
  {
    if (typeof (element) != 'object')
      element = document.getElementById (element);

    if (element && element.getContext)
      return element.getContext('2d');

    return null;
  },

  // Clear a canvas, per w3c specification.
  // Accepts either an element ID or a DOM object.
  //
  ClearCanvas: function (element)
  {
    if (typeof (element) != 'object')
      element = document.getElementById(element);

    if (element)
      element.setAttribute ('width', element.getAttribute ('width'));
  },

  defaultView: null, // Cache defaultView (like jQuery does)
  GetElementComputedStyle: function (element)
  {
    if (!this.defaultView) this.defaultView = document.defaultView; 
    if (this.defaultView && this.defaultView.getComputedStyle)
      return this.defaultView.getComputedStyle (element, null);

    return null;
  },

  // Convert degrees to radians
  //
  Deg2Rad: function (theta)
  {
    return theta * Math.PI / 180.0;
  }
};
