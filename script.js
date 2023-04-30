/* 
Tetris game made with HTML, CSS and Javascript, following the tutorial provided by freeCodeCamp https://www.youtube.com/watch?v=rAUn1Lom6dw, taught by teacher Ania Kubow.
*/

document.addEventListener('DOMContentLoaded', () => {
    //The code of the whole project must be writen inside this addEventListener function. 
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let timerId;
    let score = 0;

    //Adding color to tetrominoes
    const colors = [
        'orange',
        'red',
        'magenta',
        'lawngreen',
        'blue',
        'yellow',
        'rebeccapurple'
    ];

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

    const jTetromino = [
        [0, 1, width + 1, width * 2 + 1],
        [2, width, width + 1, width + 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width + 2, width * 2]
    ];

    const sTetromino = [
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino, sTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';//removing the color from background
        })
    }

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

    let nextRandom = Math.floor(Math.random() * theTetrominoes.length); //use in the mini-grid display

    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom; //this var is also used in mini-grid display
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            addScore();
            draw();
            displayShape();
            gameOver();
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
        const isAtLeftEdge1 = current.some(index => (currentPosition + index) % width === 1);

        undraw()
        currentRotation++
        if (currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];

        //Fixing the rotation bug that occurs near the edge
        if (current === theTetrominoes[4][currentRotation]) {
            if (isAtRighttEdge && !isAtRighttEdge1) currentPosition -= 2;
            if (isAtRighttEdge1 && !isAtRighttEdge) currentPosition -= 1;
            if (isAtLeftEdge && !isAtLeftEdge1) currentPosition += 1;
        } else if (current !== theTetrominoes[3][currentRotation]) {
            if (isAtRighttEdge) currentPosition -= 1;
            if (isAtLeftEdge) currentPosition += 1;
        }
        draw();
        freeze();
    }

    //show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;


    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
        [0, 1, displayWidth + 1, displayWidth * 2 + 1], //jTetromino
        [1, displayWidth, displayWidth + 1, displayWidth * 2] // sTetromino
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';// removing color from background
        })

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }
    console.log(displaySquares)


    //add functionality to the start/pause button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            //Stop the game
            clearInterval(timerId);
            timerId = null;
        } else {
            //make the tetromino move down every second
            draw();
            timerId = setInterval(moveDown, 1000);
            //nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    })

    //add score:
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }


    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

});


