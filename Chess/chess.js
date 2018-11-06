// Исходный контейнер из HTML документа
let container = document.getElementById("container");

// Добавнение блока, который будет основой шахматной доски
let table = document.createElement('div');
table.classList.add('table');
container.appendChild(table);

// Количество строк и столбцов
let numberOfCells = 8;
// Верменная переменная, являющаяся одной клеткой доски
let tableCell;
// Переключатель - выбрал ли ты фигуру для хода
let choosePiece = false;

// Переменная определяющая чей сейчас ход
let whiteStep = true;

// Функция передачи хода другому игроку
function toggleStep() {
    whiteStep =  (whiteStep) ? false : true;
}

// Массив из шахматных фигур, кроме пешки
let chassePieseMap = ['rook', 'knight', 'bishop' , 'queen' , 'king' , 'bishop' , 'knight' , 'rook'];

// Функция генерации пустого двумерного массива, заданного размера
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

// Матрица, в которой будет содержаться текущее состояние фигур на доске
let fullTableMap = matrixArray(numberOfCells,numberOfCells);
// Матрица возможных ходов для выбранной фигуры
let possibleStepsTableMap;

// Сброс состояций всех клеток
function resetTable() {
    // Удаление клеток
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    // Создание клеток, юобавление необходимых классок
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++) {
            tableCell = document.createElement('div');
            // Опраделение цвета клетки
            ((i + j) % 2 == 0) ? tableCell.classList.add('white-cell') : tableCell.classList.add('black-cell');
            // Порядковый номер клетки
            tableCell.classList.add('cell-' + i + '-' + j);
            table.appendChild(tableCell);
        }
    }
    // Обнуление матрицы возможных ходов для выбранной фигуры
    possibleStepsTableMap = matrixArray(numberOfCells,numberOfCells);
}

//Вывод на экран текущее положение фигур
function displayCurrentPosition() {
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++) {
            tableCell = document.getElementsByClassName('cell-' + i + '-' + j)[0];
            if (fullTableMap[i][j] != null) {
                tableCell.classList.add('chess-piece');
                tableCell.classList.add(fullTableMap[i][j].piece);
                tableCell.classList.add(fullTableMap[i][j].color);
                // Ожидание, что мы выберем фигуру для хода
                if ((whiteStep && fullTableMap[i][j].color == 'chess-piece-white') ||
                    (!whiteStep && fullTableMap[i][j].color == 'chess-piece-black'))
                        tableCell.addEventListener('click', takePeace);
            }
        }
    }
}

// Вывод вожможных ходов для выюранной фигуры
function displayPossibleSteps() {
    for ( let i = 0; i < numberOfCells ; i++) {
        for (let j = 0; j < numberOfCells; j++) {
            tableCell = document.getElementsByClassName('cell-' + i + '-' + j)[0];
            if (possibleStepsTableMap[i][j] != null) {
                tableCell.classList.add('possible-step');
                // Ожинание, что вы подвинем куда-нибудь выбранную фигуру
                tableCell.addEventListener('click', nextStep);
            }
        }
    }
}

// Функция, отслеживыюцая выбор фигуры для хода
function takePeace() {
    // Ели эта фигура уже выюрана - снять выделение
    console.log(choosePiece);
    if (this.classList.contains('take-piece')) {
        this.classList.remove('take-piece');
        choosePiece = false;
        resetTable();
        displayCurrentPosition();
    }
    // Выбрать фигуру, если не выбрана уже какая-то другая
    else if (!choosePiece){
        this.classList.add('take-piece');
        choosePiece = true;
        possibleMove(this.classList);
    }
}

// Оброаботка перемещения фигуры
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
            toggleStep();
            displayCurrentPosition();
        }
    }
}

// Расчет возможных перемещеный для фигуры
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

// Расчет траектории перемещение для пешки
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
        // Заполнение матрицы возможных ходов для выбранной фигуры
        possibleStepsTableMap[x + (2 * direction)][y] = true;
}

// Инициализация новой партии
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
                // Заполнение матрицы, в которой будет содержаться текущее состояние фигур на доске
                fullTableMap[i][j] = cell;
        }
    }
}


resetTable();
getInitialPosition();
displayCurrentPosition();