const PLANK_LENGTH = 500;
let nextWeight = 0;
let leftWeights = []; 
let rightWeights = [];

const plankElement = document.getElementById('plank');

function init() {
    if (nextWeight === 0) {
        nextWeight = getRandomWeight();
    }
    
    plankElement.addEventListener('click', handlePlankClick);
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
    };

    let sideName = "";
    if (distance < 0) {
        leftWeights.push(newBall);
        sideName = "Left";
        console.log(distance);
    } else {
        rightWeights.push(newBall);
        sideName = "Right";
        console.log(distance);
    }

    nextWeight = getRandomWeight();

}



/*kullanacağım diğer fonksiyonlar */

function getRandomWeight() {
    return Math.floor(Math.random() * 10) + 1;
}

function getRandomColor() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
    return colors[Math.floor(Math.random() * colors.length)];
}


