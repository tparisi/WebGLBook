// Constructor
DetectorApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
DetectorApp.prototype = new Sim.App();

// Our custom initializer
DetectorApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);

    // Create a light to show off the model
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1);
	this.scene.add(light);	
	
	var amb = new THREE.AmbientLight( 0xffffff );
	this.scene.add(amb);
	
	this.camera.position.set(0, 0, 5);
	
	this.createModel();
}

DetectorApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
	this.mesh.rotation.y += 0.01;
}

DetectorApp.prototype.createModel = function()
{
	var geometry = new THREE.CubeGeometry(2, 2, 2);
	var material = new THREE.MeshPhongMaterial({color:0xFFFFFF});
	
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI / 6;
	mesh.rotation.y = Math.PI / 6;
	
	this.scene.add(mesh);
	
	this.mesh = mesh;
}

