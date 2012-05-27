// Constructor
OverlayApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
OverlayApp.prototype = new Sim.App();

// Our custom initializer
OverlayApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a point light to show off the KeyFrameBall
	var light = new THREE.PointLight( 0xffffff, 1, 20);
	light.position.set(0, 0, 10);
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1);
	this.scene.add(light);
	
	this.camera.position.z = 6.667;
	
    // Create the KeyFrameBall and add it to our sim
    var keyFrameBall = new KeyFrameBall();
    keyFrameBall.init();
    this.addObject(keyFrameBall);
    
    this.keyFrameBall = keyFrameBall;
    this.animating = false;
    this.keyFrameBall.subscribe("complete", this, this.onAnimationComplete);
    
    this.tracker = new Tracker;
    this.tracker.init(this.keyFrameBall);
    this.addObject(this.tracker);
}

OverlayApp.prototype.handleMouseUp = function(x, y)
{
	this.animating = !this.animating;
	this.keyFrameBall.animate(this.animating);
}

OverlayApp.prototype.onAnimationComplete = function()
{
	this.animating = false;
}

OverlayApp.trackPosition = false;
OverlayApp.animation_time = 3000;

// Custom KeyFrameBall class
KeyFrameBall = function()
{
	Sim.Object.call(this);
}

KeyFrameBall.prototype = new Sim.Object();

KeyFrameBall.prototype.init = function()
{
    // Create our KeyFrameBall
    var geometry = new THREE.CylinderGeometry(.5, .5, 2, 32, 32);
    // Nice ball texture from http://www.flickr.com/photos/stevekin/4306285919/
    var material = new THREE.MeshPhongMaterial( 
    		{ map: THREE.ImageUtils.loadTexture( "../images/4306285919_46b9d8e4c3_z.jpg" )} );
    var mesh = new THREE.Mesh( geometry, material ); 
    mesh.position.set(-2, 0, 2);

    // Tell the framework about our object
    this.setObject3D(mesh);
    
    this.animator = new Sim.KeyFrameAnimator;
    this.animator.init({ 
    	interps:
    		[ 
    	    { keys:KeyFrameBall.positionKeys, values:KeyFrameBall.positionValues, target:this.object3D.position },
    	    { keys:KeyFrameBall.rotationKeys, values:KeyFrameBall.rotationValues, target:this.object3D.rotation } 
    		],
    	loop: OverlayApp.loopAnimation,
    	duration:OverlayApp.animation_time
    });

    this.addChild(this.animator);    
    this.animator.subscribe("complete", this, this.onAnimationComplete);
}

KeyFrameBall.prototype.animate = function(on)
{
	if (on)
	{
		this.animator.loop = OverlayApp.loopAnimation;
	    this.animator.start();
	}
	else
	{
		this.animator.stop();
	}
}

KeyFrameBall.prototype.onAnimationComplete = function()
{
	this.publish("complete");
}

KeyFrameBall.positionKeys = [0, .25, .75, 1];
KeyFrameBall.positionValues = [ { x : -2, y: 0, z : 2}, 
                        { x: 0, y: 1, z: 0},
                        { x: 2, y: 0, z: -2},
                        { x : -2, y: 0, z : 2}
                        ];
KeyFrameBall.rotationKeys = [0, .5, 1];
KeyFrameBall.rotationValues = [ { z: 0 }, 
                                { z: Math.PI},
                                { z: Math.PI * 2 },
                                ];

//Custom Tracker class
Tracker = function()
{
	Sim.Object.call(this);
}

Tracker.prototype = new Sim.Object();

Tracker.prototype.init = function(object)
{
	this.object = object;
	this.position = new THREE.Vector3();
	this.projector = null;
	this.camera = null;
}

Tracker.prototype.update = function()
{
	if (!this.projector)
	{
		var app = this.object.getApp();
		this.projector = app.projector;
		this.camera = app.camera;
		this.container = app.container;
		this.renderer = app.renderer;
	}
	
	var mat = this.object.object3D.matrixWorld;
	var pos = new THREE.Vector3();
	pos = mat.multiplyVector3(pos);

	if (this.position.x != pos.x ||
			this.position.y != pos.y ||
			this.position.z != pos.z)
	{
		console.log("Object position: " + pos.x + ", " + pos.y + ", " + pos.z);
		this.position = pos;
		var projected = this.position.clone();
		this.projector.projectVector(projected, this.camera);

		var eltx = (1 + projected.x) * this.container.offsetWidth / 2 ;
		var elty = (1 - projected.y) * this.container.offsetHeight / 2;

		var offset = $(this.renderer.domElement).offset();	
		eltx += offset.left;
		elty += offset.top;
		
		console.log("Projected position: " + projected.x + ", " + projected.y + ", " + projected.z);
		console.log("xy: " + eltx + ", " + elty);
		
		var trackbox = document.getElementById("trackbox");
		trackbox.style.left = eltx + "px";
		trackbox.style.top = elty + "px";
		
		trackbox.innerHTML = "" + Math.floor(eltx) + ", " + Math.floor(elty);
	}
	
	Sim.Object.prototype.update.call(this);
}

