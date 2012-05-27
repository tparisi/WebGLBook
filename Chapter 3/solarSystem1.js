// Constructor
SolarSystemApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
SolarSystemApp.prototype = new Sim.App();

// Our custom initializer
SolarSystemApp.prototype.init = function(container)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, container);
	
    // Create the Earth and add it to our sim
    var earth = new Earth();
    earth.init({animateOrbit:true});
    this.addObject(earth);
    
    // Exaggerate the size a bit... we're far away
    //earth.setScale(2, 2, 2);
    
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);

    // Move the camera back so we can see our Solar System
    this.camera.position.set(0, 0, 66);

    // Tilt the whole solar system toward the camera a bit
    this.root.rotation.x = Math.PI / 6;
    
	this.lastX = 0;
	this.lastY = 0;
	this.mouseDown = false;
}

SolarSystemApp.prototype.handleMouseMove = function(x, y)
{
	if (this.mouseDown)
	{
		var dx = x - this.lastX;
		if (Math.abs(dx) > SolarSystemApp.MOUSE_MOVE_TOLERANCE)
		{
			this.root.rotation.y -= (dx * 0.01);
		}
		this.lastX = x;
		
		return;
		
		var dy = y - this.lastY;
		if (Math.abs(dy) > SolarSystemApp.MOUSE_MOVE_TOLERANCE)
		{
			this.root.rotation.x += (dy * 0.01);
			
			// Clamp to some outer boundary values
			if (this.root.rotation.x < 0)
				this.root.rotation.x = 0;
			
			if (this.root.rotation.x > SolarSystemApp.MAX_ROTATION_X)
				this.root.rotation.x = SolarSystemApp.MAX_ROTATION_X;
			
		}
		this.lastY = y;
		
	}	
}

SolarSystemApp.prototype.handleMouseDown = function(x, y)
{
	this.lastX = x;
	this.lastY = y;
	this.mouseDown = true;
}

SolarSystemApp.prototype.handleMouseUp = function(x, y)
{
	this.lastX = x;
	this.lastY = y;
	this.mouseDown = false;
}

SolarSystemApp.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;

	this.camera.position.z -= dx;
}

SolarSystemApp.MOUSE_MOVE_TOLERANCE = 0;
SolarSystemApp.MAX_ROTATION_X = Math.PI / 2;

