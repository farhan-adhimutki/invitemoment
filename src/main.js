// Intersection Observer for fade-up animations
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  );

  animatedElements.forEach((el) => observer.observe(el));

  const toggleButton = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggleButton && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('active');
      toggleButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    toggleButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
});
