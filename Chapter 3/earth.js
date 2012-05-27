// Custom Earth class
Earth = function()
{
	Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function(param)
{
	param = param || {};
	
	this.animateOrbit = param.animateOrbit || false;
	this.animateRotation = param.animateRotation || false;
	this.period = param.period;
	this.revolutionSpeed = param.revolutionSpeed ? param.revolutionSpeed : Earth.ROTATION_Y;
	this.rotationSpeed = this.revolutionSpeed * 365 / 2;
	this.cloudsRotationSpeed = this.rotationSpeed * Earth.CLOUDS_ROTATION_FACTOR;
	
    // Create an orbit group to simulate the orbit - this is the top-level Earth group
    var earthOrbitGroup = new THREE.Object3D();
    
    // Tell the framework about our object
    this.setObject3D(earthOrbitGroup);

    // Create a group to contain Earth and Clouds meshes
    var earthGroup = new THREE.Object3D();
    var distance = param.distance || 0;
    var distsquared = distance * distance;
    earthGroup.position.set(Math.sqrt(distsquared/2), 0, -Math.sqrt(distsquared/2));
    earthOrbitGroup.add(earthGroup);
    
    this.earthGroup = earthGroup;
    var size = param.size || 1;
    this.earthGroup.scale.set(size, size, size);
    
    // Add the earth globe and clouds
    if (param.hires)
    {
    	this.createShaderGlobe();
    	this.createClouds();
    }
    else
    {
    	this.createLitGlobe();
    }
    
    // Add the moon
	this.createMoon(size, distance, this.rotationSpeed / Moon.PERIOD);
	
	if (param.showOrbit)
	{
		this.createMoonOrbit(distance, size);
	}
	
}

Earth.prototype.createShaderGlobe = function()
{
    // Create our Earth with nice texture - normal map for elevation, specular highlights
	var surfaceMap = THREE.ImageUtils.loadTexture( "../images/earth_surface_2048.jpg" );
	var normalMap = THREE.ImageUtils.loadTexture( "../images/earth_normal_2048.jpg" );
	var specularMap = THREE.ImageUtils.loadTexture( "../images/earth_specular_2048.jpg" );

	var shader = THREE.ShaderUtils.lib[ "normal" ],
	uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "tNormal" ].texture = normalMap;
	uniforms[ "uNormalScale" ].value = 0.85;

	uniforms[ "tDiffuse" ].texture = surfaceMap;
	uniforms[ "tSpecular" ].texture = specularMap;

	uniforms[ "enableAO" ].value = false;
	uniforms[ "enableDiffuse" ].value = true;
	uniforms[ "enableSpecular" ].value = true;

	uniforms[ "uDiffuseColor" ].value.setHex( 0xffffff );
	uniforms[ "uSpecularColor" ].value.setHex( 0x333333 );
	uniforms[ "uAmbientColor" ].value.setHex( 0x000000 );

	uniforms[ "uShininess" ].value = 15;

	var shaderMaterial = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: uniforms,
		lights: true
	});

    var globeGeometry = new THREE.SphereGeometry(1, 32, 32);

    // We'll need these tangents for our shader
    globeGeometry.computeTangents();
    var globeMesh = new THREE.Mesh( globeGeometry, shaderMaterial ); 
    
    // Let's work in the tilt
    globeMesh.rotation.z = Earth.TILT;

    // Add it to our group
    this.earthGroup.add(globeMesh);
	
    // Save it away so we can rotate it
    this.globeMesh = globeMesh;
}

Earth.prototype.createLitGlobe = function()
{
    // Create our Earth with nice texture
    var earthmap = "../images/earth_surface_2048.jpg";
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial( { map: texture } );
    var globeMesh = new THREE.Mesh( geometry, material ); 

    // Let's work in the tilt
    globeMesh.rotation.z = Earth.TILT;
    
    // Add it to our group
    this.earthGroup.add(globeMesh);
	
    // Save it away so we can rotate it
    this.globeMesh = globeMesh;
}

Earth.prototype.createClouds = function()
{
	// Create our clouds
	var cloudsMap = THREE.ImageUtils.loadTexture( "../images/earth_clouds_1024.png" );
	var cloudsMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map: cloudsMap, transparent:true } );

    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
	cloudsMesh = new THREE.Mesh( cloudsGeometry, cloudsMaterial );
	cloudsMesh.rotation.z = Earth.TILT;

    // Add it to our group
    this.earthGroup.add(cloudsMesh);
	
    // Save it away so we can rotate it
    this.cloudsMesh = cloudsMesh;
}

Earth.prototype.createMoon = function(size, distance, rotationSpeed)
{
	var moon = new Moon();
	moon.init({size:size, distance:distance, rotationSpeed:rotationSpeed});
	this.addChild(moon);
	var distsquared = distance * distance;
	moon.setPosition(Math.sqrt(distsquared/2), 0, -Math.sqrt(distsquared/2));
}

Earth.prototype.createMoonOrbit = function(distance, size)
{
	var moonOrbit = new Orbit();
	moonOrbit.init(Moon.DISTANCE_FROM_EARTH / Earth.RADIUS / size);
	this.addChild(moonOrbit);
	var distsquared = distance * distance;
	moonOrbit.setPosition(Math.sqrt(distsquared/2), 0, -Math.sqrt(distsquared/2));
}

Earth.prototype.update = function()
{
	// Simulate the orbit
	if (this.animateOrbit)
	{
		this.object3D.rotation.y += this.revolutionSpeed;
	}
	
	if (this.animateRotation)
	{
		// "I feel the Earth move..."
		this.globeMesh.rotation.y += this.rotationSpeed;
	
		// "Clouds, too..."
		if (this.cloudsMesh)
		{
			this.cloudsMesh.rotation.y += this.cloudsRotationSpeed;
		}
	}
	
	Sim.Object.prototype.update.call(this);
}


Earth.ROTATION_Y = 0.003;
Earth.TILT = 0.41;
Earth.RADIUS = 6371;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_FACTOR = 0.95;
	
// Custom Moon class
Moon = function()
{
	Sim.Object.call(this);
}

Moon.prototype = new Sim.Object();

Moon.prototype.init = function(param)
{
	param = param || {};
	
	this.rotationSpeed = param.rotationSpeed || Moon.ROTATION_SPEED;
	var size = param.size || 1;
	
	// Create a group to contain the Moon and orbit
    var moonGroup = new THREE.Object3D();
    
	var MOONMAP = "../images/moon_1024.jpg";	
    var geometry = new THREE.SphereGeometry(Moon.SIZE_IN_EARTHS * size, 32, 32);
    var texture = THREE.ImageUtils.loadTexture(MOONMAP);
    var material = new THREE.MeshPhongMaterial( { map: texture, 
    	ambient : 0x888888 } );
    var mesh = new THREE.Mesh( geometry, material );    
	var distance = Moon.DISTANCE_FROM_EARTH / Earth.RADIUS / size;
	var distsquared = distance * distance;
    mesh.position.set(Math.sqrt(distsquared/2), 0, -Math.sqrt(distsquared/2));
    moonGroup.add(mesh);
    
    // Tell the framework about our object
    this.setObject3D(moonGroup);
}

Moon.prototype.update = function()
{
	// Moon orbit
	this.object3D.rotation.y += this.rotationSpeed;
	
	Sim.Object.prototype.update.call(this);
}

Moon.DISTANCE_FROM_EARTH = 356400;
Moon.PERIOD = 28;
Moon.ROTATION_SPEED = 0.003;
Moon.EXAGGERATE_FACTOR = 1.2;
Moon.SIZE_IN_EARTHS = 1 / 3.7 * Moon.EXAGGERATE_FACTOR;
