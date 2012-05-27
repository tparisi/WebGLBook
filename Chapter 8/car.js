//Custom Car class
Car = function()
{
	Sim.Object.call(this);
}

Car.prototype = new Sim.Object();

Car.prototype.init = function(param)
{
	param = param || {};
	
	var mesh = param.mesh;
	if (!mesh)
		return;

	// Create a group to hold the car
	var group = new THREE.Object3D;
    this.setObject3D(group);

    // Add the mesh to our group
	this.object3D.add( mesh );		
	this.mesh = mesh;
	
	this.running = false;
	this.curTime = Date.now();
	
	this.speed = Car.DEFAULT_SPEED;
	this.speedFactor = Car.DEFAULT_SPEED_FACTOR;
	
	this.createCrashAnimation();
	this.createBounceAnimation();

	if (param.exhaust)
	{
		this.createExhaust();
	}
	
	// Hang on to the sound library
	this.sounds = param.sounds;
}

Car.prototype.createExhaust = function()
{
	var exhaust1 = new Exhaust;
	exhaust1.init();
	exhaust1.object3D.position.set(-.333, .2, 2);
	this.exhaust1 = exhaust1;

	var exhaust2 = new Exhaust;
	exhaust2.init();
	exhaust2.object3D.position.set(.444, .2, 2);
	this.exhaust2 = exhaust2;

}

Car.prototype.update = function()
{
	if (this.running)
	{
		if (this.crashed)
		{
			this.speed -= (1000 / 3600);
			if (this.speed < 0)
			{
				this.speed = 0;
				this.running = false;
			}
		}
		
		var now = Date.now();
		var deltat = now - this.curTime;
		this.curTime = now;
		
		var dist = deltat / 1000 * this.speed / this.speedFactor;
		this.object3D.position.z -= dist;
	}
	
	Sim.Object.prototype.update.call(this);
}

Car.prototype.start = function()
{
	if (this.exhaust1)
	{
		this.addChild(this.exhaust1);
	}

	if (this.exhaust2)
	{
		this.addChild(this.exhaust2);
	}
	
	this.running = true;
}

Car.prototype.stop = function()
{
	if (this.exhaust1)
	{
		this.removeChild(this.exhaust1);
	}

	if (this.exhaust2)
	{
		this.removeChild(this.exhaust2);
	}
	
	if (this.sounds)
	{
		var rev_short = this.sounds["rev_short"];
		rev_short.pause();
		
		var rev_long = this.sounds["rev_long"];
		rev_long.pause();

		var bounce = this.sounds["bounce"];
		bounce.pause();
	
	}
	
	this.running = false;
}

Car.prototype.crash = function()
{
	if (this.exhaust1)
	{
		this.removeChild(this.exhaust1);
	}

	if (this.exhaust2)
	{
		this.removeChild(this.exhaust2);
	}
	
	this.crashed = true;
	this.animateCrash(true);

	if (this.sounds)
	{
		var rev_short = this.sounds["rev_short"];
		rev_short.pause();
		
		var rev_long = this.sounds["rev_long"];
		rev_long.pause();
		
		var bounce = this.sounds["bounce"];
		bounce.pause();
		
		var crash = this.sounds["crash"];
		crash.play();
	}

}

Car.prototype.bounce = function()
{
	this.animateBounce(true);

	if (this.sounds)
	{
		var bounce = this.sounds["bounce"];
		bounce.play();
	}

}

Car.prototype.createCrashAnimation = function()
{
    this.crashAnimator = new Sim.KeyFrameAnimator;
    this.crashAnimator.init({ 
    	interps:
    		[ 
    	    { keys:Car.crashPositionKeys, values:Car.crashPositionValues, target:this.mesh.position },
    	    { keys:Car.crashRotationKeys, values:Car.crashRotationValues, target:this.mesh.rotation } 
    		],
    	loop: false,
    	duration:Car.crash_animation_time
    });

    this.addChild(this.crashAnimator);    
    this.crashAnimator.subscribe("complete", this, this.onCrashAnimationComplete);	
}

Car.prototype.animateCrash = function(on)
{
	if (on)
	{
	    this.crashAnimator.start();
	}
	else
	{
		this.crashAnimator.stop();
	}
}

Car.prototype.onCrashAnimationComplete = function()
{
}

Car.prototype.createBounceAnimation = function()
{
    this.bounceAnimator = new Sim.KeyFrameAnimator;
    this.bounceAnimator.init({ 
    	interps:
    		[ 
    	    { keys:Car.bounceRotationKeys, values:Car.bounceRotationValues, target:this.mesh.rotation } 
    		],
    	loop: false,
    	duration:Car.bounce_animation_time
    });

    this.addChild(this.bounceAnimator);    
    this.bounceAnimator.subscribe("complete", this, this.onBounceAnimationComplete);	
}

Car.prototype.animateBounce = function(on)
{
	if (on)
	{
	    this.bounceAnimator.start();
	}
	else
	{
		this.bounceAnimator.stop();
	}
}

Car.prototype.onBounceAnimationComplete = function()
{
}


Car.crashPositionKeys = [0, .25, .75, 1];
Car.crashPositionValues = [ { x : -1, y: 0, z : 0}, 
                        { x: 0, y: 1, z: -1},
                        { x: 1, y: 0, z: -5},
                        { x : -1, y: 0, z : -2}
                        ];
Car.crashRotationKeys = [0, .25, .5, .75, 1];
Car.crashRotationValues = [ { z: 0, y: 0 }, 
                                { z: Math.PI, y: 0},
                                { z: Math.PI * 2, y: 0},
                                { z: Math.PI * 2, y: Math.PI},
                                { z: Math.PI * 2, y: Math.PI * 2},
                                ];

Car.crash_animation_time = 2000;

Car.bounceRotationKeys = [0, .25, .5, .75, 1];
Car.bounceRotationValues = [ { z: 0, y: 0 }, 
                                { z: Math.PI / 8, y: 0},
                                { z: 0, y: 0},
                                { z: -Math.PI / 8, y: 0},
                                { z: 0, y: 0},
                                ];

Car.bounce_animation_time = 500;

Car.DEFAULT_SPEED = 100 * 1000 / 3600;
Car.DEFAULT_SPEED_FACTOR = 2;
Car.CAR_LENGTH = 4.2; // Supposedly, average car length
Car.CAR_WIDTH = 1.8;
Car.CAR_HEIGHT = 1.2;
