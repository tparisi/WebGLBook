// Constructor
TextApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
TextApp.prototype = new Sim.App();

// Our custom initializer
TextApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
	// Set up some nice lighting
	var pointLight = new THREE.PointLight( 0xffcc00, 1 );
	pointLight.position.set( 0, 0, 100 );
	this.scene.add( pointLight );

	var spotLight = new THREE.SpotLight( 0xff0000, 1 );
	spotLight.position.set( 100, 100, 100 );
	this.scene.add( spotLight );
		
	// Position/orient the camera
	this.camera.position.set(0, 21, 48);
	this.camera.lookAt(new THREE.Vector3);

	// Create our text and floor
	this.createTextObjects();
	this.createFloor();
	
	// Other initialization
	this.mouseDown = false;
}

TextApp.prototype.createTextObjects = function()
{
	// Create the text objects
    var text = new TextObject();
    text.init('WebGL');
    this.addObject(text);
    this.text1 = text;

    // Create the text
    var text = new TextObject();
    text.init('WebGL');
    this.addObject(text);
	text.object3D.rotation.x = Math.PI;
	text.object3D.rotation.y = Math.PI * 2;
	text.mesh.position.z = -TextApp.TEXT_DEPTH;
	text.setPosition(0, -1, 0);
    this.text2 = text;
}

TextApp.prototype.createFloor = function()
{
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 3000 ), new THREE.MeshPhongMaterial( { color: 0x333333, specular:0xff0000, shininess:100, opacity: 0.5, transparent: true } ) );
	plane.rotation.x = -Math.PI/2;
	plane.position.z = 3;
	this.scene.add( plane );
}

TextApp.prototype.update = function()
{
	this.root.rotation.y += 0.005;
}

TextApp.prototype.handleMouseScroll = function(delta)
{
	var dx = delta;

	this.camera.position.z -= dx;	
}

TextApp.prototype.handleMouseDown = function(x, y, point, normal)
{
	this.mouseDown = true;
	this.lastx = x, this.lasty = y;
}

TextApp.prototype.handleMouseUp = function(x, y, point, normal)
{
	this.mouseDown = false;
}

TextApp.prototype.handleMouseMove = function(x, y, point, normal)
{
	if (this.mouseDown)
	{
		var dx = (x - this.lastx) * .02;
		this.root.rotation.y += dx;
		this.lastx = x;
	}
}

TextApp.TEXT_DEPTH = 2;
TextApp.TEXT_SIZE = 8;
TextApp.HOVER = 1;

//Custom Model class
TextObject = function()
{
	Sim.Object.call(this);
}

TextObject.prototype = new Sim.Object();

TextObject.prototype.init = function(str)
{
    // Create a group to contain text
    var textGroup = new THREE.Object3D();
    
    // Tell the framework about our object
    this.setObject3D(textGroup);

    this.str = str;
    this.createTextMesh();
}

TextObject.prototype.createTextMesh = function()
{
	var textMesh, textGeo, faceMaterial, textMaterialFront, textMaterialSide;

	var text = this.str;
	var height = TextApp.TEXT_DEPTH; // depth means height here
	var size = TextApp.TEXT_SIZE;

	var font = "droid sans";
	var weight = "bold";
	var style = "normal";

	var faceMaterial = new THREE.MeshFaceMaterial();

	var textMaterialFront = new THREE.MeshPhongMaterial( 
			{ color: 0xffffff, shading: THREE.FlatShading } );

	var textGeometry = new THREE.TextGeometry( text, 
			{ size: size, height: height, font: font, weight: weight, style: style,

		material: 0,
		extrudeMaterial: 0
	});

	textGeometry.materials = [ textMaterialFront ];

	textGeometry.computeBoundingBox();
	textGeometry.computeVertexNormals();

	textMesh = new THREE.Mesh( textGeometry, faceMaterial );
	var centerOffset = -0.5 * ( textGeometry.boundingBox.x[ 1 ] - 
			textGeometry.boundingBox.x[ 0 ] );
	textMesh.position.x = centerOffset;
	this.object3D.add(textMesh);
	this.mesh = textMesh;
}

TextObject.prototype.update = function()
{
	Sim.Object.prototype.update.call(this);
}
