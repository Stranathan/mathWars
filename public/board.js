

function board()
{
  this.rows = 7;
  this.columns = 7;
  this.squareSize = 80;
  this.fontSize = 40;
  this.font = loadFont('AvenirNextLTPro-Demi.otf'); // global namespace still working
  this.grid; // a grid full of gridcells
  this.numberGrid; // a grid with their number representation
  this.selectedGrid;
  this.makeGrids()
}

// right now, since I'm overwriting the grid from the board made server side
// there is no reason to make number grid at construction
board.prototype.makeGrids = function()
{
  this.grid = make2DArray (this.rows, this.columns);
  this.numberGrid = make2DArray(this.rows, this.columns);
  this.selectedGrid = make2DArray(this.rows, this.columns);

  for (var i = 0; i< this.rows; i++)
  {
    for(var j = 0; j< this.columns; j++)
    {
      let number = getNumber();
      this.grid[i][j] = new gridCell(this.squareSize, i, j, number, this.font, this.fontSize);
      this.numberGrid[i][j] = this.grid[i][j].num;
      this.selectedGrid[i][j] = false;
    }
  }
}

board.prototype.setNumberGrid = function()
{
  for (var i = 0; i< this.rows; i++)
  {
    for(var j = 0; j< this.columns; j++)
    {
      this.numberGrid[i][j] = this.grid[i][j].num;
    }
  }
}

board.prototype.setSelectedGrid = function()
{
  for (var i = 0; i< this.rows; i++)
  {
    for(var j = 0; j< this.columns; j++)
    {
      if(this.grid[i][j].isSelected)
      {
        this.selectedGrid[i][j] = true;
      }
      else
      {
        this.selectedGrid[i][j] = false;
      }
    }
  }
}
