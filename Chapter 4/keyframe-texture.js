// Constructor
TextureAnimationApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
TextureAnimationApp.prototype = new Sim.App();

// Our custom initializer
TextureAnimationApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
	// Some scene lighting
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	this.scene.add( ambientLight );

	this.camera.position.z = 10;
	
    // Create the Head and add it to our sim
    var waterfall = new Waterfall();
    waterfall.init();
    this.addObject(waterfall);
    this.waterfall = waterfall;
    
    this.waterfall.subscribe("complete", this, this.onAnimationComplete)
}

TextureAnimationApp.prototype.handleMouseUp = function(x, y)
{
	this.animating = !this.animating;
	this.waterfall.animate(this.animating);
}

TextureAnimationApp.prototype.onHeadLightAnimationComplete = function()
{
	this.animating = false;
}

// Waterfall class
Waterfall = function()
{
	Sim.Object.call(this);
}

Waterfall.prototype = new Sim.Object();

Waterfall.prototype.init = function()
{
	var group = new THREE.Object3D;
	
	// Great water texture by Patrick Hoesly
	// http://www.flickr.com/photos/zooboing/
	// http://www.flickr.com/photos/zooboing/4441454031/sizes/o/in/photostream/
	// Attribution 2.0 Generic (CC BY 2.0) 
	var map = THREE.ImageUtils.loadTexture("../images/4441454031_7772f8351e_o.jpg");
    map.wrapS = map.wrapT = true;
    var material = new THREE.MeshBasicMaterial( 
    		{ color: 0x80aaaa, opacity: .6, transparent: true, map : map } );
	
	var geometry = new THREE.PlaneGeometry(2, 6);
    var mesh = new THREE.Mesh(geometry, material);
    
    group.add(mesh);
    var cliffmap = THREE.ImageUtils.loadTexture("../images/8890.jpg");
    cliffmap.repeat.set(4,3);
    cliffmap.wrapS = cliffmap.wrapT = true;
    var material = new THREE.MeshBasicMaterial( 
    		{ color: 0xaaaaaa, opacity: 1, transparent: false, map : cliffmap } );
	
	var geometry = new THREE.PlaneGeometry(5, 6);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -.01;
    group.add(mesh);

    group.rotation.x = -Math.PI / 12;
    
    this.texture = map;
    this.setObject3D(group);
    this.createAnimation();
}

Waterfall.prototype.createAnimation = function()
{
	this.animator = new Sim.KeyFrameAnimator;
	this.animator.init({ 
		interps:
			[
			    { 
			    	keys:[0, 1], 
			    	values:[
			    	        { y: 1},
			    	        { y: 0},
			    	        ],
			    	target:this.texture.offset
			    }, 
			],
		loop: true,
		duration:Waterfall.animation_time
	});

	this.animator.subscribe("complete", this, this.onAnimationComplete);
	
	this.addChild(this.animator);    
}

Waterfall.prototype.animate = function(on)
{
	if (on)
	{
	   this.animator.start();
	}
	else
	{
		this.animator.stop();
	}
}

Waterfall.prototype.onAnimationComplete = function()
{
	this.publish("complete");
}

Waterfall.animation_time = 3300;
