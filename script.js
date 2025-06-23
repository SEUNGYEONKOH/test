const canvas = document.getElementById("rain-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = [];
const splashes = [];
const mouse = { x: -100, y: -100 };

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const rainAudio = document.getElementById("rain-audio");
const soundToggle = document.getElementById("sound-toggle");
const rainSlider = document.getElementById("rain-slider");
const soundStartBtn = document.getElementById("sound-start-btn");

soundStartBtn.addEventListener("click", () => {
  rainAudio.volume = 0.5;
  rainAudio.loop = true;
  rainAudio.play().then(() => {
    console.log("소리 재생 시작됨");
    soundStartBtn.disabled = true;
    soundStartBtn.innerText = "🔊 재생 중";
  }).catch(err => {
    console.error("재생 실패", err);
    alert("소리를 재생할 수 없습니다. 브라우저 보안 설정을 확인하세요.");
  });
});

soundToggle.addEventListener("change", () => {
  if (soundToggle.checked) {
    rainAudio.play().catch(() => {});
  } else {
    rainAudio.pause();
  }
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
      splashes.push(new Splash(this.x, canvas.height));
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

class Splash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 1;
  }

  update() {
    this.radius += 1;
    this.alpha -= 0.03;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y - 2, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(173, 216, 230, ${this.alpha})`;
    ctx.stroke();
  }

  isDone() {
    return this.alpha <= 0;
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

  splashes.forEach(splash => {
    splash.update();
    splash.draw();
  });

  for (let i = splashes.length - 1; i >= 0; i--) {
    if (splashes[i].isDone()) {
      splashes.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

rainSlider.addEventListener("input", () => {
  const count = parseInt(rainSlider.value);
  raindrops.length = 0;
  for (let i = 0; i < count; i++) {
    raindrops.push(new Raindrop());
  }
});
