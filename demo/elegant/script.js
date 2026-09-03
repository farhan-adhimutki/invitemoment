// js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Opening Invitation & Music ---
  const btnOpen = document.getElementById('open-invitation');
  const coverSection = document.getElementById('cover');
  const mainContent = document.getElementById('main-content');
  const body = document.body;
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const floatingControls = document.getElementById('floating-controls');

  let isPlaying = false;

  btnOpen.addEventListener('click', () => {
    // Hide cover
    coverSection.classList.add('slide-up');

    setTimeout(() => {
      coverSection.style.display = 'none';
      // Show main content
      mainContent.classList.remove('hidden');
      floatingControls.classList.remove('hidden');
      body.classList.remove('locked');

      // Re-trigger scroll animations for elements now visible
      initScrollAnimations();

      // Play music
      playMusic();
    }, 800);
  });

  function playMusic() {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
      })
      .catch((err) => {
        console.log('Audio autoplay prevented', err);
      });
  }

  function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // --- 2. URL Parameters for Guest Name ---
  const urlParams = new URLSearchParams(window.location.search);
  const toParam = urlParams.get('to');
  const guestNameEl = document.getElementById('guest-name');

  if (toParam) {
    const formattedName = toParam.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    guestNameEl.textContent = formattedName;

    if (supabaseClient) {
      supabaseClient
        .from('cindy')
        .select('nama')
        .ilike('nama', formattedName)
        .limit(1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error('Guest name lookup error:', error);
            return;
          }

          if (data?.nama) {
            guestNameEl.textContent = data.nama;
          }
        });
    }
  }

  // --- 3. Countdown Timer ---
  // Set wedding date: Sept 06, 2026 14:00:00
  const weddingDate = new Date('September 06, 2026 14:00:00').getTime();

  const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      clearInterval(countdownTimer);
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
  }, 1000);

  // --- 4. Scroll Animations ---
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target); // Run once
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-anim').forEach((el) => {
      observer.observe(el);
    });
  }

  // --- 5. Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 6. Active Nav Link (Bottom Nav) ---
  const sections = document.querySelectorAll('section');
  const bottomNavLinks = document.querySelectorAll('#bottom-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    bottomNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // --- 7. Lightbox Gallery ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.querySelector('.close-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      lightboxImg.src = e.target.src;
      lightbox.classList.add('active');
    });
  });

  closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  const wishForm = document.getElementById('wish-form');
  const wishesList = document.getElementById('wishes-list');

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('wisher-name').value;
      const text = document.getElementById('wish-text').value;

      const btn = wishForm.querySelector('button');
      btn.innerText = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        const newWish = document.createElement('div');
        newWish.className = 'wish-card';
        // Add slide-in animation class if desired
        newWish.innerHTML = `
                    <h4>${name}</h4>
                    <p>${text}</p>
                    <span class="time">Just now</span>
                `;

        wishesList.prepend(newWish);
        wishForm.reset();

        btn.innerText = 'Send Wish';
        btn.disabled = false;
      }, 1000);
    });
  }
});

// --- 9. Copy Text Function (Global) ---
window.copyText = function (elementId, btnElement) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btnElement.style.background = '#e6f4ea';
      btnElement.style.color = '#1e8e3e';

      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2000);
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
};

// --- 8. RSVP Supabase ---
const rsvpForm = document.getElementById('rsvp-form');
const rsvpStatus = document.getElementById('rsvp-status');
const rsvpWishesList = document.getElementById('rsvp-wishes-list');
const rsvpStorageKey = 'sujar-cindy-rsvp';
const supabaseClient = window.supabase?.createClient('https://your-supabase-url.supabase.co', 'your-supabase-anon-key');

function renderRsvpList(rsvps) {
  rsvpWishesList.replaceChildren();

  rsvps.forEach((rsvp) => {
    const wishCard = document.createElement('article');
    wishCard.className = 'rsvp-wish-card';

    const wishHeader = document.createElement('div');
    wishHeader.className = 'rsvp-wish-header';

    const wishName = document.createElement('h4');
    wishName.textContent = rsvp.nama;

    const attendance = document.createElement('span');
    attendance.className = 'rsvp-attendance';
    attendance.textContent = rsvp.status_kehadiran;

    const wishMessage = document.createElement('p');
    wishMessage.textContent = rsvp.ucapann;

    wishHeader.append(wishName, attendance);
    wishCard.append(wishHeader, wishMessage);
    rsvpWishesList.append(wishCard);
  });
}

async function loadRsvps() {
  if (!supabaseClient) {
    rsvpStatus.textContent = 'RSVP belum dapat terhubung ke server.';
    return;
  }

  const { data, error } = await supabaseClient.from('cindy').select('nama, status_kehadiran, ucapann, timestamp').order('timestamp', { ascending: false });

  if (error) {
    console.error('Load RSVP error:', error);
    rsvpStatus.textContent = 'Ucapan belum dapat dimuat.';
    return;
  }

  renderRsvpList(data || []);
}

if (rsvpForm && rsvpStatus && rsvpWishesList) {
  loadRsvps();

  try {
    if (localStorage.getItem(rsvpStorageKey)) {
      rsvpForm.hidden = true;
      rsvpStatus.textContent = 'Anda sudah mengirim RSVP.';
    }
  } catch (error) {
    console.error('Local RSVP error:', error);
  }

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (localStorage.getItem(rsvpStorageKey)) {
      rsvpForm.hidden = true;
      rsvpStatus.textContent = 'Anda sudah mengirim RSVP.';
      return;
    }

    const rsvp = {
      nama: document.getElementById('rsvp-name').value.trim(),
      status_kehadiran: document.getElementById('rsvp-attendance').value,
      ucapann: document.getElementById('rsvp-message').value.trim(),
      timestamp: new Date().toISOString(),
    };

    if (!rsvp.nama || !rsvp.status_kehadiran || !rsvp.ucapann) {
      rsvpStatus.textContent = 'Mohon lengkapi semua data.';
      return;
    }

    const rsvpSubmit = document.getElementById('rsvp-submit');
    rsvpSubmit.disabled = true;
    rsvpSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

    try {
      const { error } = await supabaseClient.from('cindy').insert(rsvp);

      if (error) {
        throw error;
      }

      localStorage.setItem(rsvpStorageKey, 'sent');
      await loadRsvps();
      rsvpForm.hidden = true;
      rsvpStatus.textContent = 'Anda sudah mengirim RSVP.';
    } catch (error) {
      console.error('Supabase RSVP error:', error);
      rsvpStatus.textContent = 'RSVP tidak dapat dikirim. Silakan coba lagi.';
      rsvpSubmit.disabled = false;
      rsvpSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Konfirmasi';
    }
  });
}
