var tableGenerated = 0;
var TIME;


//created by Anna Vasilyeva
//modified by Vladislav Polyakov

function letItGo() {

    var firstNums = document.getElementById('FirstNums').value.replace(/\s+/g, '');
    var secondNums = document.getElementById('SecondNums').value.replace(/\s+/g, '');
    TIME = document.getElementById('Time').value;

    var firstNumsArr = firstNums.split(',');
    var secondNumsArr = secondNums.split(',');

    if (rightInput(firstNums, secondNums, firstNumsArr, secondNumsArr) == 0)
		return;

    firstNumsArr = inputInInt(firstNumsArr);
    secondNumsArr = inputInInt(secondNumsArr);

    if (checkIntArr(firstNumsArr, secondNumsArr)== 0 )
		return;


    if (tableGenerated == 1) {
        var table = document.getElementById('Table');
        var tableDiv = document.getElementById('tableDiv');

        tableDiv.removeChild(table);
        tableGenerated = 0;

        var table = document.createElement("table");
        table.id = 'Table';
        table.border = '1';
        tableDiv.appendChild(table);
    }

    generateTable(firstNumsArr.length + 18);


    for (var numberOfPair = 0; numberOfPair < firstNumsArr.length; numberOfPair++) {

        var cell = document.getElementById("h" + (numberOfPair + 1) + "w" + 0);
        cell.innerHTML = firstNumsArr[numberOfPair] + "/" + secondNumsArr[numberOfPair]+"<br> Time:"+(TIME*(numberOfPair+1));
        firstNumsArr[numberOfPair] = firstNumsArr[numberOfPair].toString(2);
        secondNumsArr[numberOfPair] = secondNumsArr[numberOfPair].toString(2);
        parseToArray(firstNumsArr[numberOfPair], secondNumsArr[numberOfPair], numberOfPair);
    }
}

function rightInput(firstNums, secondNums, firstNumsArr, secondNumsArr) {
   
    if (firstNumsArr.length != secondNumsArr.length) {
        alert('Имеются неполные пары элементов.');
        return 0;
    }

    if (firstNums == "" || secondNums == "") {
        alert('Заполните все поля.');
        return 0;
    }
    return 1;
}

function inputInInt(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].match(/^\d+$/)) {
            arr[i] = +arr[i];
        }
        else
            alert("Ошибка в создании массива");
    }
    return arr;
}

function checkIntArr(firstNumsArr, secondNumsArr) {
    for (var i = 0; i < firstNumsArr.length; i++) {
        if (firstNumsArr[i] > 63 && firstNumsArr[i] < 1
            && secondNumsArr[i] > 63 && secondNumsArr[i] < 1) {
            alert("Превышена разрядность (есть числа > 63)");
            return 0;
        }
    }
    return 1;
}


function parseToArray(dividentString, divisorString, numberOfPair) {
    var divident = [];
    var divisor = [];

    divident = invertArray(dividentString);
    divisor = invertArray(divisorString);
    putInRegisters(divident, divisor, numberOfPair);
}

function invertArray(someString) {
    var number = [];
    number = someString.split("");
    while (number.length < 6) {
        number.unshift(0);
    }
    number.reverse();

    return number;
}


function shift(A, P) {
    var higherBitOfARegister = A[5];
    for (var i = 5; i > 0; i--) {
        P[i] = P[i - 1];
        A[i] = A[i - 1];
    }
    P[0] = higherBitOfARegister;
    A[0] = 0;
}


function ifSecondBigger(fisrtBinNumber, secondBinNumber) {
    for (var i = 5; i >= 0; i--) {
        if (fisrtBinNumber[i] != secondBinNumber[i]) {
            if (fisrtBinNumber[i] < secondBinNumber[i])
                return true;
            else
                return false;
        }
    }
}


function putInRegisters(divident, divisor, numberOfPair) {

    var registerP = [0, 0, 0, 0, 0, 0];
    var registerA = [];
    var registerB = [];
    for (var i = 0; i < 6; i++) {
        registerA.push(+divident[i]);
        registerB.push(+divisor[i]);
    }

    var rowIndex = numberOfPair + 1;
    var columnIndex = 1;

    for (var i = 0; i < 6; i++) {

        shift(registerA, registerP);

        setCellInfo(rowIndex, columnIndex, registerP, registerA);
        rowIndex++;
        columnIndex++;

        var registerPCopy = registerP.slice();
        registerP = subtract(registerP, registerB);

        setCellInfo(rowIndex, columnIndex, registerP, registerA);
        rowIndex++;
        columnIndex++;

        if (registerP.length > 6) {
            setLowOrderBitOfRegister(registerA, 0);

            setCellInfo(rowIndex, columnIndex, registerP, registerA);
            rowIndex++;
            columnIndex++;

            registerP = restoreRegister(registerPCopy);
        }
        else {
            setLowOrderBitOfRegister(registerA, 1);

            setCellInfo(rowIndex, columnIndex, registerP, registerA);
            rowIndex++;
            columnIndex++;
        }
    }

    while (registerP[registerP.length - 1] == 0 && registerP.length > 0) {
        registerP.pop();
    }
    while (registerA[registerA.length - 1] == 0 && registerA.length > 0) {
        registerA.pop();
    }
    var remainder;
    var quotient;
    if (registerP.length != 0) {
        remainder = parseInt(registerP.reverse().join(""), 2);
    }
    else {
        remainder = 0;
    }

    if (registerA.length != 0) {
        quotient = parseInt(registerA.reverse().join(""), 2);
    }
    else {
        quotient = 0;
    }
    rowIndex--;

    var cell = document.getElementById("h" + rowIndex + "w" + columnIndex);
    var timeSpent = (TIME*18)+TIME*numberOfPair;
    cell.innerHTML = "Quotient: " + quotient + "<br> Remainder:" + remainder+"<br> Time: "+ timeSpent;

}


function generateTable(elementsNumber) {
    var table = document.getElementById('Table');
    for (var rowIndex = 0; rowIndex < elementsNumber; rowIndex++) {
        var row = document.createElement("tr");
        row.setAttribute("id", "r" + rowIndex);
        for (var columnIndex = 0; columnIndex < 20; columnIndex++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", "h" + rowIndex + "w" + columnIndex);
            row.appendChild(cell);
            if (rowIndex == 0) {
                if (columnIndex > 0 && columnIndex < 19) {
                    var nameOfAct;
                    switch (columnIndex % 3) {
                        case 1:
                            nameOfAct = " shift";
                            break;
                        case 2:
                            nameOfAct = "substract";
                            break;
                        case 0:
                            nameOfAct = "set bit";
                            break;
                    }

                    cell.innerHTML = columnIndex + "<br>" + nameOfAct;
                }
                if (columnIndex == 19) {
                    cell.innerHTML = "Result";
                }
                if (columnIndex == 0) {
                    cell.innerHTML = "Pair:";
                }
            }
        }
        table.appendChild(row);
    }
    tableGenerated = 1;
}

function setCellInfo(rowIndex, columnIndex, registerP, registerA) {
    var regPString;
    registerPCopy = registerP.slice();
    registerACopy = registerA.slice();
    if (registerPCopy.length == 7) {
        registerPCopy.pop();
        var addition = registerPCopy.slice();
        for (var i = 0; i < registerPCopy.length; i++) {
            if (addition[i] == 1) {
                addition[i] = 0;
            }
            else addition[i] = 1;
        }
        var oneArray = [1, 0, 0, 0, 0, 0];
        addition = sum(addition, oneArray);
        addition[5] = 1;

        regPString = addition.reverse().join("");
    }
    else regPString = registerPCopy.reverse().join("");

    var info = "P:" + regPString + "<br>" + "A:" + registerACopy.reverse().join("");
    var cell = document.getElementById("h" + rowIndex + "w" + columnIndex);
    cell.innerHTML = info;
    return info;
}

function setLowOrderBitOfRegister(registerA, lastBit) {
    registerA[0] = lastBit;
}

function restoreRegister(oldRegister) {
    return oldRegister;
}

function subtract(minuend, subtrahend) {
    var biggerNumber = [];
    var smallerNumber = [];
    negative = new Boolean(false);
    if (ifSecondBigger(minuend, subtrahend)) {
        biggerNumber = subtrahend;
        smallerNumber = minuend;
        negative = true;
    }
    else {
        biggerNumber = minuend;
        smallerNumber = subtrahend;
    }
    var addition = smallerNumber.slice();
    for (var i = 0; i < smallerNumber.length; i++) {
        if (addition[i] == 1) {
            addition[i] = 0;
        }
        else addition[i] = 1;
    }
    var oneArray = [1, 0, 0, 0, 0, 0];
    addition = sum(addition, oneArray);
    var substraction = [];
    substraction = sum(biggerNumber, addition);
    if (substraction.length > 6) {
        substraction.pop();
    }
    if (negative == true) {
        substraction.push(1);
    }
    return substraction;
}

function sum(P, B) {
    var summOfPair = [];
    for (var i = 0; i < 6; i++) {
        summOfPair[i] = P[i] + B[i];
    }
    for (var i = 0; i < summOfPair.length; i++) {
        if (summOfPair[i] > 1) {
            if (i == summOfPair.length - 1) {
                summOfPair.push(0);
            }
            if (summOfPair[i] % 2 == 0) {
                summOfPair[i + 1] += summOfPair[i] / 2;
                summOfPair[i] = 0;
            } else {
                summOfPair[i + 1] += (summOfPair[i] - 1) / 2;
                summOfPair[i] = (summOfPair[i] - 1) / 2;
            }
        }
    }
    return summOfPair;
}

