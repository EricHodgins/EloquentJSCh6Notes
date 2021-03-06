
function repeat(string, times) {
  var result = "";
  for (var i = 0; i < times; i++)
    result += string;
  return result;
}

function TextCell(text) {
  this.text = text.split("\n");
}
TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};
TextCell.prototype.minHeight = function() {
  return this.text.length;
};
TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};


function rowHeights(rows) {
  return rows.map(function(row) {      
    return row.reduce(function(max, cell) {
      var m = Math.max(max, cell.minHeight());
      return m;
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}


function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  function drawLine(blocks, lineNo) {
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
  }

  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {      
      return cell.draw(widths[colNum], heights[rowNum]);
    });
    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
  }

  return rows.map(drawRow).join("\n");
}


var rows = [];
for (var i = 0; i < 5; i++) {
   var row = [];
   for (var j = 0; j < 5; j++) {
     if ((j + i) % 2 == 0)
       row.push(new TextCell("##"));
     else
       row.push(new TextCell("  "));
   }
   rows.push(row);
}
 

// console.log(drawTable(rows));


// Lets piece this together

// 1 Make an array of arrays (holding Textcell objects) like this [[Textcell,Textcell,Textcell,Textcell,Textcell]....5 times].  Each Textcell holds a 
// an array of either "   " or "##". You can get this when you cal the Textcell.text property.  For example:
// var t = new Textcell("##"); ----> t.text will output ['##'].  This essentially is a bunch of TextCell objects.

var rows2 = [];
for (var i = 0; i < 5; i++) {
    var tmp = [];
  for (var j = 0; j < 5; j++) {
     if ((i + j) % 2 === 0) {
        tmp.push(new TextCell("##"));
     } else {
        tmp.push(new TextCell("--"));
     }
   }

  rows2.push(tmp); 
}


//console.log(rows2); // take a look

// 2 Now we go to drawTable.  Let's understand the rowHeights and colWidths functions.  Should be fun.
// First rowHeights and helper method minHeight.

function TextCell(text) {
  this.text = text.split("\n"); // split puts the text into an array here. "hello" becomes ["hello"] for exmaple.
}

TextCell.prototype.minHeight = function() {
  return this.text.length;
};

function rowHeights(rows) {
  return rows.map(function(row) {  
    return row.reduce(function(max, cell) {    
      var m = Math.max(max, cell.minHeight());
      return m;
    }, 0);
  });
}

//console.log(rowHeights(rows2));

// First goes to map.  map will iterate overall the elements in the rows array.  So a row is an array of TextCell's.  Then on Each
// TextCell array reduce is used on it.  Reduce will 'reduce' the array to one value.  This is where minHeight is useful.
// It returns the length of that particular TextCell value. in this case it's alway one.  Because the text property only holds 1 element.
// so rowHeights returns an array with a min height for each row.  in this case it's [1,1,1,1,1]

// Now colWidths

TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}


// Loops through all the values in the first element.  that's why rows[0] is there. 
//console.log(colWidths(rows)); // this prints out [2,2,2,2,2]


// now lets look at drawTable

function repeat(string, times) {
  var result = "";
  for (var i = 0; i < times; i++)
    result += string;
  return result;
}

TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};


// Remember rows = [[Textcell,Textcell,Textcell,Textcell,Textcell]....5 times].


function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  function drawLine(blocks, lineNo) {
    console.log(blocks);
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
  }

  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {  
      return cell.draw(widths[colNum], heights[rowNum]);
    });
    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
  }

  return rows.map(drawRow).join("\n");
}


// heights = [1,1,1,1,1]
// widths =  [2,2,2,2,2]
// blocks = [["##"], ["  "], ["##"]...] for each row.

//console.log(drawTable(rows2));


// Now let's move on to more crazy data... MOUNTAIN data
function UnderlinedCell(inner) {
  this.inner = inner;
};
UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
};
UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
};
UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1)
    .concat([repeat("-", width)]);
};

function dataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      return new TextCell(String(row[name]));
    });
  });

  return [headers].concat(body);
}

//console.log(dataTable(MOUNTAINS));
console.log(drawTable(dataTable(MOUNTAINS)));

// headers in put into an array [headers] because you need an array to access reduce.
// So now you have UnderlinedCell concat with TextCells.  Now you can use minWidth and minHeight. So each UnderlineCell contains inner.  Which holds a TextCell.
// Each TextCell for Underline holds the Header value. So.."name", "height" ...
// NOw for rowHeights & colWidths you can call the min functions which go to the UnderlineCell class.  But by callling this.inner.minWidth() for example actually
// runs the TextCell minWidth method.  Because inner itself is a TextCell.  It returns that and then back to Undderline it adds 1.

// Essentially end up with this ["name height country", "--- --- -----"].join("\n") for drawrow.



























































