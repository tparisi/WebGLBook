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
	
	this.planets = [];
	this.orbits = [];
	this.lastX = 0;
	this.lastY = 0;
	this.mouseDown = false;
	
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);

    // Are the stars out tonight...?
    var stars = new Stars();
    // Push the stars out past Pluto
    stars.init(Sun.SIZE_IN_EARTHS + SolarSystemApp.EARTH_DISTANCE * SolarSystemApp.PLUTO_DISTANCE_IN_EARTHS);
    this.addObject(stars);
    
    // And on the third day...
	this.createPlanets();
	
    // Move the camera back so we can see our Solar System
    this.camera.position.set(0, 0, Sun.SIZE_IN_EARTHS * 8);
    
    var amb = new THREE.AmbientLight(0x676767);
    this.scene.add(amb);

    // Tilt the whole solar system toward the camera a bit
    this.root.rotation.x = Math.PI / 8;
    //this.root.rotation.z = Math.PI / 8;
    
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
	
	// Clamp to some boundary values
	if (this.camera.position.z < SolarSystemApp.MIN_CAMERA_Z)
		this.camera.position.z = SolarSystemApp.MIN_CAMERA_Z;
	if (this.camera.position.z > SolarSystemApp.MAX_CAMERA_Z)
		this.camera.position.z = SolarSystemApp.MAX_CAMERA_Z;
}

SolarSystemApp.prototype.createPlanets = function()
{	    
	var i, len = SolarSystemApp.planet_specs.length;
	for (i = 0; i < len; i++)
	{
		var spec = SolarSystemApp.planet_specs[i];
		var planet = spec.type ? new spec.type : new Planet;
		
		planet.init({animateOrbit:true, animateRotation: true, showOrbit:true,    	
			distance:spec.distance * SolarSystemApp.EARTH_DISTANCE + Sun.SIZE_IN_EARTHS, 
	    	size:spec.size * SolarSystemApp.EXAGGERATED_PLANET_SCALE, 
	    	period : spec.period,
	    	revolutionSpeed : 0.002,
	    	map : spec.map});
		this.addObject(planet);
		this.planets.push(planet);

		var orbit = new Orbit();
		orbit.init(spec.distance * SolarSystemApp.EARTH_DISTANCE + Sun.SIZE_IN_EARTHS);
		this.addObject(orbit);		
		this.orbits.push(orbit);
	}
}

SolarSystemApp.MOUSE_MOVE_TOLERANCE = 4;
SolarSystemApp.MAX_ROTATION_X = Math.PI / 2;
SolarSystemApp.MAX_CAMERA_Z = Sun.SIZE_IN_EARTHS * 50;
SolarSystemApp.MIN_CAMERA_Z = Sun.SIZE_IN_EARTHS * 3;
SolarSystemApp.EARTH_DISTANCE = 50;
SolarSystemApp.PLUTO_DISTANCE_IN_EARTHS = 77.2;
SolarSystemApp.EARTH_DISTANCE_SQUARED = 45000;
SolarSystemApp.EXAGGERATED_PLANET_SCALE = 5.55;
SolarSystemApp.planet_specs = [
   // Mercury
   { size : 1 / 2.54, distance : 0.4, period : 0.24, map : "../images/Mercury.jpg" },
   // Venus
   { size : 1 / 1.05, distance : 0.7, period : 0.62, map : "../images/venus.jpg"  },
   // Earth
   { type : Earth, size : 1 , distance : 1, period : 1, map : "../images/earth_surface_2048.jpg"  },
   // Mars
   { size : 1 / 1.88, distance : 1.6, period : 1.88, map : "../images/MarsV3-Shaded-2k.jpg"  },
   // Jupiter
   { size : 11.1, distance : 5.2, period : 11.86, map : "../images/realj2k.jpg"  },
   // Saturn
   { type : Saturn, size : 9.41, distance : 10, period : 29.46, map : "../images/saturn_bjoernjonsson.jpg"  },
   // Uranus
   { size : 4, distance : 19.6, period : 84.01, map : "../images/uranus.jpg"  },
   // Neptune
   { size : 3.88, distance : 38.8, period : 164.8, map : "../images/neptune.jpg"  },
   // Pluto - have to exaggerate his size or we'll never see the little guy
   { size : 10 / 5.55, distance : 77.2, period : 247.7, map : "../images/pluto.jpg"  },                            	   
                               ];

