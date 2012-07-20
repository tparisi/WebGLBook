//Custom Car class
Player = function()
{
	Car.call(this);
}

Player.prototype = new Car();

Player.prototype.init = function(param)
{
	Car.prototype.init.call(this, param);

	this.camera = param.camera;
	this.speed = 0;
	this.acceleration = 0;
	this.rpm = 0;
	this.playingRevSound = false;
	this.revStartTime = 0;
	
	if (this.sounds)
	{
		this.revSound = this.sounds["rev_short"];
		this.revSoundLong = this.sounds["rev_long"];
	}
	else
	{
		this.revSound = null;
		this.revSoundLong = null;
	}
	
	this.keysDown = [];
	this.keysDown[Sim.KeyCodes.KEY_LEFT] = false;
	this.keysDown[Sim.KeyCodes.KEY_RIGHT] = false;
	this.keysDown[Sim.KeyCodes.KEY_UP] = false;
	this.keysDown[Sim.KeyCodes.KEY_DOWN] = false;	
}

Player.prototype.updateCamera = function()
{
	var camerapos = new THREE.Vector3(Player.CAMERA_OFFSET_X, 
			Player.CAMERA_OFFSET_Y, Player.CAMERA_OFFSET_Z);
	camerapos.addSelf(this.object3D.position);
	this.camera.position.copy(camerapos);
	this.camera.lookAt(this.object3D.position);

	// Rotate particle system to view-aligned to avoid nasty alpha sorting artifacts
	if (this.exhaust1)
	{
		this.exhaust1.object3D.rotation.x = this.camera.rotation.x;
	}
	
	if (this.exhaust2)
	{
		this.exhaust2.object3D.rotation.x = this.camera.rotation.x;
	}

}

Player.prototype.update = function()
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

			if (this.revSound)
			{
				this.revSound.pause();
			}
			
			if (this.revSoundLong)
			{
				this.revSoundLong.pause();
			}
		}		

		var now = Date.now();
		var deltat = now - this.curTime;
		this.curTime = now;
		
		var turning = false;
		if (this.keysDown[Sim.KeyCodes.KEY_LEFT])
		{
			this.turn(-0.1);
			turning = true;
		}
		
		if (this.keysDown[Sim.KeyCodes.KEY_RIGHT])
		{
			this.turn(0.1);
			turning = true;
		}

		if (!turning)
		{
			this.turn(0);
		}
		
		if (this.keysDown[Sim.KeyCodes.KEY_UP])
		{
			this.accelerate(0.02);
		}		
		else if (this.keysDown[Sim.KeyCodes.KEY_DOWN])
		{
			this.accelerate(-0.02);
		}	
		else
		{
			this.accelerate(-0.01);
		}

		var dist = deltat / 1000 * this.speed / this.speedFactor;
		this.object3D.position.z -= dist;
		
		this.updateCamera();
		
		if (this.speed < 0)
		{
			this.speed = 0;
		}
	}	

	Sim.Object.prototype.update.call(this);

}

Player.prototype.turn = function(delta)
{
	this.object3D.position.x += delta;
	if (delta < 0)
	{
		this.object3D.rotation.y = Math.PI / 8;
	}
	else if (delta > 0)
	{
		this.object3D.rotation.y = -Math.PI / 8;
	}
	else
	{
		this.object3D.rotation.y = 0;
	}
}

Player.prototype.accelerate = function(delta)
{
	// Update acceleration value
	if (this.acceleration > 0 && delta < 0)
	{
		this.acceleration = delta;
	}
	else if (this.acceleration < 0 && delta > 0)
	{
		this.acceleration = delta;
	}
	else
	{
		this.acceleration += delta;		
		this.rpm += delta * Player.MAX_RPM;
	}
	
	if (this.rpm > Player.MAX_RPM)
	{
		this.rpm = Player.MAX_RPM;
	}
	
	if (this.acceleration > Player.MAX_ACCELERATION)
	{
		this.acceleration = Player.MAX_ACCELERATION;
	}

	if (this.acceleration < -Player.MAX_ACCELERATION)
	{
		this.acceleration = -Player.MAX_ACCELERATION;
	}
	
	// Now apply it to speed
	this.speed += (this.acceleration * 1000 / 3600);
	if (this.speed < 0)
	{
		this.speed = 0;
	}
	
	if (this.speed > Player.MAX_SPEED)
	{
		this.speed = Player.MAX_SPEED;
	}
	
	
	if (this.sounds)
	{
		if (delta > 0)
		{
			if (!this.playingRevSound || (this.playingRevSound && this.revSound.ended))
			{
				this.revSound.play();
				this.playingRevSound = true;
			}
			
			if (!this.revStartTime)
			{
				this.revStartTime = Date.now();
			}
			else
			{
				var revTime = Date.now() - this.revStartTime;
				if (revTime > Player.REV_LONG_THRESHOLD)
				{
					this.revSoundLong.play();
				}
			}
		}
		else
		{
			this.revStartTIme = 0;
		}
	}
	
}


Player.prototype.handleKeyDown = function(keyCode, charCode)
{
	this.keysDown[keyCode] = true;
}

Player.prototype.handleKeyUp = function(keyCode, charCode)
{
	this.keysDown[keyCode] = false;
}

Player.MAX_SPEED = 250 * 1000 / 3600;
Player.MAX_ACCELERATION = 3;
Player.MAX_RPM = 5000;

Player.CAMERA_OFFSET_X = 0;		// meters
Player.CAMERA_OFFSET_Y = 1.333;
Player.CAMERA_OFFSET_Z = 5;

Player.REV_LONG_THRESHOLD = 500; // ms