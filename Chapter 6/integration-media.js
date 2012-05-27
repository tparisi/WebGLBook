// Constructor
MediaApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
MediaApp.prototype = new Sim.App();

// Our custom initializer
MediaApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the VideoPlayer
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1).normalize();
	this.scene.add(light);
	
	// Set up camera view
	this.camera.position.set(0, 0, 5);

	// Create the VideoPlayer and add it to our sim
	var video1 = document.getElementById( 'video1' );

    var player = new VideoPlayer();
    player.init({ video : video1, size : 1.333, animateRollover : false });
    this.addObject(player);
    
    // Position it
    player.setPosition(2, -.778, 0);
    
	// Create an RSS-Viewing Canvas and add it to our sim
    var view = new CanvasView();
    var canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    
    var param = { 
    		url : 'http://rss.cnn.com/rss/cnn_topstories.rss',
    		backgroundColor : 'rgba(48, 89, 156, 0)', // '#30599C',
    		textColor : '#FFFFFF',
    		titleColor : '#330808',
    		headingColor : '#333333',
    		titlePointSize: 24,
    		} ;
    var program = new RSSCanvasProgram();
    program.init(param);
    
    view.init({ canvas : canvas, program : program });
    this.addObject(view);

    // Position, orient it
    view.setPosition(-.5, 0, 0);
    view.object3D.rotation.y = Math.PI / 8;
    
    this.videoPlayer = player;
}

MediaApp.prototype.update = function()
{
	this.videoPlayer.object3D.rotation.y += 0.01;
	Sim.App.prototype.update.call(this);
}
