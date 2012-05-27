//Custom Scene data class
SceneData = function()
{
	Sim.Object.call(this);
}

SceneData.prototype = new Sim.Object();

SceneData.prototype.init = function(param)
{
	var group = new THREE.Object3D;

	var that = this;

	var url = param.url || "";
	if (!url)
		return;

	var scale = param.scale || 1;
	this.scale = new THREE.Vector3(scale, scale, scale);
	
	var loader = new THREE.SceneLoader();
	loader.load( url, function( data ) { 
		that.handleLoaded(data) } );

    // Tell the framework about our object
    this.setObject3D(group);
}


SceneData.prototype.handleLoaded = function(data)
{
	this.object3D.add(data.scene);
	
	this.object3D.scale.copy(this.scale);
	
	if (this.onLoadComplete)
	{
		this.onLoadComplete(this);
	}
}


