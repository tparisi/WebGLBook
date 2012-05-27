// Constructor
ExhaustApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ExhaustApp.prototype = new Sim.App();

// Our custom initializer
ExhaustApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a headlight to show off the model
	this.headlight = new THREE.DirectionalLight( 0xffffff, 1);
	this.headlight.position.set(0, 0, 1);
	this.scene.add(this.headlight);	

	var exhaust = new Exhaust();
	exhaust.init();
	this.addObject(exhaust);

	this.camera.position.z = 3;
}

ExhaustApp.prototype.update = function()
{	
	Sim.App.prototype.update.call(this);
}
