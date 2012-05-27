// Constructor
SceneViewer = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
SceneViewer.prototype = new Sim.App();

// Our custom initializer
SceneViewer.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a headlight to show off the model
	this.headlight = new THREE.DirectionalLight( 0xffffff, 1);
	this.headlight.position.set(0, 0, 1);
	this.scene.add(this.headlight);	

	this.camera.position.set(-20, 3, 0);	
	this.root.rotation.y = -Math.PI / 2;

	this.camera.lookAt(this.root.position);
	this.createGrid();
	this.createCameraControls();
}

SceneViewer.prototype.addContent = function(content)
{	
	this.root.add(content.object3D);	
}

SceneViewer.prototype.createGrid = function()
{
	var line_material = new THREE.LineBasicMaterial( { color: 0xaaaaaa, opacity: 0.8 } ),
		geometry = new THREE.Geometry(),
		floor = 0, step = 1, size = 66;
	
	for ( var i = 0; i <= size / step * 2; i ++ )
	{
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
	
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
	}
	
	var grid = new THREE.Line( geometry, line_material, THREE.LinePieces );

	this.root.add(grid);
}

SceneViewer.prototype.createCameraControls = function()
{
	// Set up the FP controls
	var controls = new THREE.FirstPersonControls( this.camera );

	controls.movementSpeed = 10;
	controls.lookSpeed = 0.01;
	
	// Don't allow tilt up/down
	controls.lookVertical = false;

	this.controls = controls;
	
	this.clock = new THREE.Clock();
}

SceneViewer.prototype.update = function()
{
	// Update the camera controls
	this.controls.update(this.clock.getDelta());

	// Update the headlight to point at the model
	var normcamerapos = this.camera.position.clone().normalize();
	this.headlight.position.copy(normcamerapos);

	Sim.App.prototype.update.call(this);
}

