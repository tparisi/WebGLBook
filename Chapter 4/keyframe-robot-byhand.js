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
	
    // Create a point light to show off the Robot
	var light = new THREE.PointLight( 0xffffff, 1, 20);
	light.position.set(0, 0, 10);
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1);
	this.scene.add(light);
	
	this.camera.position.set(0, .667, 13);
	
    // Create the Robot and add it to our sim
    var robot = new Robot();
    robot.init();
    this.addObject(robot);
    
    this.root.rotation.y = Math.PI / 4;
    this.robot = robot;
    this.animating = false;
    this.robot.subscribe("complete", this, this.onAnimationComplete)
}

RobotApp.prototype.update = function()
{
	this.root.rotation.y += 0.01;
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

RobotApp.followPath = false;
RobotApp.animation_time = 1500;

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
	
    this.createBody();
    this.createAnimation();
}

Robot.prototype.createBody = function()
{
	var body = new RobotBody;
	body.init();
	this.addChild(body);
	this.body = body;
}

Robot.prototype.createAnimation = function()
{
	this.animator = new Sim.KeyFrameAnimator;
	this.animator.init({ 
		interps:
			[ 
//		    { keys:Robot.walkPositionKeys, values:Robot.walkPositionValues, target:this.object3D.position }, 
//		    { keys:Robot.upperTorsoRotationKeys, values:Robot.upperTorsoRotationValues, target:this.body.upperTorso.rotation }, 
		    { keys:Robot.torsoRotationKeys, values:Robot.torsoRotationValues, target:this.body.torso.rotation }, 
		    { keys:Robot.upperLeftLegRotationKeys, values:Robot.upperLeftLegRotationValues, target:this.body.upper_left_leg_group.rotation }, 
		    { keys:Robot.lowerLeftLegRotationKeys, values:Robot.lowerLeftLegRotationValues, target:this.body.lower_left_leg_group.rotation }, 
		    { keys:Robot.upperRightLegRotationKeys, values:Robot.upperRightLegRotationValues, target:this.body.upper_right_leg_group.rotation }, 
		    { keys:Robot.lowerRightLegRotationKeys, values:Robot.lowerRightLegRotationValues, target:this.body.lower_right_leg_group.rotation }, 
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

Robot.walkPositionKeys = [0, .5, 1];
Robot.walkPositionValues = [ { z: -1 }, 
                                { z: 0 },
                                { z: 1 },
                                ];

Robot.upperTorsoRotationKeys = [0, .25, .5, .75, 1];
Robot.upperTorsoRotationValues = [ { y: 0 }, 
                                { y: -Math.PI / 24 },
                                { y: 0 },
                                { y: Math.PI / 24 },
                                { y: 0 },
                                ];

Robot.torsoRotationKeys = [0, .25, .5, .75, 1];
Robot.torsoRotationValues = [ { z: 0 }, 
                                { z: Math.PI / 18 },
                                { z: 0 },
                                { z: -Math.PI / 18 },
                                { z: 0 },
                                ];

Robot.upperLeftLegRotationKeys = [0, .25, .5, .75, 1];
Robot.upperLeftLegRotationValues = [ { x: 0 }, 
                                { x: -Math.PI / 6},
                                { x: 0 },
                                { x: 0 },
                                { x: 0 },
                                ];

Robot.lowerLeftLegRotationKeys = [0, .25, .5, .75, 1];
Robot.lowerLeftLegRotationValues = [ { x: 0 }, 
                                { x: Math.PI / 4},
                                { x: 0 },
                                { x: Math.PI / 8 },
                                { x: 0 },
                                ];

Robot.upperRightLegRotationKeys = [0, .25, .5, .75, 1];
Robot.upperRightLegRotationValues = [ { x: 0 }, 
                                { x: 0 },
                                { x: 0 },
                                { x: -Math.PI / 6},
                                { x: 0 },
                                ];

Robot.lowerRightLegRotationKeys = [0, .25, .5, .75, 1];
Robot.lowerRightLegRotationValues = [ { x: 0 }, 
                                { x: Math.PI / 8 },
                                { x: 0 },
                                { x: Math.PI / 4},
                                { x: 0 },
                                ];


//Robot body
RobotBody = function()
{
	Sim.Object.call(this);
}

RobotBody.prototype = new Sim.Object();

RobotBody.prototype.init = function()
{
	this.object3D = new THREE.Object3D;

	this.createMaterials();
	this.createUpperBody();	
	this.createLegs();
}

RobotBody.prototype.createMaterials = function()
{
	this.bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 10, specular: 0x000067 } );
}

RobotBody.prototype.createUpperBody = function()
{
	var torso = new THREE.Object3D;
	
	var upperTorso = new THREE.Object3D;
    var geometry = new THREE.CylinderGeometry(1.222, 1, 3, 32, 32);
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  ); 
    mesh.position.y = 1.333;
	
    upperTorso.add(mesh);

	var head = new THREE.Object3D;
	
    geometry = new THREE.CubeGeometry(1.333, 1.222, 1.333, 16, 16); // CylinderGeometry(.775, .775, 1.111, 32, 32);
    mesh = new THREE.Mesh( geometry, this.bodyMaterial  ); 
    head.add(mesh);
    head.position.y = 3.775;
	
    upperTorso.add(head);

    torso.add(upperTorso);

	this.object3D.add(torso);
	
	this.torso = torso;
	this.upperTorso = upperTorso;
	this.createArms();
}

RobotBody.prototype.createArms = function()
{
    // Empty shoulders group for the arms
    var shoulders = new THREE.Object3D;	
    shoulders.position.y = 2.667;    
    this.upperTorso.add(shoulders);
    
	this.shoulders = shoulders;

	var arm = this.createArm();
	arm.group.position.set(-.95, -.2, 0);
	this.shoulders.add(arm.group);

	this.upper_right_arm_group = arm.upper_arm_group;
	this.lower_right_arm_group = arm.lower_arm_group;

	arm = this.createArm();
	arm.group.position.set(.95, -.2, 0);
	this.shoulders.add(arm.group);

	this.upper_left_arm_group = arm.upper_arm_group;
	this.lower_left_arm_group = arm.lower_arm_group;
	
	this.upper_right_arm_group.rotation.z = -Math.PI / 4;
	this.lower_right_arm_group.rotation.z = Math.PI / 2;
	this.upper_left_arm_group.rotation.z = Math.PI / 4;
	this.lower_left_arm_group.rotation.z = -Math.PI / 2;
}

RobotBody.prototype.createArm = function()
{
	var arm_group = new THREE.Object3D;
	
    // Create our Robot
	// Upper arm
	var upper_arm_group = new THREE.Object3D;
    var geometry = new THREE.CylinderGeometry(.333, .267, 1.4, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 1, specular: 0x00aaaa } );
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  ); 
    // Put top of mesh above the origin
    mesh.position.y = -.7;
    upper_arm_group.add(mesh);
    
	var elbow_group = new THREE.Object3D;
    var geometry = new THREE.SphereGeometry(.267, 32, 32);
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  ); 
    elbow_group.position.y = -1.4;
    elbow_group.add(mesh);
    
	var lower_arm_group = new THREE.Object3D;
    var geometry = new THREE.CylinderGeometry(.267, .222, 1.333, 32, 32);
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  );
    // Put top of mesh above the origin
    mesh.position.y = -.667;
    lower_arm_group.add(mesh);
    // Put lower arm group at elbow location
    lower_arm_group.position.y = -1.4;

    // Add elbow and lower arm as children of upper arm
    upper_arm_group.add(elbow_group);
    upper_arm_group.add(lower_arm_group);
    
    arm_group.add(upper_arm_group);
    
    return { group: arm_group, upper_arm_group : upper_arm_group, lower_arm_group : lower_arm_group  };    
}

RobotBody.prototype.createLegs = function()
{
	var leg = this.createLeg();
	leg.group.position.x = -.5;
	this.object3D.add(leg.group);

	this.upper_right_leg_group = leg.upper_leg_group;
	this.lower_right_leg_group = leg.lower_leg_group;

	leg = this.createLeg();
	leg.group.position.x = .5;
	this.object3D.add(leg.group);

	this.upper_left_leg_group = leg.upper_leg_group;
	this.lower_left_leg_group = leg.lower_leg_group;
}

RobotBody.prototype.createLeg = function()
{
	var map = THREE.ImageUtils.loadTexture( "../images/4306285919_46b9d8e4c3_z.jpg" );
	
	var leg_group = new THREE.Object3D;
	
    // Create our Robot
	// Upper leg
	var upper_leg_group = new THREE.Object3D;
    var geometry = new THREE.CylinderGeometry(.5, .333, 2, 32, 32);
    // Nice ball texture from http://www.flickr.com/photos/stevekin/4306285919/
    // var material = new THREE.MeshPhongMaterial({ map: map } );
    var material = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 1, specular: 0x00aaaa } );
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  ); 
    // Put top of mesh at the origin
    mesh.position.y = -1;
    upper_leg_group.add(mesh);
    
	var knee_group = new THREE.Object3D;
    var geometry = new THREE.SphereGeometry(.333, 32, 32);
    // Nice ball texture from http://www.flickr.com/photos/stevekin/4306285919/
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  ); 
    knee_group.position.set(0, -2, 0);
    knee_group.add(mesh);
    
	var lower_leg_group = new THREE.Object3D;
    var geometry = new THREE.CylinderGeometry(.333, .166, 2, 32, 32);
    // Nice ball texture from http://www.flickr.com/photos/stevekin/4306285919/
    var mesh = new THREE.Mesh( geometry, this.bodyMaterial  );
    // Put top of mesh at the origin
    mesh.position.y = -1;
    lower_leg_group.add(mesh);
    // Put lower leg group at knee location
    lower_leg_group.position.y = -2;

    // Add knee and lower leg as children of upper leg
    upper_leg_group.add(knee_group);
    upper_leg_group.add(lower_leg_group);
    
    leg_group.add(upper_leg_group);

    
    return { group: leg_group, upper_leg_group : upper_leg_group, lower_leg_group : lower_leg_group  };    
}


