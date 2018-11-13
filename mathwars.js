// Constants
const DEFAULT_COLUMNS = 5;
const DEFAULT_ROWS = 5;
const DEFAULT_CELL_SIZE = 120;
const DEFAULT_FONT_SIZE = 40;
const Colors = { white: 1, black: -1, grey: 0 };
Object.freeze(Colors);

// Variables
var DEFAULT_FONT;
var grid;
// var font;

// mouse click handling stuff
// var thisClickI = 0;
// var thisClickJ = 0;
// var lastClickI = 0;
// var lastClickJ = 0;
// var clickCount = 0;

// Classes
class Click {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.clickCount = 0;
  }
}

class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Cell {
  constructor(x, y, value) {
    this.pos = new Pos(x, y);
    this.value = value;
    this.size = DEFAULT_CELL_SIZE;
  }

  draw() {
    var sign = Math.abs(this.value) / this.value;
    this.color = sign == Nan ? 0 : -1;
    drawX = this.pos.x * this.size;
    drawY = this.pos.y * this.size;
  }
}

class Grid {
  constructor(
    rows = DEFAULT_ROWS,
    columns = DEFAULT_COLUMNS,
    cellSize = DEFAULT_CELL_SIZE,
    font = DEFAULT_FONT,
    fontSize = DEFAULT_FONT_SIZE
  ) {
    this.rows = rows;
    this.columns = columns;
    this.cellSize = cellSize;
    this.font = font;
    this.fontSize = fontSize;
    this._grid = Array(this.rows)
      .fill()
      .map(() => Array(this.columns).fill());

    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j; this.columns, j++) {
        this._grid[i][j] = new Cell(i, j, getNumber());
      }
    }
  }
}

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  // init canvas
  createCanvas(squareSize * rows, squareSize * columns);

  // make an array to hold the cells, then make a cell at each j index
  grid = make2DArray(rows, columns);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      var number = getNumber();
      grid[i][j] = new gridCell(squareSize, i, j, number, font, fontSize);
    }
  }
}

function draw() {
  background(51);
  let lastDrawIndexI = 0;
  let lastDrawIndexJ = 0;

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].display();
      if (grid[i][j].isSelected == true) {
        lastDrawIndexI = i;
        lastDrawIndexJ = j;
      }
    }
  }
  grid[lastDrawIndexI][lastDrawIndexJ].display();
}

// p5 gloabl function... mouseX and mouseY can be used elsewhere globally too
function mousePressed() {
  console.log(clickCount);
  // swap to turn off for draw call
  if (clickCount == 1) {
    lastClickI = thisClickI;
    lastClickJ = thisClickJ;
    grid[lastClickI][lastClickJ].isSelected = false;
  }

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].selection(mouseX, mouseY)) {
        console.log("the I index is: " + i + " and the J index is: " + j);
        thisClickI = i;
        thisClickJ = j;
        if (clickCount == 0) {
          grid[thisClickI][thisClickJ].isSelected = true;
        }
        // do arithmetic
        if (clickCount == 1) {
          // I think the bounds of the array can be ignored if i just check each
          // of the four cases
          if (
            (thisClickI + 1 == lastClickI && thisClickJ == lastClickJ) ||
            (thisClickI == lastClickI && thisClickJ + 1 == lastClickJ) ||
            (thisClickI == lastClickI && thisClickJ - 1 == lastClickJ) ||
            (thisClickI - 1 == lastClickI && thisClickJ == lastClickJ)
          ) {
            grid[thisClickI][thisClickJ].arithmetic(
              grid[lastClickI][lastClickJ]
            );
          }
        }
      }
    }
  }

  clickCount += 1;
  // reset click count every two clicks
  if (clickCount == 2) {
    clickCount = 0;
  }
}

// gloabl p5 function
function mouseMoved() {
  return false;
}
/**
  some functions for convenience and setup
*/
// function make2DArray(rows, columns) {
//   // of size rows
//   var arr = new Array(rows);

//   for (var i = 0; i < arr.length; i++) {
//     // of size columns
//     arr[i] = new Array(columns);
//   }
//   return arr;
// }

// makes a random number on our math range, randomly assigns it -tive, +tive
function getNumber() {
  // Math.floor(random(min, max)) + min
  var num = Math.floor(random(0, 11));
  return random() > 0.5 ? num * -1 : num;
}
