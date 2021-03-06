    // program for finding times, left wheel velocity, right wheel velocity, and the angle that the robot is heading to, when the robot is moving according to the cubic bezier spline path. 
    // to use program:
    // - download node.js
    // - download "npm install fractional" through node.js command line

// var Fraction = require('fractional').Fraction;
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
    currentPoint[0] = 	((1-tTime)*(1-tTime)*(1-tTime)) * wayPointA[0] + 
  						(3*(1-tTime)*(1-tTime)*tTime) * controlPointA[0] + 
              			(3*(1-tTime)*tTime*tTime) * invertedPointB[0] + 
              			(tTime*tTime*tTime) * wayPointB[0];
    currentPoint[1] =   ((1-tTime)*(1-tTime)*(1-tTime)) * wayPointA[1] + 
  		    			(3*(1-tTime)*(1-tTime)*tTime) * controlPointA[1] + 
              	    	(3*(1-tTime)*tTime*tTime) * invertedPointB[1] + 
                        (tTime*tTime*tTime) * wayPointB[1];           
    return currentPoint;
}

// find the left wheel position according to the equation and time
function LeftPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime, angle, robotWidth){
    var Leftpoint = [];
    var robotHalfWidth = robotWidth/2;
    var shiftX = robotHalfWidth*Math.sin(angle);
    var shiftY = robotHalfWidth*Math.cos(angle);
	Leftpoint[0] = 	((1-tTime)*(1-tTime)*(1-tTime)) * (wayPointA[0]-shiftX) + 
                    (3*(1-tTime)*(1-tTime)*tTime) * (controlPointA[0]-shiftX) + 
            		(3*(1-tTime)*tTime*tTime) * (invertedPointB[0]-shiftX) + 
            		(tTime*tTime*tTime) * (wayPointB[0]-shiftX);
    Leftpoint[1] = 	((1-tTime)*(1-tTime)*(1-tTime)) * (wayPointA[1]+shiftY) + 
                    (3*(1-tTime)*(1-tTime)*tTime) * (controlPointA[1]+shiftY) + 
                    (3*(1-tTime)*tTime*tTime) * (invertedPointB[1]+shiftY) + 
                    (tTime*tTime*tTime) * (wayPointB[1]+shiftY);
    // console.log(shiftX);
    // console.log(shiftY);
    return Leftpoint;
}

// find the right wheel position according to the equation and time
function RightPosition(wayPointA, controlPointA, wayPointB, invertedPointB, tTime, angle, robotWidth){
    var rightPoint = [];
    var robotHalfWidth = robotWidth/2;
    var shiftX = robotHalfWidth*Math.sin(angle);
    var shiftY = robotHalfWidth*Math.cos(angle);
    rightPoint[0] = ((1-tTime)*(1-tTime)*(1-tTime)) * (wayPointA[0]+shiftX) + 
                    (3*(1-tTime)*(1-tTime)*tTime) * (controlPointA[0]+shiftX) + 
                    (3*(1-tTime)*tTime*tTime) * (invertedPointB[0]+shiftX) + 
              		(tTime*tTime*tTime) * (wayPointB[0]+shiftX);
    rightPoint[1] = ((1-tTime)*(1-tTime)*(1-tTime)) * (wayPointA[1]-shiftY) + 
                    (3*(1-tTime)*(1-tTime)*tTime) * (controlPointA[1]-shiftY) + 
                    (3*(1-tTime)*tTime*tTime) * (invertedPointB[1]-shiftY) + 
              		(tTime*tTime*tTime) * (wayPointB[1]-shiftY);
    return rightPoint;
}

// find the angle where the robot is heading to
function FindHeadingAngle(wayPointA, controlPointA, wayPointB, invertedPointB, tTime){
    var dxdt =  (3*(1-tTime)*(1-tTime)) * (controlPointA[0]-wayPointA[0]) + 
                (6*(1-tTime)*tTime) * (invertedPointB[0]-controlPointA[0]) +
                (3*tTime*tTime) * (wayPointB[0]-invertedPointB[0]);

    var dydt =  (3*(1-tTime)*(1-tTime)) * (controlPointA[1]-wayPointA[1]) + 
                (6*(1-tTime)*tTime) * (invertedPointB[1]-controlPointA[1]) +
                (3*tTime*tTime) * (wayPointB[1]-invertedPointB[1]);

    return Math.atan2(dydt, dxdt);
}

// convert radian to a readble radian
function NumberToDecimalRadian(number){
    return number / Math.PI + "π" + " radian(s)"; 
}

// convert radian to a readble radian
function NumberToFractionRadian(number){
    return "(" + new Fraction(number/Math.PI).toString() + ")" + "π" + " radian(s)"; 
}

// find the distance between points
function MessureDistanceBetweenPoints(pointA, pointB){
    return Math.sqrt(Math.pow((pointA[0]-pointB[0]), 2) + Math.pow((pointA[1]-pointB[1]), 2));
}

// find the robot velocity
function RobotVelocity(wayPointA, controlPointA, wayPointB, invertedPointB, tTime){
    var dxdt =  (3*(1-tTime)*(1-tTime)) * (controlPointA[0]-wayPointA[0]) + 
                (6*(1-tTime)*tTime) * (invertedPointB[0]-controlPointA[0]) +
                (3*tTime*tTime) * (wayPointB[0]-invertedPointB[0]);

    var dydt =  (3*(1-tTime)*(1-tTime)) * (controlPointA[1]-wayPointA[1]) + 
                (6*(1-tTime)*tTime) * (invertedPointB[1]-controlPointA[1]) +
                (3*tTime*tTime) * (wayPointB[1]-invertedPointB[1]);

    return dydt / dxdt;
} 

// main function
function CubicBezierSpline (wayPointA, controlPointA, wayPointB, controlPointB, robotWidth, timeFrequency){
    var times = [];
	var lVelocity = [];
    var rVelocity = [];
    var headingAngle = [];
    var headingAngleDecimal = [];
    // var headingAngleFraction = [];

    // var allData = [times, lVelocity, rVelocity, headingAngleDecimal, headingAngleFraction];
    var allData = [times, lVelocity, rVelocity, headingAngleDecimal];
    var invertedPointB = ControlToInverted(wayPointB, controlPointB);
    
    // assume that time is proportional to percent through the route
    var kTime = 10000;
    var kVelocityMax = 1000;
        
    // assume that staring point has zero angle degree
    var currentLeft = [[(wayPointA[0]-robotWidth/2*Math.sin(0)),(wayPointA[1]+robotWidth/2*Math.cos(0))]];
    var currentRight = [[(wayPointA[0]+robotWidth/2*Math.sin(0)),(wayPointA[1]-robotWidth/2*Math.cos(0))]];

    for (var i = 0; i < 1; i = i + timeFrequency){
        times.push(Math.round(i*kTime));
 
        // currentPoint.push(CurrentPosition(wayPointA, controlPointA, wayPointB, invertedPointB, i));

        headingAngle.push(FindHeadingAngle(wayPointA, controlPointA, wayPointB, invertedPointB, i));
        headingAngleDecimal.push(NumberToDecimalRadian(headingAngle[Math.round(i/timeFrequency)]));
        // headingAngleFraction.push(NumberToFractionRadian(headingAngle[Math.round(i/timeFrequency)]));

        currentLeft.push(LeftPosition(wayPointA, controlPointA, wayPointB, invertedPointB, i, headingAngle[Math.round(i/timeFrequency)], robotWidth));
        currentRight.push(RightPosition(wayPointA, controlPointA, wayPointB, invertedPointB, i, headingAngle[Math.round(i/timeFrequency)], robotWidth));
        
        lVelocity.push(((MessureDistanceBetweenPoints(currentLeft[Math.round(i/timeFrequency)+1], currentLeft[Math.round(i/timeFrequency)]))/timeFrequency)*kVelocityMax);
        rVelocity.push(((MessureDistanceBetweenPoints(currentRight[Math.round(i/timeFrequency)+1], currentRight[Math.round(i/timeFrequency)]))/timeFrequency)*kVelocityMax);

        lVelocity.splice(0, 1, 0);
        rVelocity.splice(0, 1, 0);
    }
    return allData;
}
