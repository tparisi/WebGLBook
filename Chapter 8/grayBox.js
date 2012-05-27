// Constructor
GrayBox = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
GrayBox.prototype = new Sim.App();

// Our custom initializer
GrayBox.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
	this.createEnvironment();
	this.createCars();
	this.loadRacer();
	
	this.curTime = Date.now();
	this.deltat = 0;
	
	this.running = false;

	// Make sure the game has keyboard focus
	this.focus();
	
}

GrayBox.prototype.createEnvironment = function()
{
	this.environment = new Environment();
	this.environment.init({app:this,
		textureSky:false,
		textureGround:false,
		textureFinishLine:false,
		displaySigns:false});
	this.addObject(this.environment);
}

GrayBox.prototype.loadRacer = function()
{
	var that = this;
	var model = new JSONModel;
	model.init({ url : "../models/Nissan GTR OBJ/Objects/NissanOBJ1.js", scale:0.0254,
		callback: function(model) { that.onRacerLoaded(model); }
	});
}

GrayBox.prototype.onRacerLoaded = function(model)
{
	model.mesh.rotation.y = Math.PI;
	
	this.player = new Player;
	this.player.init({ mesh : model.object3D, camera : camera, exhaust:true });
	this.addObject(this.player);
	this.player.setPosition(0, GrayBox.CAR_Y + Environment.GROUND_Y, 
			Environment.ROAD_LENGTH / 2 - GrayBox.PLAYER_START_Z);
	this.player.start();
	
	this.running = true;
}

GrayBox.prototype.createCars = function()
{
	this.cars = [];
	
	var i = 0, nCars = 5;
	for (i = 0; i < nCars; i++)
	{
		var mesh = this.createCar();
		
		var r = Math.random(), g = Math.random(), b = Math.random();
		mesh.material.color.setRGB(r, g, b);

		var car = new Car;
		car.init({ mesh : mesh });
		this.addObject(car);
		var randx = (Math.random() -.5 ) * (Environment.ROAD_WIDTH - Car.CAR_WIDTH);		
		var randz = (Math.random()) * Environment.ROAD_LENGTH / 2 - GrayBox.CAR_START_Z;
		car.setPosition(randx, GrayBox.CAR_Y + Environment.GROUND_Y, randz);	
		
		this.cars.push(car);
		car.start();
	}
}

GrayBox.prototype.createCar = function()
{
	var geometry = new THREE.CubeGeometry(Car.CAR_WIDTH, Car.CAR_HEIGHT, Car.CAR_LENGTH);
	var material = new THREE.MeshPhongMaterial({color:0xaaaaaa});
	
	var mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

GrayBox.prototype.update = function()
{
	var now = Date.now();
	var deltat = now - this.curTime;
	this.curTime = now;

	if (this.running)
	{		
		this.testCollision();

		if (this.player.object3D.position.z < (-Environment.ROAD_LENGTH / 2 +  Car.CAR_LENGTH))
		{
			this.running = false;
			this.player.stop();
			
			var i, len = this.cars.length;
			for (i = 0; i < len; i++)
			{
				this.cars[i].stop();
			}
		}	
	}
	
	Sim.App.prototype.update.call(this);
}

GrayBox.prototype.testCollision = function()
{
	var playerpos = this.player.object3D.position;
	
	if (playerpos.x > (Environment.ROAD_WIDTH / 2 - (Car.CAR_WIDTH/2)))
	{
		this.player.bounce();
		this.player.object3D.position.x -= 1;
	}
	
	if (playerpos.x < -(Environment.ROAD_WIDTH / 2 - (Car.CAR_WIDTH/2)))
	{
		this.player.bounce();
		this.player.object3D.position.x += 1;
	}
		
	var i, len = this.cars.length;
	for (i = 0; i < len; i++)
	{
		var carpos = this.cars[i].object3D.position;
		var dist = playerpos.distanceTo(carpos);
		if (dist < GrayBox.COLLIDE_RADIUS)
		{
			this.player.crash();
			this.cars[i].crash();
			this.running = false;
			break;
		}
	}
}

GrayBox.prototype.handleKeyDown = function(keyCode, charCode)
{
	if (this.player)
	{
		this.player.handleKeyDown(keyCode, charCode);
	}
}

GrayBox.prototype.handleKeyUp = function(keyCode, charCode)
{
	if (this.player)
	{
		this.player.handleKeyUp(keyCode, charCode);
	}
}

GrayBox.COLLIDE_RADIUS = Math.sqrt(2 * Car.CAR_WIDTH);
GrayBox.CAR_Y = .4666;
GrayBox.CAR_START_Z = 10;
GrayBox.PLAYER_START_Z = 4;

