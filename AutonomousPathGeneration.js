// find inverted control point by using the convert point input
function ControlToInverted(wayPoint, controlPoint){
    var invertedPoint = [];
    invertedPoint[0] = wayPoint[0] + (wayPoint[0]-controlPoint[0]);
    invertedPoint[1] = wayPoint[1] + (wayPoint[1]-controlPoint[1]);
    return invertedPoint;
}

// find the current position according to the equation and time
function CurrentPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime){
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
function LeftPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime, angle, robotWidth){
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
function RightPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime, angle, robotWidth){
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

// find the angle where the robot is heading to
function FindHeadingAngle(currentPoint, pastPoint){
    return Math.atan((currentPoint[0]-pastPoint[0])/(currentPoint[1]-pastPoint[1]))/Math.PI()+"π"+" radian(s)";
}

// find the distance between points
function MessureDistanceBetweenPoints(pointA, pointB){
    return Math.sqrt(Math.pow((pointA[0]-pointB[0]),2)+Math.pow((pointA[1]-pointB[1]),2));
}

// main function
function CubicBezierSpline (wayPointA, controlPointA, wayPointB, controlPointB, robotWidth){
    var allData = [times, lVelocity, rVelocity, headingAngle];
    var times = [];
	var lVelocity = [];
    var rVelocity = [];
    var headingAngle = [];
    
    var invertedPointB = ControlToInverted(wayPointB, controlPointB);

    var timeFrequency = 0.01;
    var kTime = 10000;
    var kVelocityMax = 1000;
    
    var timeDifferent = 0.001;
    var currentPoint = CurrentPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime);
    var pastPoint    = CurrentPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime - timeDifferent);
    
    for (var i = 0; i < 1; i = i + timeFrequency){
        times.push(i*kTime);
        headingAngle.push(FindHeadingAngle(currentPoint, pastPoint));

        var currentLeft  = LeftPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime, angle, robotWidth);
        var pastLeft     = LeftPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime - timeDifferent, angle, robotWidth);
        var currentRight = RightPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime, angle, robotWidth);
        var pastRight    = RightPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime - timeDifferent, angle, robotWidth);
        
        lVelocity.push(((MessureDistanceBetweenPoints(currentLeft, pastLeft))/timeDifferent)*kVelocityMax);
        rVelocity.push(((MessureDistanceBetweenPoints(currentRight, pastRight))/timeDifferent)*kVelocityMax);
	}
    return allData;
}
// document.write(CubicBezierSpline([0,0],[3,0],[5,5],[8,5]));