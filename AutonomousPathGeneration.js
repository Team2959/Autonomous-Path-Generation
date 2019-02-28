// find inverted control point by using the convert point input
function ControlToInverted(wayPoint, controlPoint){
    var invertedPoint = [];
    invertedPoint[0] = wayPoint[0] + (wayPoint[0]-controlPoint[0]);
    invertedPoint[1] = wayPoint[1] + (wayPoint[1]-controlPoint[1]);
    return invertedPoint;
}

// find the current position according to the equation and time
function CurrentPosition(tTime, wayPointA, controlPointA, wayPointB, invertedPointB){
    var currentPoint = [];
    currentPoint[0] = 	(3*(1-tTime)*(1-tTime)*(1-tTime))*wayPointA[0] + 
  						(3*(1-tTime)*(1-tTime))*controlPointA[0] + 
              			(3*(1-tTime)*(1-tTime))*invertedPointB[0] + 
              			(tTime^3)*wayPointB[0];
    currentPoint[1] =   (3*(1-tTime)*(1-tTime)*(1-tTime))*wayPointA[1] + 
  		    			(3*(1-tTime)*(1-tTime))*controlPointA[1] + 
              	    	(3*(1-tTime)*(1-tTime))*invertedPointB[1] + 
                    	(tTime*tTime*tTime)*wayPointB[1];
     return currentPoint;
}

// find the left wheel position according to the equation and time
function LeftPosition(wayPointA, controlPointA, wayPointB, invertedPointB, angle, tTime, robotWidth){
    var Leftpoint = [];
    var robotHalfWidth = robotWidth/2;
    var shiftX = robotHalfWidth*Math.sin(angle);
    var shiftY = robotHalfWidth*Math.cos(angle);
	Leftpoint[0] = 	(3*(1-tTime)*(1-tTime)*(1-tTime))*(wayPointA[0]+shiftX) + 
  					(3*(1-tTime)*(1-tTime))*(controlPointA[0]+shiftX) + 
            		(3*(1-tTime)*(1-tTime))*(invertedPointB[0]+shiftX) + 
            		(tTime*tTime*tTime)*(wayPointB[0]+shiftX);
    Leftpoint[1] = 	(3*(1-tTime)*(1-tTime)*(1-tTime))*(wayPointA[1]-shiftY) + 
  					(3*(1-tTime)*(1-tTime))*(controlPointA[1]-shiftY) + 
             		(3*(1-tTime)*(1-tTime))*(invertedPointB[1]-shiftY) + 
              		(tTime*tTime*tTime)*(wayPointB[1]-shiftY);
    return Leftpoint;
}

// find the right wheel position according to the equation and time
function RightPosition(wayPointA, controlPointA, wayPointB, invertedPointB, angle, tTime, robotWidth){
    var rightPoint = [];
    var robotHalfWidth = robotWidth/2;
    var shiftX = robotHalfWidth*Math.sin(angle);
    var shiftY = robotHalfWidth*Math.cos(angle);
    rightPoint[0] = (3*(1-tTime)*(1-tTime)*(1-tTime))*(wayPointA[0]-shiftX) + 
  					(3*(1-tTime)*(1-tTime))*(controlPointA[0]-shiftX) + 
              		(3*(1-tTime)*(1-tTime))*(invertedPointB[0]-shiftX) + 
              		(tTime*tTime*tTime)*(wayPointB[0]-shiftX);
    rightPoint[1] = (3*(1-tTime)*(1-tTime)*(1-tTime))*(wayPointA[1]+shiftY) + 
  					(3*(1-tTime)*(1-tTime))*(controlPointA[1]+shiftY) + 
              		(3*(1-tTime)*(1-tTime))*(invertedPointB[1]+shiftY) + 
              		(tTime*tTime*tTime)*(wayPointB[1]+shiftY);
    return rightPoint;
}


//still working on it
// main function
function CubicBezierSpline (wayPointA, controlPointA, wayPointB, controlPointB){
    var times = [];
	var lVelocity = [];
    var rVelocity = [];
    var heading = [];
  
    var timeFrequency = 1;
    var kTime = 100;
    var kVelocity = 1000;
  
    for (var i = 0; i < 100; i++){
  	    times.push(i*kTime);
	}
    return times;
}
//document.write(CubicBezierSpline(0,0));