const canvas = document.getElementById("rain-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = [];
const mouse = { x: -100, y: -100 };

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Raindrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.radius = 2 + Math.random() * 2;
    this.speed = 2 + Math.random() * 4;
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 80) {
      this.x += dx / dist * 5;
      this.y += dy / dist * 5;
    } else {
      this.y += this.speed;
    }

    if (this.y > canvas.height) {
      this.reset();
      this.y = 0;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(135, 206, 250, 0.7)";
    ctx.fill();
  }
}

for (let i = 0; i < 150; i++) {
  raindrops.push(new Raindrop());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  raindrops.forEach(drop => {
    drop.update();
    drop.draw();
  });
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
