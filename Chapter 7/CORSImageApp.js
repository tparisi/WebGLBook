// Constructor
CORSImageApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
CORSImageApp.prototype = new Sim.App();

// Our custom initializer
CORSImageApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);

    // Create a light to show off the model
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 0, 1);
	this.scene.add(light);	
	
	var amb = new THREE.AmbientLight( 0xffffff );
	this.scene.add(amb);
	
	this.camera.position.set(0, 0, 3.333);
	
	this.createModel();
}

CORSImageApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
	if (this.mesh)
		this.mesh.rotation.y += 0.01;
}

CORSImageApp.prototype.createModel = function()
{
	// Load image with valid Picasa url
	var image ='https://lh4.googleusercontent.com/-KW-igfekK1A/' +
		'T4SRm1Tw7CI/AAAAAAAAACo/GIBNY3G301M/s144/tonypb.jpg';
		
	var that = this;
	
	var img = new Image();
	img.crossOrigin = ''; // synonymous with, er, 'anonymous'
	img.onload = function(){ 
		
		// Create a new Three.js texture with this image, flag needs update
		var texture = new THREE.Texture(img);
		texture.needsUpdate = true;
		
		// Drop the map image onto a cube, easy-peasy
		var geometry = new THREE.CubeGeometry(1, 1, 1);
		var material = new THREE.MeshPhongMaterial({color:0xFFFFFF, map: texture});
		
		var mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = Math.PI / 6;
		mesh.rotation.y = Math.PI / 6;
		
		that.scene.add(mesh);
		
		that.mesh = mesh;	
		};
		
	img.src = image;
}

