
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

  const playRound = (index) => {
    console.log(`Dropping ${getActivePlayer().name}'s token into position ${index}....`);
    Gameboard.putMarker(index, getActivePlayer().symbole);

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

  return {getActivePlayer, playRound, printPlayers};
};



//Display the UI without modifying the Gameboard()
const displayController = (function () {

});

const game = GameController("Bob", "Alice");
game.printPlayers();
game.playRound(4);
game.playRound(5);
game.playRound(8);

Gameboard.printBoard();