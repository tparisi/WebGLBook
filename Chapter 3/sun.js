// Custom Sun class
Sun = function()
{
	Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function()
{
	// Create a group to hold our sun mesh and light
	var sunGroup = new THREE.Object3D();

	// Create our sun mesh
	var sunmap = "../images/sun_surface.jpg";
	var texture = THREE.ImageUtils.loadTexture(sunmap);
    var material = new THREE.MeshLambertMaterial( { map: texture, ambient : 0xffff00 } );

    var geometry = new THREE.SphereGeometry(Sun.SIZE_IN_EARTHS, 64, 64);
	sunMesh = new THREE.Mesh( geometry, material );
	
    // Create a point light to show off our solar system
	var light = new THREE.PointLight( 0xffffff, 1.2, 1000 );
    
	sunGroup.add(sunMesh);
	sunGroup.add(light);
	
    // Tell the framework about our object
    this.setObject3D(sunGroup);    
}

Sun.SIZE_IN_EARTHS = 10;
