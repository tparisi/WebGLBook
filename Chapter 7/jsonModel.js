//Custom JSON model class
JSONModel = function()
{
	Sim.Object.call(this);
}

JSONModel.prototype = new Sim.Object();

JSONModel.prototype.init = function(param)
{
	var group = new THREE.Object3D;

	var that = this;

	var url = param.url || "";
	if (!url)
		return;

	var scale = param.scale || 1;
	
	this.scale = new THREE.Vector3(scale, scale, scale);
	var loader = new THREE.JSONLoader();
	loader.load( url, function( data ) { 
		that.handleLoaded(data) } );

    // Tell the framework about our object
    this.setObject3D(group);
}


JSONModel.prototype.handleLoaded = function(data)
{
	if (data instanceof THREE.Geometry)
	{
		var geometry = data;
		
		// Just in case model doesn't have normals
		geometry.computeVertexNormals();
		
		var material = new THREE.MeshFaceMaterial();
		var mesh = new THREE.Mesh( geometry, material  );
		mesh.scale.copy(this.scale);
		this.object3D.add( mesh );	
	}
}


