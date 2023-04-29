/* 
Tetris game made with HTML, CSS and Javascript, following the tutorial provided by freeCodeCamp https://www.youtube.com/watch?v=rAUn1Lom6dw, taught by teacher Ania Kubow.
*/

document.addEventListener('DOMContentLoaded', () => {
    //The code of the whole project must be writen inside this addEventListener function. 
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    const width = 10;

    //Add border line
    function addBorderLine() {
        squares.forEach(square => {
            if (!square.classList.contains('taken')) {
                square.classList.add('borderLine');
            }
        })
    }

    addBorderLine();

    //The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        })
    }

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }

    //make the tetromino move down every second
    timerId = setInterval(moveDown, 1000);

    //assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();

    }

    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        }
    }

    //move the tetromino left, unless is at the edge or there is blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        };

        draw();
        freeze();
    }

    //move the tetromino Right, unless is at the edge or there is blockage
    function moveRight() {
        undraw();
        const isAtRighttEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRighttEdge) currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        };

        draw();
        freeze();
    }

    //rotate the tetromino
    function rotate() {
        const isAtRighttEdge = current.some(index => (currentPosition + index) % width === width - 1);
        const isAtRighttEdge1 = current.some(index => (currentPosition + index) % width === width - 2);
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        undraw()
        currentRotation++
        if (currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        if (current === theTetrominoes[4][currentRotation]) {
            if (isAtRighttEdge && !isAtRighttEdge1) currentPosition -= 2;
            if (isAtRighttEdge1 && !isAtRighttEdge) currentPosition -= 1;
            if (isAtLeftEdge) currentPosition += 1;
        } else if (current !== theTetrominoes[3][currentRotation]) {
            if (isAtRighttEdge) currentPosition -= 1;
            if (isAtLeftEdge) currentPosition += 1;
        }
        draw();
        freeze();

    }
});


