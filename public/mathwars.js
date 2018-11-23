
var socket;
//
var myTurn = false;
//
var board;
// mouse click handling stuff
var thisClickI = 0;
var thisClickJ = 0;
var lastClickI = 0;
var lastClickJ = 0;
var clickCount = 0;

function setup()
{
  board = new board();
  createCanvas(board.squareSize*board.rows, board.squareSize*board.columns);

  socket = io.connect('http://ian.local:3000/');
  socket.on("initTurn", getInitTurn)
  socket.on('initMessage', getGrid);
  socket.on('turn', newDraw);
  socket.on('otherTurn', otherTurnSelection);
}
// works, first player to join gets true
function getInitTurn (initTurnData)
{
  myTurn = initTurnData.t;
}

function getGrid(initData)
{
  for (var i = 0; i< board.rows; i++)
  {
    for(var j = 0; j< board.columns; j++)
    {
      // set global board to
      board.grid[i][j].num = initData.g[i][j];
      board.grid[i][j].numString = board.grid[i][j].num.toString();
    }
  }
  // set the number array (the data structure we use with server) to be
  // the same as the change board grid of cells.
  board.setNumberGrid();
}

function newDraw(data)
{
  myTurn = data.x

  for (var i = 0; i< board.rows; i++)
  {
    for(var j = 0; j< board.columns; j++)
    {
      // set global board to
      board.grid[i][j].isSelected = false;
      board.grid[i][j].num = data.y[i][j];
      board.grid[i][j].numString = board.grid[i][j].num.toString();
    }
  }
  // set the number array (the data structure we use with server) to be
  // the same as the grid
  board.setNumberGrid();
}

// correct this selection grid to be that of the other client
function otherTurnSelection(otherTurnData)
{
  for (var i = 0; i< board.rows; i++)
  {
    for(var j = 0; j< board.columns; j++)
    {
      // set global board to
      board.grid[i][j].isSelected = otherTurnData.z[i][j];
    }
  }
}

// this only draws different stoke if isSelected is true
function draw()
{
  background(51);
  if(myTurn == true)
  {
    let lastDrawIndexI = 0;
    let lastDrawIndexJ = 0;

    for (var i = 0; i< board.rows; i++)
    {
      for(var j = 0; j< board.columns; j++)
      {
        board.grid[i][j].display();
        if(board.grid[i][j].isSelected == true)
        {
          lastDrawIndexI = i;
          lastDrawIndexJ = j;
        }
      }
    }
    board.grid[lastDrawIndexI][lastDrawIndexJ].display();
  }
  if(myTurn == false)
  {
    let lastOtherDrawIndexI = 0;
    let lastOtherDrawIndexJ = 0;

    for (var i = 0; i< board.rows; i++)
    {
      for(var j = 0; j< board.columns; j++)
      {
        board.grid[i][j].displayOtherSelection();
        if(board.grid[i][j].isSelected == true)
        {
          lastOtherDrawIndexI = i;
          lastOtherDrawIndexJ = j;
        }
      }
    }
    board.grid[lastOtherDrawIndexI][lastOtherDrawIndexJ].displayOtherSelection();
  }
}

function mousePressed()
{
  if (! myTurn) {
    return
  }
  // swap to turn off for draw call
  if(clickCount == 1)
  {
    lastClickI = thisClickI;
    lastClickJ = thisClickJ;
    board.grid[lastClickI][lastClickJ].isSelected = false;
  }

  var i = Math.floor(mouseX / board.squareSize);
  var j = Math.floor(mouseY / board.squareSize);

  if (! (i <= board.rows && i >= 0 && j <= board.columns && j >= 0)){
    return
  }

  thisClickI = i;
  thisClickJ = j;

  if(clickCount == 0)
  {
    // can't select 0
    console.log(board.grid[i][j])
    if(board.grid[i][j].num != 0)
    {
      console.log("dsajfklsa");
      clickCount += 1
      board.grid[thisClickI][thisClickJ].isSelected = true;
      board.setSelectedGrid();
      var otherTurnData = {z: board.selectedGrid};
      socket.emit('otherTurn', otherTurnData);
    }
  }
  // do arithmetic
  else if (clickCount == 1)
  {
    // I think the bounds of the array can be ignored if i just check each
    // of the four cases
    if((thisClickI + 1 == lastClickI && thisClickJ == lastClickJ) ||
       (thisClickI == lastClickI && thisClickJ + 1 == lastClickJ) ||
       (thisClickI == lastClickI && thisClickJ - 1 == lastClickJ) ||
       (thisClickI - 1 == lastClickI && thisClickJ == lastClickJ))
    {
      board.grid[thisClickI][thisClickJ].arithmetic(board.grid[lastClickI][lastClickJ]);
      // this can only be reached if a turn has been made
      myTurn = false;
    }
    clickCount += 1
  }

  // reset click count every two clicks
  if(clickCount == 2)
  {
    clickCount = 0;
  }

  // the values of the gridcells were changed, this updates the display
  board.setNumberGrid();

  if(myTurn == false)
  {
    var data = {x: true, y: board.numberGrid};
    socket.emit('turn', data);
  }
}
