// Custom Planet class
Planet = function()
{
	Sim.Object.call(this);
}

Planet.prototype = new Sim.Object();

Planet.prototype.init = function(param)
{
	param = param || {};
	
    // Create an orbit group to simulate the orbit - this is the top-level Planet group
    var planetOrbitGroup = new THREE.Object3D();
    
    // Tell the framework about our object
    this.setObject3D(planetOrbitGroup);

    // Create a group to contain Planet and Clouds meshes
    var planetGroup = new THREE.Object3D();
    var distance = param.distance || 0;
    var distsquared = distance * distance;
    planetGroup.position.set(Math.sqrt(distsquared/2), 0, -Math.sqrt(distsquared/2));
    planetOrbitGroup.add(planetGroup);
    
    this.planetGroup = planetGroup;
    var size = param.size || 1;
    this.planetGroup.scale.set(size, size, size);
    
    var map = param.map;
	this.createGlobe(map);

	this.animateOrbit = param.animateOrbit;
	this.period = param.period;
	this.revolutionSpeed = param.revolutionSpeed ? param.revolutionSpeed : Planet.REVOLUTION_Y;
}

Planet.prototype.createGlobe = function(map)
{
    // Create our Planet with nice texture
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var texture = THREE.ImageUtils.loadTexture(map);
    var material = new THREE.MeshPhongMaterial( {map: texture, ambient: 0x333333} );
    var globeMesh = new THREE.Mesh( geometry, material ); 

    // Add it to our group
    this.planetGroup.add(globeMesh);
	
    // Save it away so we can rotate it
    this.globeMesh = globeMesh;
}


Planet.prototype.update = function()
{	
	// Simulate the orbit
	if (this.animateOrbit)
	{
		this.object3D.rotation.y += this.revolutionSpeed / this.period;
	}
	
	Sim.Object.prototype.update.call(this);
}

Planet.REVOLUTION_Y = 0.003;
