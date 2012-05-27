// KeyFrameAnimator class
// Construction/initialization
Sim.KeyFrameAnimator = function() 
{
    Sim.Object.call();
	    		
	this.interps = [];
	this.running = false;
}

Sim.KeyFrameAnimator.prototype = new Sim.Object;
	
Sim.KeyFrameAnimator.prototype.init = function(param)
{
	param = param || {};
	
	if (param.interps)
	{
		this.createInterpolators(param.interps);
	}	    		

	this.duration = param.duration ? param.duration : Sim.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
}

Sim.KeyFrameAnimator.prototype.createInterpolators = function(interps)
{
	var i, len = interps.length;
	for (i = 0; i < len; i++)
	{
		var param = interps[i];
		var interp = new Sim.Interpolator();
		interp.init({ keys: param.keys, values: param.values, target: param.target });
		this.interps.push(interp);
	}
}

// Start/stop
Sim.KeyFrameAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
}

Sim.KeyFrameAnimator.prototype.stop = function()
{
	this.running = false;
	this.publish("complete");
}

// Update - drive key frame evaluation
Sim.KeyFrameAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;

	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		this.publish("complete");
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(1);
		}
		return;
	}
	else
	{
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(fract);
		}
	}
}
// Statics
Sim.KeyFrameAnimator.default_duration = 1000;

//Interpolator class
//Construction/initialization
Sim.Interpolator = function() 
{
 Sim.Object.call();
	    		
	this.keys = [];
	this.values = [];
	this.target = null;
	this.running = false;
}

Sim.Interpolator.prototype = new Sim.Object;
	
Sim.Interpolator.prototype.init = function(param)
{
	param = param || {};
	
	if (param.keys && param.values)
	{
		this.setValue(param.keys, param.values);
	}	    		

	this.target = param.target ? param.target : null;
}

Sim.Interpolator.prototype.setValue = function(keys, values)
{
	this.keys = [];
	this.values = [];
	if (keys && keys.length && values && values.length)
	{
		this.copyKeys(keys, this.keys);
		this.copyValues(values, this.values);
	}
}

//Copying helper functions
Sim.Interpolator.prototype.copyKeys = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		to[i] = from[i];
	}
}

Sim.Interpolator.prototype.copyValues = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		var val = {};
		this.copyValue(from[i], val);
		to[i] = val;
	}
}

Sim.Interpolator.prototype.copyValue = function(from, to)
{
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		to[ property ] = from[ property ];
	}
}

//Interpolation and tweening methods
Sim.Interpolator.prototype.interp = function(fract)
{
	var value;
	var i, len = this.keys.length;
	if (fract == this.keys[0])
	{
		value = this.values[0];
	}
	else if (fract >= this.keys[len - 1])
	{
		value = this.values[len - 1];
	}

	for (i = 0; i < len - 1; i++)
	{
		var key1 = this.keys[i];
		var key2 = this.keys[i + 1];

		if (fract >= key1 && fract <= key2)
		{
			var val1 = this.values[i];
			var val2 = this.values[i + 1];
			value = this.tween(val1, val2, (fract - key1) / (key2 - key1));
		}
	}
	
	if (this.target)
	{
		this.copyValue(value, this.target);
	}
	else
	{
		this.publish("value", value);
	}
}

Sim.Interpolator.prototype.tween = function(from, to, fract)
{
	var value = {};
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		var range = to[property] - from[property];
		var delta = range * fract;
		value[ property ] = from[ property ] + delta;
	}
	
	return value;
}
