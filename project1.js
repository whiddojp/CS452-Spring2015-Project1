var gl;
var program;
var points = [];
var points2 = [];
var colors = [];

var s=.1;//scale for character
var vertices=[] , objectiveVerticies=[];

var vBuffer,vPosition,cBuffer,vColor;
var objectiveBuffer,objectivePosition;

var offset_x=-1+2*s;
var offset_y=-1+2*s;

var speed = 5;

var objective_x=.2, objective_y=.2, objectiveSize=s;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); } 
	s=30/canvas.width;	
	objectiveSize=20/canvas.width
	//Call function to build polygon		
		 buildANDdrawCat(0);
	
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 );
        
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	//Char Buffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0,0 );
    gl.enableVertexAttribArray( vPosition );  
	
	//Objective Buffer
	objectiveBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, objectiveBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(objectiveVerticies), gl.STATIC_DRAW );

    objectivePosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( objectivePosition, 2, gl.FLOAT, false, 0,0 );
    gl.enableVertexAttribArray( objectivePosition );

	
   drawScene()
};

var score = 1;

	//event listeners for buttons	
	window.addEventListener("keydown", function() {
		 switch (event.keyCode) {
			 case 65: // ’A’ key
			// console.log(offset_x);
				if (offset_x > (-1+s))
					offset_x=offset_x-.02;
				start=true;
				break;
			 case 83: // ’S’ key
				if (offset_y > (-1+s))
					offset_y=offset_y-.02;
				start=true;			 
				break;
			 case 68: // ’D’ key
				if (offset_x < (1-s))
					offset_x=offset_x+.02;
				start=true;	
				break;		 
			 case 87: // ’W’ key
				if (offset_y < (1-s))
					offset_y=offset_y+.02;
				start=true;	
			 break;
			 case 49: // ’1’ key , resets game
			 	if (lava) {
					lava = false;
					if (score>highScore) {
						highScore = score;
						document.getElementById("Hscore").innerHTML = "High Score: " + highScore;
					}
					score = 0;
					gravity = 0;
					offset_x=-1+2*s;
					offset_y=-1+2*s;
					objective_x=.2; 
					objective_y=.2;
					document.getElementById("score").innerHTML = "Score: " + score;
					changeStatus();
				}	
			 break;			 
		 }
	}, false);
	
var start=false;
var point=false;
var lava=false;
var score=0;
var highScore=0;
var gravity=0.000;
var status;
function drawScene()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

	if (!lava) {
		buildANDdrawCat(0)
		touchCheck()
		if (point) { changeObjective() }
		drawObjectives()	
		if(score==20) { document.getElementById("status").innerHTML = "Status: " + "Well Look at That, You Won!! But I think you should keep going....call it pride."; }
		if(start) {
			if(offset_y > (-1+s))
				offset_y=offset_y-gravity;		
		}	
	}
	else {
		buildANDdrawCat(2)
		gravity = 0;	
		document.getElementById("status").innerHTML = "Status: " + "He's Dead Jim!";
	}
	
	setTimeout( function () { requestAnimFrame(drawScene); }, speed );
}

function touchCheck(){
	if( (offset_x)>(objective_x-objectiveSize) && (offset_x-s)<(objective_x+objectiveSize) && (offset_y)>(objective_y-objectiveSize) && (offset_y-s)<(objective_y+objectiveSize) ) {
		point = true; 	
	}
	if (offset_y < (-1+s)) { lava = true; }
}

function changeObjective() {
	
	if (Math.floor(Math.random()*2) == 1)		
		objective_x = Math.random();
	else 
		objective_x = -Math.random();
	
	if (Math.floor(Math.random()*2) == 1)		
		objective_y = Math.random();
	else 
		objective_y = -Math.random();
		
	point = false;
	console.log("Objective Location: " + objective_x + ", " + objective_y);
	score++;
	if (gravity<.02) { gravity+=.001; }
	document.getElementById("score").innerHTML = "Score: " + score;
}

function drawObjectives(){
	
	objectiveVerticies=[
		vec2(objective_x,objective_y), //Top left
		vec2(objective_x,objective_y+objectiveSize), //bottom Left
		vec2(objective_x+objectiveSize,objective_y+objectiveSize), //bottom Right
		vec2(objective_x+objectiveSize,objective_y), //top right
	]	
	
    gl.bindBuffer( gl.ARRAY_BUFFER, objectiveBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(objectiveVerticies), gl.STATIC_DRAW );

    gl.vertexAttribPointer( objectivePosition, 2, gl.FLOAT, false, 0,0 );
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}

function changeStatus() {
	var i = (Math.floor(Math.random() * 10)+1);
	
	if (i==1) 		{ status = "Status: I'm a fox....not a cat -_-"; }
	else if (i==2) 	{ status = "Status: What? You think you have 9 lives?"; }
	else if (i==3) 	{ status = "Status: You know that red stuff? Stay out of it!"; }
	else if (i==4) 	{ status = "Status: I'm losing hope for your survival..."; }
	else if (i==5) 	{ status = "Status: I think someone else should take over."; }
	else if (i==6) 	{ status = "Status: Dead....just kidding :), no really you're gonna die again"; }
	else if (i==7) 	{ status = "Status: and again. This can't be natural"; }
	else if (i==8) 	{ status = "Status: Touch the red stuff, I dare you!"; }
	else if (i==9) 	{ status = "Status: Still living.....somehow"; }
	else if (i==10) { status = "Status: I ran out of witty sayings, so I printed this"; }
	else { status = "Status: Error 404, Math not found"; }	
	document.getElementById("status").innerHTML = status;
}

function triangle( a, b, c ,color)
{
    // add colors and vertices for one triangle
    var baseColors = [
        vec3(.7, .3, .9),
        vec3(1, 1.0, 0.0),
        vec3(1.0, 0.0, 0.0),    
    ];
	//Puts points and colors into their designated arrays
    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );	
}

function buildANDdrawCat(color)
{

	points=[];
	colors=[];
	vertices = [
		vec2( offset_x, (-1*s)+offset_y), //(-57/57)
		vec2( (17/50*s)+offset_x, (-24/57*s)+offset_y),
		vec2( offset_x, (5/57*s)+offset_y),
		vec2( offset_x,(8/57*s)+offset_y),
		vec2( (.5*s)+offset_x,(-34/57*s)+offset_y),
		vec2( offset_x,(38/57*s)+offset_y),
		vec2((.5*s)+offset_x,(10/57*s)+offset_y),
		vec2( (1*s)+offset_x,(38/57*s)+offset_y),
		vec2((1*s)+offset_x,(8/57*s)+offset_y),
		vec2((33/50*s)+offset_x,(-24/57*s)+offset_y),
		vec2((1*s)+offset_x,(-1*s)+offset_y),
		vec2((1*s)+offset_x,(5/57*s)+offset_y),
		vec2(offset_x,(40/57*s)+offset_y),
		vec2((.5*s)+offset_x,(12/57*s)+offset_y),
		vec2((1*s)+offset_x,(40/57*s)+offset_y),
		
		//left ear
		vec2(offset_x,(42/57*s+offset_y)), 
		vec2((5/50*s)+offset_x,(42/57*s)+offset_y),
		vec2((.2*s)+offset_x,(1*s)+offset_y),
		vec2((15/50*s)+offset_x,(42/57*s)+offset_y),
		vec2((.4*s)+offset_x,(42/57*s)+offset_y),
		
		
		//right ear
		vec2((30/50*s)+offset_x,(42/57*s)+offset_y), 
		vec2((35/50*s)+offset_x,(42/57*s)+offset_y),
		vec2((40/50*s)+offset_x,(1*s)+offset_y),
		vec2((45/50*s)+offset_x,(42/57*s)+offset_y),
		vec2((1*s)+offset_x,(42/57*s)+offset_y),
		
		//tail
		vec2((-2/50*s)+offset_x,(-11/57*s)+offset_y),
		vec2((-2/50*s)+offset_x,(18/57*s)+offset_y),
		vec2((-20/50*s)+offset_x,(34/57*s)+offset_y),
		vec2((-11/50*s)+offset_x,(8/57*s)+offset_y),
		vec2((-22/50*s)+offset_x,(34/57*s)+offset_y),
		vec2((-32/50*s)+offset_x,(35/57*s)+offset_y),
		vec2((-18/50*s)+offset_x,(15/57*s)+offset_y),
		vec2((-35/50*s)+offset_x,(35/57*s)+offset_y),
		vec2((-1*s)+offset_x,(25/75*s)+offset_y),
		vec2((-25/50*s)+offset_x,(14/57*s)+offset_y),
		vec2((-1*s)+offset_x,(17/57*s)+offset_y),
		vec2((-1*s)+offset_x,(2/57*s)+offset_y),
		vec2((-1*s)+offset_x,offset_y),
		vec2((-40/50*s)+offset_x,(-8/57*s)+offset_y),
		vec2((-28/50*s)+offset_x,(10/57*s)+offset_y),
		vec2((-37/50*s)+offset_x,(-7/57*s)+offset_y),
		vec2((-25/50*s)+offset_x,(-4/57*s)+offset_y),
		vec2((-28/50*s)+offset_x,(7/57*s)+offset_y),		
	];
	
	//Build Cat and put verts in points array
	triangle(vertices[0],vertices[1],vertices[2],color); //left left
	triangle(vertices[3],vertices[4],vertices[5],color); //body
	triangle(vertices[5],vertices[6],vertices[4],color);
	triangle(vertices[4],vertices[7],vertices[6],color);
	triangle(vertices[4],vertices[8],vertices[7],color);
	triangle(vertices[9],vertices[10],vertices[11],color);
	triangle(vertices[12],vertices[13],vertices[14],color);//2nd leg
	triangle(vertices[15],vertices[16],vertices[17],color);//leftear
	triangle(vertices[17],vertices[18],vertices[19],color);
	triangle(vertices[20],vertices[21],vertices[22],color);
	triangle(vertices[22],vertices[23],vertices[24],color);
	triangle(vertices[25],vertices[26],vertices[27],color);//tail
	triangle(vertices[28],vertices[29],vertices[30],color);
	triangle(vertices[31],vertices[32],vertices[33],color);
	triangle(vertices[34],vertices[35],vertices[36],color);
	triangle(vertices[37],vertices[38],vertices[39],color);
	triangle(vertices[40],vertices[41],vertices[42],color);
	
	//DRAW	
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );			
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0,0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
}







