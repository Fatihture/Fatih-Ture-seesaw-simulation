const PLANK_LENGTH = 500;
let nextWeight = 0;
let leftWeights = []; 
let rightWeights = [];
let ghostBall;

const plankElement = document.getElementById('plank');
const nextWeightEl = document.getElementById('nextWeightDisplay');
const leftTotalEl = document.getElementById('totalLeftWeight');
const rightTotalEl = document.getElementById('totalRightWeight');
const angleEl = document.getElementById('tiltAngle');
const logListEl = document.getElementById('logList');
const resetBtn = document.getElementById('resetBtn');

function init() {
    loadData();

    if (nextWeight === 0) {
        nextWeight = getRandomWeight();
    }
    
    updateScreen();

    ghostBall = document.createElement('div');
    ghostBall.className = 'ghost-ball';
    plankElement.appendChild(ghostBall);

    plankElement.addEventListener('mousemove', (e) => {
        const x = e.offsetX;
        
        ghostBall.style.left = x + 'px';
        ghostBall.style.display = 'flex';

        const size = 30 + (nextWeight * 2);
        ghostBall.style.width = size + 'px';
        ghostBall.style.height = size + 'px';
        
        ghostBall.innerText = nextWeight + 'kg';
    });

    plankElement.addEventListener('mouseleave', () => {
        ghostBall.style.display = 'none';
    });



    plankElement.addEventListener('click', handlePlankClick);
    resetBtn.addEventListener('click', resetSimulation);
}


function handlePlankClick(event) {

    const clickX = event.offsetX; /* offset tahtanın en solunu 0 alıyor*/
    const center = PLANK_LENGTH / 2;
    const distance = clickX - center; 

    if (distance === 0) return;

    const absDistance = Math.abs(distance);
    
    const newBall = {
        weight: nextWeight,
        distance: absDistance,
        color: getRandomColor(),
        isNew: true
    };

    playDropSound();

    let sideName = "";
    if (distance < 0) {
        leftWeights.push(newBall);
        sideName = "Left";
    } else {
        rightWeights.push(newBall);
        sideName = "Right";
    }

    addLog(nextWeight, sideName, absDistance);

    nextWeight = getRandomWeight();

    saveData();
    updateScreen();
}


function updateScreen() {
    
    plankElement.innerHTML = '';

    for (let i = 0; i < leftWeights.length; i++) {
        drawBall(leftWeights[i], 'left');
    }

    for (let i = 0; i < rightWeights.length; i++) {
        drawBall(rightWeights[i], 'right');
    }

    calculatePhysics()
    nextWeightEl.innerText = nextWeight + ' kg';

    if(ghostBall) {
        plankElement.appendChild(ghostBall);
    }

    
}


function drawBall(ball, side) {
    const div = document.createElement('div');

    if (ball.isNew) {
        div.className = 'weight-object falling';
        ball.isNew = false; // sonraki çizimde tekrar düşmesin diye 
    } else {
        div.className = 'weight-object';
    }

    div.innerText = ball.weight + 'kg' ;
    div.style.backgroundColor = ball.color;

    const size = 30 + (ball.weight * 2);
    div.style.width = size + 'px';
    div.style.height = size + 'px';

    const center = PLANK_LENGTH / 2;
    if (side === 'left') {
        div.style.left = (center - ball.distance) + 'px';
    } else {
        div.style.left = (center + ball.distance) + 'px';
    }

    plankElement.appendChild(div);
}


function calculatePhysics() {

    let leftTorque = 0;
    let rightTorque = 0;
    let leftTotal = 0;
    let rightTotal = 0;

    for (let i = 0; i < leftWeights.length; i++) {
        leftTorque += leftWeights[i].weight * leftWeights[i].distance;
        leftTotal += leftWeights[i].weight;
    }

    for (let i = 0; i < rightWeights.length; i++) {
        rightTorque += rightWeights[i].weight * rightWeights[i].distance;
        rightTotal += rightWeights[i].weight;
    }

    let angle = (rightTorque - leftTorque) / 10;

    if (angle > 30) angle = 30;
    if (angle < -30) angle = -30;

    plankElement.style.transform = 'rotate(' + angle + 'deg)';
    
    leftTotalEl.innerText = leftTotal + ' kg';
    rightTotalEl.innerText = rightTotal + ' kg';
    angleEl.innerText = angle.toFixed(1) + '°';
}


/*kullanacağım diğer fonksiyonlar */

function getRandomWeight() {
    return Math.floor(Math.random() * 10) + 1;
}


function getRandomColor() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function addLog(weight, side, distance) {
    const p = document.createElement('div');
    p.className = 'log-item';
    p.innerText = "📦" + " " + weight + 'kg dropped on ' + side + ' at ' + Math.round(distance) + 'px';
    logListEl.prepend(p);
}

function resetSimulation() {
    leftWeights = [];
    rightWeights = [];
    nextWeight = getRandomWeight();
    logListEl.innerHTML = '';
    saveData();
    updateScreen();
}


function saveData() {
    const data = {
        left: leftWeights,
        right: rightWeights,
        next: nextWeight
    };
    localStorage.setItem('simple_seesaw_data', JSON.stringify(data));
}


function loadData() {
    const saved = localStorage.getItem('simple_seesaw_data');
    if (saved) {
        const data = JSON.parse(saved);
        leftWeights = data.left;
        rightWeights = data.right;
        nextWeight = data.next;

        for(let i=0; i<leftWeights.length; i++) leftWeights[i].isNew = false; /*animasyon tekrarlamasın diye */
        for(let i=0; i<rightWeights.length; i++) rightWeights[i].isNew = false;
    }
}

/* ses */

function playDropSound() {
    

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Sesin tonu
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);

    if (nextWeight < 4) {
        oscillator.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.1);
    }

    else if (nextWeight < 7) {
        oscillator.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.1);
    }

    else {
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
    }

    // Sesin seviyesi
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

init();
