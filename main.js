const cards = document.querySelectorAll('.memory-card');
const timer = document.getElementById('timer');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let seconds = 0;
let firstFlipTime, lastFlipTime;
let intervalId; // add this variable

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;

        // start timer on first flip
        if (!firstFlipTime) {
            firstFlipTime = Date.now();
            startTimer();
        }
    } else {
        // second click
        hasFlippedCard = false;
        secondCard = this;

        checkForMatch();

        // check if game is over
        if (document.querySelectorAll('.memory-card.flip').length === cards.length) {
            lastFlipTime = Date.now();
            endGame();
        }
    }
}


function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        card.style.order = String(Math.floor(Math.random() * 12));
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

function startTimer() {
    intervalId = setInterval(() => {
        seconds++;
        timer.innerHTML = `Time: ${seconds} seconds`;
    }, 1000);
}

function endGame() {
    clearInterval(intervalId);

    // disable all cards
    cards.forEach(card => card.removeEventListener('click', flipCard));

    // calculate time taken to complete game
    const timeTaken = (lastFlipTime - firstFlipTime) / 1000;

    // display message to user
    timer.innerHTML = `You completed the game in ${timeTaken} seconds!`;
}

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGame);

function resetGame() {
    // Reset all card flips
    cards.forEach(card => card.classList.remove('flip'));

    // Reset the timer
    clearInterval(intervalId);
    seconds = 0;
    timer.innerHTML = 'Time: 0 seconds';
    firstFlipTime = null;
    lastFlipTime = null;

    // Reshuffle the cards
    (function shuffle() {
        cards.forEach(card => {
            card.style.order = String(Math.floor(Math.random() * 12));
        });
    })();

    // Re-enable click events on the cards
    cards.forEach(card => card.addEventListener('click', flipCard));
}

