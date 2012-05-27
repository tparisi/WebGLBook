// Constructor
ContextApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ContextApp.prototype = new Sim.App();

// Our custom initializer
ContextApp.prototype.init = function(param)
{
	var debugCanvas = 
	WebGLDebugUtils.makeLostContextSimulatingCanvas(document.createElement( 'canvas' ));

	param.canvas = debugCanvas;
	
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
	this.addContextListener();
	
	this.status = param.status;
}

ContextApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
	this.mesh.rotation.y += 0.01;
}

ContextApp.prototype.createModel = function()
{
	// Create a few graphics objects to demonstrate re-creation on lost context
	var image = "../images/8890.jpg";
	var geometry = new THREE.CubeGeometry(2, 2, 2);
	var material = new THREE.MeshPhongMaterial({color:0xFFFFFF,
		map : THREE.ImageUtils.loadTexture(image)});

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI / 6;
	mesh.rotation.y = Math.PI / 6;
	
	this.scene.add(mesh);
	
	this.mesh = mesh;
}

ContextApp.prototype.handleContextLost = function(e)
{
	// alert("Context lost! " + e);
	this.container.removeChild(this.renderer.domElement);
	this.status.innerHTML = "Context lost, re-initializing...";
	this.init( { container:this.container, status: this.status } );
	this.status.innerHTML += "done.";
}

ContextApp.prototype.addContextListener = function()
{
	var that = this;
	this.renderer.domElement.addEventListener("webglcontextlost", 
			function(e) { 
				that.handleContextLost(e);
				}, 
			false);
}

ContextApp.prototype.handleMouseDown = function(x, y)
{
	this.status.innerHTML = "";
	this.renderer.domElement.loseContext();
}
