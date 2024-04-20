class Cell {
    constructor() {
        this._value = '-';
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = newValue;
    }
}

class GameBoard {
    constructor() {
        this.rows = 3;
        this.columns = 3;
        this.board = this.createBoard();
    }

    createBoard() {
        const board = [];
        for (let i = 0; i < this.rows; i++) {
            board[i] = [];
            for (let j = 0; j < this.columns; j++) {
                board[i].push(new Cell());
            }
        }
        return board;
    }

    getBoard() {
        return this.board;
    }

    playTurn(player, row, column) {
        if (this.board[row][column].value === '-') {
            this.board[row][column].value = player;
            return true;
        } else {
            return false;
        }
    }

    printBoard() {
        const curState = this.board.map(row => row.map(cell => cell.value));
        console.log(curState);
    }
}

class GameController {
    constructor(playerOneName = "Player One", playerTwoName = "Player Two") {
        this.board = new GameBoard();
        this.players = [
            { name: playerOneName, token: 'x' },
            { name: playerTwoName, token: 'o' }
        ];
        this.activePlayer = this.players[0];
        this.printNewRound();
    }

    switchPlayerTurn() {
        this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    getActivePlayer() {
        return this.activePlayer;
    }

    printNewRound() {
        this.board.printBoard();
        console.log(`${this.getActivePlayer().name}'s turn`);
    }

    checkBoard() {
        for (let i = 0; i < 3; i++) {
            let rowMatches = 0;
            for (let j = 0; j < 3; j++) {
                if (this.board.getBoard()[i][j].value === this.board.getBoard()[i][0].value && this.board.getBoard()[i][j].value !== '-') {
                    rowMatches++;
                }
            }
            if (rowMatches === 3) {
                return true;
            }
        }

        for (let i = 0; i < 3; i++) {
            let colMatches = 0;
            for (let j = 0; j < 3; j++) {
                if (this.board.getBoard()[j][i].value === this.board.getBoard()[0][i].value && this.board.getBoard()[j][i].value !== '-') {
                    colMatches++;
                }
            }
            if (colMatches === 3) {
                return true;
            }
        }

        // Check diagonals
        if ((this.board.getBoard()[0][0].value !== '-' &&
            this.board.getBoard()[0][0].value === this.board.getBoard()[1][1].value && this.board.getBoard()[1][1].value === this.board.getBoard()[2][2].value) ||
            (this.board.getBoard()[0][2].value !== '-' &&
                this.board.getBoard()[0][2].value === this.board.getBoard()[1][1].value && this.board.getBoard()[1][1].value === this.board.getBoard()[2][0].value)) {
            return true;
        }

        // Check for tie

        let emptyCells = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board.getBoard()[i][j].value === '-') {
                    emptyCells++;
                }
            }
        }
        if (emptyCells === 0) {
            return 'tie';
        }
        return false;
    }

    playRound(row, column) {
        console.log(`Player ${this.getActivePlayer().name} row: ${row}, column: ${column}`);
        if (this.board.playTurn(this.getActivePlayer().token, row, column)) {
            const checker = this.checkBoard();
            if (checker === true) {
                console.log(`${this.getActivePlayer().name} won the game`);
            } else if (checker === 'tie') {
                console.log(`It's a tie`);
            } else {
                this.switchPlayerTurn();
                this.printNewRound();
            }
        } else {
            console.log("Retry!");
            this.printNewRound();
        }
    }
}

const game = new GameController();

function initializeBoard() {
    const boardContainer = document.querySelector('.board');
    const board = game.board.getBoard();

    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.firstChild);
    }

    for (let i = 0; i < board.length; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let j = 0; j < board[i].length; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.setAttribute('data-row', i);
            cellDiv.setAttribute('data-column', j);
            cellDiv.textContent = board[i][j].value;
            rowDiv.appendChild(cellDiv);
        }

        boardContainer.appendChild(rowDiv);
    }
}

initializeBoard();

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', cellClickHandler); // Add event listener for cell clicks
});

function cellClickHandler() {
    const row = parseInt(this.getAttribute('data-row'));
    const column = parseInt(this.getAttribute('data-column'));
    game.playRound(row, column);
    updateInterface();
}

const disableCellClick = () => {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', cellClickHandler);
    });
};

function updateInterface() {
    const board = game.board.getBoard();
    const resultDisplay = document.querySelector('.turn');

    document.querySelectorAll('.cell').forEach((cell, index) => {
        const row = Math.floor(index / board.length);
        const column = index % board[row].length;
        cell.textContent = board[row][column].value;
    });

    const checker = game.checkBoard();
    if (checker === true) {
        resultDisplay.textContent = `${game.getActivePlayer().name} won the game`;
        disableCellClick();
    } else if (checker === 'tie') {
        resultDisplay.textContent = `It's a tie`;
        disableCellClick();
    } else {
        resultDisplay.textContent = `${game.getActivePlayer().name}'s turn`;
    }
}

document.querySelector('.restart-btn').addEventListener('click', () => {
    gameRestart();
});

function gameRestart() {
    const board = game.board.getBoard(); 
    document.querySelectorAll('.cell').forEach((cell, index) => {
        const row = Math.floor(index / board.length);
        const column = index % board[row].length;
        cell.textContent = '-';
        board[row][column].value = '-';
    });
}
