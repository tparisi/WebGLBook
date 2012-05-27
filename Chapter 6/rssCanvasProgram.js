// RSSCanvasProgram - Draws something on a canvas
RSSCanvasProgram = function()
{
}

RSSCanvasProgram.prototype = new Object;

RSSCanvasProgram.prototype.init = function(param)
{
	param = param || {};
	
	this.url = param.url;
	this.backgroundColor = param.backgroundColor || '#696969';
	this.textColor = param.textColor || '#aa0000';
	this.titleColor = param.titleColor || this.textColor;
	this.headingColor = param.headingColor || this.textColor;
	this.titlePointSize = param.titlePointSize || 20;
	this.descriptionPointSize = param.descriptionPointSize || 14;
	this.datePointSize = param.datePointSize || 10;
	this.running = true;
    this.items = [];
    
    this.fetchRSS();
}

RSSCanvasProgram.prototype.setView = function(view)
{
	this.view = view;
	var texture = this.view.texture;
    texture.wrapT = true;
}

RSSCanvasProgram.prototype.fetchRSS = function(d)
{
    this.lastFetchTime = Date.now();

    var that = this;
	$.get('rssproxy.php?url=' + this.url, function(d) { that.handleRSSData(d) } );
}

RSSCanvasProgram.prototype.handleRSSData = function(d)
{
	var that = this;
	var itemsAdded = false;
	
	//find each 'item' in the file and parse it
	$(d).find('item').each(
		function()
		{

			//name the current found item this for this particular loop run
				var item = $(this);
				that.addItem(item);
				itemsAdded = true;
			}
		);
	
	if (itemsAdded)
	{
		this.needsRedraw = true;
	}
}

RSSCanvasProgram.prototype.addItem = function(item)
{
	// grab the post title
	var title = item.find('title').text();
	// grab the post's URL
	var link = item.find('link').text();
	// next, the description
	var description = item.find('description').text();
	//don't forget the pubdate
	var pubDate = item.find('pubDate').text();
	
	this.items.push({ title : title, link : link, description : description, pubDate :
		pubDate });
}

RSSCanvasProgram.prototype.run = function()
{
	if (this.running)
	{
		var texture = this.view.texture;
		texture.offset.y += 0.001;
		
		if (this.needsRedraw)
		{
			this.draw();
			this.needsRedraw = false;
		}
	}
	
	var deltat = Date.now() - this.lastFetchTime;
	if (deltat > RSSCanvasProgram.FETCH_INTERVAL)
	{
		this.fetchRSS();
	}
}

RSSCanvasProgram.prototype.toggleRun = function()
{
	this.running = !this.running;
}

RSSCanvasProgram.prototype.handleMouseUp = function(x, y)
{
	this.toggleRun();
}

RSSCanvasProgram.prototype.start = function()
{
	this.running = true;
}

RSSCanvasProgram.prototype.stop = function()
{
	this.running = false;
}

RSSCanvasProgram.prototype.draw = function()
{
	var context = this.view.context;
	var canvas = this.view.canvas;
	var texture = this.view.texture;	

	context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = this.titleColor;
    context.font = "italic " + this.titlePointSize + "pt Arial";
    var x = canvas.width / 2;
    var y = RSSCanvasProgram.top_margin;
    context.fillText("TOP STORIES (CNN)", x, y);
    this.drawItems(context);
}

RSSCanvasProgram.prototype.drawItems = function(context)
{
    context.textAlign = "left";
    context.textBaseline = "middle";
    var x = RSSCanvasProgram.left_margin ;
    var y = RSSCanvasProgram.top_margin + this.titlePointSize + 10;

    var i, len = this.items.length;
    for (i = 0; i < len; i++)
    {
    	var item = this.items[i];
        context.font = "italic " + this.titlePointSize + "pt Arial";
        context.fillStyle = this.headingColor;
        context.fillText(item.title, x, y);
        y += (this.titlePointSize + 6);
        context.font = this.descriptionPointSize + "pt Arial Narrow";
        context.fillStyle = this.textColor;
        context.fillText(item.description, x, y);
        y += (this.descriptionPointSize + 6);
        context.font = this.datePointSize + "pt Arial Narrow";
        context.fillText(item.pubDate, x, y);
        y += (this.datePointSize + 10);
    }
}

RSSCanvasProgram.left_margin = 10;
RSSCanvasProgram.top_margin = 60;
RSSCanvasProgram.FETCH_INTERVAL = 300 * 1000; // 300 seconds i.e. 5 mins
