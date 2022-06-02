// =============================================================================
// Program
// =============================================================================

console.log("Start programme");

var canvasId = "drawing-canvas";
let canvas = document.getElementById(canvasId);
canvas.width = innerWidth;
canvas.height = innerHeight;

// get mesh coordinates from canvas element
let {X, Y, gridSpacing} = MeshGridFromCanvas(canvasId, 50);

// generate a random matrix array
let V = RandomMatrix(X.NumRows, X.NumCols);
let V2 = RandomMatrix(X.NumRows, X.NumCols);

// plot

GridPlot(canvasId, X, Y, V, gridSpacing, SquareMaker);
GridPlot(canvasId, X, Y, V2, gridSpacing, CircleMaker);