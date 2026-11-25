var CURRENT_COLOR = "RGB(255, 102, 46)"; // Default color is red
var DEFAULT_COLOR = "RGB(67, 67, 67)"; // Default color is gray
var IS_CLICKED = false; // Flag to track if the button is clicked
var FILL_MODE = false; // Flag to track if fill mode is enabled

var COLOR_MAP = {
  "red": "RGB(255, 102, 46)",
  "blue": "RGB(83, 15, 255)",
  "green": "RGB(26, 218, 84)",
  "yellow": "RGB(255, 236, 26)",
  "skyblue": "RGB(142, 229, 255)",
};

document.addEventListener('mousedown', function(event) {
    IS_CLICKED = true;
  });

document.addEventListener('mouseup', function() {
    IS_CLICKED = false;
  });

  let field = document.querySelector('.field');
  for (let i = 0; i < 450; i+= 1) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('id', `${i}`);
    field.appendChild(cell);
  }

  let cells = document.querySelectorAll('.cell');
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    cell.addEventListener('click', function() {
        cell.style.backgroundColor = CURRENT_COLOR;
    });
    cell.addEventListener('mouseover', function() {
        if (IS_CLICKED) {
            cell.style.backgroundColor = CURRENT_COLOR;
        }
    });
    cell.addEventListener('mousedown', function() {
        if (FILL_MODE) {
            let cell_id = parseInt(cell.getAttribute('id'));
            cells.forEach((targetCell, index) => {
                let gridCols = 30; // Number of columns in the grid
                let targetRow = Math.floor(index / gridCols);
                let targetCol = index % gridCols;
                let startRow = Math.floor(cell_id / gridCols);
                let startCol = cell_id % gridCols;
                let rowDist= Math.abs(targetRow - startRow);
                let colDist = Math.abs(targetCol - startCol);
                let distance = rowDist + colDist; // Manhattan distance
                let delay = distance * 30; // Delay based on distance (50ms per cell)
                targetCell.animate([
                    { backgroundColor: CURRENT_COLOR}
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    delay: delay,
                    fill: 'forwards'
                });
            });
            setTimeout(() => {
                for (let j = 0; j < cells.length; j++) {
                    cells[j].style.backgroundColor = CURRENT_COLOR;
                }
            }, 1000); // Wait for the animation to finish before setting the final color
        } else {
            cell.style.backgroundColor = CURRENT_COLOR;
        }
    });

  }

let color_cells = document.querySelectorAll('.color-cell');
for (let i = 0; i < color_cells.length; i++) {
    let color_cell = color_cells[i];
    color_cell.addEventListener('click', function() {
        let colorClass = "";
        if (color_cell.classList.contains('red')) colorClass = "red";
        else if (color_cell.classList.contains('blue')) colorClass = "blue";
        else if (color_cell.classList.contains('green')) colorClass = "green";
        else if (color_cell.classList.contains('yellow')) colorClass = "yellow";
        else if (color_cell.classList.contains('skyblue')) colorClass = "skyblue";
        CURRENT_COLOR = COLOR_MAP[colorClass];
        FILL_MODE = false; // Disable fill mode when a color is selected
        document.querySelector('.selected').classList.remove('selected'); // Remove fill mode indicator
        color_cell.classList.add('selected'); // Highlight the selected color
    });
}

document.querySelector('.eraser').addEventListener('click', function() {
    CURRENT_COLOR = DEFAULT_COLOR;
    FILL_MODE = false;
    document.querySelector('.selected').classList.remove('selected');
    this.classList.add('selected');
});

document.querySelector('.fill-tool').addEventListener('click', function() {
    FILL_MODE = true;
    document.querySelector('.selected').classList.remove('selected');
    this.classList.add('selected');
});

var COLORS = [
    "rgb(67,67, 67)", 
    "rgb(255, 102, 46)", 
    "rgb(26, 218, 84)", 
    "rgb(255, 236, 26)", 
    "rgb(142, 229, 255)"
];

setInterval(function() {
    let result = "";
    let temp_cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < temp_cells.length; i+= 1) {
        let cell = temp_cells[i];
        let color = cell.style.backgroundColor;
        let colorIndex = "0"; // Default to gray if color not found
        for (let j = 0; j < COLORS.length; j++) {
            if (color === COLORS[j]) {
                colorIndex = j.toString();
                break;
            }
        }
        result += colorIndex;
    }

    document.cookie = `pixel-result=${result};max-age=100000;`;
}, 5000);

document.querySelector('.save-tool').addEventListener('click', function() {
    domtoimage.toJpeg(field, { quality: 0.95 })
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        let link = document.createElement('a');
        link.download = 'pixel.jpg';
        link.href = dataUrl;
        link.click();
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
});

