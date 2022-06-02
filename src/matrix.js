console.log("Adding matrix library")

// =============================================================================
// Definitions
// =============================================================================

// definition of matrix
function Matrix(numRow, numCols, data)
{
    this.Data = data;
    this.NumRows = numRow;
    this.NumCols = numCols;
    
    this.CheckIndices = function(i, j)
    {
        if (i < 0 || j < 0) { throw "Index out of range"; }
        if (i >= this.NumRows || j >= this.NumCols) { throw "Index out of range"; }
    }

    this.Index = function(i, j) 
    {
        this.CheckIndices(i, j);
        return this.Data[i][j];
    }

    this.Modify = function(i, j, element)
    {
        this.CheckIndices(i, j);
        this.Data[i][j] = element;
    }

    this.Sub = function(i0, i1, j0, j1)
    {
        this.CheckIndices(i0, j0);
        if (i1 < i0 || j1 < j0) { throw "Indices are out range for sub matrix"}
        if (i1 > this.NumRows || j1 > this.NumCols) { throw "Indices are out range for sub matrix"}

        let NumRows = i1 == i0 ? 1 : i1 - i0;
        let NumCols = j1 == j0 ? 1 : j1 - j0;

        let outputArray = Zeros(NumRows, NumCols);
        for (var i = i0; i < i0 + NumRows; i++) 
        {
            for (var j = j0; j < j0 + NumCols; j++)
            {
                outputArray.Modify((i - i0), (j - j0), this.Index(i, j));
            }
        }
        return outputArray;
    }

    this.ToArray = function()
    {
        let outputArray = [];
        for (var i = 0; i < this.NumRows; i++) 
        {
            for (var j = 0; j < this.NumCols; j++)
            {
                outputArray.push(this.Index(i, j));
            }
        }
        return outputArray;
    }
}

// Create zeros matrix
function MatrixOf(numRows, numCols, value)
{
    if (numRows === 0 || numCols === 0)
    {
        throw "Invalid number of rows";
    }

    let matrix = [];
    
    for (let i = 0; i < numRows; i++)
    {
        var row = [];
        for (let j =0; j < numCols; j++)
        {
            row.push(value);
        }
        matrix.push(row);
    }
    
    return new Matrix(numRows, numCols, matrix);;
}

// =============================================================================
// Functions
// =============================================================================

// map a function to the matrix
function MatrixMap(matrix, func)
{
    let outputMatrix = Zeros(matrix.NumRows, matrix.NumCols);
    for (let i = 0; i < matrix.NumRows; i++)
    {
        for (var j = 0; j < matrix.NumCols; j++)
        {
            outputMatrix.Modify(i, j, func(matrix.Index(i, j)));
        }
    }
    
    return outputMatrix;
}

// map a function to corresponding elements in two matrices
function MatrixMap2(left, right, func)
{
    if (left.NumRows != right.NumRows || left.NumCols != right.NumCols)
    {
        throw "Incompatible element wise matrix operation";
    }
    
    let outputMatrix = Zeros(left.NumRows, left.NumCols);
    
    for (let i = 0; i < left.NumRows; i++)
    {
        for (var j = 0; j < right.NumCols; j++)
        {
            outputMatrix.Modify(i, j, func(left.Index(i, j), right.Index(i, j)));
        }
    }

    return outputMatrix;
}

// matrix multiplication
function MatrixMultiply(left, right)
{
    if (left.numCols != right.numRow)
    {
        throw "Inner matrix dimensions do notmatch for multiplication";
    }

    let outputMatrix = Zeros(left.NumRows, right.NumCols);

	for (let i = 0; i < left.NumRows; i++) {
		for (let j = 0; j < right.NumCols; j++) 
        {
			let tmp = 0;
            for (let k = 0; k < left.NumCols; k++) 
            {	
                tmp += (right.Index(k, j) * left.Index(i, k));  				
            }
			outputMatrix.Modify(i, j, tmp);
		}
	}

    return outputMatrix;
}

// create a matric from array
function ArrayToMatrix(array)
{
    let outputMatrix = Zeros(1, array.length);

    for (var j = 0; j < array.length; j++)
    {
        outputMatrix.Modify(0, j, array[j]);
    }

    return outputMatrix;
}

// transpose matrix
function Transpose(matrix)
{
    var outputMatrix = Zeros(matrix.NumCols, matrix.NumRows);
    for (var i = 0; i < outputMatrix.NumRows; i++)
    {
        for (var j = 0; j < outputMatrix.NumCols; j++)
        {
            outputMatrix.Modify(i, j, matrix.Index(j, i));
        }
    }
    
    return outputMatrix;
}

// linear steps 
function Linspace(start, end, steps) 
{
    let stepSize = (end - start) / (steps - 1);
    let matrix = Zeros(1, steps);
    
    for (let i = 0; i < steps; i++) 
    {
        matrix.Modify(0, i, start + i * stepSize);
    }

    return matrix;
}

// matrix creators
Zeros = (numRows, numCols) => MatrixOf(numRows, numCols, 0); 
Ones = (numRows, numCols) => MatrixOf(numRows, numCols, 1); 
RandomMatrix = (numRows, numCols) => MatrixMap(Ones(numRows, numCols), x => Math.random() );
IntegerRange = (start, end) => Linspace(start, end, end - start + 1);

// left and right element wise matrix operators
Add2 = (left, right) => MatrixMap2(left, right, (x, y) => x + y);
Subtract2 = (left, right) => MatrixMap2(left, right, (x, y) => x - y);
Multiply2 = (left, right) => MatrixMap2(left, right, (x, y) => x * y);
Divide2 = (left, right) => MatrixMap2(left, right, (x, y) => x / y);

// scalar matrix operators
Add = (matrix, value) => MatrixMap(matrix, x => x + value);
Subtract = (matrix, value) => MatrixMap(matrix, x => x - value);
Multiply = (matrix, value) => MatrixMap(matrix, x => x * value);
Divide = (matrix, value) => MatrixMap(matrix, x => x / value);

// single matrix operations
Sin = matrix => MatrixMap(matrix, x => Math.sin(x));
Sin2 = matrix => MatrixMap(matrix, x => Math.sin(2 * x));
Cos = matrix => MatrixMap(matrix, x => Math.cos(x));
Cos2 = matrix => MatrixMap(matrix, x => Math.cos(2 * x));
Tan = matrix => MatrixMap(matrix, x => Math.tan(x));
Tan2 = matrix => MatrixMap(matrix, x => Math.tan(x * 2));
Square = matrix => Multiply2(matrix, matrix);
Sqrt = matrix => MatrixMap(matrix, x => Math.sqrt(x));
Abs = matrix => MatrixMap(matrix, x => Math.abs(x));
Round = matrix => MatrixMap(matrix, x => Math.round(x));
Floor = matrix => MatrixMap(matrix, x => Math.floor(x));
Ceil = matrix => MatrixMap(matrix, x => Math.ceil(x));
Normalise = matrix => Divide(matrix, MaxAbs(matrix)) ;
NormaliseForColourMap = matrix => Normalise(Subtract(matrix, Min(matrix)));

// returning single values / reducing operations
MatrixReduce = (matrix, func) => matrix.ToArray().reduce(func);
Total = matrix => MatrixReduce(matrix, (x, y) => x + y);
Max = matrix => MatrixReduce(matrix, (x, y) => Math.max(x, y));
Min = matrix => MatrixReduce(matrix, (x, y) => Math.min(x, y));
MaxAbs = matrix => Max(Abs(matrix));
Length = matrix => Math.max(matrix.NumRows, matrix.NumCols);

// constants
const Pi = Math.PI;
const Tau = 2 * Math.PI;

// =============================================================================
// Done
// =============================================================================

console.log("Finished adding matrix library");