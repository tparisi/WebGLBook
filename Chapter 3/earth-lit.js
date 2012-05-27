// Constructor
EarthApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
EarthApp.prototype = new Sim.App();

// Our custom initializer
EarthApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create the Earth and add it to our sim
    var earth = new Earth();
    earth.init();
    this.addObject(earth);
    
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);
}

// Custom Earth class
Earth = function()
{
	Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function()
{
    // Create our Earth with nice texture
    var earthmap = "../images/earth_surface_2048.jpg";
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial( { map: texture } );
    var mesh = new THREE.Mesh( geometry, material ); 

    // Let's work in the tilt
    mesh.rotation.x = Earth.TILT;
    
    // Tell the framework about our object
    this.setObject3D(mesh);    
}

Earth.prototype.update = function()
{
	// "I feel the Earth move..."
	this.object3D.rotation.y += Earth.ROTATION_Y;
}

Earth.ROTATION_Y = 0.0025;
Earth.TILT = 0.41;

// Custom Sun class
Sun = function()
{
	Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function()
{
    // Create a point light to show off the earth - set the light out back and to left a bit
	var light = new THREE.PointLight( 0xffffff, 2, 100);
	light.position.set(-10, 0, 20);
    
    // Tell the framework about our object
    this.setObject3D(light);    
}
