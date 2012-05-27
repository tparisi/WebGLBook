// Constructor
ModelViewer = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ModelViewer.prototype = new Sim.App();

// Our custom initializer
ModelViewer.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a headlight to show off the model
	this.headlight = new THREE.DirectionalLight( 0xffffff, 1);
	this.headlight.position.set(0, 0, 1);
	this.scene.add(this.headlight);	
	
	var amb = new THREE.AmbientLight( 0xffffff );
	this.scene.add(amb);
	
	this.createCameraControls();
}

ModelViewer.prototype.addModel = function(model)
{
    this.addObject(model);    
}

ModelViewer.prototype.removeModel = function(model)
{	
    this.removeObject(model);    
}


ModelViewer.prototype.createCameraControls = function()
{
	var controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
	var radius = ModelViewer.CAMERA_RADIUS;
	
	controls.rotateSpeed = ModelViewer.ROTATE_SPEED;
	controls.zoomSpeed = ModelViewer.ZOOM_SPEED;
	controls.panSpeed = ModelViewer.PAN_SPEED;
	controls.dynamicDampingFactor = ModelViewer.DAMPING_FACTOR;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;

	controls.minDistance = radius * ModelViewer.MIN_DISTANCE_FACTOR;
	controls.maxDistance = radius * ModelViewer.MAX_DISTANCE_FACTOR;

	this.controls = controls;
}

ModelViewer.prototype.update = function()
{
	// Update the camera controls
	if (this.controls)
	{
		this.controls.update();
	}
	
	// Update the headlight to point at the model
	var normcamerapos = this.camera.position.clone().normalize();
	this.headlight.position.copy(normcamerapos);

	Sim.App.prototype.update.call(this);
}


ModelViewer.CAMERA_RADIUS = 5;
ModelViewer.MIN_DISTANCE_FACTOR = 1.1;
ModelViewer.MAX_DISTANCE_FACTOR = 10;
ModelViewer.ROTATE_SPEED = 1.0;
ModelViewer.ZOOM_SPEED = 3;
ModelViewer.PAN_SPEED = 0.2;
ModelViewer.DAMPING_FACTOR = 0.3;
