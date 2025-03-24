
// State of the Game Tic Tac Toe
// Gameboard IIFE Function - Unique and non reusable
const Gameboard = (function () {

  let board = ["" , "", "",
               "" , "", "",
               "" , "", ""]

  const getBoard = () => board; 


  const putMarker = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
    } else {
      console.log('This case is already taken');
    }
  };


  const resetBoard = () => {
    board = ["" , "", "",
             "" , "", "",
             "" , "", ""]
  }


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


const GameController = (player1Name = "Player One", player2Name = "Player Two") => {

//CLASS PLAYER
  class Player {
    #score = 0;

    constructor(name, symbol) {
      this.name = name; 
      this.symbol = symbol; 
    }

    getScore() {
      return this.#score;
    }

    addPoint() {
      this.#score++;
    }

    resetScore() {
      this.#score = 0;
    }

    changePlayerName(newName){
      this.name = newName;
    }

  }

  const player1 = new Player(player1Name, "X");
  const player2 = new Player(player2Name,"O");


  const players = [player1, player2];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

 
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };


  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  function resetScores() {
    player1.resetScore();
    player2.resetScore();
  }

  const changePlayerName = (index, newName) => {
    if (index === 0 || index === 1) {
      players[index].changePlayerName(newName);
    }
  };

  const checkVictory = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lines
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             //Diagonal
    ];
  
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (Gameboard.getBoard()[a] !== "" && 
          Gameboard.getBoard()[a] === Gameboard.getBoard()[b] && 
          Gameboard.getBoard()[b] === Gameboard.getBoard()[c]) {
        return true;
      }
    }
    return false;
  };


  const checkDraw = () => {
    let count = 0;
    for (let i = 0; i<9; i++){
      if (Gameboard.getBoard()[i] !== ""){
        count = count + 1;
      }
      if (count === 9){ 
        return true;}
    }
    return false; 
  }

  const highlightVictory = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lines
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             //Diagonal
    ];
  
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (Gameboard.getBoard()[a] !== "" && Gameboard.getBoard()[a] === Gameboard.getBoard()[b] && Gameboard.getBoard()[b] === Gameboard.getBoard()[c]) {
        return combination;
      }
    }
    return false;
  };


  const playRound = (index) => {
    console.log(`Dropping ${getActivePlayer().name}'s token into position ${index}....`); //CONSOLE
    Gameboard.putMarker(index, getActivePlayer().symbol);
    Gameboard.printBoard(); // CONSOLE
    if(checkVictory()) {
      return;
    };
    if(checkDraw()) {
      return;
    }
    switchPlayerTurn();
    printNewRound();
  }

  printNewRound();

  //Display for the console 
  const printPlayers = () => {
    console.log(`${player1.name} plays with ${player1.symbol}`);
    console.log(`${player2.name} plays with ${player2.symbol}`);
    console.log(`The active player is ${getActivePlayer().name}`);
  };

  return {resetScores, changePlayerName, checkVictory, checkDraw, highlightVictory, getActivePlayer, playRound, players, printPlayers};
};




const displayController = (function () {
    const game = GameController();
    const status = document.querySelector(".status");
    const boardContainer = document.getElementById("gameBoard")
    const resetButton = document.getElementById("resetButton");
    const player1Display = document.querySelector(".player1");
    const player2Display = document.querySelector(".player2");

    const editIcon1 = document.querySelector(".p1");
    const editIcon2 = document.querySelector(".p2");

    const confirmButton1 = document.querySelector(".confirm-icon-p1");
    const confirmButton2 = document.querySelector(".confirm-icon-p2");



    function enableEdit(playerDiv, playerIndex, confirmButton, editIcon) {
      let oldName = playerDiv.textContent;

      const input = document.createElement('input');
      input.type = "text";
      input.value = oldName;
      input.classList.add("edit-input");

      playerDiv.innerHTML = "";
      playerDiv.appendChild(input);
      
      input.focus();

      editIcon.classList.add("hidden");
      confirmButton.classList.remove("hidden");

      confirmButton.addEventListener("click", () => {
        let newName = oldName;
        if (input.value !== ""){
          newName = input.value.trim();
        }
        game.changePlayerName(playerIndex, newName);

        playerDiv.textContent = newName;

        confirmButton.classList.add("hidden");
        editIcon.classList.remove("hidden");
        
        updateUI();
        
      }); 
    }

    editIcon1.addEventListener("click", () => {
      enableEdit(player1Display, 0, confirmButton1, editIcon1);
    });
  
    editIcon2.addEventListener("click", () => {
      enableEdit(player2Display, 1, confirmButton2, editIcon2);
    });
  
    function updateUI() {

      player1Display.textContent = game.players[0].name;
      player2Display.textContent = game.players[1].name;
      status.textContent = `Turn : ${game.getActivePlayer().name}`;
      
    }


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
      player1Display.textContent = game.players[0].name;
      player2Display.textContent = game.players[1].name;
    }


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
        cell.classList.remove("victory");
      });

      function updateScoreUI() {
        document.getElementById("score1").textContent = game.players[0].getScore(); //FUNCTION CLASS (Get Score)
        document.getElementById("score2").textContent = game.players[1].getScore(); //FUNCTION CLASS (Get Score)
      }

      if (game.checkVictory()) {
        game.getActivePlayer().addPoint(); //FUNCTION CLASS (Add point)
        updateScoreUI();
        console.log(`${game.getActivePlayer().name} wins !`);
        status.textContent = `${game.getActivePlayer().name} wins ! 🎉`;
        cells.forEach((cell, index) => {
          if (index === game.highlightVictory()[0] || index === game.highlightVictory()[1] || index === game.highlightVictory()[2]) {
          cell.classList.toggle("victory", Gameboard.getBoard()[index] !== "");
          }
        });
        
        Gameboard.resetBoard();

        return;
      }

    if (game.checkDraw()) {
      console.log(`It's a draw !`);
      status.textContent = `It's a draw !`;
      Gameboard.resetBoard();
      return;
    }

    status.textContent = `Turn : ${game.getActivePlayer().name}`;
  }

    // Reset the game
    resetButton.addEventListener("click", () => {
      game.resetScores(); //FUNCTION CLASS (Reset Scores)
      game.players[0].changePlayerName("Player One"); // Reset Names in Game Controller
      game.players[1].changePlayerName("Player Two");// Reset Names in Game Controller
      player1Display.textContent = game.players[0].name; // Update in the DOM
      player2Display.textContent = game.players[1].name; // Update in the DOM
      document.getElementById("score1").textContent = 0;
      document.getElementById("score2").textContent = 0;
      Gameboard.resetBoard();
      
      updateDisplay();
    });

    createBoard(); // Create the grid

    return { updateDisplay };

});

displayController().updateDisplay();