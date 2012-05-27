// Constructor
RobotApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
RobotApp.prototype = new Sim.App();

// Our custom initializer
RobotApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the Robot
	var light = new THREE.DirectionalLight( 0xeeeeff, 1);
	light.position.set(0, 0, 1);
	this.scene.add(light);
	
	this.camera.position.set(0, 2.333, 8);
	
    // Create the Robot and add it to our sim
    var robot = new Robot();
    robot.init();
    this.addObject(robot);
    
    // This robot was modeled with x, z flipped so rotate it toward the camera
    this.root.rotation.y = Math.PI / 4;
    this.robot = robot;
    this.animating = false;
    this.robot.subscribe("complete", this, this.onAnimationComplete)
}

RobotApp.prototype.update = function()
{
	this.root.rotation.y += 0.005;
	Sim.App.prototype.update.call(this);
}

RobotApp.prototype.handleMouseUp = function(x, y)
{
	this.animating = !this.animating;
	this.robot.animate(this.animating);
}

RobotApp.prototype.onAnimationComplete = function()
{
	this.animating = false;
}

RobotApp.animation_time = 1111;

// Robot class
Robot = function()
{
	Sim.Object.call(this);
}

Robot.prototype = new Sim.Object();

Robot.prototype.init = function()
{
    // Create a group to hold the robot
	var bodygroup = new THREE.Object3D;
    // Tell the framework about our object
    this.setObject3D(bodygroup);	
	
	var that = this;
	// GREAT cartoon robot model - http://www.turbosquid.com/FullPreview/Index.cfm/ID/475463
	// Licensed
	var url = '../models/robot_cartoon_02/robot_cartoon_02.dae';
	var loader = new Sim.ColladaLoader;
	loader.load(url, function (data) {
		that.handleLoaded(data)
	});
}

Robot.prototype.handleLoaded = function(data)
{
	if (data)
	{
	    var model = data.scene;
	    // This model in cm, we're working in meters, scale down
	    model.scale.set(.01, .01, .01);
	
	    this.object3D.add(model);

	    // Walk through model looking for known named parts
	    var that = this;
	    THREE.SceneUtils.traverseHierarchy(model, function (n) { that.traverseCallback(n); });
	    
	    this.createAnimation();
	}	
}

Robot.prototype.traverseCallback = function(n)
{
	// Function to find the parts we need to animate. C'est facile!
	switch (n.name)
	{
		case 'jambe_G' :
			this.left_leg = n;
			break;
		case 'jambe_D' :
			this.right_leg = n;
			break;
		case 'head_container' :
			this.head = n;
			break;
		case 'clef' :
			this.key = n;
			break;
		default :
			break;
	}
}

Robot.prototype.createAnimation = function()
{
	this.animator = new Sim.KeyFrameAnimator;
	this.animator.init({ 
		interps:
			[
			    { keys:Robot.bodyRotationKeys, values:Robot.bodyRotationValues, target:this.object3D.rotation }, 
			    { keys:Robot.headRotationKeys, values:Robot.headRotationValues, target:this.head.rotation }, 
			    { keys:Robot.keyRotationKeys, values:Robot.keyRotationValues, target:this.key.rotation }, 
			    { keys:Robot.leftLegRotationKeys, values:Robot.leftLegRotationValues, target:this.left_leg.rotation }, 
			    { keys:Robot.rightLegRotationKeys, values:Robot.rightLegRotationValues, target:this.right_leg.rotation }, 
			],
		loop: true,
		duration:RobotApp.animation_time
	});

	this.animator.subscribe("complete", this, this.onAnimationComplete);
	
	this.addChild(this.animator);    
}

Robot.prototype.animate = function(on)
{
	if (on)
	{
	    this.animator.start();
	}
	else
	{
		this.animator.stop();
	}
}

Robot.prototype.onAnimationComplete = function()
{
	this.publish("complete");
}

Robot.headRotationKeys = [0, .25, .5, .75, 1];
Robot.headRotationValues = [ { z: 0 }, 
                                { z: -Math.PI / 96 },
                                { z: 0 },
                                { z: Math.PI / 96 },
                                { z: 0 },
                                ];

Robot.bodyRotationKeys = [0, .25, .5, .75, 1];
Robot.bodyRotationValues = [ { x: 0 }, 
                                { x: -Math.PI / 48 },
                                { x: 0 },
                                { x: Math.PI / 48 },
                                { x: 0 },
                                ];

Robot.keyRotationKeys = [0, .25, .5, .75, 1];
Robot.keyRotationValues = [ { x: 0 }, 
                                { x: Math.PI / 4 },
                                { x: Math.PI / 2 },
                                { x: Math.PI * 3 / 4 },
                                { x: Math.PI },
                                ];

Robot.leftLegRotationKeys = [0, .25, .5, .75, 1];
Robot.leftLegRotationValues = [ { z: 0 }, 
                                { z: Math.PI / 6},
                                { z: 0 },
                                { z: 0 },
                                { z: 0 },
                                ];

Robot.rightLegRotationKeys = [0, .25, .5, .75, 1];
Robot.rightLegRotationValues = [ { z: 0 }, 
                                { z: 0 },
                                { z: 0 },
                                { z: Math.PI / 6},
                                { z: 0 },
                                ];


