const skins = [
    { name: 'AK47 | Aquecimento de Aço', rarity: 'consumer', color: 'yellow', icon: 'skins/ak47.webp', weight: 50 },
    { name: 'AWP | Lighting Strike', rarity: 'mil-spec', color: 'blue', icon: 'skins/awp.png', weight: 25 },
    { name: 'USP | Jawbreaker', rarity: 'restricted', color: 'orange', icon: 'skins/usp.png', weight: 15 },
    { name: 'M4A1-S | Black Lotus', rarity: 'classified', color: 'magenta', icon: 'skins/m4a1.png', weight: 7 },
    { name: 'Zeus-X27 | Olympus', rarity: 'covert', color: 'red', icon: 'skins/zeus.png', weight: 2.5 },
    { name: 'SSG | Dezastre', rarity: 'contraband', color: 'gold', icon: 'skins/dezastre.png', weight: 0.25 },
    { name: 'UMP45 | Motorized', rarity: 'contraband', color: 'gold', icon: 'skins/ump45.png', weight: 0.25 }
];

const totalWeight = skins.reduce((sum, skin) => sum + skin.weight, 0);

const generateRandomSkin = () => {
    const rand = Math.random() * totalWeight;
    let cumulative = 0;

    for (const skin of skins) {
        cumulative += skin.weight;
        if (rand < cumulative) {
            return skin;
        }
    }

    return skins[skins.length - 1];
};

let saldo = 5000;
let costPerCase = 2400;
let isSpinning = false;
let itemWidth = 150;

const saldoDisplay = document.getElementById('user-balance');
const modal = document.getElementById('result-modal');
const overlay = document.getElementById('overlay');
const modalItemText = document.getElementById('modal-item');
const openBtn = document.getElementById('open-btn');
const detailTitle = document.querySelector('.case-detail-title span:last-child');
const detailPrice = document.querySelector('.case-detail-price');
const caseCards = Array.from(document.querySelectorAll('.case-card'));

let track = null;

function ensureRoulette() {
    const detailScreen = document.querySelector('.case-detail-screen');
    if (!detailScreen) return;

    let rouletteWindow = detailScreen.querySelector('.roulette-window');
    if (!rouletteWindow) {
        rouletteWindow = document.createElement('div');
        rouletteWindow.className = 'roulette-window';

        track = document.createElement('div');
        track.className = 'roulette-track';
        track.id = 'track';
        rouletteWindow.appendChild(track);

        const controls = detailScreen.querySelector('.case-detail-controls');
        detailScreen.insertBefore(rouletteWindow, controls);
    } else {
        track = rouletteWindow.querySelector('#track');
    }
}

function initRoulette() {
    ensureRoulette();
    if (!track) return;

    track.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        track.appendChild(createItemElement(generateRandomSkin()));
    }
    track.style.transform = 'translateX(0px)';
    track.style.transition = 'none';
}

function createItemElement(skin) {
    const div = document.createElement('div');
    div.className = 'roulette-item';
    div.style.setProperty('--rarity-color', skin.color);
    div.innerHTML = `
        <img src="assets/img/${skin.icon}" alt="${skin.name}" class="item-icon">
        <div class="item-name">${skin.name}</div>
    `;
    return div;
}

function syncActiveCase(card) {
    caseCards.forEach((item) => item.classList.remove('is-active'));
    card.classList.add('is-active');

    const title = card.querySelector('h3')?.textContent?.trim() || 'Case';
    const priceTag = card.querySelector('.case-footer')?.textContent?.trim() || 'R$0.00';

    if (detailTitle) detailTitle.textContent = title;
    if (detailPrice) detailPrice.textContent = priceTag;

    const numericPrice = Number(String(priceTag).replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.')) || 0;
    costPerCase = numericPrice;

    if (openBtn) {
        openBtn.textContent = `Abrir por ${priceTag}`;
    }
}

function bindCases() {
    caseCards.forEach((card) => {
        card.addEventListener('click', () => syncActiveCase(card));
    });

    if (caseCards.length) {
        syncActiveCase(caseCards[0]);
    }
}

if (openBtn) {
    openBtn.addEventListener('click', () => {
        if (isSpinning) return;
        if (saldo < costPerCase) {
            alert('Você precisa de créditos para girar novamente.');
            return;
        }

        saldo -= costPerCase;
        saldoDisplay.innerText = `Créditos: R$${saldo}`;

        isSpinning = true;
        openBtn.disabled = true;
        openBtn.innerText = 'Abrindo...';

        ensureRoulette();
        if (!track) return;

        track.style.transition = 'none';
        track.style.transform = 'translateX(0px)';
        track.innerHTML = '';

        const totalItems = 70;
        const winningIndex = 55;
        let winningSkin = null;

        for (let i = 0; i < totalItems; i++) {
            const skin = generateRandomSkin();
            if (i === winningIndex) {
                winningSkin = skin;
            }
            track.appendChild(createItemElement(skin));
        }

        const trackContainerWidth = document.querySelector('.roulette-window')?.offsetWidth || 900;
        const centerOffset = trackContainerWidth / 2;
        const itemCenterPoint = (winningIndex * itemWidth) + (itemWidth / 2);
        const randomOffset = Math.floor(Math.random() * (itemWidth - 10)) - ((itemWidth - 10) / 2);
        const finalPosition = (itemCenterPoint - centerOffset) + randomOffset;

        track.style.transition = 'transform 6s cubic-bezier(0.15, 0.8, 0.1, 1)';
        track.style.transform = `translateX(-${finalPosition}px)`;

        setTimeout(() => {
            isSpinning = false;
            openBtn.disabled = false;
            openBtn.innerText = `Abrir por ${detailPrice?.textContent?.trim() || 'R$0.00'}`;
            showModal(winningSkin);
        }, 6200);
    });
}

function showModal(skin) {
    if (!skin || !modalItemText || !modal || !overlay) return;

    modalItemText.innerText = skin.name;
    modalItemText.style.color = skin.color;
    modalItemText.style.textShadow = `0 0 10px ${skin.color}`;
    overlay.style.display = 'block';
    modal.style.display = 'block';
}

function closeModal() {
    if (overlay) overlay.style.display = 'none';
    if (modal) modal.style.display = 'none';
}

bindCases();
initRoulette();