//Custom Exhaust class
Exhaust = function()
{
	Sim.Object.call(this);
}

Exhaust.prototype = new Sim.Object();

Exhaust.prototype.init = function(param)
{
	this.setObject3D(new THREE.Object3D);
	
	this.initParticles();
}

Exhaust.prototype.initParticles = function()
{
	var sphereRadius = 1;
	
	var particleCount = 100;
	var particles = new THREE.Geometry();


	var pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xffffff,
			size: 1,
			opacity:.05,
			transparent:true,
			map: new THREE.ImageUtils.loadTexture('../images/smoke-2.png')
		});


	for(var p = 0; p < particleCount; p++) {

		var radius =  sphereRadius*0.05;
		var angle = Math.random() * (Math.PI * 2)
		var pX = Math.sin(angle) * radius,
			pY = Math.random() * 1,
			pZ = 0,
		    particle = new THREE.Vertex(
				new THREE.Vector3(pX, pY, pZ)
			);

		particle.velocity = new THREE.Vector3(
			Math.random()-0.5,				// x
			Math.random()*0.25,	// y
			0);				// z

		particles.vertices.push(particle);
	}

	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		pMaterial);

	particleSystem.position.y = sphereRadius*-0.2;

	particleSystem.sortParticles = false;

	// add it to the scene
	this.object3D.add(particleSystem);
	
	this.particleCount = particleCount;
	this.particles = particles;
	this.particleSystem = particleSystem;
	this.sphereRadius = sphereRadius;
}

Exhaust.prototype.update = function()
{
	//update particles
	var pCount = this.particleCount;
	while(pCount--) {

		var particle = this.particles.vertices[pCount];

		if(particle.position.y > .25 || particle.position.y < 0) {
			particle.position.y = 0;
			var radius =  this.sphereRadius*0.05;
			var angle = Math.random() * (Math.PI * 2);
			particle.position.x = Math.cos(angle) * radius;
		}

		//continue;
		
		var t = Date.now() / 1000 % 3;
		particle.position.x += Math.cos(t*particle.velocity.x) * .007;
		particle.position.y += Math.sin(t*particle.velocity.y) * .05;

	}
	this.particleSystem.geometry.__dirtyVertices = true;
}