// Constructor
RacingGame = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
RacingGame.prototype = new Sim.App();

// Our custom initializer
RacingGame.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
	param = param || {};
	this.param = param;
	
	this.hud = param.hud;
	this.sounds = param.sounds;
	
	this.createEnvironment();
	this.loadCars();
	this.loadRacer();
	
	this.curTime = Date.now();
	this.deltat = 0;
	
	this.running = false;
	this.state = RacingGame.STATE_LOADING;	

	// Make sure the game has keyboard focus
	this.focus();

	this.addContextListener();
}

RacingGame.prototype.createEnvironment = function()
{
	this.environment = new Environment();
	this.environment.init({app:this,
		textureSky:true,
		textureGround:true,
		textureFinishLine:true,
		displaySigns:true});
	this.addObject(this.environment);
}

RacingGame.prototype.loadCars = function()
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
					scale:0.7, 
					position:{x:0, y:.1, z:Car.CAR_LENGTH},
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
					scale:0.17, 
					position:{x:1, y:-.5, z:Car.CAR_LENGTH},
					rotation:{x:-Math.PI / 2, y:0, z:0},
				}); }
			}				
			);

    model = new JSONModel;
	model.init(
			{
				url : "../models/Camaro-1/Camaro.js",
				callback: function(model) 
				{ that.onCarLoaded(model, "camaro_silver", 
				{
					scale:0.17, 
					position:{x:1, y:-.5, z:Car.CAR_LENGTH},
					rotation:{x:-Math.PI / 2, y:0, z:0},
					map:"../models/Camaro-1/camaro_4.jpg",
					mapIndex:0
				}); }
			}				
			);

}

RacingGame.prototype.onCarLoaded = function(model, make, options)
{
	this.carModels[this.nMakesLoaded++] = { make: make, model : model, options : options };
	
	if (this.nMakesLoaded >= this.nMakesTotal)
	{
		this.createCars();
	}
}


RacingGame.prototype.loadRacer = function()
{
	var that = this;
	var model = new JSONModel;
	model.init({ url : "../models/Nissan GTR OBJ/Objects/NissanOBJ1.js", scale:0.0254,
		callback: function(model) { that.onRacerLoaded(model); }
	});
}

RacingGame.prototype.onRacerLoaded = function(model)
{
	// Turn away from camera
	model.mesh.rotation.y = Math.PI;

	this.player = new Player;
	this.player.init({ mesh : model.object3D, camera : camera, exhaust:true,
		sounds : this.sounds});
	this.addObject(this.player);
	this.player.setPosition(0, RacingGame.CAR_Y + Environment.GROUND_Y, 
			Environment.ROAD_LENGTH / 2 - RacingGame.PLAYER_START_Z);
	this.player.start();
	
	if (this.cars)
	{
		this.startGame();
	}
}

RacingGame.prototype.startGame = function()
{
	this.running = true;
	this.state = RacingGame.STATE_RUNNING;
	this.startTime = Date.now();
	
	if (this.sounds)
	{
		var driving = this.sounds["driving"];
		driving.loop = true;
		driving.play();
	}
}

RacingGame.prototype.finishGame = function()
{
	this.running = false;
	this.player.stop();
	
	var i, len = this.cars.length;
	for (i = 0; i < len; i++)
	{
		this.cars[i].stop();
	}
	
	this.state = RacingGame.STATE_COMPLETE;
	this.showResults();
}

RacingGame.prototype.crash = function(car)
{
	this.player.crash();
	car.crash();
	this.running = false;
	this.state = RacingGame.STATE_CRASHED;
	this.showResults();
}

RacingGame.prototype.createCars = function()
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
		var randz = (Math.random()) * Environment.ROAD_LENGTH / 2 - RacingGame.CAR_START_Z;
		car.setPosition(randx, RacingGame.CAR_Y + Environment.GROUND_Y, randz);	
		
		this.cars.push(car);
		car.start();
	}

	if (this.player)
	{
		this.startGame();
	}
}

RacingGame.prototype.createCar = function(makeIndex)
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

RacingGame.prototype.update = function()
{
	if (this.running)
	{
		this.elapsedTime = (Date.now() - this.startTime) / 1000;
		this.updateHUD();
		
		this.testCollision();

		if (this.player.object3D.position.z < (-Environment.ROAD_LENGTH / 2 - Car.CAR_LENGTH))
		{
			this.finishGame();
		}	
	}
	
	Sim.App.prototype.update.call(this);
}

RacingGame.prototype.updateHUD = function()
{
	if (this.hud)
	{
		var kmh = this.player.speed * 3.6;  // convert m/s to km/hr
		this.hud.speedometer.update(kmh);
		
		this.hud.tachometer.update(this.player.rpm);
		
		this.hud.timer.innerHTML = "TIME<br>" + this.elapsedTime.toFixed(2);

		var roadRelative = (this.player.object3D.position.z - (Environment.ROAD_LENGTH / 2) + 4);
		var distanceKm = -roadRelative / Environment.ROAD_LENGTH;
		this.hud.odometer.innerHTML = "TRIP<br>" + distanceKm.toFixed(2);
	}	
}

RacingGame.prototype.testCollision = function()
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
		if (dist < RacingGame.COLLIDE_RADIUS)
		{
			this.crash(this.cars[i]);
			break;
		}
	}
}

RacingGame.prototype.showResults = function()
{
	var overlay = document.getElementById("overlay");

	var headerHtml = "?";
	var contentsHtml = "?";
	var elapsedTime = this.elapsedTime.toFixed(2);
	
	if (this.state == RacingGame.STATE_COMPLETE)
	{
		if (elapsedTime < RacingGame.best_time)
		{
			RacingGame.best_time = elapsedTime;
		}

		headerHtml = "RACE COMPLETE!";
		contentsHtml = 
			"ELAPSED TIME: " + elapsedTime + "s<p>BEST TIME: " + RacingGame.best_time + "s";

	}
	else if (this.state == RacingGame.STATE_CRASHED)
	{
		headerHtml = "CRASHED!";
		contentsHtml = 
			"CRASH TIME: " + elapsedTime + "s";
	}
	
	var header = document.getElementById("header");
	var contents = document.getElementById("contents");
	header.innerHTML = headerHtml;
	contents.innerHTML = contentsHtml;

	overlay.style.display = "block";    
}


RacingGame.prototype.handleKeyDown = function(keyCode, charCode)
{
	if (this.player)
	{
		this.player.handleKeyDown(keyCode, charCode);
	}
}

RacingGame.prototype.handleKeyUp = function(keyCode, charCode)
{
	if (this.player)
	{
		this.player.handleKeyUp(keyCode, charCode);
	}
}

RacingGame.prototype.restart = function(e)
{
	// Re-init the sounds
	if (this.sounds)
	{
		var driving = this.sounds["driving"];
		driving.pause();
		driving.currentTime = 0;
	}
	
	// Hide the overlay
	var overlay = document.getElementById("overlay");
	overlay.style.display = 'none';

	// Reinitialize us
	this.container.removeChild(this.renderer.domElement);
	this.init( this.param );
}

RacingGame.prototype.handleContextLost = function(e)
{
	this.restart();
}

RacingGame.prototype.addContextListener = function()
{
	var that = this;
	
	this.renderer.domElement.addEventListener("webglcontextlost", 
			function(e) { 
				that.handleContextLost(e);
				}, 
			false);
}

RacingGame.COLLIDE_RADIUS = Math.sqrt(2 * Car.CAR_WIDTH);
RacingGame.STATE_LOADING = 0;
RacingGame.STATE_RUNNING = 1;
RacingGame.STATE_COMPLETE = 2;
RacingGame.STATE_CRASHED = 3;
RacingGame.CAR_Y = .4666;
RacingGame.CAR_START_Z = 10;
RacingGame.PLAYER_START_Z = 4;
RacingGame.best_time = Number.MAX_VALUE;
