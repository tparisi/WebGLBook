// Custom VideoPlayer class
VideoPlayer = function()
{
	Sim.Object.call(this);
}

VideoPlayer.prototype = new Sim.Object();

VideoPlayer.prototype.init = function(param)
{
	// Save away init params
	var video = param.video || "";
	if (!video)
		return;
	
	var size = param.size || 2;
	
	this.animateRollover = param.animateRollover;
	
	var texture = new THREE.Texture(video);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	// Create our VideoPlayer
	var group = new THREE.Object3D;
    var geometry = new THREE.CubeGeometry(size, size, size);
    var material = new THREE.MeshLambertMaterial( 
    		{ map:texture } );
    var mesh = new THREE.Mesh( geometry, material ); 
    group.add(mesh);
    
    // Tell the framework about our object
    this.setObject3D(group);
    
    // Save away important objects
    this.video = video;
    this.texture = texture;

    // We'll start out with 'autoplay'
    this.playing = true;

    // Cursor rollover
    this.overCursor = 'pointer';

	// Set up the animation
    this.animator = new Sim.KeyFrameAnimator;
    this.animator.init({ 
    	interps:
    		[ 
    	    { keys:VideoPlayer.rotationKeys, 
    	    	values:VideoPlayer.rotationValues, 
    	    	target:this.object3D.rotation } 
    		],
    	loop: false,
    	duration:VideoPlayer.animation_time
    });
    this.animator.subscribe("complete", this, this.onAnimationComplete);
    this.addChild(this.animator); 
	this.animating = false;

}

VideoPlayer.prototype.update = function()
{
	if (this.playing)
	{
		// Don't update the texture until we have data
		if (this.video.readyState === this.video.HAVE_ENOUGH_DATA)
		{
			if (this.texture)
			{
				this.texture.needsUpdate = true;
			}
		}
	}
	
	Sim.Object.prototype.update.call(this);
}

VideoPlayer.prototype.handleMouseOver = function()
{
	// Do rollover animation if flag is set
	if (this.animateRollover && !this.animating)
	{
		this.animator.start();
		this.publish("over", this.id);
		this.animating = true;
	}
}

VideoPlayer.prototype.onAnimationComplete = function()
{
	this.animating = false;
}

VideoPlayer.prototype.handleMouseUp = function()
{
	// Mouse down/up combo toggles play state
	this.togglePlay();
}

VideoPlayer.prototype.togglePlay = function()
{
	this.playing = !this.playing;
	if (this.playing)
	{
		this.video.play();
	}
	else
	{
		this.video.pause();
	}		
}

VideoPlayer.rotationKeys = [0, .5, 1];
VideoPlayer.rotationValues = [ { y: 0 }, 
                                { y: Math.PI / 2},
                                { y: Math.PI },
                                { y: Math.PI * 3 / 2},
                                { y: Math.PI * 2},
                                ];

VideoPlayer.animation_time = 750;