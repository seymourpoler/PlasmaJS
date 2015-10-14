/***************************************************************************
 * Do What THe Fuck You Want To Public Licence 2                           *
 *                                                                         *
 * JavaScript implementation by Piotr Rochala (http://rocha.la/)           *
 * Based on C# work of Serge Meunier (http://www.smokycogs.com/)           *
 *                                                                         *
 * Check this code in action on http://rocha.la/javascript-plasma-fractal  *
 *                                                                         *
 **************************************************************************/

function $plasma(configuration){
	var roughness, totalSize;
	var width, height, canvas, ctx;
	var types = { PLASMA: 0, CLOUD: 1 };
	var colorModif = [255, 255, 255];
	var points;
	var self = this;
	
	width = configuration.width;
	height = configuration.height;
	roughness = configuration.rough;
	plasmaType = configuration.type;
	points = getPoints(width, height, roughness);
	canvas = document.getElementById(configuration.canvasId);
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	
	this.draw = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var x = 0; x < width; x++)
		{
			for (var y = 0; y < height; y++)
			{
				//get color for each pixel
				var color = getRGBColor(points[x][y], plasmaType);
				ctx.fillStyle = "rgb(" + color.red + "," + color.green + "," + color.blue +")";
				ctx.fillRect(x, y, 1, 1);
			}
		}
	};
	
	function getPoints(width, height, rough)  
	{  
		var p1, p2, p3, p4;  
		var points = [];
		for (var x = 0; x < width; x++)
		{
			points[x] = [];
		}
		//give corners random colors
		p1 = Math.random();
		p2 = Math.random();
		p3 = Math.random();
		p4 = Math.random();
		roughness = rough;
		totalSize = width + height;
		splitRect(points, 0, 0, width, height, p1, p2, p3, p4);
		return points;
	}
	
	function splitRect(points, x, y, width, height, p1, p2, p3, p4)
	{  
		var side1, side2, side3, side4, center;
		var transWidth = ~~(width / 2);
		var transHeight = ~~(height / 2);
		
		//as long as square is bigger then a pixel..
		if (width > 1 || height > 1)
		{  
			//center is just an average of all 4 corners
			center = ((p1 + p2 + p3 + p4) / 4);
			
			//randomly shift the middle point 
			center += shift(transWidth + transHeight);
			
			//sides are averages of the connected corners
			//p1----p2
			//|     |
			//p4----p3
			side1 = ((p1 + p2) / 2);
			side2 = ((p2 + p3) / 2);
			side3 = ((p3 + p4) / 2);
			side4 = ((p4 + p1) / 2);
			
			//its possible that middle point was moved out of bounds so correct it here
			center = normalize(center);
			side1 = normalize(side1);
			side2 = normalize(side2);
			side3 = normalize(side3);
			side4 = normalize(side4);
			
			//repear operation for each of 4 new squares created
			//recursion, baby!
			splitRect(points, x, y, transWidth, transHeight, p1, side1, center, side4);
			splitRect(points, x + transWidth, y, width - transWidth, transHeight, side1, p2, side2, center);
			splitRect(points, x + transWidth, y + transHeight, width - transWidth, height - transHeight, center, side2, p3, side3);
			splitRect(points, x, y + transHeight, transWidth, height - transHeight, side4, center, side3, p4);
		}
		else 
		{
			//when last square is just a pixel, simply average it from the corners
			points[x][y]= (p1 + p2 + p3 + p4) / 4;
		}
	}
	
	function normalize(val)  
	{  
		return (val < 0) ? 0 : (val > 1) ? 1 : val;
	}
	
	function shift(smallSize)
	{ 
		return (Math.random() - 0.5) * smallSize / totalSize * roughness;
	}
	
	function getRGBColor(c, type)
	{
		var red = 0, green = 0, blue = 0;
	
		switch (type)
		{
			case types.CLOUD:
				if (c < 0.3)
					red = c;
				red = green = c;

				blue = 1;
				break;
			case types.PLASMA:
				//r
				if (c < 0.5)
					red = c * 2;
				else
					red = (1.0 - c) * 2;

				//g
				if (c >= 0.3 && c < 0.8)
					green = (c - 0.3) * 2;
				else if (c < 0.3)
					green = (0.3 - c) * 2;
				else
					green = (1.3 - c) * 2;

				//b
				if (c >= 0.5)
					blue = (c - 0.5) * 2;
				else
					blue = (0.5 - c) * 2;
				break;
			default:
				red = green = blue = c;
				break;
		}
		return {
			red: ~~(red * colorModif[0]),
			green: ~~(green * colorModif[1]),
			blue: ~~(blue * colorModif[2])
		};
	}
}