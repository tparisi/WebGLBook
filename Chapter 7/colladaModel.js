//Custom COLLADA model class
ColladaModel = function()
{
	Sim.Object.call(this);
}

ColladaModel.prototype = new Sim.Object();

ColladaModel.prototype.init = function(param)
{
	var group = new THREE.Object3D;

	var that = this;

	var url = param.url || "";
	if (!url)
		return;

	var scale = param.scale || 1;
	
	this.scale = new THREE.Vector3(scale, scale, scale);
	var loader = new THREE.ColladaLoader();
	loader.load( url, function( data ) { 
		that.handleLoaded(data) } );

    // Tell the framework about our object
    this.setObject3D(group);

    // Init animation state
    this.skin = null;
	this.frame = 0;
	this.animating = false;
    this.frameRate = ColladaModel.default_frame_rate;
    this.animate(true);
}


ColladaModel.prototype.handleLoaded = function(data)
{
	if (data)
	{
	    var model = data.scene;
	    // This model in cm, we're working in meters, scale down
	    model.scale.copy(this.scale);
	
	    this.object3D.add(model);
	    
	    // Any skinning data? Save it away
	    this.skin = data.skins[0];
	}	
}

ColladaModel.prototype.animate  = function(animating)
{
	if (this.animating == animating)
	{
		return;
	}
	
	this.animating = animating;
	if (this.animating)
	{
		this.frame = 0;
		this.startTime = Date.now();
	}
}

ColladaModel.prototype.update = function()
{
	Sim.Object.prototype.update.call(this);
	
	if (!this.animating)
		return;
	
	if ( this.skin )
	{
    	var now = Date.now();
    	var deltat = (now - this.startTime) / 1000;
    	var fract = deltat - Math.floor(deltat);
    	this.frame = fract * this.frameRate;
		
		for ( var i = 0; i < this.skin.morphTargetInfluences.length; i++ )
		{
			this.skin.morphTargetInfluences[ i ] = 0;
		}

		this.skin.morphTargetInfluences[ Math.floor( this.frame ) ] = 1;
	}
}

ColladaModel.default_frame_rate = 30;

