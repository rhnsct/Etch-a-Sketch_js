
let container = document.getElementById('sketchContainer');
const gridDimensions = 25;
let gridSize = 16;
let backgroundColor = document.getElementById('backgroundColor')
let color = document.getElementById('colorPicker');
let primaryMouseButtonDown = false;
color.oninput = function() {
    let text = document.getElementById('drawText')
    text.style.color = invertColor(color.value, true)
};

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
};

function generateGrid(size, dimensions){
    clearGrid();

    let getSize = dimensions/size
    container.style.setProperty('--grid-size', size)
    container.style.setProperty('--grid-dimensions', dimensions + 'em')

    for (let i = 0; i < size*size; i++){
        
        let div = document.createElement('div');
        div.className = 'background'
        div.setAttribute('style', `background-color: ${backgroundColor.value}; border: none; width: ${getSize}em; height: ${getSize}em; user-select:none; `);
        div.setAttribute('id', `${i}`);
        
        div.addEventListener("mousedown", setPrimaryButtonState);
        div.addEventListener("mousemove", setPrimaryButtonState);
        div.addEventListener("mouseup", setPrimaryButtonState);
        container.appendChild(div);  
    }
};

function setPrimaryButtonState(e) {
    
    let flags = e.buttons !== undefined ? e.buttons : e.which;
    primaryMouseButtonDown = (flags & 1) === 1;
    if (flags == 1) {
        changeColours(this.id, getDrawColor());
    }
};

function getDrawColor() {
    let color = document.getElementById('colorPicker');
    color.oninput = function() {
        let text = document.getElementById('drawText')
        text.style.color = invertColor(color.value, true)
    }
    return color.value
};

function changeColours(id, color) {
        
    let div = document.getElementById(id);
    div.style.backgroundColor = color
};

function clearGrid() {
    
    let first = container.firstElementChild;
    while (first) {
        first.remove();
        first = container.firstElementChild;
    }
};

function rangeSliderLogic() {
    
    let slider = document.getElementById('sizeRange');
    let sliderOutput = document.getElementById('slideCount');

    sliderOutput.textContent = slider.value + 'x' + slider.value;
    slider.oninput = function() {
        sliderOutput.textContent = this.value + 'x' + this.value ;
        gridSize = this.value;
    };
    slider.onchange = function() {
        
        generateGrid(this.value, gridDimensions)
    };
};

function initialisePage() {
    rangeSliderLogic()
    generateGrid(gridSize,gridDimensions)

    let button = document.getElementById('clearButton')
    button.addEventListener('click', () => {
        generateGrid(gridSize,gridDimensions)
    })

    let listDivs = document.getElementById('sketchContainer').getElementsByClassName('background')

    backgroundColor.oninput = function() {
        let text = document.getElementById('backgroundText')
        text.style.color = invertColor(backgroundColor.value, true)
    }
    backgroundColor.onchange = function() {

        for (let i = 0; i <= listDivs.length -1; i++){
            listDivs[i].style.backgroundColor = backgroundColor.value
        }
    }
};



initialisePage()




