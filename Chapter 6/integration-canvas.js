// Constructor
CanvasApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
CanvasApp.prototype = new Sim.App();

// Our custom initializer
CanvasApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the Player
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1).normalize();
	this.scene.add(light);
	
	this.camera.position.set(0, 0, 7);
	
	this.createCanvas();
}

CanvasApp.prototype.createCanvas = function()
{
	// Create the Canvas and add it to our sim
    var view = new CanvasView();
    var canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    
    var param = { 
    		backgroundColor : 'rgb(255, 255, 255)',
    		textColor : '#000066',
    		} ;
    var program = new PaintCanvasProgram();
    program.init(param);
    
    view.init({ canvas : canvas, program : program });
    this.addObject(view);

    // Make the "canvas" actually look like a canvas - give it some thickness
    var geom = new THREE.CubeGeometry(4, 4, .5);
    var material = new THREE.MeshPhongMaterial({color:0xffffff, ambient:0xffffff});
    var mesh = new THREE.Mesh(geom, material);
    mesh.position.z = - .255;
    view.object3D.add(mesh);

    // Turn the canvas a bit so that we can see the 3D-ness
    view.object3D.rotation.y = Math.PI / 6;
}

CanvasApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
}
