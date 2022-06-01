function Linspace(start, end, steps) {
    // linear steps 
    var stepSize = (end - start) / (steps - 1);
    var arr = [];
    for (var i = 0; i < steps; i++) {
        arr[i] = start + i * stepSize
    }
    return arr
}

