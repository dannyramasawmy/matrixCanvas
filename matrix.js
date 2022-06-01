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
        if (i < 0 || j < 0)
        {
            throw "Index out of range";
        }
    
        if (i >= this.NumRows || j >= this.NumCols)
        {
            throw "Index out of range";
        }
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
    
    return  new Matrix(numRows, numCols, matrix);;
}

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

// =============================================================================
// Functions
// =============================================================================

// matrix creators
Zeros = (numRows, numCols) => { return MatrixOf(numRows, numCols, 0) }; 
Ones = (numRows, numCols) => { return MatrixOf(numRows, numCols, 1) }; 
RandomMatrix = (numRows, numCols) => { return MatrixMap(Ones(numRows, numCols), (x) => Math.random() )};

// left and right element wise matrix operators
Add2 = (left, right) => { return MatrixMap2(left, right, (x, y) => x + y); }
Subtract2 = (left, right) => { return MatrixMap2(left, right, (x, y) => x - y); }
Multiply2 = (left, right) => { return MatrixMap2(left, right, (x, y) => x * y); }
Divide2 = (left, right) => { return MatrixMap2(left, right, (x, y) => x / y); }

// scalar matrix operators
Add = (matrix, value) => { return MatrixMap(matrix, (x) => x + value); }
Subtract = (matrix, value) => { return MatrixMap(matrix, (x) => x - value); }
Multiply = (matrix, value) => { return MatrixMap(matrix, (x) => x * value); }
Divide = (matrix, value) => { return MatrixMap(matrix, (x) => x / value); }
Square = (matrix) => {return Multiply2(matrix, matrix)};
Sqrt = (matrix) => {return MatrixMap(matrix, (x) => Math.sqrt(x))};
Abs = (matrix) => {return MatrixMap(matrix, (x) => Math.abs(x))};
  
// returning single values / reducing operations
MatrixReduce = (matrix, func) => { return matrix.ToArray().reduce(func); }
Total = (matrix) => { return MatrixReduce(matrix, (x, y) => x + y) };
Max = (matrix) => { return MatrixReduce(matrix, (x, y) => Math.max(x, y)) };
Min = (matrix) => { return MatrixReduce(matrix, (x, y) => Math.min(x, y)) };
MaxAbs = (matrix) => { return Max(Abs(matrix))};
 


console.log("Finished adding matrix library");