// Constructor
InteractionApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
InteractionApp.prototype = new Sim.App();

// Our custom initializer
InteractionApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a directional light to show off the Control
	var light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(1, 0, 1).normalize();
	this.scene.add(light);
	
	this.camera.position.set(0, 1, 6);
	this.camera.lookAt(this.root);
	
	this.controls = [];
	
    // Create the Control and add it to our sim
    var comment = new Control();
    comment.init({ id : Control.ID_COMMENT, icon : "../images/icons/comment.png" });
    this.addObject(comment);
    this.controls.push(comment);

    // Create the Control and add it to our sim
    var info = new Control();
    info.init({ id : Control.ID_INFO, icon : "../images/icons/info.png" });
    this.addObject(info);
    this.controls.push(info);

    // Create the Control and add it to our sim
    var clock = new Control();
    clock.init({ id : Control.ID_CLOCK, icon : "../images/icons/clock.png" });
    this.addObject(clock);
    this.controls.push(clock);

    // Create the Control and add it to our sim
    var favorite = new Control();
    favorite.init({ id : Control.ID_FAVORITE, icon : "../images/icons/favorite.png" });
    this.addObject(favorite);
    this.controls.push(favorite);
    
    // Create the Control and add it to our sim
    var help = new Control();
    help.init({ id : Control.ID_HELP, icon : "../images/icons/help.png" });
    this.addObject(help);
    this.controls.push(help);
    
    this.layoutControls();
    
    this.selectedControl = null;
    
}

InteractionApp.prototype.layoutControls = function()
{
	var scale = 2;
	var theta = 0;
	var x = scale * Math.sin(theta);
	var z = scale * Math.cos(theta);
	var y = 0;

	var nControls = this.controls.length;
	var left = (nControls - 1 )/ 2 * -scale;
	
	var i;

	x = left;
	y = z = 0;
	for (i = 0; i < nControls; i++)
	{
		this.controls[i].setPosition(x, y, z);
		x += scale;
		
		this.controls[i].subscribe("selected", this, this.onControlSelected)
	}
}

InteractionApp.prototype.onControlSelected = function(control, selected)
{
	if (control == this.selectedControl)
	{
		if (!selected)
		{
			this.selectedControl = null;
		}
	}
	else
	{
		if (selected)
		{
			if (this.selectedControl)
			{
				this.selectedControl.deselect();
			}
			this.selectedControl = control;
		}
	}
}

InteractionApp.prototype.update = function()
{
    TWEEN.update();

    Sim.App.prototype.update.call(this);
}

// Custom Control class
Control = function()
{
	Sim.Object.call(this);
}

Control.prototype = new Sim.Object();

Control.prototype.init = function(param)
{
	this.id = param.id || Control.ID_NONE;
	
	var icon = param.icon || '';
	var map = THREE.ImageUtils.loadTexture(icon);
	
    // Create our Control
    var geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    var material = new THREE.MeshPhongMaterial( 
    		{ color: 0xffffff, ambient: 0xababab, transparent:true, map:map } );
    var mesh = new THREE.Mesh( geometry, material ); 
    mesh.doubleSided = true;
    // mesh.position.set(-2, 0, 2);
    // mesh.rotation.x = Math.PI / 12;
    
    // Tell the framework about our object
    this.setObject3D(mesh);
    this.mesh = mesh;
    
    this.selected = false;
    
    // Have the framework show the pointer when over
    this.overCursor = 'pointer';
}

Control.prototype.handleMouseOver = function(x, y)
{
	this.mesh.scale.set(1.05, 1.05, 1.05);
	this.mesh.material.ambient.setRGB(.777,.777,.777);
}

Control.prototype.handleMouseOut = function(x, y)
{
	this.mesh.scale.set(1, 1, 1);
	this.mesh.material.ambient.setRGB(.667, .667, .667);
}

Control.prototype.handleMouseDown = function(x, y, position)
{
	if (!this.selected)
	{
		this.select();
	}
	else
	{
		this.deselect();
	}
}

Control.prototype.select = function()
{
	if (!this.savedposition)
	{
		this.savedposition = this.mesh.position.clone();
	}
	
	new TWEEN.Tween(this.mesh.position)
    .to({
        x : 0,
        y : 0,
        z: 2
    	}, 500).start();
	
	this.selected = true;
	this.publish("selected", this, true);
}

Control.prototype.deselect = function()
{
	new TWEEN.Tween(this.mesh.position)
    .to({ x: this.savedposition.x, 
    	  y: this.savedposition.y,
    	  z: this.savedposition.z
    	}, 500).start();
	
	this.selected = false;
	this.publish("selected", this, false);
}

Control.ID_NONE = -1;
Control.ID_COMMENT = 0;
Control.ID_INFO = 1;
Control.ID_CLOCK = 2;
Control.ID_FAVORITE = 3;
Control.ID_HELP = 4;
