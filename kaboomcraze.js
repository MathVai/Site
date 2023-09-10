document.addEventListener('contextmenu', event => event.preventDefault());

let minefield = document.getElementById('minefield');
let grid = [];
let revealedCount = 0;
let flagCount = 0;
let timerId = null;
let elapsedTime;
let elapsedTimeInSeconds = (elapsedTime / 1000).toFixed(2);

let styles = getComputedStyle(document.documentElement);
let blue = String(styles.getPropertyValue('--brightblue1')).trim();
let green = String(styles.getPropertyValue('--green3')).trim();
let red = String(styles.getPropertyValue('--red2')).trim();
let orange = String(styles.getPropertyValue('--orange1')).trim();
let pink = String(styles.getPropertyValue('--pink1')).trim();
let beige = String(styles.getPropertyValue('--beige2')).trim();
let gray = String(styles.getPropertyValue('--gray1')).trim();

var timerDisplay = document.getElementById('timer');
var mineCountDisplay = document.getElementById('mine-count');
var gameMessageDisplay = document.getElementById('game-message');
var startTime;
var mineCount = 15;
var gameover = false;
var minesRemaining = mineCount;
var cells;

document.addEventListener('windowOpened', function (event) {
    console.log('Événement windowOpened déclenché. windowId:', event.windowId);

    if (event.windowId === "kaboomcraze") {
        console.log('Correspondance trouvée avec l\'ID "kaboomcraze".');

        var kaboomCrazeWindow = document.querySelector(`.window[data-id="${event.windowId}"]`);
        if (kaboomCrazeWindow) {

            timerDisplay = kaboomCrazeWindow.querySelector('#timer');
            console.log('Fenêtre Kaboom Craze trouvée dans le DOM.');
            mineCountDisplay = kaboomCrazeWindow.querySelector('#mine-count');

            const minefieldInOpenedWindow = kaboomCrazeWindow.querySelector('#minefield');

            if (minefieldInOpenedWindow) {
                console.log('Champ de mines trouvé dans la fenêtre Kaboom Craze.');
                minefield = minefieldInOpenedWindow; // Mise à jour de la référence à minefield
                createMinefield(); // Création du champ de mines
                attachEventHandlersToMinefield(minefield); // Attachement des gestionnaires d'événements

                // Ici, attachez l'écouteur d'événements au bouton reset-button du clone
                const resetButton = kaboomCrazeWindow.querySelector('#reset-button');
                if (resetButton) {
                    resetButton.addEventListener('click', function () {
                        console.log("Reset button clicked in cloned window!");
                        resetGame();
                    });
                }

            } else {
                console.log('Champ de mines NON trouvé dans la fenêtre Kaboom Craze.');
            }
        } else {
            console.log('Fenêtre Kaboom Craze NON trouvée dans le DOM avec l\'ID:', event.windowId);
        }
    } else {
        console.log('L\'ID de la fenêtre ouverte ne correspond pas à "kaboomcraze".');
    }
});





function attachEventHandlersToMinefield(minefieldElement) {
    minefieldElement.addEventListener('click', handleCellClick);
    minefieldElement.addEventListener('contextmenu', handleCellRightClick);
}


const createMinefield = () => {
    let kaboomCrazeWindow = document.querySelector('.window[data-id="kaboomcraze"]');
    if (kaboomCrazeWindow) {
        console.log("kaboomCrazeWindow trouvé !");
        minefield = kaboomCrazeWindow.querySelector('#minefield');
        mineCountDisplay = kaboomCrazeWindow.querySelector('#mine-count');
        console.log("mineCountDisplay:", mineCountDisplay);
    } else {
        console.log("kaboomCrazeWindow non trouvé. Utilisation du document principal.");
        minefield = document.getElementById('minefield');
        mineCountDisplay = document.getElementById('mine-count');
    }

    console.log('Minefield element:', minefield);
    minefield.innerHTML = '';
    grid = [];
    revealedCount = 0;
    flagCount = 0;
    minesRemaining = mineCount;
    let minePositions = new Set();
    while (minePositions.size < mineCount) {
        minePositions.add(Math.floor(Math.random() * 100));
    }
    for (let i = 0; i < 100; i++) {
        let cell = document.createElement('div');
        cell.classList.add('minefield-cell');
        minefield.appendChild(cell);
        let isMine = minePositions.has(i);
        let surroundingMines = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let x = i % 10;
                let y = Math.floor(i / 10);
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                    if (minePositions.has(nx + ny * 10)) {
                        surroundingMines++;
                    }
                }
            }
        }
        grid.push({
            isMine,
            surroundingMines,
            isRevealed: false,
            isFlagged: false
        });
    }
    cells = document.querySelectorAll('.minefield-cell');
    console.log("Taille de la grille lors de la création:", grid.length);

}



const handleCellClick = (e) => {
    console.log('Cell clicked');
    if (!timerId) {
        console.log('Starting timer...');
        startTimer();
    }

    let minefieldOfClickedCell = e.currentTarget;
    console.log("minefieldOfClickedCell:", minefieldOfClickedCell);

    let cell = e.target.closest('.minefield-cell');
    let index = Array.from(minefieldOfClickedCell.children).indexOf(cell);
    console.log('Index lors du clic:', index);
    console.log('Longueur de grid:', grid.length);
    console.log("Nombre d'enfants dans minefield lors du clic:", minefieldOfClickedCell.children.length);

    if (index < 0 || index >= grid.length) {
        console.error("Erreur: Index hors des limites de la grille.");
        return;
    }

    if (typeof grid[index] === 'undefined') {
        console.error("Erreur: La cellule à l'index", index, "est undefined.");
        return;
    }

    let {
        isMine,
        surroundingMines,
        isRevealed,
        isFlagged
    } = grid[index];
    console.log(`Cell details - isMine: ${isMine}, surroundingMines: ${surroundingMines}, isRevealed: ${isRevealed}, isFlagged: ${isFlagged}`); // Log cell details
    if (isRevealed || isFlagged) {
        return;
    }
    if (isMine) {
        console.log('Mine found!'); // Log if mine is found
        cell.classList.add('bombed'); // Ajoute la classe "bombed"
        revealMines(minefieldOfClickedCell);
        gameOver(false);
    } else {
        console.log('Revealing cell...'); // Log if cell is being revealed
        revealCell(index, minefieldOfClickedCell);
        if (revealedCount === 100 - mineCount) {
            gameOver(true);
        }
    }
}


const handleCellRightClick = (e) => {
    e.preventDefault();
    let minefieldOfRightClickedCell = e.currentTarget;
    let cell = e.target.closest('.minefield-cell');

    let index = Array.from(minefieldOfRightClickedCell.children).indexOf(cell);
    if (typeof grid[index] === 'undefined') {
        console.error("Erreur : l'index", index, "n'existe pas dans la grille.");
        return;
    }
    let {
        isRevealed,
        isFlagged
    } = grid[index];
    if (isRevealed) {
        return;
    }
    if (isFlagged) {
        cell.classList.remove('flagged'); // Supprime la classe "flagged"
        flagCount--;
    } else {
        cell.classList.add('flagged'); // Ajoute la classe "flagged"
        flagCount++;
    }
    grid[index].isFlagged = !isFlagged;
    minesRemaining = mineCount - flagCount;
    mineCountDisplay.textContent = minesRemaining;
}


const revealMines = (minefieldOfClickedCell) => {
    grid.forEach((cell, index) => {
        if (cell.isMine) {
            let cellElement = minefieldOfClickedCell.children[index];
            cellElement.classList.add('bombed'); // Ajoute la classe "bombed" à la cellule
        }
    });
}


const revealCell = (index, minefieldOfClickedCell) => {
    if (index < 0 || index >= 100) {
        return;
    }
    let cell = grid[index];
    if (cell.isRevealed || cell.isFlagged || cell.isMine) {
        return;
    }
    let cellElement = minefieldOfClickedCell.children[index];
    cell.isRevealed = true;
    revealedCount++;
    cellElement.classList.add('revealed');
    if (cell.surroundingMines === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                revealCell(index + dx + dy * 10, minefieldOfClickedCell);
            }
        }
    } else {
        cellElement.textContent = cell.surroundingMines;
        switch (cell.surroundingMines) {
            case 1:
                cellElement.style.color = blue;
                break;
            case 2:
                cellElement.style.color = green;
                break;
            case 3:
                cellElement.style.color = red;
                break;
            case 4:
                cellElement.style.color = orange;
                break;
            case 5:
                cellElement.style.color = pink;
                break;
            case 6:
                cellElement.style.color = beige;
                break;
            case 7:
                cellElement.style.color = gray;
                break;
            case 8:
                cellElement.style.color = '#000000';
                break;
        }
    }
}

function startTimer() {
    if (!timerId) {
        let startTime = Date.now();
        timerId = setInterval(function () {
            elapsedTime = Date.now() - startTime;
            let milliseconds = parseInt((elapsedTime) % 1000);
            let seconds = parseInt((elapsedTime / 1000) % 60);
            let minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
            let centiseconds = Math.floor(milliseconds / 10); // convert milliseconds to centiseconds
            timerDisplay.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + '.' + (centiseconds < 10 ? '0' : '') + centiseconds;
        }, 100);
    }
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    timerDisplay.textContent = '00:00';
}

function resetGame() {
    let kaboomCrazeWindow = document.querySelector('.window[data-id="kaboomcraze"]');
    if (kaboomCrazeWindow) {
        minefield = kaboomCrazeWindow.querySelector('#minefield'); // Mise à jour de la référence au champ de mines
    }
    stopTimer();
    gameover = false;
    minesRemaining = mineCount;
    mineCountDisplay.textContent = minesRemaining;
    createMinefield();
    attachEventHandlersToMinefield(minefield);
    console.log('Number of cells:', minefield.children.length);
    hideLeaderboard();
    document.getElementById('player-name-input').classList.add('hidden');
    document.getElementById('submit-button').classList.add('hidden');
}

function gameOver(win) {
    stopTimer();
    gameover = true;
    elapsedTimeInSeconds = Math.floor(elapsedTime / 10) / 100; // Add this line here
    let endGameMessage = win ? 'Victoire !' : 'Perdu !';
    document.getElementById('end-game-message').textContent = endGameMessage;
    document.getElementById('player-time').textContent = "Temps : " + elapsedTimeInSeconds + " sec.";
    displayLeaderboard();
    document.getElementById('end-game-modal').classList.remove('hidden');

    // Show or hide input and submit button
    document.getElementById('player-name-input').style.display = win ? 'block' : 'none';
    document.getElementById('submit-button').style.display = win ? 'block' : 'none';

    if (win) {
        document.getElementById('player-name-input').focus();
    }
}

function displayLeaderboard() {
    let leaderboard = document.getElementById('right-side');
    leaderboard.classList.remove('hidden');
}

function hideLeaderboard() {
    let leaderboard = document.getElementById('right-side');
    leaderboard.classList.add('hidden');
}


document.getElementById('restart-button').addEventListener('click', function () {
    let playerNameInput = document.getElementById('player-name-input');
    let playerName = playerNameInput.value;
    if (!gameover) {
        return;
    }
    if (playerName !== '') {
        let newScoreRef = firebase.firestore().collection('scores').doc();
        newScoreRef.set({
            name: playerName,
            time: elapsedTimeInSeconds
        }).then(function () {
            document.getElementById('end-game-modal').classList.add('hidden');
            resetGame();
            displayLeaderboard();
        }).catch(function (error) {
            console.error('Error writing new score to database', error);
        });
        playerNameInput.value = '';
    } else {
        resetGame();
        hideLeaderboard();
        playerNameInput.classList.add('hidden');
        document.getElementById('submit-button').classList.add('hidden');
    }
    document.getElementById('end-game-modal').classList.add('hidden');
});

document.getElementById('submit-button').addEventListener('click', function () {
    let playerNameInput = document.getElementById('player-name-input');
    let playerName = playerNameInput.value;
    if (!gameover || (playerName === '' && gameover)) {
        return; // Don't do anything if the game is not over or the player name is not entered
    }
    if (playerName !== '') {
        let newScoreRef = firebase.firestore().collection('scores').doc();
        newScoreRef.set({
            name: playerName,
            time: elapsedTimeInSeconds
        }).then(function () {
            // After the score is added, update and display the leaderboard
            updateLeaderboard(playerName);
            document.getElementById('submit-button').disabled = true; // Disable the submit button
        }).catch(function (error) {
            console.error('Error writing new score to database', error);
        });
        playerNameInput.value = ''; // Clear the input field
    } else {
        resetGame();
    }
});

document.getElementById('restart-button').addEventListener('click', function () {
    resetGame();
    document.getElementById('submit-button').disabled = false; // Enable the submit button
});

function updateLeaderboard(playerName) {
    let leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear the leaderboard
    firebase.firestore().collection('scores').orderBy('time').get().then(function (querySnapshot) {
        let rank = 1; // Initialize the rank counter
        querySnapshot.forEach(function (doc) {
            let score = doc.data();
            let li = document.createElement('li');
            li.textContent = rank + '. ' + score.name + ': ' + score.time;
            // Highlight the player's score
            if (score.name === playerName) {
                li.classList.add('highlight');
            }
            leaderboardList.appendChild(li);
            rank++; // Increment the rank counter for each score
        });
    });
}

window.addEventListener('beforeunload', stopTimer);



firebase.firestore().collection('scores').orderBy('time').onSnapshot(function (querySnapshot) {
    let leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear the leaderboard
    let rank = 1; // Initialize the rank counter
    querySnapshot.forEach(function (doc) {
        let score = doc.data();
        leaderboardList.innerHTML += '<li>' + rank + '. ' + score.name + ': ' + score.time + '</li>';
        rank++; // Increment the rank counter for each score
    });
});