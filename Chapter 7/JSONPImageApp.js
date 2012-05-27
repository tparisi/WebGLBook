// Constructor
JSONPImageApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
JSONPImageApp.prototype = new Sim.App();

// Our custom initializer
JSONPImageApp.prototype.init = function(param)
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

JSONPImageApp.prototype.update = function()
{
	Sim.App.prototype.update.call(this);
	if (this.mesh)
		this.mesh.rotation.y += 0.01;
	
	if (this.texture)
		this.texture.needsUpdate = true;
}

JSONPImageApp.prototype.createModel = function()
{
	var that = this;
	var meshx = 0;
	
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?", displayImages);

			function displayImages(data) {

			    // Start putting together the HTML string
			    var htmlString = "";
			    
			    // Now start cycling through our array of Flickr photo details
			    var item = data.items[0];
//			    $.each(data.items, function(i,item){
			    
			        // I only want the ickle square thumbnails
			        var sourceSquare = (item.media.m).replace("_m.jpg", "_s.jpg");

				    // Pop our HTML in the #images DIV
				    $('#images').html('<img src="' + sourceSquare + '">');
				    			        
			        var img = new Image;
			        img.src = sourceSquare;
			        
			    	var texture = new THREE.Texture(img);
			    	texture.needsUpdate = true;
			    	
			    	var geometry = new THREE.CubeGeometry(1, 1, 1);
			    	var material = new THREE.MeshPhongMaterial({color:0xFFFFFF, map: texture});
			    	
			    	var mesh = new THREE.Mesh(geometry, material);
			    	mesh.rotation.x = Math.PI / 6;
			    	mesh.rotation.y = Math.PI / 6;
			    	
			    	mesh.position.x = meshx;
			    	meshx += 0.5;
			    	
			    	that.scene.add(mesh);
			    	
			    	that.mesh = mesh;
			    	that.texture = true;
//			    });
			    
			    // Close down the JSON function call
			}
	
}
