let container = document.getElementById("container");
let table = document.createElement('div');
table.classList.add('table');
container.appendChild(table);

let numberOfCells = 8;
let tableCell;
let choosePiece = false;

let chassePieseMap = ['rook', 'knight', 'bishop' , 'queen' , 'king' , 'bishop' , 'knight' , 'rook'];

function matrixArray(rows,columns){
    let arr = [];
    for(let i=0; i<rows; i++){
        arr[i] = [];
        for(let j=0; j<columns; j++){
            arr[i][j] = null;//вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
        }
    }
    return arr;
}

let fullTableMap = matrixArray(numberOfCells,numberOfCells);
let possibleStepsTableMap = matrixArray(numberOfCells,numberOfCells);

function resetTable() {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++) {
            tableCell = document.createElement('div');
            ((i + j) % 2 == 0) ? tableCell.classList.add('white-cell') : tableCell.classList.add('black-cell');
            tableCell.classList.add('cell-' + i + '-' + j);
            table.appendChild(tableCell);
            tableCell.classList.remove('chess-piece');
            tableCell.classList.remove('possible-step');
        }
    }
}

function displayCurrentPosition() {
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++) {
            tableCell = document.getElementsByClassName('cell-' + i + '-' + j)[0];
            if (fullTableMap[i][j] != null) {
                tableCell.classList.add('chess-piece');
                tableCell.classList.add(fullTableMap[i][j].piece);
                tableCell.classList.add(fullTableMap[i][j].color);
                tableCell.addEventListener('click', takePeace);
            }
            tableCell.addEventListener('click', nextStep);
        }
    }
}

function displayPossibleSteps() {
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++) {
            tableCell = document.getElementsByClassName('cell-' + i + '-' + j)[0];
            if (possibleStepsTableMap[i][j] != null) {
                tableCell.classList.add('possible-step');
            }
        }
    }
}

function takePeace() {
    if (this.classList.contains('take-piece')) {
        this.classList.remove('take-piece');
        choosePiece = false;
        resetTable();
        displayCurrentPosition();
    }
    else if (!choosePiece){
        this.classList.add('take-piece');
        choosePiece = true;
        possibleMove(this.classList);
    }
}

function nextStep() {
    if (choosePiece) {
        let yP,
            xP,
            yC,
            xC;
        let previousCell = document.getElementsByClassName('take-piece')[0];
        let previousCellClassList = previousCell.className.split(/\s+/);
        for (let i = 0; i < previousCellClassList.length; i++) {
            if (previousCellClassList[i].match(/cell-\d-\d$/i)) {
                yP = previousCellClassList[i].split('-')[2];
                xP = previousCellClassList[i].split('-')[1];
                break;
            }
        }

        let currentCellClassList = this.className.split(/\s+/);
        for (let i = 0; i < currentCellClassList.length; i++) {
            if (currentCellClassList[i].match(/cell-\d-\d$/i)) {
                yC = currentCellClassList[i].split('-')[2];
                xC = currentCellClassList[i].split('-')[1];
                break;
            }
        }

        if (!(xC === xP && yC === yP)) {
            fullTableMap[xC][yC] = fullTableMap[xP][yP];
            fullTableMap[xP][yP] = null;
            choosePiece = false;
            resetTable();
            displayCurrentPosition();
        }
    }
}

function possibleMove(currentCellClassList) {
    console.log("PossibleMove executed:\n" + currentCellClassList);
    let yC,
        xC;
    for (let i = 0; i < currentCellClassList.length; i++) {
        if (currentCellClassList[i].match(/cell-\d-\d$/i)) {
            yC = +currentCellClassList[i].split('-')[2];
            xC = +currentCellClassList[i].split('-')[1];
            break;
        }
    }
    switch (fullTableMap[xC][yC].piece){
        case 'pawn':
            possibleMovePawn(xC, yC);
            break;
        default:
            console.log("Неизвестная фигура");
    }
    displayPossibleSteps();
    console.log(xC + "\n" + yC);
}

function possibleMovePawn(x , y) {
    let direction = 1;
    if(fullTableMap[x][y].color == 'chess-piece-white') {
        direction = -1;
    }
    console.log(1 * direction);
    console.log(x);
    console.log((1 * direction) + x);
    possibleStepsTableMap[x + (1 * direction)][y] = true;
    if(x == 6 && direction == -1 || x == 1 && direction == 1)
        possibleStepsTableMap[x + (2 * direction)][y] = true;
}

function getInitialPosition() {
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++ ) {
            let cell = {
                piece: null,
                color: null
            };
            if (i == 0 || i == 1) {
                cell.color = 'chess-piece-black';
            }

            if (i == 6 || i == 7) {
                cell.color = 'chess-piece-white';
            }

            if(i == 1 || i == 6) {
                cell.piece = 'pawn';
            }

            if(i == 0 || i == 7) {
                cell.piece = chassePieseMap[j];
            }

            if (cell.piece != null)
                fullTableMap[i][j] = cell;
        }
    }
}


resetTable();
getInitialPosition();
displayCurrentPosition();