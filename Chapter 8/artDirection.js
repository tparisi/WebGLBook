// Constructor
ArtDirection = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
ArtDirection.prototype = new Sim.App();

// Our custom initializer
ArtDirection.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
	this.createEnvironment();
	this.loadCars();
	this.loadRacer();
	
	this.curTime = Date.now();	
	this.running = false;	

	// Make sure the game has keyboard focus
	this.focus();
}

ArtDirection.prototype.createEnvironment = function()
{
	this.environment = new Environment();
	this.environment.init({app:this, 
		textureSky:true, 
		textureGround:true,
		textureFinishLine:true,
		displaySigns:true});
	this.addObject(this.environment);
}

ArtDirection.prototype.loadCars = function()
{
	this.carModels = [];
	this.nMakesLoaded = 0;
	this.nMakesTotal = 3;
	
	var that = this;
	var model = new JSONModel;
	model.init(
			{
				url : "../models/Nova Car/NovaCar.js",
				callback: function(model) { that.onCarLoaded(model, "nova", 
				{
					scale:0.66, 
					position:{x:0, y:.1, z:0},
					rotation:{x:-Math.PI / 2, y:0, z:0},
				}); }
			}				
			);

    model = new JSONModel;
	model.init(
			{
				url : "../models/Camaro-1/Camaro.js",
				callback: function(model) { that.onCarLoaded(model, "camaro", 
				{
					scale:0.15, 
					position:{x:1, y:-.5, z:0},
					rotation:{x:-Math.PI / 2, y:0, z:0},
				}); }
			}				
			);

    model = new JSONModel;
	model.init(
			{
				url : "../models/Camaro-1/Camaro.js",
				callback: function(model) { that.onCarLoaded(model, "camaro_silver", 
				{
					scale:0.15, 
					position:{x:1, y:-.5, z:0},
					rotation:{x:-Math.PI / 2, y:0, z:0},
					map:"../models/Camaro-1/camaro_4.jpg",
					mapIndex:0
				}); }
			}				
			);

}

ArtDirection.prototype.onCarLoaded = function(model, make, options)
{
	this.carModels[this.nMakesLoaded++] = { make: make, model : model, options : options };
	
	if (this.nMakesLoaded >= this.nMakesTotal)
	{
		this.createCars();
	}
}

ArtDirection.prototype.loadRacer = function()
{
	var that = this;
	var model = new JSONModel;
	model.init({ url : "../models/Nissan GTR OBJ/Objects/NissanOBJ1.js", scale:0.0254,
		callback: function(model) { that.onRacerLoaded(model); }
	});
}

ArtDirection.prototype.onRacerLoaded = function(model)
{
	model.mesh.rotation.y = Math.PI;
	
	this.player = new Player;
	this.player.init({ mesh : model.object3D, camera : camera, exhaust:true });
	this.addObject(this.player);
	this.player.setPosition(0, ArtDirection.CAR_Y + Environment.GROUND_Y, Environment.ROAD_LENGTH / 2 - 4);
	this.player.start();
	
	this.running = true;
}

ArtDirection.prototype.createCars = function()
{
	this.cars = [];
	
	var i = 0, nCars = 5;
	for (i = 0; i < nCars; i++)
	{
		var object = this.createCar(i % this.nMakesLoaded);
		
		var car = new Car;
		car.init({ mesh : object });
		this.addObject(car);
		var randx = (Math.random() -.5 ) * (Environment.ROAD_WIDTH - Car.CAR_WIDTH);		
		var randz = (Math.random()) * Environment.ROAD_LENGTH / 2 - ArtDirection.CAR_START_Z;
		car.setPosition(randx, ArtDirection.CAR_Y + Environment.GROUND_Y, randz);	
		
		this.cars.push(car);
		// car.start();
	}
}

ArtDirection.prototype.createCar = function(makeIndex)
{
	var model = this.carModels[makeIndex].model;
	var options = this.carModels[makeIndex].options;

	var group = new THREE.Object3D;
	group.rotation.y = Math.PI;
	
	var mesh = new THREE.Mesh(model.mesh.geometry, model.mesh.material);
	mesh.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
	mesh.scale.set(options.scale, options.scale, options.scale);
	mesh.position.set(options.position.x, options.position.y, options.position.z);

	if (options.map)
	{
		var material = mesh.geometry.materials[options.mapIndex];
		material.map = THREE.ImageUtils.loadTexture(options.map);
	}
	
	group.add(mesh);
	
	return group;
}

ArtDirection.prototype.update = function()
{
	if (this.running)
	{
		if (this.player.object3D.position.z < (-Environment.ROAD_LENGTH / 2 - Car.CAR_LENGTH))
		{
			this.running = false;
			this.player.stop();
			
			var i, len = this.cars.length;
			for (i = 0; i < len; i++)
			{
				this.cars[i].stop();
			}
			
			this.showResults();
		}	
	}
	
	Sim.App.prototype.update.call(this);
}

ArtDirection.prototype.showResults = function()
{
	var overlay = document.getElementById("overlay");
	overlay.style.display = "block";
}


ArtDirection.prototype.handleKeyDown = function(keyCode, charCode)
{
	if (this.player)
	{
		this.player.handleKeyDown(keyCode, charCode);
	}
}

ArtDirection.prototype.handleKeyUp = function(keyCode, charCode)
{
	if (this.player)
	{
		this.player.handleKeyUp(keyCode, charCode);
	}
}

ArtDirection.CAR_Y = .4666;
ArtDirection.CAR_START_Z = 10;
ArtDirection.PLAYER_START_Z = 4;
