let dictionary = [];
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0, 
    currentCol: 0,
};

function updateGrid(){
    for(let i =0; i<state.grid.length; i++){
        for(let j = 0; j<state.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter=''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container){                  
    const grid = document.createElement('div');
    grid.className = 'grid';

    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 5; j++){
            drawBox(grid,i, j);
        }              
    }
    container.appendChild(grid);

}

function registerKeyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if(key === 'Enter'){ 
            const word = getCurrentWord();
            if(isWordValid(word)){
                revealWord(word);
                state.currentCol = 0;
                state.currentRow++;
            }else{
                alert('Invalid word');
            }
        }
        if(key === 'Backspace'){ 
            removeLetter();
        }
        if(isLetter(key)){
            addLetter(key);
        }
        updateGrid();
    }
}

function getCurrentWord(){
    return state.grid[state.currentRow].reduce((prev,curr) => prev + curr);
}

function isWordValid(word){
    return dictionary.includes(word);
}

function revealWord(word){
    const row = state.currentRow;
    const animation_duration = 500;

    for(let i=0; i<5; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
           
        
            if(letter === state.secret[i]){
                box.classList.add('right');
            }else if(state.secret.includes(letter)){
                box.classList.add('wrong');
            }else{
            box.classList.add('empty'); 
            }
        }, ((i+1) * animation_duration)/2) ; 

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration)/2}ms`;
    }

    setTimeout(() => {
    if (word === state.secret){
        alert('You win!');
    }else if (state.currentRow === 6){
        alert(`You lose! The word was ${state.secret}`);
    }
}, 3* animation_duration);
}       

function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
} 

function addLetter(letter){
    if(state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter(){
    if(state.currentCol === 0) return;
    state.currentCol--;
    state.grid[state.currentRow][state.currentCol] = '';
}

function startup() { 
    const game = document.getElementById('game');
    drawGrid(game);  

    fetch('./src/words.txt')
        .then(response => response.text())
        .then (text => {
            dictionary = text
                .split('\n')
                .map(w => w.trim().toLowerCase())
                .filter(w => w.length === 5);
            state.secret = dictionary[Math.floor(Math.random() * dictionary.length)];
        })
    
    registerKeyboardEvents();

}

startup();

