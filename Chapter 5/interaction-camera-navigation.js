// Constructor
SceneViewer = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
SceneViewer.prototype = new Sim.App();

// Our custom initializer
SceneViewer.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a point light to show off the scene
	var light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(0, 20, 0);
	this.scene.add(light);

	light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(0, 0, 0);
	this.scene.add(light);
	
	var amb = new THREE.AmbientLight( 0x808080, 1);
	this.scene.add(amb);
	
	this.camera.position.set(-33, 6, 0);	
	this.camera.lookAt(this.root.position);
	
	this.root.rotation.y = -Math.PI / 2;
	
    // Create the model and add it to our sim
    var content = new Scene();
    content.init();
    this.addObject(content);    

    this.content = content;    
	
    this.createCameraControls();
}

SceneViewer.prototype.createCameraControls = function()
{
	// Set up the FP controls
	var controls = new THREE.FirstPersonControls( this.camera );

	controls.movementSpeed = 13;
	controls.lookSpeed = 0.01;
	
	// Don't allow tilt up/down
	controls.lookVertical = false;

	this.controls = controls;
	
	this.clock = new THREE.Clock();
}

SceneViewer.prototype.update = function()
{
	this.controls.update(this.clock.getDelta());
    Sim.App.prototype.update.call(this);
}

// Custom model class
Scene = function()
{
	Sim.Object.call(this);
}

Scene.prototype = new Sim.Object();

Scene.prototype.init = function(param)
{
	// Create an empty group to hold the content
	var group = new THREE.Object3D;

    // Tell the framework about our object
    this.setObject3D(group);

    this.createWalls();
    this.createFloor();

    this.loadModels();
}

Scene.prototype.createWalls = function()
{
	var geometry = new THREE.CubeGeometry(.1, 20, 66);
	// Brick texture adapted from http://wdc3d.com/wp-content/uploads/2010/05/red-brick-seamless-1000-x-1000.jpg
	// From set http://wdc3d.com/2d-textures/6-seamless-tileable-brick-textures/
	var map = THREE.ImageUtils.loadTexture('../images/red-brick-seamless-512-x-512.jpg');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3,3);
	var material = new THREE.MeshLambertMaterial({ map : map});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(-33, 10, 0);
	this.object3D.add(mesh);

	var geometry = new THREE.CubeGeometry(.1, 20, 66);
	var material = new THREE.MeshLambertMaterial({ map : map});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(33, 10, 0);
	this.object3D.add(mesh);

	var geometry = new THREE.CubeGeometry(66, 20, .1);
	var material = new THREE.MeshLambertMaterial({ map : map});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 10, -33);
	this.object3D.add(mesh);

}

Scene.prototype.createFloor = function()
{
	geometry = new THREE.PlaneGeometry(66, 66, 66, 66);
	var map = THREE.ImageUtils.loadTexture('../images/great-marble-texture_w725_h544-TP.jpg');
    map.repeat.set(11,11);
    map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping;
    material = new THREE.MeshLambertMaterial({ambient:0xffffff, map : map});
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = -.01;
	this.object3D.add(mesh);
}

Scene.prototype.loadModels = function()
{
    // Create the model and add it to our sim
	var sb = "../images/SwedishRoyalCastle/";
	var urls = [ sb + "px.jpg", sb + "nx.jpg",
	             sb + "py.jpg", sb + "ny.jpg",
	             sb + "pz.jpg", sb + "nz.jpg" ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	//textureCube = null;
	
	var camaroMaterials = {

			body: new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
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
	
	// Model from Turbosquid
	// http://www.turbosquid.com/Search/Artists/dskfnwn
	// http://www.turbosquid.com/FullPreview/Index.cfm/ID/411348
	var model = new Model();
    model.init({ url : "../models/Camaro/CamaroNoUv_bin.js" , materials : materials });
    this.addChild(model);
    
    model.object3D.position.set(6.67, 3, -15.67);
    model.object3D.rotation.y = Math.PI / 12;

	// Model from Turbosquid
    // http://www.turbosquid.com/Search/Artists/JiMDeviL
    // http://www.turbosquid.com/FullPreview/Index.cfm/ID/642678
	var model = new Model();
    model.init({ url : "../models/garbagecan/garbagecan.js" , materials : null, scale:.075 });
    this.addChild(model);
    
    model.object3D.position.set(20, 0, -27);

	materials = [];
	materials.push(
			new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map:THREE.ImageUtils.loadTexture('../models/LampPost/LampPost copy.jpg'), 
		}));
	materials.push(
			new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map:THREE.ImageUtils.loadTexture('../models/LampPost/LampPostBump.jpg'), 
		}));

	// Model from Turbosquid
	// http://www.turbosquid.com/Search/Artists/Ashley-Hornbaker
	// http://www.turbosquid.com/FullPreview/Index.cfm/ID/499750
	var model = new Model();
    model.init({ url : "../models/LampPost/LampPost.js" , materials : materials, scale : .67 });
    this.addChild(model);
    
    model.object3D.position.set(26, 0, -30);
    model.object3D.rotation.y = -Math.PI / 4;
}

Scene.CAMERA_START_Z = 25;

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
