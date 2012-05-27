// Constructor
Shipster = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
Shipster.prototype = new Sim.App();

// Our custom initializer
Shipster.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a direction light to show off the ships
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(0, 2, 1).normalize();
	this.scene.add(light);

	// Create points light to show off our earth
	light = new THREE.PointLight( 0xffffff, 1.2, 1000 );
	light.position.set(-50, 0, 50);
	this.scene.add(light);
	
	// Set up a nice camera position
	this.camera.position.set(0, 0, 100);
	
    // Put Earth in the background
    var earth = new Earth();
    earth.init({radius:25});
    this.addObject(earth);
    
    // Create the ship ships
    this.ships = [];
    var ship = new Ship();
    ship.init('../models/Feisar_Ship_OBJ/Feisar_Ship.js', Shipster.SHIP_FEISAR, .08);
    ship.setPosition(-33, 0, 33);
    this.addObject(ship);
    ship.subscribe("over", this, this.onShipOver);
    this.ships.push(ship);

    var ship = new Ship();
    ship.init('../models/EnemyShip1/EnemyShip1.js', Shipster.SHIP_ENEMYSHIP, .08);
    ship.setPosition(0, 0, 33);
    this.addObject(ship);
    ship.subscribe("over", this, this.onShipOver);
    this.ships.push(ship);

    var ship = new Ship();
    ship.init('../models/craft/craft.js', Shipster.SHIP_CRUISER, 1.25);
    ship.setPosition(33, 0, 33);
    this.addObject(ship);
    ship.subscribe("over", this, this.onShipOver);
    this.ships.push(ship);    
}

Shipster.prototype.handleMouseUp = function(x, y)
{
	var callout = document.getElementById("callout");
	callout.style.display = "none";
}

Shipster.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;

	this.camera.position.z -= dx;	
}

Shipster.prototype.onShipOver = function(id)
{
	var html = "";
	switch(id)
	{
		case Shipster.SHIP_FEISAR :
			headerHtml = "Fighter";
			contentsHtml = 
				"Weight: 50,000 m tons<br>Max Speed:.6C<br>Guns: 4 fore<br>" +
					"Max Passengers: 4<br>" + "Freight Capacity: Minimal<br>" +
					"Warp-Capable: No";
			break;
			
		case Shipster.SHIP_ENEMYSHIP :
			headerHtml = "Warship";
			contentsHtml = 
				"Weight:66,000 m tons<br>Max Speed:.3C<br>Guns: 4 fore, 2 aft<br>" +
					"Max Passengers: 4<br>" + "Freight Capacity: Minimal<br>" +
					"Warp-Capable: No";
			break;
			
		case Shipster.SHIP_CRUISER :
			headerHtml = "Cruiser";
			contentsHtml = 
				"Weight:100,000 m tons<br>Max Speed:.2C<br>Guns: 4 fore<br>" +
					"Max Passengers: 8<br>" + "Freight Capacity: 5,000 m tons<br>" +
					"Warp-Capable: Yes";
			break;
	}
	
	// Populate the callout
	var callout = document.getElementById("callout");
	var calloutHeader = document.getElementById("header");
	var calloutContents = document.getElementById("contents");
	calloutHeader.innerHTML = headerHtml;
	calloutContents.innerHTML = contentsHtml;
	callout.shipID = id;
	
	// Place the callout near the object and show it
	var screenpos = this.getObjectScreenPosition(this.ships[id]);
	callout.style.display = "block";
	callout.style.left = (screenpos.x - callout.offsetWidth / 2)+ "px";
	callout.style.top = (screenpos.y + Shipster.CALLOUT_Y_OFFSET) + "px";
}

Shipster.prototype.selectShip = function(id)
{
}

Shipster.prototype.getObjectScreenPosition = function(object)
{	
	var mat = object.object3D.matrixWorld;
	var pos = new THREE.Vector3();
	pos = mat.multiplyVector3(pos);

	projected = pos.clone();
	this.projector.projectVector(projected, this.camera);

	var eltx = (1 + projected.x) * this.container.offsetWidth / 2 ;
	var elty = (1 - projected.y) * this.container.offsetHeight / 2;

	var offset = $(this.renderer.domElement).offset();	
	eltx += offset.left;
	elty += offset.top;
		
	return { x : eltx, y : elty };
}

Shipster.SHIP_NONE = -1;
Shipster.SHIP_FEISAR = 0;
Shipster.SHIP_ENEMYSHIP = 1;
Shipster.SHIP_CRUISER = 2;

Shipster.CALLOUT_Y_OFFSET = 60;

//Custom Ship class
Ship = function()
{
	Sim.Object.call(this);
}

Ship.prototype = new Sim.Object();

Ship.prototype.init = function(url, id, scale)
{
    // Create a group to contain ship
    var modelGroup = new THREE.Object3D();
    
    // Tell the framework about our object
    this.setObject3D(modelGroup);
    
    this.scale = scale || 1;
	this.id = id;
	
    // Load the ship
    var that = this;
	var loader = new THREE.JSONLoader;
	loader.load(url, function (data) {
		that.handleLoaded(data);
	});


	// Set up the animation
    this.animator = new Sim.KeyFrameAnimator;
    this.animator.init({ 
    	interps:
    		[ 
    	    { keys:Ship.rotationKeys, values:Ship.rotationValues, target:this.object3D.rotation } 
    		],
    	loop: false,
    	duration:Ship.animation_time
    });
    this.animator.subscribe("complete", this, this.onAnimationComplete);
    this.addChild(this.animator); 
	this.animating = false;

}

Ship.prototype.handleLoaded = function(data)
{
	// Add the mesh to our group
	if (data instanceof THREE.Geometry)
	{
		var geometry = data;
		var material = new THREE.MeshFaceMaterial();
		var mesh = new THREE.Mesh( data, material);
		
		this.object3D.add( mesh );
		
	    mesh.scale.set(this.scale, this.scale, this.scale);
	    mesh.rotation.x = Math.PI / 4;
	}
}

Ship.prototype.handleMouseUp = function(x, y, point, normal)
{
	this.publish("selected", this.id);
}

Ship.prototype.handleMouseOver = function()
{
	if (!this.animating)
	{
		this.animator.start();
		this.publish("over", this.id);
		this.animating = true;
	}
}

Ship.prototype.onAnimationComplete = function()
{
	this.animating = false;
}

Ship.scaleKeys = [0, .5, 1];
Ship.scaleValues = [ { x : 1, y: 1, z : 1}, 
                        { x: 1.2, y: 1.2, z: 1.2},
                        { x: 1, y: 1, z: 1},
                        ];
Ship.rotationKeys = [0, .25, .5, .75, 1];
Ship.rotationValues = [ { y: 0 }, 
                                { y: Math.PI / 2},
                                { y: Math.PI },
                                { y: Math.PI * 3 / 2},
                                { y: Math.PI * 2},
                                ];

Ship.animation_time = 1000;