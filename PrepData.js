function PrepData(header, data){
    var result = "";
    result += header + "\n";
    for (var i = 0; i < data[0].length; i++){
        result += data[0][i] + ",";
        result += data[1][i] + ",";
        result += data[2][i] + ",";
        result += data[3][i] + "\n";
        // result += data[4][i] + ",\n";
    }
    return result;
}