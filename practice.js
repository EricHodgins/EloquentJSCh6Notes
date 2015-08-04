
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
 
console.log(rows);
// console.log(drawTable(rows));


// Lets piece this together

// 1 Make an array of arrays (holding Textcell objects) like this [[Textcell,Textcell,Textcell,Textcell,Textcell]....5 times].  Each Textcell holds a 
// an array of either "   " or "##". You can get this when you cal the Textcell.text property.  For example:
// var t = new Textcell("##"); ----> t.text will output ['##']

var rows2 = [];
for (var i = 0; i < 5; i++) {
    var tmp = [];
  for (var j = 0; j < 5; j++) {
     if ((i + j) % 2 === 0) {
        tmp.push(new TextCell("##"));
     } else {
        tmp.push(new TextCell("  "));
     }
   }

  rows2.push(tmp); 
}


console.log(rows2);