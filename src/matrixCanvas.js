console.log("Adding matrixCanvas library")

// =============================================================================
// Definitions
// =============================================================================

function MeshGridFromCanvas(canvasId, numOfPointsShortestAxis)
{
    if (numOfPointsShortestAxis < 1) {throw "Invalid number grid samples"}

    // canvas measurements
    let canvas = document.getElementById(canvasId);
    let width = canvas.width;
    let height = canvas.height;   
    let padding = 2; // so points are not off the screen

    // find shortest side
    let isWidthShortest = width < height ? true : false;
    let shortestSide = Math.min(width, height);
    let longestSide = Math.max(width, height);

    // create coordinate vectors
    let shortSideCoordinates = Linspace(0, shortestSide, numOfPointsShortestAxis + padding);
    let gridSpacing = shortSideCoordinates.Index(0, 1) - shortSideCoordinates.Index(0, 0);
    let longSideCoordinates = Linspace(0, longestSide, Math.floor(longestSide/gridSpacing) + padding);    

    // meshgrid
    let longSideMesh = MatrixMultiply(
        Ones(Length(shortSideCoordinates) - padding, 1), 
        longSideCoordinates.Sub(0, 0, 1, Length(longSideCoordinates) - 1));  
    let shortSideMesh = MatrixMultiply(
        Ones(Length(longSideCoordinates) - padding, 1), 
        shortSideCoordinates.Sub(0, 0, 1, Length(shortSideCoordinates) - 1));  

    let X = isWidthShortest ? shortSideMesh : longSideMesh;
    let Y = isWidthShortest ? Transpose(longSideMesh) : Transpose(shortSideMesh);
    
    return {X, Y, gridSpacing};
}

function GridPlot(canvasId, X, Y, V, gridSpacing, funcWithDraw)
{
    if (!(X.NumRows == Y.NumRows && X.NumRows == V.NumRows)) {throw "Grid plot dimensions do not agree"}
    if (!(X.NumCols == Y.NumCols && X.NumCols == V.NumCols)) {throw "Grid plot dimensions do not agree"}
    
    let canvas = document.getElementById(canvasId);
    let c = canvas.getContext('2d')
    let Vn = Normalise(V);

    for (var i = 0; i < X.NumRows; i++)
    {
        for (var j = 0; j < X.NumCols; j++)
        {
            let currentPoint = funcWithDraw(X.Index(i, j), Y.Index(i, j), Vn.Index(i, j), gridSpacing);
            currentPoint.Draw(c);
        }
    }
}

// =============================================================================
// Shapes
// =============================================================================

CircleMaker = (x, y, value, gridSpacing) => { return new Circle(x, y, value, gridSpacing) }
SquareMaker = (x, y, value, gridSpacing) => { return new Square(x, y, value, gridSpacing) }

function Circle(x, y, value, gridSpacing) {
    this.X = x;
    this.Y = y;
    this.MaxRadius = gridSpacing / 2;
    this.Radius = this.MaxRadius * value;
    this.Color = Gray(value, true);

    this.Draw = function(c)
    {
        c.beginPath();
        c.arc(this.X, this.Y, this.Radius, 0, Math.PI * 2, false);
        c.fillStyle = this.Color;
        c.fill();
    };
};

function Square(x, y, value, gridSpacing) {
    this.X = x;
    this.Y = y;
    this.SideLength = value;
    this.MaxWidth = gridSpacing;
    this.Color = Red(value, false);

    this.Draw = function(c)
    {
        c.beginPath();
        c.rect(x - this.MaxWidth / 2, y - this.MaxWidth / 2, this.MaxWidth, this.MaxWidth);
        c.fillStyle = this.Color;
        c.fill();
    };
};


// =============================================================================
// Colormaps
// =============================================================================

Red = (intensity, isTranslucent) => {return `rgba(${intensity * 255}, 0, 0, ${isTranslucent? intensity : 1})`;} 
Green = (intensity, isTranslucent) => {return `rgba(0, ${intensity * 255}, 0, ${isTranslucent? intensity : 1})`;} 
Blue = (intensity, isTranslucent) => {return `rgba(0, 0, ${intensity * 255}, ${isTranslucent? intensity : 1})`;} 
Gray = (intensity, isTranslucent, scale=255) => {return `rgba(${intensity * scale}, ${intensity * scale},${intensity * scale}, ${isTranslucent? intensity : 1})`;} 

// =============================================================================
// Done
// =============================================================================

console.log("Finished adding matrixCanvas library");