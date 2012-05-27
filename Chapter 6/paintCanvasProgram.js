// PaintCanvasProgram - Simple paint program on a 2D canvas
PaintCanvasProgram = function()
{
}

PaintCanvasProgram.prototype = new Object;

PaintCanvasProgram.prototype.init = function(param)
{
	param = param || {};
	
	this.backgroundColor = param.backgroundColor || '#696969';
	this.textColor = param.textColor || '#aa0000';
	this.needsRedraw = true;
	this.running = true;
    this.items = [];
}

PaintCanvasProgram.prototype.setView = function(view)
{
	this.view = view;
	var texture = this.view.texture;
}

PaintCanvasProgram.prototype.run = function()
{
	if (this.running)
	{
		this.update();
		if (this.needsRedraw)
		{
			this.draw();
			this.needsRedraw = false;
		}
	}
}

PaintCanvasProgram.prototype.update = function()
{
	// If the mouse is held down, keep painting items under the most recent position
	if (this.mouseDown)
	{
		this.addItem(this.mouseX, this.mouseY, "rgba("
	        +Math.floor(Math.random()*255) + ","
	        +Math.floor(Math.random()*255) + ","
	        +Math.floor(Math.random()*255) + ","
	        +(Math.random() - .1) + ")",
	        10 + Math.random() * 50);		
	}
}

PaintCanvasProgram.prototype.start = function()
{
	this.running = true;
}

PaintCanvasProgram.prototype.stop = function()
{
	this.running = false;
}

PaintCanvasProgram.prototype.draw = function()
{
	// Set up drawing
	var context = this.view.context;
	var canvas = this.view.canvas;
	var texture = this.view.texture;	

	context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = this.textColor;
    
    // Draw all our items
    this.drawItems(context);
}

// Adds a new blob to the canvas and flags redraw
PaintCanvasProgram.prototype.addItem = function(x, y, fill, radius)
{
	this.items.push({ x: x, y: y, fill: fill, radius:radius});
	this.needsRedraw = true;
}

// Draw each item in the list
PaintCanvasProgram.prototype.drawItems = function(context)
{
    len = this.items.length;
    for (i = 0; i < len; i++)
    {
    	var item = this.items[i];
	    context.fillStyle = item.fill;
	    context.beginPath();
	    context.arc(item.x,item.y,item.radius,0,Math.PI*2,true);
	    context.closePath();
	    context.fill();
    }
}

PaintCanvasProgram.prototype.handleMouseUp = function(x, y)
{
	// Stop painting items
	this.mouseDown = false;
}

PaintCanvasProgram.prototype.handleMouseDown = function(x, y)
{
	// Start painting items under the mouse position
	this.mouseDown = true;
	this.mouseX = x;
	this.mouseY = y;
	
    this.addItem(x, y, "rgba("
            +Math.floor(Math.random()*255) + ","
            +Math.floor(Math.random()*255) + ","
            +Math.floor(Math.random()*255) + ","
            +(Math.random() - .1) + ")",
            10 + Math.random() * 50);
	
}

PaintCanvasProgram.prototype.handleMouseMove = function(x, y)
{
	// Paint items under the mouse position
	if (this.mouseDown)
	{
		this.mouseX = x;
		this.mouseY = y;
	    this.addItem(x, y, "rgba("
	            +Math.floor(Math.random()*255) + ","
	            +Math.floor(Math.random()*255) + ","
	            +Math.floor(Math.random()*255) + ","
	            +(Math.random() - .1) + ")",
	            10 + Math.random() * 50);
	}	
}


