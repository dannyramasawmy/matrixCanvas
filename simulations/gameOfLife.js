// =============================================================================
// Program
// =============================================================================

console.log("Start programme");

var canvasId = "drawing-canvas";
let canvas = document.getElementById(canvasId);
canvas.width = innerWidth;
canvas.height = innerHeight;

// get mesh coordinates from canvas element
let {X, Y, gridSpacing} = MeshGridFromCanvas(canvasId, 150);

// generate a random matrix array
let randomStart = RandomMatrix(X.NumRows, X.NumCols);
let currentTimeStep = MatrixMap(randomStart, x => x > 0.5 ? 1 : 0);

function ClearCanvas(canvasId)
{
    let canvas = document.getElementById(canvasId);
    let c = canvas.getContext('2d');    
    c.fillStyle = "black"
    c.fillRect(0, 0, innerWidth, innerHeight);
}

var frame = 0;

ApplyRules = (c, n) =>
{
    if (c == 1 && (n == 2 || n == 3)) return 1;
    if (c == 0 && n == 3) return 1;
    return 0;
}

function animate() {
    
    ClearCanvas(canvasId);
    GridPlot(canvasId, X, Y, currentTimeStep, gridSpacing, ScaledCircleMaker);

    let neighbours = AddNeighbours(PadWithZeros(currentTimeStep));

    currentTimeStep =  MatrixMap2(currentTimeStep, neighbours, ApplyRules);
    
    console.log(`Frame ${frame++}`);
}
animate();
setInterval(animate, 300);

