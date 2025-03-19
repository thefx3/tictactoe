
// State of the Game Tic Tac Toe
// Gameboard IIFE Function - Unique and non reusable
const Gameboard = (function () {

  //To count INDEX from 0 to 9
  let board = ["" , "", "",
               "" , "", "",
               "" , "", ""]

  //This board will be modified with the GameController with the other functions
  //inside of Gameboard();

  //FUNCTION 1 - Access to the board from another function
  const getBoard = () => board; 


  //FUNCTION 2
  const putMarker = (index, symbole) => {
    //Check the avaibility of the space in the grid
    //And where the maker can be put
    //And which player put the marker

    //If cell is empty, 
    if (board[index] === "") {
      board[index] = symbole;
    } else {
      console.log('This case is already taken');
    }
  };

  //FUNCTION 3 - Reset the entire board
  const resetBoard = () => {
    board = ["" , "", "",
             "" , "", "",
             "" , "", ""]
  }

  //FUNCTION 4 - to display in the console - no use after the displayController
  const printBoard = () => {
    for (let i = 0; i<7; i++){
      console.log(board[i] + " | " + board[i+1] + " | "+ board[i+2] + " | ");
      i = 3;
      console.log(board[i] + " | " + board[i+1] + " | "+ board[i+2] + " | ");
      i = 6;
      console.log(board[i] + " | " + board[i+1] + " | "+ board[i+2] + " | ");
      }
    }


  return {getBoard, putMarker, resetBoard, printBoard};

})();

//Logic of the Game : turns, victory
// FACTORY FUNCTION - Possibility to create multiple players
const GameController = (player1Name = "Player One", player2Name = "Player Two") => {

  const createPlayer = (name, symbole) => {
    return {name, symbole};
  };

  const player1 = createPlayer(player1Name,"X");
  const player2 = createPlayer(player2Name,"O");

  const players = [player1, player2];

  //Who is the active Player of the round
  let activePlayer = players[0]; //By default, it's Player1

  //Then switch turn
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    //If activePlayer = activePlayer (is that equal to players[O]?)
    //If yes (activePlayer = players[0]), activePlayer is equal to Players[1]
    //If no (activePlayer = players[1]), activePlayer is equal to Players[0]
  };

  //Get the ActivePlayer from the outside of the function
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkVictory = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lines
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             //Diagonal
    ];
  
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (Gameboard.getBoard()[a] !== "" && Gameboard.getBoard()[a] === Gameboard.getBoard()[b] && Gameboard.getBoard()[b] === Gameboard.getBoard()[c]) {
        // console.log(`${getActivePlayer().name} wins !`);
        return true; // Return if win
      }
    }
  
    return false; // No victory
  };

  const playRound = (index) => {
    console.log(`Dropping ${getActivePlayer().name}'s token into position ${index}....`); //CONSOLE
    Gameboard.putMarker(index, getActivePlayer().symbole);
    Gameboard.printBoard(); // CONSOLE
    if(checkVictory(Gameboard.getBoard())) {
      return;
    };
    switchPlayerTurn();
    printNewRound();
  }

  printNewRound();

  //Display for the console 
  const printPlayers = () => {
    console.log(`${player1.name} plays with ${player1.symbole}`);
    console.log(`${player2.name} plays with ${player2.symbole}`);
    console.log(`The active player is ${getActivePlayer().name}`);
  };

  return {checkVictory, getActivePlayer, playRound, printPlayers};
};



//Display the UI without modifying the Gameboard()
const displayController = (function () {
    const game = GameController();
    const status = document.querySelector(".status");
    const boardContainer = document.getElementById("gameBoard")
    const resetButton = document.getElementById("resetButton");

    //Create function in the DOM
    function createBoard() {
      boardContainer.innerHTML = "";

      Gameboard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index; //Store the index in each cell for click event
        
        cellDiv.textContent = cell; 

        cellDiv.dataset.sym = cell; //Store the symbol of each cell for CSS

        cellDiv.addEventListener("click",putMarkerClick);

        boardContainer.appendChild(cellDiv);
      });
    }


    //Event on click to put Marker
    function putMarkerClick(event) {
      const index = event.target.dataset.index; //Retrieve the dataset-index the cell

      if (Gameboard.getBoard()[index] !=="") return;

      game.playRound(index);
      updateDisplay();
    }

    function updateDisplay() {
      const cells = document.querySelectorAll(".cell");

      cells.forEach((cell, index) => {
        cell.textContent = Gameboard.getBoard()[index];
        cell.dataset.sym = cell.textContent;
        cell.classList.toggle("taken", Gameboard.getBoard()[index] !== "");
      });

    if (game.checkVictory()) {
      console.log(`${game.getActivePlayer().name} wins !`);
      status.textContent = `${game.getActivePlayer().name} a gagné ! 🎉`;
      Gameboard.resetBoard();

      //Display and highlight the grid position's winner
      //Reset the Game
      //Update the Score
      return;
    }

    status.textContent = `Tour de : ${game.getActivePlayer().name}`;
  }

    // Reset the game
    resetButton.addEventListener("click", () => {
      Gameboard.resetBoard();
      updateDisplay();
    });

    createBoard(); // Create the grid


    return { updateDisplay };

});

displayController().updateDisplay();