// Constructor
ProxyImageApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ProxyImageApp.prototype = new Sim.App();

// Our custom initializer
ProxyImageApp.prototype.init = function(param)
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

ProxyImageApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
	if (this.mesh)
		this.mesh.rotation.y += 0.01;
}

ProxyImageApp.prototype.createModel = function()
{
 
	var imageURL = 'http://api.twitter.com/1/users/profile_image/auradeluxe';
	var imageURL = 'http://farm8.staticflickr.com/7030/6625647929_d43c81a5dc_b.jpg';
	var queryURL = 'imageProxy.php?url=' + imageURL;
    var img = new Image;
    img.src = queryURL;
			        
	var texture = new THREE.ImageUtils.loadTexture(queryURL); // Texture(img);
	var geometry = new THREE.CubeGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({color:0xFFFFFF, map: texture});
	
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI / 6;
	mesh.rotation.y = Math.PI / 6;
	
	this.scene.add(mesh);
	
	this.mesh = mesh;	
}

