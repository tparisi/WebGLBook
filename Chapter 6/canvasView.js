// Custom CanvasView class
CanvasView = function()
{
	Sim.Object.call(this);
}

CanvasView.prototype = new Sim.Object();

CanvasView.prototype.init = function(param)
{
	param = param || {};
	
	var canvas = param.canvas || "";
	this.width = param.width || 4;
	this.height = param.height || 4;
	if (!canvas)
		return;

	var context = canvas.getContext("2d");

	var texture = new THREE.Texture(canvas);

	// Create our viewer object
	var group = new THREE.Object3D;
    var geometry = new THREE.PlaneGeometry(this.width, this.height, 16);
    var material = new THREE.MeshBasicMaterial( 
    		{ map:texture, transparent:true, opacity:1 } );
    var mesh = new THREE.Mesh( geometry, material ); 
    group.add(mesh);
    
    // Tell the framework about our object
    this.setObject3D(group);

    // Tuck away needed objects
    this.canvas = canvas;
    this.context = context;
    this.texture = texture;

    // Connect the rendering program up to our view
	this.program = param.program;
	if (this.program)
	{
		this.program.setView(this);
	}
	
    this.overCursor = 'pointer';	
}

CanvasView.prototype.update = function()
{
	// Run the rendering program
	if (this.program)
	{
		this.program.run();

		// Tell Three.js to re-render the texture
		if (this.texture)
		{
			this.texture.needsUpdate = true;
		}
	}
	
	Sim.Object.prototype.update.call(this);
}

CanvasView.prototype.handleMouseDown = function(x, y, hitPoint, hitNormal)
{
	// Marshall mouse clicks to the rendering program
	if (this.program && this.program.handleMouseDown)
	{
		var canvasCoord = this.calcCanvasCoord(hitPoint);
		this.program.handleMouseDown(canvasCoord.x, canvasCoord.y);
	}
}

CanvasView.prototype.handleMouseUp = function(x, y, hitPoint, hitNormal)
{
	// Marshall mouse clicks to the rendering program
	if (this.program && this.program.handleMouseUp)
	{
		var canvasCoord = this.calcCanvasCoord(hitPoint);
		this.program.handleMouseUp(canvasCoord.x, canvasCoord.y);
	}
}

CanvasView.prototype.handleMouseMove = function(x, y, hitPoint, hitNormal)
{
	// Marshall mouse motion to the rendering program
	if (this.program && this.program.handleMouseMove && hitPoint)
	{
		var canvasCoord = this.calcCanvasCoord(hitPoint);
		this.program.handleMouseMove(canvasCoord.x, canvasCoord.y);
	}
}

// Helper to convert object-space coordinates into canvas-space
CanvasView.prototype.calcCanvasCoord = function(point)
{
	// First, get corners of our rectangular canvas mesh
	var left = -this.width / 2;
	var bottom = -this.height / 2;

	// Now, convert those to UV space ([0..1] with +Y downward)
	var x = (point.x - left) / this.width;
	var y = 1 - ((point.y - bottom) / this.height);

	// Finally, convert UV to canvas coordinates
	x = Math.ceil(x * this.canvas.width);
	y = Math.ceil(y * this.canvas.height);
	
	return { x : x, y : y };
}
