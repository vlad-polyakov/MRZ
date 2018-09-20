//Created by Stanislav Kozel
//Modified by Vladislav Polyakov and Vladislav Shusterman


var data;
google.charts.load('current', {'packages': ['line']});

var m;
var p;
var q;
var n;
var timeOperation = [];
var numberOperation = [];
var nodes = [];

var T1;
var Tn;
var R;
var Ky;
var E;
var kD;
var Lavg;

var A = [];
var B = [];

/////////////////////////////////////Data


//Created by Vladislav Polyakov
function main() {

    T1 = 0;
    Tn = 0;
    R = 0;

    m = parseInt(document.getElementById("inputM").value);
    p = parseInt(document.getElementById("inputP").value);
    q = parseInt(document.getElementById("inputQ").value);
    n = parseInt(document.getElementById("inputN").value);
    //n,p,m,q check
    if (isNaN(m) || m <= 0 || isNaN(p) || p <= 0 || isNaN(q) || q <= 0 || isNaN(n) || n <= 0) {
        alert("Некорректный ввод!");
        return;
    }
    timeOperation = [];
    timeOperation.push(parseInt(document.getElementById("inputT1").value));//сложение
    timeOperation.push(parseInt(document.getElementById("inputT2").value));//деление
    timeOperation.push(parseInt(document.getElementById("inputT3").value));//произведение
    timeOperation.push(parseInt(document.getElementById("inputT4").value));//модуль числа
    timeOperation.push(parseInt(document.getElementById("inputT5").value));//сравнение
    // time operation
    for (var i = 0; i < timeOperation.length; i++) {
        if (isNaN(timeOperation[i]) || timeOperation[i] <= 0) {
            alert("Некорректный ввод!");
            return;
        }
    }

    numberOperation = [];
    nodes = [];
    for (var i = 0; i < timeOperation.length; i++) {
        numberOperation.push(0);
        nodes.push(0);
    }
    nodes.push(0);
    nodes.push(0);

    A = genMatrix(p, m);
    B = genMatrix(m, q);

    var D = calculateMatrixD();
    var C = [];

    T1 = 0;
    for (var i = 0; i < numberOperation.length; i++) {
        T1 += numberOperation[i] * timeOperation[i];
    }

    for (var i = 0; i < p; i++) {
        C.push([]);
        for (var j = 0; j < q; j++) {
            C[i].push(Math.round(calculateCElem(i, j, D) * 1000) / 1000);
        }
    }

    T1 += timeOperation[0] * p * (m - 1) * q;

    R = p * m * q*2;
    Ky = T1 / Tn;
    E = Ky / n;

    //i=0...p; j=0...q; k=0...m
    //t[0] - "+"
    //t[1] - "/"
    //t[2] - "*"
    //t[3] - "||"
    //t[4] - "<"

    Lavg = 0;
    Lavg += timeOperation[3]*nodes[0];
    Lavg+=timeOperation[4]*nodes[1];
    Lavg+=timeOperation[2]*nodes[2];
    Lavg+=timeOperation[2]*nodes[3];
    Lavg+=timeOperation[0]*nodes[4];
    Lavg+=(timeOperation[1]+timeOperation[0])*nodes[5];
    Lavg+=timeOperation[0]*nodes[6];
    /*Lavg += (timeOperation[3]  + timeOperation[4]) * nodes[0];
    Lavg += (timeOperation[2]) * nodes[1];
    Lavg += (timeOperation[4] + timeOperation[2]) * nodes[2];
    Lavg += (timeOperation[0]) * nodes[3];
    Lavg += (timeOperation[1] * 2 + timeOperation[0]) * nodes[4];
    Lavg += timeOperation[0] * nodes[5];*/
    Lavg /= R;

    kD = T1 / Lavg;

    generateTables(C, D);
}
//modified by Vladislav Polyakov
function generateTables(C, D) {
    document.getElementById('AllTables').parentNode.removeChild(document.getElementById('AllTables'));
    var div = document.createElement("div");
    div.setAttribute("id", "AllTables");
    var table = document.createElement("table");
    var tableRow = document.createElement("tr");
    var tableData = document.createElement("td");
    tableData.innerHTML += "<p align='center'>A=</p>";
    tableRow.appendChild(tableData);
    tableData = document.createElement("td");
    tableData.innerHTML += "<p align='center'>B=</p>";
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);
    tableRow = document.createElement("tr");
    tableData = document.createElement("td");

    createTable(A, tableData);
    tableRow.appendChild(tableData);
    tableData = document.createElement("td");
    createTable(B, tableData);
    tableRow.appendChild(tableData);
    tableData = document.createElement("td");
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);

    var body = document.querySelector("body");

    div.appendChild(table);
    table = document.createElement("table");
    tableRow = document.createElement("tr");
    for (var k = 0; k < m; k++) {
        tableData = document.createElement("td");
        tableData.innerHTML += "<p align='center'>D[" + k + "]=</p>";
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    tableRow = document.createElement("tr");
    for (var k = 0; k < m; k++) {
        tableData = document.createElement("td");
        createTable(D[k], tableData);
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    body = document.querySelector("body");
    div.appendChild(table);

    table = document.createElement("table");
    tableRow = document.createElement("tr");
    tableData = document.createElement("td");
    tableData.innerHTML += "<p align='center'>C=</p>";
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);
    tableRow = document.createElement("tr");
    tableData = document.createElement("td");
    createTable(C, tableData);
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);
    body = document.querySelector("body");
    div.appendChild(table);

    var oper = ["сложение", "деление", "произведение", "модуль", "сравнение"];

    table = document.createElement("table");
    table.setAttribute("bordercolor", "grey");
    table.setAttribute("border", "1px");
    tableRow = document.createElement("tr");
    var tableHeader = document.createElement("th");
    tableRow.appendChild(tableHeader);
    for (var i = 0; i < oper.length; i++) {
        tableHeader = document.createElement("th");
        var text = document.createTextNode(oper[i]);
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader)
    }
    tableHeader = document.createElement("th");
    var text = document.createTextNode("Т1");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);

    tableHeader = document.createElement("th");
    var text = document.createTextNode("Т" + n);
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader = document.createElement("th");
    var text = document.createTextNode("Ky");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader = document.createElement("th");
    var text = document.createTextNode("e");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader = document.createElement("th");
    var text = document.createTextNode("D");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableHeader = document.createElement("th");
    var text = document.createTextNode("r");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);

    tableRow = document.createElement("tr");
    tableData = document.createElement("td");
    tableData.innerHTML += "<p align='center'>Время операции</p>";
    tableRow.appendChild(tableData);
    for (var i = 0; i < timeOperation.length; i++) {
        tableData = document.createElement("td");
        tableData.innerHTML += "<p align='center'>" + timeOperation[i] + "</p>";
        tableRow.appendChild(tableData);
    }
    tableData = document.createElement("td");
    tableData.setAttribute("rowspan", "2");
    tableData.innerHTML += "<p align='center'>" + T1 + "</p>";
    tableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.setAttribute("rowspan", "2");
    tableData.innerHTML += "<p align='center'>" + Tn + "</p>";
    tableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.setAttribute("rowspan", "2");
    tableData.innerHTML += "<p align='center'>" + Ky.toFixed(3) + "</p>";
    tableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.setAttribute("rowspan", "2");
    tableData.innerHTML += "<p align='center'>" + E.toFixed(3) + "</p>";
    tableRow.appendChild(tableData);

    tableData = document.createElement("td");
    tableData.setAttribute("rowspan", "2");
    tableData.innerHTML += "<p align='center'>" + kD.toFixed(3) + "</p>";
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);

    tableData = document.createElement("td");
    tableData.setAttribute("rowspan", "2");
    tableData.innerHTML += "<p align='center'>" + R + "</p>";
    tableRow.appendChild(tableData);
    table.appendChild(tableRow);

    tableRow = document.createElement("tr");
    tableData = document.createElement("td");
    tableData.innerHTML += "<p align='center'>Кол-во вызовов</p>";
    tableRow.appendChild(tableData);
    for (var i = 0; i < numberOperation.length; i++) {
        tableData = document.createElement("td");
        tableData.innerHTML += "<p align='center'>" + numberOperation[i] + "</p>";
        tableRow.appendChild(tableData);
    }
    table.appendChild(tableRow);
    div.appendChild(table);
    body.appendChild(div);
}
//created by Vladislav Polyakov using http://www.stijit.com/javascript/table 
function createTable(matrix, parent) {
    var firstTable = document.querySelector("table");
    var table = document.createElement("table");
    var tableRow = "";
    var tableData = "";
    var text = "";
    var height = 60;
    table.setAttribute("width", 250);
    table.setAttribute("border", "1px")
    table.setAttribute("bordercolor", "grey");
    table.setAttribute("align", "center");
    for (var i = 0; i < matrix.length; i++) {
        tableRow = document.createElement("tr");
        for (var j = 0; j < matrix[0].length; j++) {
            tableData = document.createElement("td");
            tableData.innerHTML += "" + matrix[i][j];
            tableRow.appendChild(tableData);
            tableData.setAttribute("height", height);
        }
        table.appendChild(tableRow);
    }
    return parent.appendChild(table);
}
//created by Vladislav Polyakov
function genMatrix(row, column) {
    var res = [];
    for (var i = 0; i < row; i++) {
        res.push([]);
        for (var j = 0; j < column; j++) {
            res[i].push(Math.random() * 2 - 1);
        }
    }
    return res;
}
//modified by Vladislav Polyakov
function absMatrix(matrix) {
    var res = [];
    var t = 0;
    for (var i = 0; i < matrix.length; i++) {
        res.push([]);
        for (var j = 0; j < matrix[i].length; j++) {
            res[i].push(Math.abs(matrix[i][j]));
            numberOperation[3] += 1;
            t += timeOperation[3];
            nodes[0] +=1; // модуль
        }
    }
    Tn += Math.ceil(t / n);
    return res;
}
//modified by Vladislav Polyakov
function calculateMatrixD() {
    var res = [];
    var absA = absMatrix(A);
    var absB = absMatrix(B);
    var t = 0;
    for (var k = 0; k < m; k++) {
        res.push([]);
        for (var i = 0; i < p; i++) {
            res[k].push([]);
            for (var j = 0; j < q; j++) {
                //<=>
                numberOperation[4] += 1;
                t += timeOperation[4];
                //*
                numberOperation[2] += 1;
                t += timeOperation[2];

                nodes[1]+=1; // сравнение

                if (absA[i][k] < absB[k][j]) {

                    res[k][i].push(A[i][k] * B[k][j]);

                    nodes[2] += 1; //умножение
                } else {

                    nodes[3] += 1; //сравнение

                    //<=>
                    numberOperation[4] += 1;
                    t += timeOperation[4];
                    if (A[i][k] * B[k][j] === 0) {
                        res[k][i].push(A[i][k] + B[k][j]);
                        //+
                        numberOperation[0] += 1;
                        t += timeOperation[0];

                        nodes[4] += 1;//сумма
                    } else {
                        res[k][i].push(A[i][k] / B[k][j] + B[k][j] / A[i][k]);
                        //+
                        numberOperation[0] += 1;
                        t += timeOperation[0];
                        // /
                        numberOperation[1] += 2;
                        t += 2 * timeOperation[1];

                        nodes[5] += 1;//сумма + деление
                    }
                }
            }
        }
    }
    Tn += Math.ceil(t / n);
    return res;
}

//modified by Vladislav Shusterman
function calculateCElem(i, j, D) {
    var Dk = [];
    for (var k = 0; k < D.length; k++) {
        Dk.push(D[k][i][j]);
    }
    return sumArray(Dk);
}

function sumArray(D) {
    if (D.length == 1) {
        var res = D[0];
        return res;
    } else {
        var t = 0;
        var res = [];
        if (D.length % 2 === 1) {
            res.push(D[D.length - 1]);
        }
        for (var i = 0; i < (D.length - D.length % 2); i += 2) {
            res.push(D[i] + D[i + 1]);
            numberOperation[0] += 1;
            t += timeOperation[0];

            nodes[6] += 1;//сумма матриц
        }
        Tn += Math.ceil(t / n);
        return (sumArray(res));
    }
}







