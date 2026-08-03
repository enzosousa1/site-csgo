let skins = [
    { name: "AK47 | Aquecimento de Aço", rarity: "consumer", color: "yellow", icon: "skins/ak47.webp" },
    { name: "AWP | Lighting Strike", rarity: "mil-spec", color: "blue", icon: "skins/awp.png" },
    { name: "USP | Jawbreaker", rarity: "restricted", color: "orange", icon: "skins/usp.png" },
    { name: "M4A1-S | Black Lotus", rarity: "classified", color: "magenta", icon: "skins/m4a1.png" },
    { name: "Zeus-X27 | Olympus", rarity: "covert", color: "red", icon: "skins/zeus.png" },
    { name: "SSG | Dezastre", rarity: "contraband", color: "gold", icon: "skins/dezastre.png" },
    { name: "UMP45 | Motorized", rarity: "contraband", color: "gold", icon: "skins/ump45.png" },
];

let generateRandomSkin = () => {    
    let rand = Math.random() * 100;
    if (rand < 50) return skins[0]; // 50% chance
    if (rand < 75) return skins[1]; // 25% chance
    if (rand < 90) return skins[2]; // 15% chance
    if (rand < 97) return skins[3]; // 7% chance
    if (rand < 99.5) return skins[4]; // 2.5% chance
    return skins[5]; // 0.5% chance Faca
};

let saldo = 5000;
let costPerCase = 100;
let isSpinning = false;
let itemWidth = 150;

let track = document.getElementById('track');
let openBtn = document.getElementById('open-btn');
let saldoDisplay = document.getElementById('user-balance');
let modal = document.getElementById('result-modal');
let overlay = document.getElementById('overlay');
let modalItemText = document.getElementById('modal-item');

function initRoulette() {
    track.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        track.appendChild(createItemElement(generateRandomSkin()));
    }
    track.style.transform = `translateX(0px)`;
    track.style.transition = 'none';
}

function createItemElement(skin) {
    let div = document.createElement('div');
    div.className = 'roulette-item';
    div.style.setProperty('--rarity-color', skin.color);
    div.innerHTML = `
        <img src="assets/img/${skin.icon}" alt="${skin.name}" class="item-icon">
        <div class="item-name">${skin.name}</div>
    `;
    return div;
}

openBtn.addEventListener('click', () => {
    if (isSpinning) return;
    if (saldo < costPerCase) {
        alert("Você precisa de créditos para girar novamente.");
        return;
    }

    saldo -= costPerCase;
    saldoDisplay.innerText = `Créditos: R$${saldo}`;

    isSpinning = true;
    openBtn.disabled = true;
    openBtn.innerText = "Abrindo...";

    track.style.transition = 'none';
    track.style.transform = `translateX(0px)`;
    track.innerHTML = '';

    let totalItems = 70;
    let winningIndex = 55;

    let winningSkin = null;

    for (let i = 0; i < totalItems; i++) {
        let skin = generateRandomSkin();
        if (i === winningIndex) {
            winningSkin = skin;
        }
        track.appendChild(createItemElement(skin));
    }

    track.getBoundingClientRect();

    let trackContainerWidth = document.querySelector('.roulette-window').offsetWidth;
    let centerOffset = trackContainerWidth / 2;
    let itemCenterPoint = (winningIndex * itemWidth) + (itemWidth / 2);
    let randomOffset = Math.floor(Math.random() * (itemWidth - 10)) - ((itemWidth - 10) / 2);
    let finalPosition = (itemCenterPoint - centerOffset) + randomOffset;

    track.style.transition = 'transform 6s cubic-bezier(0.15, 0.8, 0.1, 1)';
    track.style.transform = `translateX(-${finalPosition}px)`;

    setTimeout(() => {
        isSpinning = false;
        openBtn.disabled = false;
        openBtn.innerText = "Girar Roleta (R$100)";
        
        showModal(winningSkin);
    }, 6200);
});

function showModal(skin) {
    modalItemText.innerText = skin.name;
    modalItemText.style.color = skin.color;
    modalItemText.style.textShadow = `0 0 10px ${skin.color}`;
    overlay.style.display = 'block';
    modal.style.display = 'block';
}

function closeModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

initRoulette();