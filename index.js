$(document).ready(function () {
  var gameOver = false;
  var turnX = true;
  var playerToken;
  var computerToken;
  var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  var winners = [
    ["00", "01", "02"],
    ["10", "11", "12"],
    ["20", "21", "22"],
    ["00", "10", "20"],
    ["01", "11", "21"],
    ["02", "12", "22"],
    ["00", "11", "22"],
    ["02", "11", "20"],
  ];

  $(".boardContainer").hide();

  $(".playerX").click(function () {
    playerToken = "X";
    computerToken = "O";
    reset();
    $(".playerContainer span").hide();
    $(".boardContainer").show();
  });

  $(".playerO").click(function () {
    playerToken = "O";
    computerToken = "X";
    reset();
    $(".playerContainer span").hide;
    $(".boardContainer").show();
    var computerMove = minimax(board, 0, computerToken);
    updateBoard(computerMove[0], computerMove[1], computerToken);
  });

  function reset() {
    gameOver = false;
    board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    $(".boardContainer div")
      .text("")
      .css("color", "black")
      .css("cursor", "pointer");
    $(".winner").text("");
    $(".playerContainer span").hide();
  }

  $(".boardContainer div").click(function () {
    if (gameOver == false) {
      var r = parseInt(this.className[4]);
      var c = parseInt(this.className[5]);
      if (board[r][c] == null) {
        updateBoard(r, c, playerToken);
        if (gameOver == false) {
          var computerMove = minimax(board, 0, "O");
          updateBoard(computerMove[0], computerMove[1], computerToken);
        }
      }
    }
  });

  function updateBoard(r, c, token) {
    $(".cell" + r + c).text(token);
    board[r][c] = token;

    var highlightWinner = true;
    var winner = isGameOver(board, highlightWinner);
    if (winner) {
      gameOver = true;
      if (winner == "X") {
        $(".winner").text("X wins!");
      } else if (winner == "O") {
        $(".winner").text("O wins!");
      } else {
        $(".winner").text("Draw!");
      }
      $(".playerContainer span").show();
    }
  }

  function minimax(tempBoard, depth, token) {
    var low = Number.POSITIVE_INFINITY;
    var high = Number.NEGATIVE_INFINITY;
    var bestMove = [null, null];

    var winner = isGameOver(tempBoard);
    if (winner == false) {
      //game on
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (tempBoard[i][j] == null) {
            var cloneBoard = [];
            for (let k = 0; k < 3; k++) {
              cloneBoard[k] = tempBoard[k].slice();
            }
            cloneBoard[i][j] = token;
            //console.log(cloneBoard);

            var oppToken;
            if (token == "X") {
              oppToken = "O";
            } else {
              oppToken = "X";
            }
            var value = minimax(cloneBoard, depth + 1, oppToken);
            cloneBoard = null;

            if (token == playerToken) {
              if (value < low) {
                low = value;
                bestMove = [i, j];
              }
            } else {
              if (value > high) {
                high = value;
                bestMove = [i, j];
              }
            }
          }
        }
      }

      if (depth == 0) {
        return bestMove;
      } else {
        if (token == playerToken) {
          return low;
        } else {
          return high;
        }
      }
    } else if (winner == playerToken) {
      //player wins
      return depth - 10;
    } else if (winner == computerToken) {
      //computer wins
      return 10 - depth;
    } else {
      //draw
      return 0;
    }
  }

  function isGameOver(tempBoard, highlightWinner) {
    //check if X or O won
    var winX = true;
    var winO = true;
    for (let i = 0; i < 8; i++) {
      winX = true;
      winO = true;
      for (let j = 0; j < 3; j++) {
        var r = parseInt(winners[i][j][0]);
        var c = parseInt(winners[i][j][1]);
        if (tempBoard[r][c] != "X") {
          winX = false;
        }
        if (tempBoard[r][c] != "O") {
          winO = false;
        }
        if (winX == false && winO == false) {
          break;
        }
      }
      if (winX) {
        if (highlightWinner) {
          highlight(winners[i]);
        }
        return "X";
      } else if (winO) {
        if (highlightWinner) {
          highlight(winners[i]);
        }
        return "O";
      }
    }

    //check for draw
    var draw = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tempBoard[i][j] == null) {
          draw = false;
          break;
        }
      }
    }
    if (draw) {
      if (highlightWinner) {
        highlight(null);
      }
      return "D";
    }

    return false;
  }

  function highlight(cells) {
    $(".boardContainer div").css("color", "#999").css("cursor", "default");
    if (cells) {
      for (let i = 0; i < 3; i++) {
        $(".cell" + cells[i]).css("color", "darkred");
      }
    }
  }
});
