function Cell() {
    let value = '-';

    const markCell = (player) => value = player;
    const getValue = () => value;
    return {
        markCell,
        getValue
    };
}

function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i ++) {
        board[i] = [];
        for(let j = 0; j < columns; j ++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const playTurn = (player, row, column) => {
        if(board[row][column].getValue() === '-') {
            board[row][column].markCell(player);
            return true;
        }
        else {
            return false;
        }
    };

    const printBoard = () => {
        const curState = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(curState);
    }

    return { getBoard, playTurn, printBoard };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            token: 'x'
        },
        {
            name: playerTwoName,
            token: 'o'
        }
    ];
     
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkBoard = () => {
        let emptyCells = 0;

        // Check rows
        for(let i = 0; i < 3; i ++) {
            let rowMatches = 0;
            for(let j = 0; j < 3; j ++) {
                // Corrected: Added parentheses to call getValue() function
                if(board.getBoard()[i][j].getValue() === '-') {
                    emptyCells ++;
                }
                else if(board.getBoard()[i][j].getValue() === board.getBoard()[i][0].getValue()) {
                    rowMatches ++;
                }
            }
            if(rowMatches === 3) {
                return true;
            }
        }

        // Check columns
        for(let i = 0; i < 3; i ++) {
            let colMatches = 0;
            for(let j = 0; j < 3; j ++) {
                // Corrected: Added parentheses to call getValue() function
                if(board.getBoard()[j][i].getValue() === board.getBoard()[0][i].getValue() && board.getBoard()[i][j].getValue() != '-') {
                    colMatches ++;
                }
            }
            if(colMatches === 3) {
                return true;
            }
        }


        // Check diagonals
        if((board.getBoard()[0][0].getValue() != '-' &&
            board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() && board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue()) ||
            (board.getBoard()[0][2].getValue() != '-') && 
            board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() && board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue()) 
            {
            return true;
            }
        
       

        // Check for tie
        if (emptyCells === 0) {
            return 'tie';
        }

        return false;
    };
        
    
    const playRound = (row, column) => {
        console.log(`Player ${getActivePlayer().name} row: ${row}, column: ${column}`);
        board.playTurn(getActivePlayer().token, row, column);
      
            const checker = checkBoard();
            if(checker === true) {
                console.log(`${getActivePlayer().name} won the game`);
            }
            else if(checker === 'tie') {
                console.log(`It's a tie`);
            }
            else {
                switchPlayerTurn();
                printNewRound();
            }
      
        
    };

    printNewRound();
    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();
