const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

const cardsData = [
    {
        "image": "../photos/Michael.png",
        "name": "Michael"
    },
    {
        "image": "../photos/FrenchMichael2.png",
        "name": "French Michael"
    },
    {
        "image": "../photos/Oldtimeymichael.png",
        "name": "Old Timey Michael"
    },
    {
        "image": "../photos/Michael67.png",
        "name": "Michael on Tyler"
    },
    {
        "image": "../photos/MoggingMichael.png",
        "name": "MOgging Michael"
    },
    {
        "image": "../photos/FrenchMichael.png",
        "name": "Michael Protection"
    },
    {
        "image": "../photos/MaliciousMichael.png",
        "name": "Malicious Michael"
    },
    {
        "image": "../photos/Michale8.png",
        "name": "Michael Booth"
    }
];

document.querySelector(".score").textContent = score;

cards = [...cardsData, ...cardsData];
shuffleCards();
generateCards();

function shuffleCards() {
    let currentIndex = cards.length;
    let randomIndex, temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src="${card.image}" />
        </div>
        <div class="back"></div>
        `;
        cardElement.addEventListener("click", flipCard);
        gridContainer.appendChild(cardElement);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard= this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch= firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped"); 
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}
