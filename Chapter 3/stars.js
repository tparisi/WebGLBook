// Custom Stars class
Stars = function()
{
	Sim.Object.call(this);
}

Stars.prototype = new Sim.Object();

Stars.prototype.init = function(minDistance)
{
	// Create a group to hold our Stars particles
	var starsGroup = new THREE.Object3D();

	var i;
	var starsGeometry = new THREE.Geometry();

	// Create random particle locations
	for ( i = 0; i < Stars.NVERTICES; i++)
	{

		var vector = new THREE.Vector3( (Math.random() * 2 - 1) * minDistance, 
				(Math.random() * 2 - 1) * minDistance, 
				(Math.random() * 2 - 1) * minDistance);
		
		if (vector.length() <  minDistance)
		{
			vector = vector.setLength(minDistance);
		}
		
		starsGeometry.vertices.push( new THREE.Vertex( vector ) );

	}

	// Create a range of sizes and colors for the stars
	var starsMaterials = [];
	for (i = 0; i < Stars.NMATERIALS; i++)
	{
		starsMaterials.push(
				new THREE.ParticleBasicMaterial( { color: 0x101010 * (i + 1), 
					size: i % 2 + 1, 
					sizeAttenuation: false } )
				);
	}
	
	// Create several particle systems spread around in a circle, cover the sky
	for ( i = 0; i < Stars.NPARTICLESYSTEMS; i ++ )
	{

		var stars = new THREE.ParticleSystem( starsGeometry, starsMaterials[ i % Stars.NMATERIALS ] );

		stars.rotation.y = i / (Math.PI * 2);
		
		starsGroup.add( stars );

	}

	
    // Tell the framework about our object
    this.setObject3D(starsGroup);    
}

Stars.NVERTICES = 667;
Stars.NMATERIALS = 8;
Stars.NPARTICLESYSTEMS = 24;

