// Created by: Garett Palm and Connor Cooley
// Due date: September 27, 2018
// This program allows the drawing of lines and
//    polygons to the canvas in different colors

"use strict";

/** @type{WebGLRenderingContext} */
let shape = [];
let gl;
let maxNumVertices = 10000;
let index = 0;
let delay = 50;
let mouseClicked = false;
let numPolygons = 0;
let numIndices = [];
numIndices[0] = 0;
let start = [0];
let mousePosition;
let cIndex = 0;

let colors = [
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(0.0, 0.0, 0.0, 1.0), // black
];

let drawingLines = true;
let program;

window.addEventListener("load", function()
{
    let canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
	
	let lines = document.getElementById("shapeLine");
	lines.addEventListener("click", function() {
		drawingLines = true;
	});
	
	let filled = document.getElementById("shapeFilled");
	filled.addEventListener("click", function() {
		drawingLines = false;
	});
	
	let red = document.getElementById("colorRed");
	red.addEventListener("click", function() {
		cIndex = 0;
	});
	
	let green = document.getElementById("colorGreen");
	green.addEventListener("click", function() {
		cIndex = 1;
	});
	
	let blue = document.getElementById("colorBlue");
	blue.addEventListener("click", function() {
		cIndex = 2;
	});
	
	let black = document.getElementById("colorBlack");
	black.addEventListener("click", function() {
		cIndex = 3;
	});
	
    canvas.addEventListener("mousedown", function(event) {
		if(drawingLines)
		{
			shape.push(1);
		}
		else
		{
			shape.push(0);
		}
        mouseClicked = true;
		numPolygons++;
		numIndices[numPolygons] = 0;
		start[numPolygons] = index;
    });
	
	// Used https://codepen.io/light_denied/pen/doqJvq as help
    canvas.addEventListener("mousemove", function(event) {
        let status = document.getElementById("status");
        status.innerHTML = event.clientX + ", " + event.clientY + " " + event.buttons;
		
		if(mouseClicked){
			mousePosition = vec2(2 * event.clientX / canvas.width - 1,
			2 * (canvas.height - event.clientY) / canvas.height - 1);
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
			gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(mousePosition));

			mousePosition = vec4(colors[cIndex]);

			gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
			gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(mousePosition));

			numIndices[numPolygons]++;
			index++;
		}
    });
	
    canvas.addEventListener("mouseup", function() {
		mouseClicked = false;
    });
    
    if (!gl) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
	gl.clear(gl.COLOR_BUFFER_BIT);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);
	
	let bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	let cBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);
	let vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

    render();
});

function render() {
	
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	for(let i = 0; i <= numPolygons; i++)
	{
		if(shape[i - 1] == 1)
		{
			gl.drawArrays(gl.LINE_STRIP, start[i], numIndices[i]);
		}
		else if(shape[i - 1] == 0)
		{
			gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
		}
	}
	
	setTimeout(
    function() {
      requestAnimFrame(render);
    }, delay
  );
}
