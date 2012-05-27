// Constructor
EarthApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
EarthApp.prototype = new Sim.App();

// Our custom initializer
EarthApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create the Earth and add it to our sim
    var earth = new Earth();
    earth.init();
    this.addObject(earth);
    
    // Let there be light!
    var sun = new Sun();
    sun.init();
    this.addObject(sun);

}

// Custom Earth class
Earth = function()
{
	Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function()
{	
    // Create a group to contain Earth and Clouds
    var earthGroup = new THREE.Object3D();
    
    // Tell the framework about our object
    this.setObject3D(earthGroup);

    // Add the earth globe and clouds
    this.createGlobe();
    this.createClouds();
}

Earth.prototype.createGlobe = function()
{
    // Create our Earth with nice texture - normal map for elevation, specular highlights
	var surfaceMap = THREE.ImageUtils.loadTexture( "../images/earth_surface_2048.jpg" );
	var normalMap = THREE.ImageUtils.loadTexture( "../images/earth_normal_2048.jpg" );
	var specularMap = THREE.ImageUtils.loadTexture( "../images/earth_specular_2048.jpg" );

	var shader = THREE.ShaderUtils.lib[ "normal" ],
	uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "tNormal" ].texture = normalMap;
	uniforms[ "tDiffuse" ].texture = surfaceMap;
	uniforms[ "tSpecular" ].texture = specularMap;

	uniforms[ "enableDiffuse" ].value = true;
	uniforms[ "enableSpecular" ].value = true;

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
    globeMesh.rotation.x = Earth.TILT;

    // Add it to our group
    this.object3D.add(globeMesh);
	
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
	cloudsMesh.rotation.x = Earth.TILT;

    // Add it to our group
    this.object3D.add(cloudsMesh);
	
    // Save it away so we can rotate it
    this.cloudsMesh = cloudsMesh;
}

Earth.prototype.update = function()
{
	// "I feel the Earth move..."
	this.globeMesh.rotation.y += Earth.ROTATION_Y;

	// "Clouds, too..."
	this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;
	
	Sim.Object.prototype.update.call(this);
}

Earth.ROTATION_Y = 0.001;
Earth.TILT = 0.41;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.95;

// Custom Sun class
Sun = function()
{
	Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function()
{
    // Create a point light to show off the earth - set the light out back and to left a bit
	var light = new THREE.PointLight( 0xffffff, 2, 100);
	light.position.set(-10, 0, 20);
    
    // Tell the framework about our object
    this.setObject3D(light);    
}
