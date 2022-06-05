console.log("Adding matrixCanvas library")

// =============================================================================
// Definitions
// =============================================================================

function MeshGridFromCanvas(canvasId, numOfPointsShortestAxis)
{
    if (numOfPointsShortestAxis < 1) { throw "Invalid number grid samples" }

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
    if (!(X.NumRows == Y.NumRows && X.NumRows == V.NumRows)) { throw "Grid plot dimensions do not agree" }
    if (!(X.NumCols == Y.NumCols && X.NumCols == V.NumCols)) { throw "Grid plot dimensions do not agree" }
    
    let canvas = document.getElementById(canvasId);
    let c = canvas.getContext('2d')
    let Vn = NormaliseForColourMap(V); // has range 0 to 1

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

ScaledCircleMaker = (x, y, value, gridSpacing) => new Circle(x, y, value, gridSpacing, true);
ScaledSquareMaker = (x, y, value, gridSpacing) => new Square(x, y, value, gridSpacing, true);
FixedCircleMaker = (x, y, value, gridSpacing) => new Circle(x, y, value, gridSpacing, false);
FixedSquareMaker = (x, y, value, gridSpacing) => new Square(x, y, value, gridSpacing, false);

function Circle(x, y, value, gridSpacing, scaleDimension) 
{
    this.X = x;
    this.Y = y;
    this.MaxRadius = gridSpacing / 2;
    this.Radius = this.MaxRadius * (scaleDimension ? Math.abs(value) : 1);
    this.Color = TwoToneBurgandy(value, true);

    this.Draw = function(c)
    {
        c.beginPath();
        c.arc(this.X, this.Y, this.Radius, 0, Math.PI * 2, false);
        c.fillStyle = this.Color;
        c.fill();
    };
};

function Square(x, y, value, gridSpacing, scaleDimension) 
{
    this.X = x;
    this.Y = y;
    this.SideLength = Math.abs(value);
    this.MaxWidth = gridSpacing * (scaleDimension ? Math.abs(value) : 1);
    this.Color = YellowDarkGreen(value, false);

    this.Draw = function(c)
    {
        c.beginPath();
        c.rect(x - this.MaxWidth / 2, y - this.MaxWidth / 2, this.MaxWidth, this.MaxWidth);
        c.fillStyle = this.Color;
        c.fill();
    };
};


// =============================================================================
// Colormaps accepting ranges from 0 to 1
// =============================================================================

Scale = (v, range=255) => v * range;

// primary
Red = (v, hasAlpha) => `rgba(${Scale(v)}, 0, 0, ${Math.abs(hasAlpha) ? v : 1})`;
Green = (v, hasAlpha) => `rgba(0, ${Scale(v)}, 0, ${hasAlpha? v : 1})`;
Blue = (v, hasAlpha) => `rgba(0, 0, ${Scale(v)}, ${hasAlpha? v : 1})`;
Gray = (v, hasAlpha) => `rgba(${Scale(v)}, ${Scale(v)}, ${Scale(v)}, ${hasAlpha? v : 1})`;

// single colors
Indigo = (v, hasAlpha) => `rgba(${Scale(v)}, ${Scale(v)}, 255, ${hasAlpha? v : 1})`;
Yellow = (v, hasAlpha) => `rgba(${Scale(v)}, ${Scale(v)}, 0, ${hasAlpha? v : 1})`;
DarkGreen = (v, hasAlpha) => `rgba(${Scale(v)}, 255, ${Scale(v)}, ${hasAlpha? v : 1})`;
Purple = (v, hasAlpha) => `rgba(${Scale(v)}, 0, ${Scale(v)}, ${hasAlpha? v : 1})`;
Burgandy = (v, hasAlpha) => `rgba(255, ${Scale(v)}, ${Scale(v)}, ${hasAlpha? v : 1})`;
Cyan = (v, hasAlpha) => `rgba(0, ${Scale(v)}, ${Scale(v)}, ${hasAlpha? v : 1})`;

// two tone
ColourColour = (v, hasAlpha, fColor1, fColor2) => (v < 0.5) ? fColor1(Math.abs(v - 1), hasAlpha) : fColor2(v, hasAlpha);

RedGreen = (v, hasAlpha) => ColourColour(v, hasAlpha, Red, Green);
RedBlue = (v, hasAlpha) => ColourColour(v, hasAlpha, Red, Blue);
GreenRed = (v, hasAlpha) => ColourColour(v, hasAlpha, Green, Red);
GreenBlue = (v, hasAlpha) => ColourColour(v, hasAlpha, Green, Blue);
BlueRed = (v, hasAlpha) => ColourColour(v, hasAlpha, Blue, Red);
BlueGreen = (v, hasAlpha) => ColourColour(v, hasAlpha, Blue, Green);

YellowDarkGreen = (v, hasAlpha) => ColourColour(v, hasAlpha, Yellow, DarkGreen);
BurgandyPurple = (v, hasAlpha) => ColourColour(v, hasAlpha, Burgandy, Purple);

TwoToneBurgandy = (v, hasAlpha) => (v < 0.5) ? `rgba(0, ${Scale(v)}, ${Scale(v)}, ${hasAlpha? v : 1})` : "#800020";


// =============================================================================
// Done
// =============================================================================

console.log("Finished adding matrixCanvas library");