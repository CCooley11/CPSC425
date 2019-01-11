// Created by: Connor Cooley and Garett Palm
// Allows the user to add different shapes to the canvas
//    and apply transformations and rotations 
// 10/11/18

"use strict";

let canvas;

/** @type {WebGLRenderingContext} */
let gl;

let program;
let points = [];
let colors = [];
let rot1;
let rot2;
let rot3;
let scale1;
let mouseClicked = false;
let tz;
let tx=0;
let ty=0;
let mousePosition;
let shapes = [];
let matrixLoc;
let status;

// Represents a shape to be drawn to the screen, and maintains the relevant
// GPU buffers
class Shape {
    constructor() {
        if (!gl) {
            console.log("Shape constructor must be called after WebGL is initialized");
        }
        
        // Buffer for vertex positions
        this.vBuffer = gl.createBuffer();

        // Buffer for vertex colors
        this.cBuffer = gl.createBuffer();

        // Transformation matrix
        this.mat = mat4();

        // Number of vertices in this shape
        this.numVertices = 0;

        // What draw mode to use
        this.drawMode = gl.TRIANGLES;
    }

    // Render the shape to the screen
    draw() {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
		var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
		var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vColor );
        matrixLoc = gl.getUniformLocation(program, "mat");
        gl.uniformMatrix4fv(matrixLoc, false, flatten(this.mat));
        gl.drawArrays( gl.TRIANGLES, 0, this.numVertices );
    }

    // Set the positions and colors to be used for this shape.  Both positions
    // and colors should be arrays of vec4s.
    setData(positions, colors) {
        if (positions.length != colors.length) {
            console.log("Positions and colors not the same length");
        }
        this.numVertices = positions.length;
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    }

    // Set transformation matrix
    setMat(mat) {
        this.mat = mat;
    }
}

let cube;
let tet;
let oct;
let dod;

window.onload = function init()
{
    status = document.getElementById("status");
    rot1 = document.getElementById("rot1");
    rot2 = document.getElementById("rot2");
    rot3 = document.getElementById("rot3");
    scale1 = document.getElementById("scale1");
    tz = document.getElementById("tz");
    [rot1, rot2, rot3, scale1, tz].forEach(function(elem) {
        elem.initValue = elem.value;
        elem.addEventListener("input", render);
        elem.addEventListener("dblclick", function() {
            elem.value = elem.initValue;
            render();
        });
    });
    
	// Code from book
    let addCube = document.getElementById("addCube");
    addCube.addEventListener("click", function()
    {
        cube = new Shape();

        function colorCube()
        {
            quad( 1, 0, 3, 2 );
            quad( 2, 3, 7, 6 );
            quad( 3, 0, 4, 7 );
            quad( 6, 5, 1, 2 );
            quad( 4, 5, 6, 7 );
            quad( 5, 4, 0, 1 );
        }
        
        function quad(a, b, c, d)
        {
            var vertices = [
                vec4( -0.5, -0.5,  0.5, 1.0 ),
                vec4( -0.5,  0.5,  0.5, 1.0 ),
                vec4(  0.5,  0.5,  0.5, 1.0 ),
                vec4(  0.5, -0.5,  0.5, 1.0 ),
                vec4( -0.5, -0.5, -0.5, 1.0 ),
                vec4( -0.5,  0.5, -0.5, 1.0 ),
                vec4(  0.5,  0.5, -0.5, 1.0 ),
                vec4(  0.5, -0.5, -0.5, 1.0 )
            ];

            var vertexColors = [
                vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
                vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
                vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
                vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
                vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
                vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
                vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
                vec4( 1.0, 1.0, 1.0, 1.0 )   // white
            ];
            var indices = [ a, b, c, a, c, d ];

            for ( var i = 0; i < indices.length; ++i ) {
                points.push( vertices[indices[i]] );
                // for solid colored faces use
                colors.push(vertexColors[a]);
            }   
        }
        colorCube();
        cube.setMat;
        cube.setData(points,colors);
        shapes.push(cube);
        render();
		points = [];
		colors = [];
    });

    let addtetrahedron = document.getElementById("addTet");
	addtetrahedron.addEventListener("click", function()
	{
		tet = new Shape();
		
		function colorTet()
		{
			quad( 0, 1, 2, 3 );
            quad( 1, 2, 3, 0 );
            quad( 2, 3, 0, 1 );
            quad( 3, 0, 1, 2 );
		}
		
		function quad(a, b, c, d)
		{
			var vertices = [
				vec4(0.0000, 0.0000, -1.0000, 1.0),
				vec4(0.0000, 0.9428, 0.3333, 1.0),
				vec4(-0.8165, -0.4714, 0.3333, 1.0),
				vec4(0.8165, -0.4714, 0.3333, 1.0) 
			]; 
			
			var vertexColors = [
                vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
                vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
                vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
                vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
            ];
		
			var indices = [b, c, d];
	
			for(var i = 0; i < indices.length; ++i) 
			{
				points.push(vertices[indices[i]]);
				// for solid colored faces use
				colors.push(vertexColors[a]);
			} 
		}
		colorTet();
		tet.setMat;
		tet.setData(points, colors);
		shapes.push(tet);
		render();
		points = [];
		colors = [];
	});

	let addOctagon = document.getElementById("addOct");
	addOctagon.addEventListener("click", function()
	{
		oct = new Shape();
		
		function colorOct()
		{
			quad(0, 3, 4, 5);
            quad(1, 3, 5, 1);
            quad(2, 3, 1, 0);
            quad(3, 3, 0, 4);
			quad(4, 4, 0, 2);
			quad(5, 4, 2, 5);
			quad(6, 2, 0, 1);
			quad(7, 5, 2, 1);
		}
		
		function quad(a, b, c, d)
		{
			var vertices = [
				vec4(-0.7070, 0.0000, 0.0000, 1.0),
				vec4(0.0000, 0.707, 0.0000, 1.0),
				vec4(0.0000, 0.0000, -0.707, 1.0),
				vec4(0.0000, 0.0000, 0.707, 1.0),
				vec4(0.0000, -0.707, 0.0000, 1.0),
				vec4(0.707, 0.0000, 0.0000, 1.0)
			]; 
			
			var vertexColors = [
			    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
                vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
                vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
                vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
                vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
                vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
                vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
				vec4( 1.0, 1.0, 1.0, 1.0 )
            ];
		
			var indices = [b, c, d];
	
			for(var i = 0; i < indices.length; ++i) 
			{
				points.push(vertices[indices[i]]);
				// for solid colored faces use
				colors.push(vertexColors[a]);
			} 
		}
		colorOct();
		oct.setMat;
		oct.setData(points, colors);
		shapes.push(oct);
		render();
		points = [];
		colors = [];
	});
	
	let addDodecahedron = document.getElementById("addDod");
	addDodecahedron.addEventListener("click", function()
	{
		dod = new Shape();
		
		function colorDod()
		{
			quad(0, 14, 9, 8, 13, 0);
            quad(1, 1, 5, 11, 10,4);
            quad(2, 4, 10, 6, 2, 18);
            quad(3, 10, 11, 7, 15, 6);
            quad(4, 11, 5, 19, 3, 7);
            quad(5, 5, 1, 12, 17, 19);
            quad(6, 1, 4, 18, 16, 12);
            quad(7, 3, 19, 17, 9, 14);
            quad(8, 17, 12, 16, 8, 9);
            quad(9, 16, 18, 2, 13, 8);
            quad(10, 2, 6, 15, 0, 13);
            quad(11, 15, 7, 3, 14,0);
		}
		
		function quad(a, b, c, d, e, f)
		{
			var vertices = [
				vec4(-2.753/7, 0.0, 0.5257/7, 1.0),
				vec4(2.753/7, 0.0, -0.5257/7, 1.0),
				vec4(-0.8507/7, -2.618/7, 0.5257/7, 1.0),
				vec4(-0.8507/7, 2.618/7, 0.5257/7, 1.0),
				vec4(2.227/7, -1.618/7, 0.5257/7, 1.0),
				vec4(2.227/7, 1.618/7, 0.5257/7, 1.0),
				vec4(-0.5257/7, -1.618/7, 2.227/7, 1.0),
				vec4(-0.5257/7, 1.618/7, 2.227/7, 1.0),
				vec4(-1.376/7, -1.000/7, -2.227/7, 1.0),
				vec4(-1.376/7, 1.000/7, -2.227/7, 1.0),
				vec4(1.376/7, -1.000/7, 2.227/7, 1.0),
				vec4(1.376/7, 1.000/7, 2.227/7, 1.0),
				vec4(1.701/7, 0.0, -2.227/7, 1.0),
				vec4(-2.227/7, -1.618/7, -0.5257/7, 1.0),
				vec4(-2.227/7, 1.618/7, -0.5257/7, 1.0),
				vec4(-1.701/7, 0.0, 2.227/7, 1.0),
				vec4(0.5257/7, -1.618/7, -2.227/7, 1.0),
				vec4(0.5257/7, 1.618/7, -2.227/7, 1.0),
				vec4(0.8507/7, -2.618/7, -0.5257/7, 1.0),
				vec4(0.8507/7, 2.618/7, -0.5257/7, 1.0)
			]; 
			
			var vertexColors = [
			    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
                vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
                vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
                vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
                vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
                vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
                vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
				vec4( 0.5, 0.2, 0.0, 1.0 ),  // yellow/green 
				vec4( 1.0, 0.5, 0.0, 1.0 ),  // orange
				vec4( 1.0, 0.0, 0.5, 1.0 ),  //
				vec4( 0.7, 0.0, 1.0, 1.0 ),
				vec4( 0.52, 0.37, 0.26, 1.0 ),
				
				
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.3, 0.0, 0.0, 1.0 ),
				vec4( 0.7, 0.0, 1.0, 1.0 )
            ];
		
			var indices = [b, c, d, b, d, e, b, e, f];
	
			for(var i = 0; i < indices.length; ++i) 
			{
				points.push(vertices[indices[i]]);
				// for solid colored faces use
				colors.push(vertexColors[a]);
			} 
		}
		colorDod();
		dod.setMat;
		dod.setData(points, colors);
		shapes.push(dod);
		render();
		points = [];
		colors = [];
	});
	
    canvas = document.getElementById( "gl-canvas" );
    canvas.addEventListener("mousedown", function(event) {
        mouseClicked = true;
    });
	
    canvas.addEventListener("mousemove", function() {
        if (event.buttons & 1 === 1) {
            if(mouseClicked){
                mousePosition = vec2(2 * event.clientX / canvas.width - 1,
                    2 * (canvas.height - event.clientY) / canvas.height - 1);
                tx = mousePosition[0];
                ty = mousePosition[1];
            }
            render();
        }
    });
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    render();
};

function render()
{
    status.innerHTML = "Angles: " + (+rot1.value).toFixed()
        + ", " + (+rot2.value).toFixed()
        + ", " + (+rot3.value).toFixed()
        + ". Scale: " + (+scale1.value).toFixed(2)
        + ". Translation: " + (+tz.value).toFixed(2);
    
    let r1 = rotateX(rot1.value);
    let r2 = rotateY(rot2.value);
    let r3 = rotateZ(rot3.value);
    let s1 = scalem(scale1.value, scale1.value, scale1.value);
    let t1 = translate(tx, ty, tz.value);
    let mat = mult(r3,mult(r2,r1));
    mat = mult(s1,mat);
    mat = mult(t1,mat);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i = 0; i < shapes.length; i++) {
        if (i === shapes.length - 1) {
            shapes[i].setMat(mat);
        }
        shapes[i].draw();
    }
}