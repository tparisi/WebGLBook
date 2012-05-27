// Constructor
InteractionApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
InteractionApp.prototype = new Sim.App();

// Our custom initializer
InteractionApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the model
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1).normalize();
	this.scene.add(light);
	
	this.camera.position.set(0, 0, 7);
	
    // Create the Model and add it to our sim
    var model = new Model();
    model.init();
    this.addObject(model);    
    this.model = model;

	this.lastX = 0;
	this.lastY = 0;
	this.mouseDown = false;

}


InteractionApp.prototype.handleMouseDown = function(x, y)
{
	this.lastX = x;
	this.lastY = y;
	this.mouseDown = true;
}

InteractionApp.prototype.handleMouseUp = function(x, y)
{
	this.lastX = x;
	this.lastY = y;
	this.mouseDown = false;
}

InteractionApp.prototype.handleMouseMove = function(x, y)
{
	if (this.mouseDown)
	{
		var dx = x - this.lastX;
		if (Math.abs(dx) > InteractionApp.MOUSE_MOVE_TOLERANCE)
		{
			this.root.rotation.y += (dx * 0.01);
			this.model.explosion.rotation.y -= (dx * 0.01);
		}
		this.lastX = x;		
	}	
}


InteractionApp.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;

	this.camera.position.z -= dx;
	
	// Clamp to some boundary values
	if (this.camera.position.z < InteractionApp.MIN_CAMERA_Z)
		this.camera.position.z = InteractionApp.MIN_CAMERA_Z;
	if (this.camera.position.z > InteractionApp.MAX_CAMERA_Z)
		this.camera.position.z = InteractionApp.MAX_CAMERA_Z;
}

InteractionApp.prototype.update = function()
{
	TWEEN.update();
	this.root.rotation.y += 0.001;
	this.model.explosion.rotation.y -= 0.001;
    Sim.App.prototype.update.call(this);
}

InteractionApp.MOUSE_MOVE_TOLERANCE = 4;
InteractionApp.MAX_ROTATION_X = Math.PI / 2;
InteractionApp.MIN_CAMERA_Z = 4;
InteractionApp.MAX_CAMERA_Z = 12;


// Custom model class
Model = function()
{
	Sim.Object.call(this);
}

Model.prototype = new Sim.Object();

Model.prototype.init = function(param)
{
	var group = new THREE.Object3D;
	
    // Create our model
    var geometry = new THREE.SphereGeometry(2, 32, 32); // THREE.CubeGeometry(2, 2, 2, 16, 16); // 
	var map = THREE.ImageUtils.loadTexture("../images/earth_surface_2048.jpg");
    var material = new THREE.MeshPhongMaterial( 
    		{ map: map});
    var mesh = new THREE.Mesh( geometry, material ); 
    //group.rotation.x = Math.PI / 6;
    //group.rotation.y = Math.PI / 5;
    group.add(mesh);
    
    // Tell the framework about our object
    this.setObject3D(group);
    this.mesh = mesh;
    
    this.createHitIndicator();
    this.createExplosion();
    this.createNormalIndicator();
    
    this.showHitIndicator = false;
    this.showExplosion = true;
    this.showNormalIndicator = false;
}

Model.prototype.createHitIndicator = function()
{
    var hitIndicator = new THREE.Object3D;
	var rad = 0.2;
    var geometry = new THREE.SphereGeometry(rad); 
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00, ambient : 0xaa0000 });
    var mesh = new THREE.Mesh( geometry, material );
    hitIndicator.add(mesh);
    this.object3D.add(hitIndicator);
    this.hitIndicator = hitIndicator;
    this.hitIndicatorMesh = mesh;
    this.hitIndicatorMesh.visible = false;
}

Model.prototype.createExplosion = function()
{
    var explosion = new THREE.Object3D;
	var rad = 0.2;
    var geometry = new THREE.PlaneGeometry(1, 1, 1);
	var map = THREE.ImageUtils.loadTexture("../images/BLASTZORZ13copy.png");
    var material = new THREE.MeshPhongMaterial({map: map, transparent:true});
    var mesh = new THREE.Mesh( geometry, material );
    explosion.add(mesh);
    this.object3D.add(explosion);
    
    explosion.rotation.x = -this.object3D.rotation.x;
    explosion.rotation.y = -this.object3D.rotation.y;
    explosion.rotation.z = -this.object3D.rotation.z;
    
    this.explosion = explosion;
    this.explosionMap = map;
    this.explosionMesh = mesh;
    this.explosionMesh.visible = false;
}

Model.prototype.createNormalIndicator = function()
{
    var normalIndicator = new THREE.Object3D;
	var rad = 0.1;
    var geometry = new THREE.CylinderGeometry(rad, rad, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xff0000, ambient : 0xaa0000 });
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 1.5;
    normalIndicator.add(mesh);
    this.object3D.add(normalIndicator);
    this.normalIndicator = normalIndicator;
    this.normalIndicatorMesh = mesh;
    this.normalIndicatorMesh.visible = false;
}

Model.prototype.animateExplosion = function(normal)
{
	var deltapos = normal.clone().multiplyScalar(Model.EXPLOSION_DISTANCE);
	var newpos = this.explosion.position.clone().addSelf(deltapos);
	
	new TWEEN.Tween(this.explosion.position)
    .to( {
        x : newpos.x, y : newpos.y, z : newpos.z
    }, 777)
    .easing(TWEEN.Easing.Quadratic.EaseOut).start();	

	this.explosionMesh.material.opacity = 1;
	var fadetween = new TWEEN.Tween(this.explosionMesh.material)
    .to( {
    	opacity : 0
    }, 222);
	
	this.explosion.scale.set(0.222, 0.222, 0.222);
	new TWEEN.Tween(this.explosion.scale)
    .to( {
        x : .667, y : .667, z : .667
    }, 555)
    .easing(TWEEN.Easing.Quadratic.EaseOut)
    .start()
    .chain(fadetween);

}

Model.prototype.handleMouseOver = function(x, y)
{
	this.mesh.material.ambient.setRGB(.2,.2,.2);
}

Model.prototype.handleMouseOut = function(x, y)
{
	this.mesh.material.ambient.setRGB(0, 0, 0);
}

Model.prototype.handleMouseDown = function(x, y, hitPoint, normal)
{
	if (this.showHitIndicator)
	{
		this.hitIndicator.position.copy(hitPoint);
		this.hitIndicatorMesh.visible = true;		
	}

	if (this.showExplosion)
	{
		this.explosion.position.copy(hitPoint);
		this.explosionMesh.visible = true;
		this.animateExplosion(normal);
	}
	
	if (this.showNormalIndicator)
	{
		var quaternion = Sim.Utils.orientationToQuaternion(normal);
		this.normalIndicator.quaternion.copy(quaternion);
		this.normalIndicator.useQuaternion = true;

		this.normalIndicatorMesh.visible = true;
	}
}

Model.prototype.handleMouseUp = function(x, y, hitPoint, normal)
{
	if (this.showHitIndicator)
	{
		this.hitIndicatorMesh.visible = false;		
	}
	
	if (this.showNormalIndicator)
	{
		this.normalIndicatorMesh.visible = false;
	}
}

Model.prototype.handleMouseMove = function(x, y)
{
}

Model.EXPLOSION_DISTANCE = .222;