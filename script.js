// Interactive Birthday Script for Silvia (23 Desember)

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const flame = document.getElementById("flame");
  const btnBlowCandle = document.getElementById("btnBlowCandle");
  const btnPlaySong = document.getElementById("btnPlaySong");
  const songBtnText = document.getElementById("songBtnText");
  const wishStatus = document.getElementById("wishStatus");
  const btnOpenGift = document.getElementById("btnOpenGift");
  const giftLid = document.getElementById("giftLid");
  const secretCard = document.getElementById("secretCard");
  const canvas = document.getElementById("confettiCanvas");
  const galaxyCanvas = document.getElementById("galaxyCanvas");

  let isCandleBlown = false;
  let isGiftOpen = false;
  let isPlayingSong = false;
  let audioCtx = null;

  // Starfield & Cosmic Dust Generator
  const stars = [];
  const starCount = 150;
  let galaxyCtx = galaxyCanvas ? galaxyCanvas.getContext("2d") : null;

  function resizeAllCanvases() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (galaxyCanvas) {
      galaxyCanvas.width = window.innerWidth;
      galaxyCanvas.height = window.innerHeight;
      initStars();
    }
  }

  function initStars() {
    stars.length = 0;
    const w = galaxyCanvas.width;
    const h = galaxyCanvas.height;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        deltaAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
        speedY: Math.random() * 0.15 + 0.05,
        color: Math.random() < 0.25 ? "#fbbf24" : (Math.random() < 0.5 ? "#f43f5e" : "#ffffff")
      });
    }
  }

  function renderStars() {
    if (!galaxyCtx) return;
    galaxyCtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.deltaAlpha;
      if (s.alpha > 0.95 || s.alpha < 0.15) {
        s.deltaAlpha = -s.deltaAlpha;
      }
      s.y -= s.speedY;
      if (s.y < 0) {
        s.y = galaxyCanvas.height;
        s.x = Math.random() * galaxyCanvas.width;
      }

      galaxyCtx.beginPath();
      galaxyCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      galaxyCtx.fillStyle = s.color;
      galaxyCtx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      galaxyCtx.shadowBlur = s.radius * 3;
      galaxyCtx.shadowColor = s.color;
      galaxyCtx.fill();
    }
    requestAnimationFrame(renderStars);
  }

  window.addEventListener("resize", resizeAllCanvases);
  resizeAllCanvases();
  if (galaxyCanvas) {
    requestAnimationFrame(renderStars);
  }

  // Confetti Particle System
  const particles = [];
  const colors = ["#f43f5e", "#fbbf24", "#38bdf8", "#a855f7", "#34d399", "#f472b6"];

  function createConfetti(count = 70) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: canvas.height / 2 + (Math.random() * 100 - 50),
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1.2) * 10,
        gravity: 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }
  }

  let animationFrameId = null;
  function updateConfetti() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > canvas.height) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(updateConfetti);
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function launchConfetti(count = 80) {
    createConfetti(count);
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(updateConfetti);
    }
  }

  // Blow Candle Action
  btnBlowCandle.addEventListener("click", () => {
    if (!isCandleBlown) {
      flame.classList.add("extinguished");
      wishStatus.textContent = "Yay, lilinnya padam! Semoga semua permohonan baik Silvia di tanggal 23 Desember terkabul!";
      btnBlowCandle.querySelector(".btn-text").textContent = "Nyalakan Lilin Lagi";
      isCandleBlown = true;
      launchConfetti(90);
    } else {
      flame.classList.remove("extinguished");
      wishStatus.textContent = "Lilin menyala lagi! Boleh buat permohonan bonus satu lagi.";
      btnBlowCandle.querySelector(".btn-text").textContent = "Tiup Lilinnya!";
      isCandleBlown = false;
    }
  });

  // Open Gift Action
  btnOpenGift.addEventListener("click", () => {
    if (!isGiftOpen) {
      giftLid.classList.add("opened");
      secretCard.classList.remove("hidden");
      isGiftOpen = true;
      launchConfetti(60);
      btnOpenGift.setAttribute("aria-expanded", "true");
    } else {
      giftLid.classList.remove("opened");
      secretCard.classList.add("hidden");
      isGiftOpen = false;
      btnOpenGift.setAttribute("aria-expanded", "false");
    }
  });

  // Synthesizer Web Audio API for Happy Birthday Melody
  const notes = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25
  };

  const happyBirthdaySong = [
    { note: "C4", duration: 0.35 },
    { note: "C4", duration: 0.25 },
    { note: "D4", duration: 0.6 },
    { note: "C4", duration: 0.6 },
    { note: "F4", duration: 0.6 },
    { note: "E4", duration: 1.0 },

    { note: "C4", duration: 0.35 },
    { note: "C4", duration: 0.25 },
    { note: "D4", duration: 0.6 },
    { note: "C4", duration: 0.6 },
    { note: "G4", duration: 0.6 },
    { note: "F4", duration: 1.0 },

    { note: "C4", duration: 0.35 },
    { note: "C4", duration: 0.25 },
    { note: "C5", duration: 0.6 },
    { note: "A4", duration: 0.6 },
    { note: "F4", duration: 0.6 },
    { note: "E4", duration: 0.6 },
    { note: "D4", duration: 0.8 },

    { note: "B4", duration: 0.35 },
    { note: "B4", duration: 0.25 },
    { note: "A4", duration: 0.6 },
    { note: "F4", duration: 0.6 },
    { note: "G4", duration: 0.6 },
    { note: "F4", duration: 1.2 }
  ];

  function playTone(freq, duration, startTime) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.05);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  btnPlaySong.addEventListener("click", () => {
    if (isPlayingSong) return;

    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    isPlayingSong = true;
    songBtnText.textContent = "Memutar Lagu...";
    btnPlaySong.disabled = true;

    let currentTime = audioCtx.currentTime + 0.1;

    happyBirthdaySong.forEach((item) => {
      const freq = notes[item.note] || 440;
      playTone(freq, item.duration, currentTime);
      currentTime += item.duration + 0.08;
    });

    const totalDuration = (currentTime - audioCtx.currentTime) * 1000;
    setTimeout(() => {
      isPlayingSong = false;
      songBtnText.textContent = "Putar Melodi Ultah";
      btnPlaySong.disabled = false;
    }, totalDuration);
  });

  // Music Player: Stop the Wedding
  const btnPlayWeddingSong = document.getElementById("btnPlayWeddingSong");
  const audioWeddingSong = document.getElementById("audioWeddingSong");
  const weddingSongIcon = document.getElementById("weddingSongIcon");
  const weddingSongText = document.getElementById("weddingSongText");

  if (btnPlayWeddingSong && audioWeddingSong) {
    btnPlayWeddingSong.addEventListener("click", () => {
      if (audioWeddingSong.paused) {
        audioWeddingSong.play().then(() => {
          btnPlayWeddingSong.classList.add("playing");
          weddingSongIcon.innerHTML = "&#10074;&#10074;"; // Pause icon
          weddingSongText.textContent = "Pause Lagu: Stop the Wedding";
        }).catch((err) => {
          console.error("Audio playback error:", err);
        });
      } else {
        audioWeddingSong.pause();
        btnPlayWeddingSong.classList.remove("playing");
        weddingSongIcon.innerHTML = "&#9658;"; // Play icon
        weddingSongText.textContent = "Putar Lagu: Stop the Wedding";
      }
    });

    audioWeddingSong.addEventListener("ended", () => {
      btnPlayWeddingSong.classList.remove("playing");
      weddingSongIcon.innerHTML = "&#9658;";
      weddingSongText.textContent = "Putar Lagu: Stop the Wedding";
    });
  }
});
