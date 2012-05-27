// Sim.js utilities
Sim.Utils = {};

Sim.Utils.orientationToQuaternion = function(vec)
{
	var axis = new THREE.Vector3(0, 1, 0);
	var cross = new THREE.Vector3;
	cross.cross(axis, vec);
	if (!cross.length())
	{
		axis.set(0, 0, 1);
		cross.cross(vec, axis);
		if (!cross.length())
		{
			axis.set(1, 0, 0);
			cross.cross(vec, axis);
		}
	}
	
	var angle = Math.acos(vec.dot(axis));

	if (false) // angle > Math.PI / 2)
	{
		axis.multiplyScalar(-1);
		cross.cross(vec, axis);
		angle = Math.acos(vec.dot(axis));
	}

//		console.log("Cross: " + cross.x + ", " + cross.y + ", " + cross.z + "; Angle: " + angle)
	
	var mat = new THREE.Matrix4().setRotationAxis(cross, angle);
	var quaternion = new THREE.Quaternion();
	mat.decompose(null, quaternion, null);
	
	return quaternion;
}
