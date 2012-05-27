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
	
	this.camera.position.set(0, 0, 6);
	
    // Create the model and add it to our sim
    var model = new Model();
    model.init();
    this.addObject(model);    

    // Add the dragger now, couldn't do that until we have a scene
    model.createDragger();

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
		}
		this.lastX = x;
		
		return;
		
		var dy = y - this.lastY;
		if (Math.abs(dy) > InteractionApp.MOUSE_MOVE_TOLERANCE)
		{
			this.root.rotation.x += (dy * 0.01);
			
			// Clamp to some outer boundary values
			if (this.root.rotation.x < 0)
				this.root.rotation.x = 0;
			
			if (this.root.rotation.x > InteractionApp.MAX_ROTATION_X)
				this.root.rotation.x = InteractionApp.MAX_ROTATION_X;
			
		}
		this.lastY = y;
		
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
    Sim.App.prototype.update.call(this);
}

InteractionApp.prototype.setAnimateDrag = function(animateDrag)
{
	this.model.animateDrag = animateDrag;
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
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial( 
    		{ color: 0x0000ff , wireframe: false});
    var mesh = new THREE.Mesh( geometry, material ); 
    group.add(mesh);
    
    // Tell the framework about our object
    this.setObject3D(group);
    this.mesh = mesh;    

    this.animateDrag = false;
}

Model.prototype.createDragger = function()
{
	this.dragger = new Sim.PlaneDragger();
	this.dragger.init(this);
	this.dragger.subscribe("drag", this, this.handleDrag)
}

Model.prototype.handleMouseOver = function(x, y)
{
	this.mesh.material.ambient.setRGB(.2,.2,.2);
}

Model.prototype.handleMouseOut = function(x, y)
{
	this.mesh.material.ambient.setRGB(0, 0, 0);
}

Model.prototype.handleMouseDown = function(x, y, position, normal)
{
	this.lastx = x;
	this.lasty = y;
	
	this.dragger.beginDrag(x, y);
	this.lastDragPoint = new THREE.Vector3();
	this.dragDelta = new THREE.Vector3();
}

Model.prototype.handleMouseUp = function(x, y, position, normal)
{
	this.dragger.endDrag(x, y);

	if (this.animateDrag)
	{
		var newpos = this.dragDelta.clone();
		
		newpos.x *= Math.log(Math.abs(this.deltax * Math.E * 10));
		newpos.y *= Math.log(Math.abs(this.deltay * Math.E * 10));
		
		newpos.addSelf(this.object3D.position);
		
		new TWEEN.Tween(this.object3D.position)
	    .to( {
	        x : newpos.x, y : newpos.y, z : newpos.z
	    }, 1000)
	    .easing(TWEEN.Easing.Quadratic.EaseOut).start();
	}
	
	this.lastx = x;
	this.lasty = y;
	
	this.lastDragPoint = null;
	this.dragDelta = null;
}

Model.prototype.handleMouseMove = function(x, y)
{
	this.deltax = x - this.lastx;
	this.deltay = y - this.lasty;

	this.dragger.drag(x, y);
}

Model.prototype.handleDrag = function(dragPoint)
{
	this.object3D.position.copy(dragPoint);
	
	this.dragDelta.copy(dragPoint).subSelf(this.lastDragPoint);
	this.lastDragPoint.copy(dragPoint);
}
