# matrixCanvas

This will have a library for manipulating matrices and drawing them on a canvas element.

## Currently contains
```javascript
Matrix(numRow, numCols, data)
MatrixOf(numRows, numCols, value)
MatrixMap(matrix, func)
MatrixMap2(left, right, func)
MatrixMultiply(left, right)
ArrayToMatrix(array)
Transpose(matrix)

// creators
Linspace(start, end, steps)
Zeros(numRows, numCols)
Ones(numRows, numCols)
RandomMatrix(numRows, numCols)
IntegerRange(start, end)

// matrix-matrix
Add2(left, right)
Subtract2(left, right)
Multiply2(left, right)
Divide2(left, right)

// matrix-scalar 
Add(matrix, value)
Subtract(matrix, value)
Multiply(matrix, value)
Divide(matrix, value)

// matrix operations
Square(matrix)
Sqrt(matrix)
Abs(matrix)
Normalise(matrix)
  
// matrix-reduce
MatrixReduce(matrix, func)
Total(matrix)
Max(matrix)
Min(matrix)
MaxAbs(matrix)
```