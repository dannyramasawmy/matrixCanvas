console.log("Adding matrixCanvas library")

// =============================================================================
// Definitions
// =============================================================================

function GetCoordinateMatricesFromCanvas(canvasId, numOfPointsShortestAxis)
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
    let delta = shortSideCoordinates.Index(0, 1) - shortSideCoordinates.Index(0, 0);
    let longSideCoordinates = Linspace(0, longestSide, Math.floor(longestSide/delta) + padding);    

    // meshgrid
    let longSideMesh = MatrixMultiply(
        Ones(Length(shortSideCoordinates) - padding, 1), 
        longSideCoordinates.Sub(0, 0, 1, Length(longSideCoordinates) - 1));  
    let shortSideMesh = MatrixMultiply(
        Ones(Length(longSideCoordinates) - padding, 1), 
        shortSideCoordinates.Sub(0, 0, 1, Length(shortSideCoordinates) - 1));  

    let X = isWidthShortest ? shortSideMesh : longSideMesh;
    let Y = isWidthShortest ? Transpose(longSideMesh) : Transpose(shortSideMesh);
    
    return {X, Y};
}


// =============================================================================
// Done
// =============================================================================

console.log("Finished adding matrixCanvas library");