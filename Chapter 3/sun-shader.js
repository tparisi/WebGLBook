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

	var SUNMAP = "../images/lavatile.jpg";
	var NOISEMAP = "../images/cloud.png";
	var uniforms = {

			time: { type: "f", value: 1.0 },
			texture1: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( NOISEMAP  ) },
			texture2: { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( SUNMAP ) }

		};

	uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
	uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.Repeat;

	var material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent

	} );
	
	// Create our sun mesh
    var geometry = new THREE.SphereGeometry(Sun.SIZE_IN_EARTHS, 64, 64);
	sunMesh = new THREE.Mesh( geometry, material );
	
	// Tuck away the uniforms so that we can animate them over time
	this.uniforms = uniforms;

	// Set up a clock to drive the animation
	this.clock = new THREE.Clock();
	
    // Create a point light to show off our solar system
	var light = new THREE.PointLight( 0xffffff, 1.2, 100000 );
    
	sunGroup.add(sunMesh);
	sunGroup.add(light);
	
    // Tell the framework about our object
    this.setObject3D(sunGroup);    
}

Sun.prototype.update = function()
{
	var delta = this.clock.getDelta();
	
 	this.uniforms.time.value += delta;

	Sim.Object.prototype.update.call(this);
	
	this.object3D.rotation.y -= 0.001;
}

Sun.SIZE_IN_EARTHS = 100;
