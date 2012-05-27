// Constructor
ModelViewer = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ModelViewer.prototype = new Sim.App();

// Our custom initializer
ModelViewer.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create point lights to show off the model
	var light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(0, 20, 0);
	this.scene.add(light);

	light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(-20, 0, 0);
	this.scene.add(light);

	light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(20, 0, 20);
	this.scene.add(light);

	var light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(-20, 50, 20);
	this.scene.add(light);

	var amb = new THREE.AmbientLight( 0x808080, 1);
	this.scene.add(amb);
	
	this.camera.position.set(0, 0, ModelViewer.CAMERA_START_Z);
	
	this.createModel();
    this.createCameraControls();
}

ModelViewer.prototype.createModel = function()
{
    // Create the model and add it to our sim
	var sb = "../images/SwedishRoyalCastle/";
	var urls = [ sb + "px.jpg", sb + "nx.jpg",
	             sb + "py.jpg", sb + "ny.jpg",
	             sb + "pz.jpg", sb + "nz.jpg" ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	//textureCube = null;
	
	var camaroMaterials = {

			body: new THREE.MeshLambertMaterial( { color: 0x226699, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
			chrome: new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube } ),
			darkchrome: new THREE.MeshLambertMaterial( { color: 0x444444, envMap: textureCube } ),
			glass: new THREE.MeshBasicMaterial( { color: 0x223344, envMap: textureCube, opacity: 0.25, combine: THREE.MixOperation, reflectivity: 0.25, transparent: true } ),
			tire: new THREE.MeshLambertMaterial( { color: 0x050505 } ),
			interior: new THREE.MeshPhongMaterial( { color: 0x050505, shininess: 20 } ),
			black: new THREE.MeshLambertMaterial( { color: 0x000000 } )

		}

	var materials = [];
	materials.push(camaroMaterials.body); // car body
	materials.push(camaroMaterials.chrome); // wheels chrome
	materials.push(camaroMaterials.chrome); // grille chrome
	materials.push(camaroMaterials.darkchrome); // door lines
	materials.push(camaroMaterials.glass); // windshield
	materials.push(camaroMaterials.interior); // interior
	materials.push(camaroMaterials.tire); // tire
	materials.push(camaroMaterials.black); // tireling
	materials.push(camaroMaterials.black); // behind grille
	
	var model = new Model();
	// Model from Turbosquid
	// http://www.turbosquid.com/Search/Artists/dskfnwn
	// http://www.turbosquid.com/FullPreview/Index.cfm/ID/411348
    model.init({ url : "../models/Camaro/CamaroNoUv_bin.js" , materials : materials });
    this.addObject(model);    
}

ModelViewer.prototype.createCameraControls = function()
{
	var controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
	var radius = ModelViewer.CAMERA_RADIUS;
	
	controls.rotateSpeed = ModelViewer.ROTATE_SPEED;
	controls.zoomSpeed = ModelViewer.ZOOM_SPEED;
	controls.panSpeed = ModelViewer.PAN_SPEED;
	controls.dynamicDampingFactor = ModelViewer.DAMPING_FACTOR;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;

	controls.minDistance = radius * ModelViewer.MIN_DISTANCE_FACTOR;
	controls.maxDistance = radius * ModelViewer.MAX_DISTANCE_FACTOR;

	this.controls = controls;
}

ModelViewer.prototype.update = function()
{
	this.controls.update();
    Sim.App.prototype.update.call(this);
}


ModelViewer.CAMERA_START_Z = 22;
ModelViewer.CAMERA_RADIUS = 20;
ModelViewer.MIN_DISTANCE_FACTOR = 1.1;
ModelViewer.MAX_DISTANCE_FACTOR = 20;
ModelViewer.ROTATE_SPEED = 1.0;
ModelViewer.ZOOM_SPEED = 3;
ModelViewer.PAN_SPEED = 0.2;
ModelViewer.DAMPING_FACTOR = 0.3;

//Custom model class
Model = function()
{
	Sim.Object.call(this);
}

Model.prototype = new Sim.Object();

Model.prototype.init = function(param)
{
	var group = new THREE.Object3D;

	var that = this;

	var url = param.url || "";
	if (!url)
		return;

	this.materials = param.materials;
	var scale = param.scale || 1;
	
	this.scale = new THREE.Vector3(scale, scale, scale);
	var loader = new THREE.BinaryLoader();
	loader.load( url, function( data ) { 
		that.handleLoaded(data) } );

    // Tell the framework about our object
    this.setObject3D(group);
}


Model.prototype.handleLoaded = function(data)
{
	if (data instanceof THREE.Geometry)
	{
		var geometry = data;
		var material = null;
		if (this.materials)
		{
			material = new THREE.MeshFaceMaterial();
	
			var i, len = this.materials.length;
			for (i = 0; i < len; i++)
			{
				geometry.materials[i] = this.materials[i];
			}
		}
		else
		{
			material = new THREE.MeshFaceMaterial();
		}
		mesh = new THREE.Mesh( geometry, material );

		this.object3D.add( mesh );
		
		this.object3D.scale.copy(this.scale);
	}
}


