const PLANK_LENGTH = 500;
let nextWeight = 0;
let leftWeights = []; 
let rightWeights = [];

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
}


function drawBall(ball, side) {
    const div = document.createElement('div');

    div.className = 'weight-object';

    div.innerText = ball.weight;
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
    p.innerText = weight + 'kg dropped on ' + side + ' at ' + Math.round(distance) + 'px';
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


init();
