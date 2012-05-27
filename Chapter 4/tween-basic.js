// Constructor
TweenApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
TweenApp.prototype = new Sim.App();

// Our custom initializer
TweenApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a point light to show off the MovingBall
	var light = new THREE.PointLight( 0xffffff, 1, 100);
	light.position.set(0, 0, 20);
	this.scene.add(light);
	
	this.camera.position.z = 6.667;
	
    // Create the MovingBall and add it to our sim
    var movingBall = new MovingBall();
    movingBall.init();
    this.addObject(movingBall);
    
    this.movingBall = movingBall;
}

TweenApp.prototype.update = function()
{
    TWEEN.update();

	Sim.App.prototype.update.call(this);
    
}

TweenApp.prototype.handleMouseUp = function(x, y)
{
	this.movingBall.animate();
}

// Custom MovingBall class
MovingBall = function()
{
	Sim.Object.call(this);
}

MovingBall.prototype = new Sim.Object();

MovingBall.prototype.init = function()
{
    // Create our MovingBall
	var BALL_TEXTURE = "../images/ball_texture.jpg";
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial( 
    		{ map: THREE.ImageUtils.loadTexture(BALL_TEXTURE) } );
    var mesh = new THREE.Mesh( geometry, material ); 
    mesh.position.x = -3.333;

    // Tell the framework about our object
    this.setObject3D(mesh);    
}

MovingBall.prototype.animate = function()
{
	var newpos;
	if (this.object3D.position.x > 0)
	{
		newpos = this.object3D.position.x - 6.667;
	}
	else
	{
		newpos = this.object3D.position.x + 6.667;
	}
	
	new TWEEN.Tween(this.object3D.position)
    .to( {
        x: newpos
    }, 2000).start();
}

