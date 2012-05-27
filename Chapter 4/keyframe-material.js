// Constructor
MaterialApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
MaterialApp.prototype = new Sim.App();

// Our custom initializer
MaterialApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);

	// Some scene lighting
	var ambientLight = new THREE.AmbientLight( 0x444444 );
	this.scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(-.3333, 1, .777).normalize();
	this.scene.add( directionalLight );
	this.directionalLight = directionalLight;

	this.camera.position.set(0, 3.333, 6.667);
	this.camera.lookAt(this.root.position);
	
	this.createGrid();
	this.createObjects();
	this.createAnimations();
}

MaterialApp.prototype.createGrid = function()
{
	var line_material = new THREE.LineBasicMaterial( { color: 0xaaaaaa, opacity: 0.8 } ),
		geometry = new THREE.Geometry(),
		floor = -2, step = 1, size = 66;
	
	for ( var i = 0; i <= size / step * 2; i ++ )
	{
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
	
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
	}
	
	var grid = new THREE.Line( geometry, line_material, THREE.LinePieces );

	this.root.add(grid);
}


MaterialApp.prototype.createObjects = function()
{
	var geometry = new THREE.SphereGeometry(1, 32, 32);
	this.ballmaterial = new THREE.MeshPhongMaterial({ color : 0xff0000, ambient : 0x222222,
		transparent : true});
	this.ball = new THREE.Mesh(geometry, this.ballmaterial);
	this.ball.position.set(-2.67, 0, 0);
	
	this.root.add(this.ball);

	var len = Math.sqrt(2);
	geometry = new THREE.CubeGeometry(2, 2, 2);
	this.cubematerial = new THREE.MeshPhongMaterial({ color : 0x0055ff });
	this.cube = new THREE.Mesh(geometry, this.cubematerial);
	this.cube.position.set(0, 0, -5);
	
	this.root.add(this.cube);

	geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
	this.cylindermaterial = new THREE.MeshPhongMaterial({ color : 0xcccccc, shininess : 1,
		specular : 0xffff00 });
	this.cylinder = new THREE.Mesh(geometry, this.cylindermaterial);
	this.cylinder.position.set(2.67, 0, 0);
	
	this.root.add(this.cylinder);
	
}

MaterialApp.prototype.createAnimations = function()
{
	this.transparencyAnimator = new Sim.KeyFrameAnimator;
	this.transparencyAnimator.init({ 
		interps:
			[
			    { 
			    	keys:[0, .5, 1], 
			    	values:[
			    	        { opacity : 1},
			    	        { opacity : 0},
			    	        { opacity : 1},
			    	        ],
			    	target:this.ballmaterial
			    }, 
			],
		loop: true,
		duration:MaterialApp.animation_time
	});

	this.addObject(this.transparencyAnimator);    

	this.colorAnimator = new Sim.KeyFrameAnimator;
	this.colorAnimator.init({ 
		interps:
			[
			    { 
			    	keys:[0, .5, 1], 
			    	values:[
			    	        { r : 0, g : .333, b : 1 },
			    	        { r : 0, g : 1, b : .333 },
			    	        { r : 0, g : .333, b : 1 },
			    	        ],
			    	target:this.cubematerial.color
			    },
			],
		loop: true,
		duration:MaterialApp.animation_time
	});

	this.addObject(this.colorAnimator);    

	this.specularAnimator = new Sim.KeyFrameAnimator;
	this.specularAnimator.init({ 
		interps:
			[
			    { 
			    	keys:[0, .5, 1], 
			    	values:[
			    	        { r : 1, g : 1 },
			    	        { r : 0, g : 0 },
			    	        { r : 1, g : 1 },
			    	        ],
			    	target:this.cylindermaterial.specular
			    }, 
			],
		loop: true,
		duration:MaterialApp.animation_time
	});

	this.addObject(this.specularAnimator);    
}


MaterialApp.prototype.animate = function(animator, on)
{
	if (on)
	{
		animator.start();
	}
	else
	{
		animator.stop();
	}
}

MaterialApp.prototype.setAnimateTransparency = function(val)
{
	this.animate(this.transparencyAnimator, val);
}

MaterialApp.prototype.setAnimateColor = function(val)
{
	this.animate(this.colorAnimator, val);
}

MaterialApp.prototype.setAnimateSpecular = function(val)
{
	this.animate(this.specularAnimator, val);
}
MaterialApp.animation_time = 4444;

