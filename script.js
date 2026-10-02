/**
 * Vishal & Chaitali - Wedding Invitation Website Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeModal();
  initCountdownTimer();
  initTapHeartsCanvas();
  initMusicPlayer();
  initStickyNotes();
  initStickerInteractions();
  initSmoothScrolling();
  initScrollRevealObserver();
  initMobileScrollSparkles();
  initScrollCardTiltMotion();
});

/* ==========================================================================
   Envelope Unboxing Modal
   ========================================================================== */
function initEnvelopeModal() {
  const overlay = document.getElementById('envelope-overlay');
  const openBtn = document.getElementById('open-invitation-btn');

  if (!overlay || !openBtn) return;

  openBtn.addEventListener('click', () => {
    // Play confetti
    triggerMassiveConfetti();
    
    // Play sweet chime sound
    playChimeSound();

    // Start background music
    startRomanticMusic();

    // Fade out overlay
    overlay.classList.add('opened');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 800);
  });
}

/* ==========================================================================
   Countdown Timer (Target: Dec 18, 2026, 11:30 AM)
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  const weddingDate = new Date('December 18, 2026 11:30:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   Interactive Tap Hearts & Sparkles Canvas
   ========================================================================== */
function initTapHeartsCanvas() {
  const canvas = document.getElementById('tap-hearts-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let particles = [];
  const heartEmojis = ['💖', '🌸', '✨', '💕', '🌷', '❤️', '💍'];

  class HeartParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.char = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      this.size = Math.random() * 16 + 14;
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = -Math.random() * 3.5 - 1.5;
      this.opacity = 1;
      this.fade = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.fade;
      this.rotation += this.rotSpeed;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.char, 0, 0);
      ctx.restore();
    }
  }

  function spawnHearts(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      particles.push(new HeartParticle(x, y));
    }
  }

  window.addEventListener('click', (e) => {
    // Avoid triggering if clicking on input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    spawnHearts(e.clientX, e.clientY, 4);
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (touch.target.tagName === 'INPUT' || touch.target.tagName === 'TEXTAREA') return;
      spawnHearts(touch.clientX, touch.clientY, 4);
    }
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].opacity <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   Background Music Player (MP4 / MP3 File with Synthesizer Fallback)
   ========================================================================== */
let audioCtx = null;
let isPlaying = false;
let musicInterval = null;
let isFileAudio = false;

function initMusicPlayer() {
  const musicBtn = document.getElementById('music-btn');
  const weddingAudio = document.getElementById('wedding-audio');
  if (!musicBtn) return;

  if (weddingAudio) {
    weddingAudio.addEventListener('play', () => {
      isPlaying = true;
      isFileAudio = true;
      updateMusicUI(true);
    });
    weddingAudio.addEventListener('pause', () => {
      isPlaying = false;
      updateMusicUI(false);
    });
    weddingAudio.addEventListener('ended', () => {
      isPlaying = false;
      updateMusicUI(false);
    });
  }

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopRomanticMusic();
    } else {
      startRomanticMusic();
    }
  });
}

function startRomanticMusic() {
  const weddingAudio = document.getElementById('wedding-audio');

  if (weddingAudio) {
    const playPromise = weddingAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          isFileAudio = true;
          updateMusicUI(true);
        })
        .catch(() => {
          // If file not found or browser blocked, fallback to Web Audio Synth
          startSynthMelody();
        });
      return;
    }
  }

  startSynthMelody();
}

function startSynthMelody() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isPlaying = true;
  isFileAudio = false;
  updateMusicUI(true);

  // Soft romantic melody notes (Flute & Piano chords in D Major / Kalyani Raga vibe)
  const notes = [
    293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99,
    440.00, 369.99, 440.00, 587.33, 493.88, 369.99, 293.66, 369.99
  ];

  let step = 0;
  if (musicInterval) clearInterval(musicInterval);

  playWarmChord(293.66, 0.4); // D major base

  musicInterval = setInterval(() => {
    if (!isPlaying || isFileAudio) return;
    const freq = notes[step % notes.length];
    playBellTone(freq, 0.15, 1.2);
    
    // Add harmonic chord on every 4th beat
    if (step % 4 === 0) {
      playWarmChord(freq * 0.5, 0.25);
    }
    step++;
  }, 600);
}

function stopRomanticMusic() {
  isPlaying = false;
  const weddingAudio = document.getElementById('wedding-audio');
  if (weddingAudio && !weddingAudio.paused) {
    weddingAudio.pause();
  }
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  updateMusicUI(false);
}

function updateMusicUI(playing) {
  const musicBtn = document.getElementById('music-btn');
  const label = document.getElementById('music-label');
  if (!musicBtn) return;

  if (playing) {
    musicBtn.classList.add('playing');
    label.textContent = 'Playing ♡';
  } else {
    musicBtn.classList.remove('playing');
    label.textContent = 'Play Music';
  }
}

function playBellTone(freq, gainVal = 0.1, duration = 1.2) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function playWarmChord(freq, gainVal = 0.2) {
  if (!audioCtx) return;
  const chordFreqs = [freq, freq * 1.25, freq * 1.5];
  chordFreqs.forEach(f => {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal / 3, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.5);
  });
}

function playChimeSound() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  const chimes = [523.25, 659.25, 783.99, 1046.50];
  chimes.forEach((f, idx) => {
    setTimeout(() => {
      playBellTone(f, 0.2, 1.5);
    }, idx * 120);
  });
}

/* ==========================================================================
   Sticker Tap & Polaroid Interactions
   ========================================================================== */
function initStickerInteractions() {
  const stickers = document.querySelectorAll('.tap-sticker, .sticker-interactive-card');
  
  stickers.forEach(el => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

      if (window.confetti) {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { x, y },
          colors: ['#F7CAD0', '#D47B89', '#E2B056', '#FFFFFF']
        });
      }

      playBellTone(659.25 + Math.random() * 200, 0.1, 0.6);
    });
  });
}

/* ==========================================================================
   Wishes & Sticky Notes Board (Local Storage)
   ========================================================================== */
const DEFAULT_BLESSINGS = [
  {
    name: "Aarti & Family",
    message: "Heartiest congratulations Vishal & Chaitali! Wishing you both a lifetime of smiles, endless romance, and happy adventures together! ✨",
    stamp: "💖",
    time: "Just now"
  },
  {
    name: "Rohan & Sneha",
    message: "Made for each other! Can't wait to dance at the Sangeet and celebrate your big day on Dec 18th! 🎉🕺",
    stamp: "🥂",
    time: "2 hours ago"
  },
  {
    name: "Uncle & Aunty (Sharma)",
    message: "Sada Sukhi Raho! May God bless the lovely couple with eternal joy, peace, and prosperities. Lots of love and blessings 🌸",
    stamp: "🌸",
    time: "Yesterday"
  }
];

function initStickyNotes() {
  const form = document.getElementById('blessing-form');
  const board = document.getElementById('sticky-notes-board');

  let savedWishes = JSON.parse(localStorage.getItem('vc_wedding_wishes')) || JSON.parse(localStorage.getItem('cv_wedding_wishes')) || DEFAULT_BLESSINGS;

  function renderWishes() {
    board.innerHTML = '';
    savedWishes.forEach(wish => {
      const note = document.createElement('div');
      note.className = 'sticky-note';
      note.innerHTML = `
        <div class="sticky-header">
          <span class="sticky-author">${escapeHtml(wish.name)}</span>
          <span class="sticky-stamp">${wish.stamp}</span>
        </div>
        <p class="sticky-body">"${escapeHtml(wish.message)}"</p>
        <span class="sticky-time">${escapeHtml(wish.time)}</span>
      `;
      board.appendChild(note);
    });
  }

  renderWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('guest-name').value.trim();
      const message = document.getElementById('guest-message').value.trim();
      const stamp = document.querySelector('input[name="stamp"]:checked')?.value || '💖';

      if (!name || !message) return;

      const newWish = {
        name,
        message,
        stamp,
        time: "Just now"
      };

      savedWishes.unshift(newWish);
      localStorage.setItem('vc_wedding_wishes', JSON.stringify(savedWishes));
      renderWishes();

      form.reset();

      // Trigger Confetti Celebration
      triggerMassiveConfetti();
      playChimeSound();

      // Scroll sticky board into view
      board.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* ==========================================================================
   Calendar & Sharing Utilities
   ========================================================================== */
window.addToCalendar = function(title, description, startIso, endIso) {
  const startDate = startIso.replace(/-|:|\.\d\d\d/g, "");
  const endDate = endIso.replace(/-|:|\.\d\d\d/g, "");

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=Wedding+Hall`;
  
  window.open(googleUrl, '_blank');
};

window.shareInvitation = function() {
  const shareData = {
    title: 'Vishal & Chaitali Wedding Invitation',
    text: 'You are cordially invited to celebrate the wedding of Vishal & Chaitali on 18th December! 💖',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Invitation link copied to clipboard! Share it with friends & family 💌');
  }
};

window.triggerMassiveConfetti = function() {
  if (!window.confetti) return;
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#F7CAD0', '#D47B89', '#FFD166', '#FFFFFF']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
};

/* ==========================================================================
   Smooth Slow Scrolling Helpers
   ========================================================================== */
function slowSmoothScrollTo(targetY, duration = 1300) {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function initSmoothScrolling() {
  // Make the hero swipe/scroll down hint scroll smoothly & slowly to story section
  const scrollHint = document.querySelector('.scroll-down-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const storySection = document.getElementById('story');
      if (storySection) {
        const targetY = storySection.getBoundingClientRect().top + window.pageYOffset - 20;
        slowSmoothScrollTo(targetY, 1400);
      }
    });
  }

  // Slow smooth scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const targetY = targetElement.getBoundingClientRect().top + window.pageYOffset - 20;
          slowSmoothScrollTo(targetY, 1300);
        }
      }
    });
  });
}

/* ==========================================================================
   Cute Mobile Scroll Animations & Observer
   ========================================================================== */
function initScrollRevealObserver() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  // Stagger items inside containers
  document.querySelectorAll('.story-polaroid-grid, .events-timeline, .sticker-scrapbook').forEach(container => {
    const items = container.querySelectorAll('.scroll-reveal');
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.12}s`;
    });
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Cute Ambient Floating Rose Petals & Sparkles on Mobile Scroll
   ========================================================================== */
function initMobileScrollSparkles() {
  const petalEmojis = ['🌸', '✨', '💖', '💕', '🌷', '🌿'];
  let lastScrollY = window.scrollY;
  let ticking = false;
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'scroll-petals-overlay';
    document.body.appendChild(overlay);
  }

  function spawnScrollPetal() {
    if (!overlay) createOverlay();
    
    // Keep max 10 concurrent floating particles for smooth mobile 60fps performance
    if (overlay.children.length >= 10) return;

    const petal = document.createElement('span');
    petal.className = 'floating-petal-item';
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    
    const randomX = Math.random() * 90 + 5; // 5vw to 95vw
    const randomSize = Math.random() * 8 + 14; // 14px to 22px
    const randomDuration = Math.random() * 1.5 + 3.2; // 3.2s to 4.7s
    const randomRotate = (Math.random() - 0.5) * 60;

    petal.style.left = `${randomX}vw`;
    petal.style.top = `${Math.random() * 25 + 15}vh`;
    petal.style.fontSize = `${randomSize}px`;
    petal.style.animationDuration = `${randomDuration}s`;
    petal.style.transform = `rotate(${randomRotate}deg)`;

    overlay.appendChild(petal);

    setTimeout(() => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    }, randomDuration * 1000);
  }

  let scrollDistance = 0;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDistance += Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (scrollDistance > 160) {
          spawnScrollPetal();
          scrollDistance = 0;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   Scroll-Driven Dynamic Card Tilt & Float Motion (No Click Required)
   ========================================================================== */
function initScrollCardTiltMotion() {
  const storyCards = document.querySelectorAll('.story-card');
  const eventCards = document.querySelectorAll('.event-card');
  const scrapbookItems = document.querySelectorAll('.scrapbook-item');
  const venueCard = document.querySelector('.venue-card');
  const heroCard = document.querySelector('.hero-sticker-showcase .sticker-interactive-card');
  const quoteBanner = document.querySelector('.sticker-quote-banner');

  let isTicking = false;

  function updateCardTransforms() {
    const windowHeight = window.innerHeight;

    // 1. Story Polaroid Cards: Continuous gentle tilt sway as you scroll past
    storyCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        
        // Alternate tilt angles
        const baseAngle = (index % 2 === 0) ? -1.5 : 1.5;
        const tiltAngle = baseAngle + clamped * ((index % 2 === 0) ? 3.2 : -3.2);
        const yOffset = clamped * -6;
        const scale = 1 - Math.abs(clamped) * 0.02;

        card.style.transform = `perspective(800px) rotate(${tiltAngle.toFixed(2)}deg) translateY(${yOffset.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      }
    });

    // 2. Events Timeline Cards: Responsive slide emphasis as you scroll
    eventCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        
        const xOffset = (1 - Math.abs(clamped)) * 5;
        const scale = 1 + (1 - Math.abs(clamped)) * 0.015;

        card.style.transform = `translateX(${xOffset.toFixed(1)}px) scale(${scale.toFixed(3)})`;

        const badge = card.querySelector('.event-icon-badge');
        if (badge) {
          const badgeRotate = clamped * -15;
          badge.style.transform = `rotate(${badgeRotate.toFixed(1)}deg)`;
        }
      }
    });

    // 3. Scrapbook Stickers: Floating peel & tilt
    scrapbookItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        
        const baseAngles = [-2, 2, -1];
        const baseAngle = baseAngles[index % baseAngles.length];
        const tiltAngle = baseAngle + clamped * 3.5;
        const yOffset = clamped * -5;

        item.style.transform = `perspective(600px) rotate(${tiltAngle.toFixed(2)}deg) translateY(${yOffset.toFixed(1)}px)`;
      }
    });

    // 4. Hero Sticker: 3D Parallax tilt
    if (heroCard) {
      const rect = heroCard.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        
        const tiltAngle = clamped * 4;
        const yOffset = clamped * -10;

        heroCard.style.transform = `perspective(700px) rotate(${tiltAngle.toFixed(2)}deg) translateY(${yOffset.toFixed(1)}px)`;
      }
    }

    // 5. Quote Banner: Soft float sway
    if (quoteBanner) {
      const rect = quoteBanner.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        quoteBanner.style.transform = `scale(${ (1 + (1 - Math.abs(clamped)) * 0.02).toFixed(3) }) translateY(${ (clamped * -4).toFixed(1) }px)`;
      }
    }

    // 6. Venue Card
    if (venueCard) {
      const rect = venueCard.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        venueCard.style.transform = `perspective(800px) rotate(${ (clamped * 1.2).toFixed(2) }deg) scale(${ (1 + (1 - Math.abs(clamped)) * 0.015).toFixed(3) })`;
      }
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateCardTransforms);
      isTicking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateCardTransforms();
}


