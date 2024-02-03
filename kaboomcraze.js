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

// Fonction pour supprimer les caractères répétés
function removeRepeatedChars(word) {
    return word.replace(/(.)\1{2,}/g, '$1');
}

document.getElementById('submit-button').addEventListener('click', function () {
    let playerNameInput = document.getElementById('player-name-input');
    let playerName = playerNameInput.value.trim();  // Trim pour supprimer les espaces inutiles

    // Liste de mots bannis
    const bannedWords = [
        // Mots inappropriés en anglais
        /f[uùûüú][cç][kq]/i,
        /s[h#][1iìîïí]t/i,
        /b[i1ìîïí][t7][cç][h#]/i,
        /n[i1ìîïí][g9]{2}[e3èéêë][r5]/i,
        /w[h#][o0òóôõö][r5][e3èéêë]/i,
        /d[a4@]mn/i,
        /h[e3èéêë][l1][l1]/i,
        /b[a4@]st[a4@]rd/i,
        /[a4@]ss/i,
        /sl[uùûüú]t/i,
        /wh[o0òóôõö][r5][e3èéêë]/i,
        /p[i1ìîïí]ss/i,
        /d[i1ìîïí]cçk/i,
        /cr[a4@]p/i,
        /s[o0òóôõö]n[0òóôõö]fb[i1ìîïí]t[cç]h/i,
        /tw[a4@]t/i,
        /j[e3èéêë]rk/i,
        /p[uùûüú]ss[y]/i,
        /m[o0òóôõö]r[o0òóôõö]n/i,
        /idi[o0òóôõö]t/i,
        /b[i1ìîïí]mb[o0òóôõö]/i,
        /n[i1ìîïí]pp[l1][e3èéêë]/i,
        /f[a4@]gg[o0òóôõö][t7]/i,
        /dyk[e3èéêë]/i,
        /g[i1ìîïí]mp/i,
        /r[e3èéêë]t[a4@]rd/i,
        /h[o0òóôõö]m[o0òóôõö]/i,
        /m[uùûüú]ff/i,
        /c[uùûüú]nt/i,
        /scr[o0òóôõö]t[uùûüú]m/i,
        /c[o0òóôõö]ck/i,
        /b[a4@]lls[a4@]cçk/i,
        /t[i1ìîïí]ts/i,
        /b[o0òóôõö][o0òóôõö]bs/i,
        /f[a4@]p/i,
        /[^a-zA-Z]69[^a-zA-Z]/,
        /v[a4@]g/i,
        /[a4@]n[a4@][l1]/i,
        /cl[i1ìîïí]t/i,
        /h[o0òóôõö][e3èéêë]r/i,
        /m[a4@]st[uùûüú]rb[a4@][t7][e3èéêë]/i,
        /n[uùûüú]ts[a4@]cçk/i,
        /p[e3èéêë]rv/i,
        /b[o0òóôõö]ng/i,
        /t[o0òóôõö]k[e3èéêë]/i,
        /sp[i1ìîïí]nk/i,
        /b[o0òóôõö][o0òóôõö]z[i1ìîïí]ng[i1ìîïí]ng/i,
        /p[o0òóôõö]rn/i,
        /p[o0òóôõö][o0òóôõö]t/i,
        /l[e3èéêë]z/i,
        /f[e3èéêë]ll[a4@][t7][i1ìîïí][o0òóôõö]/i,
        /b[o0òóôõö][l1][l1][o0òóôõö]cçk/i,
        /[t7]w[i1ìîïí]nk[i1ìîïí][e3èéêë]/i,
        /sk[a4@]nk/i,
        /sl[a4@]g/i,
        /sn[a4@]t[cç]h/i,
        /wh[o0òóôõö]r[e3èéêë]b[a4@]g/i,
        /f[a4@]gg[i1ìîïí]ty/i,
        /fl[i1ìîïí]p/i,
        /bl[o0òóôõö]wj[o0òóôõö]b/i,
        /[a4@]ssh[o0òóôõö][l1][e3èéêë]/i,
        /b[e3èéêë][a4@][t7][cç][h#]/i,
        /c[o0òóôõö]mm[i1ìîïí][e3èéêë]/i,
        /ch[o0òóôõö]d[e3èéêë]/i,
        
    
        // Mots inappropriés en français
        /m[e3èéêë][r5][d5][e3èéêë]/i,
        /p[uùûüú][t7][e3èéêë]/i,
        /c[o0òóôõö][nñ]/i,
        /s[aàáâãä][l1][e3èéêë][aàáâãä][r5][aàáâãä][b6][e3èéêë]/i,
        /n[e3èéêë][g9]{2}[e3èéêë][r5]/i,
        /f[i1ìîïí]l[s5][o0òóôõö]f[e3èéêë]/i,
        /b[r5][a4@]nl[e3èéêë]/i,
        /c[o0òóôõö]nn[a4@]rd/i,
        /s[aàáâãä][l1][o0òóôõö]p[e3èéêë]/i,
        /tr[o0òóôõö]u[dcç]/i,
        /b[i1ìîïí]t[e3èéêë]/i,
        /c[o0òóôõö]u[i1ìîïí]ll[e3èéêë]/i,
        /b[o0òóôõö]uff[o0òóôõö]nn[e3èéêë]/i,
        /p[e3èéêë]d[e3èéêë]/i,
        /c[o0òóôõö]nn[a4@]rd/i,
        /encul[e3èéêë]/i,
        /f[o0òóôõö]utr[e3èéêë]/i,
        /tr[o0òóôõö]ud[uùûüú]cç/i,
        /p[e3èéêë]d[e3èéêë]/i,
        /s[o0òóôõö]d[o0òóôõö]m/i,
        /p[o0òóôõö]uf[i1ìîïí][a4@]ss[e3èéêë]/i,
        /s[a4@]l[o0òóôõö]p[e3èéêë]/i,
        /br[a4@]nl[e3èéêë]/i,
        /b[o0òóôõö]uf[o0òóôõö]n[i1ìîïí]/i,
        /d[e3èéêë]b[i1ìîïí][l1][e3èéêë]/i,
        /abr[uùûüú]t[i1ìîïí]/i,
        /c[o0òóôõö]nn[e3èéêë]r[i1ìîïí]/i,
        /c[o0òóôõö]ch[o0òóôõö]nn[e3èéêë]/i,
        /b[o0òóôõö]rd[e3èéêë][l1]/i,
        /n[i1ìîïí]qu[e3èéêë]/i,
        /p[uùûüú]t[e3èéêë]r[i1ìîïí]/i,
        /g[r5][o0òóôõö]ss[e3èéêë][r5]/i,
        /b[i1ìîïí]tch/i,
        /p[o0òóôõö]rc[i1ìîïí]n[i1ìîïí]k/i,
        /m[o0òóôõö]ul[e3èéêë]/i,
        /f[i1ìîïí]ll[e3èéêë]/i,
        /c[a4@]ss[o0òóôõö][uùûüú]r[e3èéêë]/i,
        /r[o0òóôõö]ux/i,
        /r[a4@]cl[uùûüú]r[e3èéêë]/i,
        /c[o0òóôõö]u[i1ìîïí]ll[e3èéêë]onn[i1ìîïí][e3èéêë]/i,
        /b[o0òóôõö]urd[e3èéêë][l1]/i,
        /n[i1ìîïí]gr[o0òóôõö][i1ìîïí]tud[e3èéêë]/i,
        /p[e3èéêë]d[a4@][l1]/i,
        /f[o0òóôõö]ut[i1ìîïí][s5]/i,
        /s[o0òóôõö]uc[e3èéêë]/i,
        /v[i1ìîïí]c[i1ìîïí][e3èéêë]ux/i,
        /m[e3èéêë]rd[i1ìîïí]ll[e3èéêë]ux/i,
        /p[e3èéêë]p[e3èéêë]r[e3èéêë]/i,
        /ch[i1ìîïí]enn[e3èéêë]p[a4@]n[i1ìîïí]s/i,
        /encul[o0òóôõö]t[e3èéêë]/i,
        /tr[uùûüú]nn[e3èéêë]/i,
        /c[o0òóôõö]nch[i1ìîïí][e3èéêë]nn[i1ìîïí]/i,
        /c[o0òóôõö]ll[a4@]b[o0òóôõö]/i,
        /c[a4@]ss[o0òóôõö]s[e3èéêë]/i,
        /m[i1ìîïí]t[o0òóôõö]/i,
        /abr[uùûüú]t[i1ìîïí]/i,
        /p[e3èéêë]t[a4@]ss[e3èéêë]/i,

          
    ];

    if (!gameover || !playerName) {
        return; // Ne faites rien si le jeu n'est pas terminé ou si le nom du joueur n'est pas entré
    }

    // Vérifier si le nom du joueur dépasse 12 caractères
    if (playerName.length > 12) {
        alert("Votre nom ne doit pas dépasser 12 caractères.");
        return;
    }

    // Vérification de la présence de mots bannis dans le nom du joueur
    const cleanedName = removeRepeatedChars(playerName);
    if (bannedWords.some(pattern => pattern.test(cleanedName))) {
        alert("Veuillez choisir un nom approprié.");
        return;
    }

    // Ajoute le score à la base de données
    let newScoreRef = firebase.firestore().collection('scores').doc();
    newScoreRef.set({
        name: playerName,
        time: elapsedTimeInSeconds
    })
    .then(() => {
        updateLeaderboard(playerName);
        document.getElementById('submit-button').disabled = true; // Désactive le bouton de soumission
    })
    .catch(error => {
        console.error('Error writing new score to database', error);
    });

    playerNameInput.value = ''; // Réinitialise le champ de saisie
});



document.getElementById('restart-button').addEventListener('click', function () {
    resetGame();
    document.getElementById('submit-button').disabled = false; // Enable the submit button
});

function updateLeaderboard(playerName) {
    let leaderboardListContainer = document.querySelector('#leaderboard-list .inner-container');
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
    let leaderboardListContainer = document.querySelector('#leaderboard-list .inner-container');
    leaderboardList.innerHTML = ''; // Clear the leaderboard
    let rank = 1; // Initialize the rank counter
    querySnapshot.forEach(function (doc) {
        let score = doc.data();
        leaderboardList.innerHTML += '<li>' + rank + '. ' + score.name + ': ' + score.time + '</li>';
        rank++; // Increment the rank counter for each score
    });
});