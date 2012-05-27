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
	// Google Maps Satellite tiles work
 	// var image = 'http://khm1.google.com/kh/v=108&x=0&y=0&z=3&s=Gali&1334026792496';
 	
 	// Google Maps Map tiles work, too
 	// I found my neighborhood using this great tool
 	// http://facstaff.unca.edu/mcmcclur/GoogleMaps/Projections/GoogleCoords.html
 	/*
		zoom level = 15
		x,y tile index = (5241, 12669)
		lat,lng of center = (37.74055085181827, -122.41765022277832)
		pixel coords of center = (1341766, 3243385)
		North/West lat/lng of center tile = (37.74465712069939, -122.420654296875)
		South East lat/lng of center tile = (37.735969208590504, -122.40966796875)
		URL of center tile= http://mt1.google.com/vt/lyrs=m@175000000&hl=en&src=api&x=5241&s=&y=12669&z=15&s=
	
	var image ='http://mt1.google.com/vt/lyrs=m@175000000&hl=en&src=api&x=5241&s=&y=12669&z=15&s=';
 	 */

	// Regular API calls don't
 	// var image = 'http://maps.googleapis.com/maps/api/staticmap?center=149%20Bronte%20St.,%20San%20Francisco,%20CA&zoom=14&size=512x512&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Ccolor:red%7Clabel:C%7C40.718217,-73.998284&sensor=false';
 	
	// Picasa does?
	var image ='https://lh4.googleusercontent.com/-KW-igfekK1A/T4SRm1Tw7CI/AAAAAAAAACo/GIBNY3G301M/s144/tonypb.jpg';
		
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

