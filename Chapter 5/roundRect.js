// RoundRect class
RoundRect = function()
{
	Sim.Object.call(this);
}

RoundRect.prototype = new Sim.Object();

RoundRect.prototype.init = function(radius, width, height) 
{  
	// Create an empty geometry object to hold the line vertex data
	var geometry = new THREE.Geometry();
	
	var ang = 0; 
	geometry.vertices.push( new THREE.Vertex (new THREE.Vector3(0, radius, 0)));
	geometry.vertices.push( new THREE.Vertex (new THREE.Vector3(0, height - radius, 0)));
	geometry.vertices.push( new THREE.Vertex (new THREE.Vector3(radius, 0, 0)));
	geometry.vertices.push( new THREE.Vertex (new THREE.Vector3(width - radius, 0, 0)));

		glVertex2f(x + radius, y); 
		glVertex2f(x + width - radius, y);//Top Line 

		glVertex2f(x + width, y + radius); 
		glVertex2f(x + width, y + height - radius);//Right Line 

		glVertex2f(x + radius, y + height); 
		glVertex2f(x + width - radius, y + height);//Bottom Line 
	   glEnd(); 

	float cX= x+radius, cY = y+radius; 
	glBegin(GL_LINE_STRIP); 
		for(ang = PI; ang <= (1.5*PI); ang = ang + 0.05) 
		{ 
			glVertex2d(radius* cos(ang) + cX, radius * sin(ang) + cY); //Top Left 
		}  
		cX = x+width-radius; 
	glEnd(); 
	glBegin(GL_LINE_STRIP); 
		for(ang = (1.5*PI); ang <= (2 * PI); ang = ang + 0.05) 
		{ 
			glVertex2d(radius* cos(ang) + cX, radius * sin(ang) + cY); //Top Right 
		} 
	glEnd(); 
	glBegin(GL_LINE_STRIP); 
		cY = y+height-radius; 
		for(ang = 0; ang <= (0.5*PI); ang = ang + 0.05) 
		{ 
			glVertex2d(radius* cos(ang) + cX, radius * sin(ang) + cY); //Bottom Right 
		} 
	glEnd(); 
	glBegin(GL_LINE_STRIP); 
		cX = x+radius; 
		for(ang = (0.5*PI); ang <= PI; ang = ang + 0.05) 
		{ 
			glVertex2d(radius* cos(ang) + cX, radius * sin(ang) + cY);//Bottom Left 
		} 
	glEnd(); 
}



