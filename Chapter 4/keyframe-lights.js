// Constructor
LightsApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
LightsApp.prototype = new Sim.App();

// Our custom initializer
LightsApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
	this.camera.position.z = 11;
	
	this.createObjects();
	this.createAnimations();
}

LightsApp.prototype.createObjects = function()
{
    // Create a group to hold the bust
	var bodygroup = new THREE.Object3D;
    // Add the top level object
    this.root.add(bodygroup);	
	this.bodygroup = bodygroup;
	
	var that = this;
	// GREAT Head model - http://www.ir-ltd.net/infinite-3d-head-scan-released
	var url = '../models/leeperrysmith/LeePerrySmith.js';
	var loader = new THREE.JSONLoader;
	loader.load(url, function (data) {
		that.handleLoaded(data)
	});
	
	var directionalLight = new THREE.DirectionalLight( 0xffeedd, 1 );
	directionalLight.position.set(0, 0, 1).normalize();
	this.root.add( directionalLight );
	this.directionalLight = directionalLight;

	var pointLight = new THREE.PointLight( 0x00ff00, 1, 10 );
	pointLight.position.set(10, 10, 10);
	this.root.add( pointLight );
	this.pointLight = pointLight;

	var spotLight = new THREE.SpotLight( 0x000000, 1, 10 );
	spotLight.position.set(-10, 10, 0);
	this.root.add( spotLight );
	this.spotLight = spotLight;

	
}

LightsApp.prototype.handleLoaded = function(geometry)
{
	if (geometry)
	{
		geometry.computeTangents();

		var material = 	new THREE.MeshPhongMaterial(
				{ 	map : THREE.ImageUtils.loadTexture( "../models/leeperrysmith/Map-COL.jpg" ), 
					ambient: 0xFFFFFF
				}
				);
		
		mesh = new THREE.Mesh( geometry, material );

	    this.bodygroup.add(mesh);
	    this.material = material;
	}	
}

LightsApp.prototype.createAnimations = function()
{
	this.directionalAnimator = new Sim.KeyFrameAnimator;
	this.directionalAnimator.init({ 
		interps:
			[
			    { 
			    	keys:[0, .25, .5, .75, 1], 
			    	values:[
			    	        { intensity : 1},
			    	        { intensity : 0.75},
			    	        { intensity : 0.5},
			    	        { intensity : 0.25},
			    	        { intensity : 1},
			    	        ],
			    	target:this.directionalLight
			    }, 
			],
		loop: true,
		duration:LightsApp.animation_time
	});

	this.addObject(this.directionalAnimator);    

	this.pointLightAnimator = new Sim.KeyFrameAnimator;
	this.pointLightAnimator.init({ 
		interps:
			[
			    { 
			    	keys:[0, .25, .5, .75, 1], 
			    	values:[
			    	        { distance : 10},
			    	        { distance : 20},
			    	        { distance : 30},
			    	        { distance : 20},
			    	        { distance : 10},
			    	        ],
			    	target:this.pointLight
			    }, 
			],
		loop: true,
		duration:LightsApp.animation_time
	});

	this.addObject(this.pointLightAnimator);    

	this.spotLightAnimator = new Sim.KeyFrameAnimator;
	this.spotLightAnimator.init({ 
		interps:
			[
			    { 
			    	keys:[0, .25, .5, .75, 1], 
			    	values:[
			    	        { r : 0, b : 0},
			    	        { r : .5, b : .5},
			    	        { r : 1, b : 1},
			    	        { r : .5, b : .5},
			    	        { r : 0, b : 0},
			    	        ],
			    	target:this.spotLight.color
			    }, 
			],
		loop: true,
		duration:LightsApp.animation_time
	});

	this.addObject(this.spotLightAnimator);    
}

LightsApp.prototype.animate = function(animator, on)
{
	if (on)
	{
		animator.start();
	}
	else
	{
		animator.stop();
	}
}

LightsApp.prototype.update = function()
{
	this.root.rotation.y += 0.001;
	Sim.App.prototype.update.call(this);
}

LightsApp.prototype.setAnimateDirectionalLight = function(val)
{
	this.animate(this.directionalAnimator, val);
}

LightsApp.prototype.setAnimatePointLight = function(val)
{
	this.animate(this.pointLightAnimator, val);
}

LightsApp.prototype.setAnimateSpotLight = function(val)
{
	this.animate(this.spotLightAnimator, val);
}

LightsApp.animation_time = 3333;
