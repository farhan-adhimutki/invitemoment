/* app.js - Web Undangan Pernikahan Classic Luxury */

document.addEventListener('DOMContentLoaded', () => {
  // Lock body scroll on load
  document.body.classList.add('locked');

  // Initialize Elements
  const coverGate = document.getElementById('cover-gate');
  const btnOpen = document.getElementById('btn-open-invitation');
  const audioToggle = document.getElementById('audio-toggle');
  const spinContainer = audioToggle ? audioToggle.querySelector('.audio-spin') : null;
  const toast = document.getElementById('toast');

  // Parse Guest Name from URL Parameter (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    const guestEl = document.getElementById('guest-name');
    if (guestEl) {
      guestEl.innerText = guestName;
    }
  }

  // Background Audio Setup
  const audioUrl = './assets/tehhijau.mp3';
  const bgAudio = new Audio(audioUrl);
  bgAudio.loop = true;
  bgAudio.volume = 0.5;
  let isPlaying = false;

  // 1. Open Invitation Handler
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Dismiss cover
      if (coverGate) {
        coverGate.classList.add('dismissed');
      }

      // Unlock scrolling
      document.body.classList.remove('locked');

      // Play music
      playMusic();

      // Scroll to Hero
      const hero = document.getElementById('hero-section');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }

      // Initialize animations observer
      initScrollReveal();
    });
  }

  // 2. Audio Control Handlers
  function playMusic() {
    bgAudio
      .play()
      .then(() => {
        isPlaying = true;
        if (spinContainer) {
          spinContainer.classList.remove('paused');
        }
        updateAudioIcon(true);
      })
      .catch((err) => {
        console.log('Audio autoplay blocked or failed:', err);
      });
  }

  function pauseMusic() {
    bgAudio.pause();
    isPlaying = false;
    if (spinContainer) {
      spinContainer.classList.add('paused');
    }
    updateAudioIcon(false);
  }

  if (audioToggle) {
    const toggleAudio = () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    };

    audioToggle.addEventListener('click', toggleAudio);
    audioToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        toggleAudio();
      }
    });
  }

  function updateAudioIcon(playing) {
    const playSvgPath = audioToggle.querySelector('.play-path');
    const pauseSvgPath = audioToggle.querySelector('.pause-path');
    if (playing) {
      playSvgPath.style.display = 'none';
      pauseSvgPath.style.display = 'block';
    } else {
      playSvgPath.style.display = 'block';
      pauseSvgPath.style.display = 'none';
    }
  }

  // 3. Countdown Timer Handler
  // Target date: October 18, 2026 09:00:00 (WIB)
  const targetDate = new Date('2026-10-18T09:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  // Start timer loop
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. Copy Bank Account Numbers with Toast Feedback
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const targetId = button.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId).innerText.replace(/\s+/g, '');

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast('Nomor Rekening Berhasil Disalin');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          showToast('Gagal menyalin nomor');
        });
    });
  });

  function showToast(message) {
    if (toast) {
      toast.innerText = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // 5. Scroll Reveal (Intersection Observer)
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }
});
