const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sun = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 35,
    color: 'yellow'
};

const G = 0.5;
const planets = [];
let isDrawing = false;
let startX, startY, currentX, currentY;
let planetMass = 50;
let planetSize = 10;

function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    return colors[Math.floor(Math.random() * colors.length)];
}

const massSlider = document.getElementById('massSlider');
const sizeSlider = document.getElementById('sizeSlider');
const massValue = document.getElementById('massValue');
const sizeValue = document.getElementById('sizeValue');

massSlider.addEventListener('input', (e) => {
    planetMass = e.target.value;
    massValue.textContent = planetMass;
});

sizeSlider.addEventListener('input', (e) => {
    planetSize = e.target.value;
    sizeValue.textContent = planetSize;
});

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
    planets.length = 0;
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        currentX = e.offsetX;
        currentY = e.offsetY;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const dx = currentX - sun.x;
        const dy = currentY - sun.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const tangentX = -dy / distance;
        const tangentY = dx / distance;
        const speed = 3;
        planets.push({
            x: currentX,
            y: currentY,
            vx: tangentX * speed,
            vy: tangentY * speed,
            radius: parseInt(planetSize),
            mass: parseInt(planetMass),
            color: getRandomColor()
        });
        isDrawing = false;
    }
});

function animate() {
    requestAnimationFrame(animate);
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw sun
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fillStyle = sun.color;
    ctx.fill();
    // Update and draw planets
    for (let i = planets.length - 1; i >= 0; i--) {
        const planet = planets[i];
        const dx = sun.x - planet.x;
        const dy = sun.y - planet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < sun.radius + planet.radius) {
            planets.splice(i, 1);
            continue;
        }
        const ax = (G * planet.mass * dx) / (distance * distance);
        const ay = (G * planet.mass * dy) / (distance * distance);
        planet.vx += ax;
        planet.vy += ay;
        planet.x += planet.vx;
        planet.y += planet.vy;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();
    }
    // Check planet-planet collisions
    for (let i = planets.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            const p1 = planets[i];
            const p2 = planets[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < p1.radius + p2.radius) {
                planets.splice(i, 1);
                planets.splice(j, 1);
                break;
            }
        }
    }
    // Draw grey circle while drawing
    if (isDrawing) {
        // Draw orbit circle centered at sun, radius to mouse
        const orbitRadius = Math.sqrt((currentX - sun.x) ** 2 + (currentY - sun.y) ** 2);
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        // Draw planet preview at mouse position
        ctx.beginPath();
        ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'grey';
        ctx.stroke();
    }
}

animate();