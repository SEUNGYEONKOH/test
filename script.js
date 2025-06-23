const canvas = document.getElementById("rain-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = [];
const splashes = [];
const mouse = { x: -100, y: -100 };

// 마우스 움직임 감지
document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// 오디오 요소 및 제어 요소 가져오기
const rainAudio = document.getElementById("rain-audio");
const rainSlider = document.getElementById("rain-slider");
const soundToggle = document.getElementById("sound-toggle");

let audioInitialized = false;

// 사용자 첫 클릭 시 오디오 초기화
function initAudio() {
  if (!audioInitialized) {
    rainAudio.volume = 0.5;
    rainAudio.loop = true;
    rainAudio.play().catch(() => {});
    audioInitialized = true;
  }
}

// 첫 클릭 시 오디오 재생 시작
document.body.addEventListener("click", initAudio, { once: true });

// 비 클래스
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

// 물방울 스플래시
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

// 초기 비 생성
for (let i = 0; i < 150; i++) {
  raindrops.push(new Raindrop());
}

// 애니메이션 루프
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

// 윈도우 리사이즈 대응
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 슬라이더: 비 양 조절
rainSlider.addEventListener("input", () => {
  initAudio();  // 슬라이더 조작 시 오디오 초기화 시도
  const count = parseInt(rainSlider.value);
  raindrops.length = 0;
  for (let i = 0; i < count; i++) {
    raindrops.push(new Raindrop());
  }
});

// 체크박스: 소리 켜고 끄기
soundToggle.addEventListener("change", () => {
  initAudio();  // 소리 켜기 시 오디오 초기화 시도
  if (soundToggle.checked) {
    rainAudio.play().catch(() => {});
  } else {
    rainAudio.pause();
  }
});
