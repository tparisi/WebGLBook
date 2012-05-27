// Simple WebGL Detector
Sim.WebGLDetector = {
	
	detectWebGL : function()
	{
		var canvas = document.createElement("canvas");
		
	    var gl = null;
	    var msg = "Your browser does not support WebGL, or it is not enabled by default.";
	    try 
	    {
	        gl = canvas.getContext("experimental-webgl");
	    } 
	    catch (e)
	    {
	        msg = "Error creating WebGL Context!: " + e.toString();
	    }
	
	    if (!gl)
	    {
	    	throw new Error(msg);
	    }
	},
		
};	