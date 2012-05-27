function Controls (meter)
{
  var mode = Controls.MODE_RANDOM;
  
  this.start = function ()
  {
    if (mode == Controls.MODE_INCREMENTAL)
        this.incrementalUpdate (meter);
    if (mode == Controls.MODE_RANDOM)
        this.randomUpdate (meter);
  }

  this.stop = function ()
  {
    this.stopAnimation (meter);
  }


  this.incrementalUpdate = function(meter)
  {
    var target = meter.value () < meter.max () ?
  		  meter.max () : meter.min ();

  	meter.animatedUpdate (target, 5000);

  }

  this.randomUpdate = function(meter)
  {
    var target = Math.random () * meter.max ();
    var time = Math.random () * 5000;

    meter.animatedUpdate (target, time);
  }

  this.stopAnimation = function(meter)
  {
  	meter.stopAnimation ();
  }

}

Controls.MODE_INCREMENTAL = 0;
Controls.MODE_RANDOM = 1;
