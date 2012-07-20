// Constructor
ObjectApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ObjectApp.prototype = new Sim.App();

// Our custom initializer
ObjectApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create some lighting to show off our alien
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 1, 1).normalize();
	this.scene.add(light);

	light = new THREE.SpotLight( 0xffffff );
	light.position.set( 0, 0, 10 );
	light.target.position.set( 0, 0, 0 );
	this.scene.add(light);

	this.scene.add( new THREE.AmbientLight( 0xaaaaaa ) );
	
	// Position the camera
	this.camera.position.set(0, 6, 12);

    // Load the alien model/animation
    var model = new MorphModel();
    model.init('../models/Alien/walkingCycleMedium.js');
    this.addObject(model);
    
    this.camera.lookAt(new THREE.Vector3(0, 3, 0));
}

ObjectApp.prototype.handleMouseDown = function(pageX, pageY)
{
	this.dragging = true;
	this.dragStartX = pageX;
	this.dragStartY = pageY;
	this.dragStartLeft = this.container.offsetLeft;
	this.dragStartTop = this.container.offsetTop;
}

ObjectApp.prototype.handleMouseUp = function(pageX, pageY)
{
	this.dragging = false;
}

ObjectApp.prototype.handleMouseMove = function(pageX, pageY)
{
	// Drag moves the DIV
	if (this.dragging)
	{
		var deltax = pageX - this.dragStartX;
		var deltay = pageY - this.dragStartY;
		
		this.container.style.left = (this.dragStartLeft + deltax) + 'px';
		this.container.style.top = (this.dragStartTop + deltay) + 'px';
	}
}


ObjectApp.prototype.handleMouseScroll = function(delta)
{
	// Scroll wheel resizes the DIV
	var dx = delta;

	var width = this.renderer.domElement.offsetWidth;
	var height = this.renderer.domElement.offsetHeight;
	this.renderer.domElement.style.width = (width + dx * 10) + 'px';
	this.renderer.domElement.style.height = (height + dx * 10) + 'px';
}

//Custom MorphModel class
MorphModel = function()
{
	Sim.Object.call(this);
}

MorphModel.prototype = new Sim.Object();

MorphModel.prototype.init = function(url, scale)
{
    // Create a group to contain model
    var modelGroup = new THREE.Object3D();
    
    // Tell the framework about our object
    this.setObject3D(modelGroup);
    
    this.scale = scale || 1;
	
    // Load the model
    var that = this;
	var loader = new THREE.JSONLoader;
	loader.load(url, function (data) {
		that.handleLoaded(data);
	});
	
	this.animating = false;
	this.overCursor = 'pointer';
	
	this.clock = new THREE.Clock();
	this.theta = 0;
	this.walkRadius = 3;
	this.animating = true;
}

MorphModel.prototype.handleLoaded = function(data)
{
	// Add the mesh to our group
	if (data instanceof THREE.Geometry)
	{
		var geometry = data;
		
		// Set up a morphing mesh and material
		var material = geometry.materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( 0xffFFFF ); // brighten it up
		material.ambient.setHex( 0xFFFFFF );
		var faceMaterial = new THREE.MeshFaceMaterial();
		
		var mesh = new THREE.MorphAnimMesh( geometry, faceMaterial  );
		mesh.duration = 1000; // 1 second walk cycle
		mesh.updateMatrix();
		this.object3D.add( mesh );
		this.bodyMesh = mesh;
		
		// Fun! Fake shadow using a scaled version of the original mesh
		// plus shadowy material
		var material = new THREE.MeshBasicMaterial( 
				{ color: 0x444444, opacity: 0.8, morphTargets: true } );
		material.shading = THREE.FlatShading;
		var mesh2 = new THREE.MorphAnimMesh( geometry, material  );
		mesh2.scale.set(1, 0.001, 1.5);
		mesh2.duration = 1000;
		this.object3D.add( mesh2 );	
		this.shadowMesh = mesh2;
	}
}

MorphModel.prototype.update = function()
{
	// Update the morph animations
	if (this.animating && this.bodyMesh)
	{
		var delta = this.clock.getDelta();
				
		this.theta += 0.01;
		var theta = this.theta;
		this.bodyMesh.rotation.y = -theta;
		this.bodyMesh.position.x = this.walkRadius * Math.cos(theta);
		this.bodyMesh.position.z = this.walkRadius * Math.sin(theta);
		this.shadowMesh.rotation.y = -theta;
		this.shadowMesh.position.x = this.walkRadius * Math.cos(theta);
		this.shadowMesh.position.z = this.walkRadius * Math.sin(theta);		
		
		this.bodyMesh.updateAnimation( 1000 * delta );
		this.shadowMesh.updateAnimation( 1000 * delta );		
	}
	
	Sim.Object.prototype.update.call(this);
}
