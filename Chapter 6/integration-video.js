// Constructor
VideoApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
VideoApp.prototype = new Sim.App();

// Our custom initializer
VideoApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the VideoPlayer
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1).normalize();
	this.scene.add(light);
	
	// Place camera
	this.camera.position.set(0, 0, 6.67);

	// Create our video players
	this.createPlayers();
}


VideoApp.prototype.createPlayers = function()
{
	var sqrt2 = Math.sqrt(2);

	// Create the VideoPlayers and add to our sim
	var video1 = document.getElementById( 'video1' );
    var player = new VideoPlayer();
    player.init({ video : video1, animateRollover : true });
    this.addObject(player);
    player.setPosition(-2 * sqrt2, sqrt2, 0);
    player.object3D.rotation.x = Math.PI / 6;

	var video2 = document.getElementById( 'video2' );
    player = new VideoPlayer();
    player.init({ video : video2, animateRollover : true });
    this.addObject(player);
    player.setPosition(0, sqrt2, 0);
    player.object3D.rotation.x = Math.PI / 6;

	var video3 = document.getElementById( 'video3' );
    player = new VideoPlayer();
    player.init({ video : video3, animateRollover : true });
    this.addObject(player);
    player.setPosition(2 * sqrt2, sqrt2, 0);
    player.object3D.rotation.x = Math.PI / 6;

	var video4 = document.getElementById( 'video4' );
    player = new VideoPlayer();
    player.init({ video : video4, animateRollover : true });
    this.addObject(player);
    player.setPosition(-2 * sqrt2, -sqrt2, 0);
    player.object3D.rotation.x = -Math.PI / 6;

	var video5 = document.getElementById( 'video5' );
    player = new VideoPlayer();
    player.init({ video : video5, animateRollover : true });
    this.addObject(player);
    player.setPosition(0, -sqrt2, 0);
    player.object3D.rotation.x = -Math.PI / 6;

	var video6 = document.getElementById( 'video6' );
    player = new VideoPlayer();
    player.init({ video : video6, animateRollover : true });
    this.addObject(player);
    player.setPosition(2 * sqrt2, -sqrt2, 0);
    player.object3D.rotation.x = -Math.PI / 6;
    
}

VideoApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
}
