const startButton = document.getElementById("start");

startButton.onclick = () => {
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;

let drawBorder = function () {
    ctx.fillStyle = 'orange';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

let drawScore = function () {
    ctx.font = '20px Comic Sans';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Fruits: ' + score, blockSize, blockSize)
};

let gameOver = function () {
    clearInterval(intervalId);
    ctx.font = '50px Courier';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game over', width / 2, height / 2);
};

let circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }

    drawSquare(color) {
        let x = this.col * blockSize;
        let y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    drawCircle(color) {
        let centerX = this.col * blockSize + blockSize / 2;
        let centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = color;
        circle(centerX, centerY, blockSize / 2, true);
    }
    equal(otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    }
}

class Snake {
    constructor() {
        this.segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ];

        this.direction = 'right';
        this.nextDirection = 'right';
    }
}

    Snake.prototype.draw = function () {
    for (let i = 0; i<this.segments.length; i++) {
    this.segments[i].drawSquare('Blue');
}
}

    Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;
    if (this.direction === 'right') {
    newHead = new Block(head.col + 1, head.row);
} else if (this.direction === 'down') {
    newHead = new Block(head.col, head.row + 1);
} else if (this.direction === 'left') {
    newHead = new Block(head.col - 1, head.row);
} else if (this.direction === 'up') {
    newHead = new Block(head.col, head.row - 1)
}
    if (this.checkCollision(newHead)) {
    gameOver();
    return;
}
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
    score++;
    apple.move();
} else {
    this.segments.pop();
}
}

    Snake.prototype.checkCollision = function(head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;

    for (let i = 0; i<this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
    selfCollision = true;
}
}

    return wallCollision || selfCollision;
}

    Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
    return;
} else if (this.direction === 'right' && newDirection === 'left') {
    return;
} else if (this.direction === 'down' && newDirection === 'up') {
    return;
} else if (this.direction === 'left' && newDirection === 'right') {
    return;
}

    this.nextDirection = newDirection;
}

class Apple {
    constructor() {
        this.position = new Block(10, 10);
    }
    draw() {
        this.position.drawCircle('LimeGreen');
    }
    move() {
        let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
        this.position = new Block(randomCol, randomRow);
    }
}

let snake = new Snake();
let apple = new Apple();

let intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100)

let directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

window.addEventListener('keydown', directKey);

function directKey(event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
}
}
