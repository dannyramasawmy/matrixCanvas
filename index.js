// =============================================================================
// Program
// =============================================================================

console.log("Start programme");

var canvasId = "drawing-canvas";
let canvas = document.getElementById(canvasId);
canvas.width = innerWidth;
canvas.height = innerHeight;




// get mesh coordinates from canvas element
let {X, Y, gridSpacing} = MeshGridFromCanvas(canvasId, 25);

// generate a random matrix array
let V = RandomMatrix(X.NumRows, X.NumCols);
let V2 = RandomMatrix(X.NumRows, X.NumCols);

let phaseMatrix = MatrixMultiply
(
    Transpose(Linspace(-Tau, Tau, X.NumRows)), 
    Linspace(-Tau, Tau, X.NumCols)
);

function ClearCanvas(canvasId)
{
    let canvas = document.getElementById(canvasId);
    let c = canvas.getContext('2d');    
    c.fillStyle = "black"
    c.fillRect(0, 0, innerWidth, innerHeight);
}

// GridPlot(canvasId, X, Y, V, gridSpacing, ScaledSquareMaker);
// GridPlot(canvasId, X, Y, V2, gridSpacing, ScaledCircleMaker);

let phaseIncrement = Pi / 30;
let linearPhase = 0;

function animate() {
    requestAnimationFrame(animate)
    
    ClearCanvas(canvasId);

    // update phase
    linearPhase += phaseIncrement;
    let wave = Sin(AddScalar(phaseMatrix, linearPhase)); 
    
    GridPlot(canvasId, X, Y, wave, gridSpacing, ScaledCircleMaker);
}
animate();