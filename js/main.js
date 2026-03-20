document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. NAVBAR SCROLL
  // ============================================
  try {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // estado inicial

      // Cerrar menú móvil al hacer click en un link del navbar
      document.querySelectorAll('.navbar__links a').forEach(link => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    }
  } catch (e) { console.warn('Navbar error:', e); }


  // ============================================
  // 2. MENÚ MÓVIL
  // ============================================
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobile-menu');
  const mobileLinks  = document.querySelectorAll('.navbar__mobile-links a, .navbar__mobile-cta');

  function openMobileMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  try {
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('is-open');
        isOpen ? closeMobileMenu() : openMobileMenu();
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
          closeMobileMenu();
          hamburger.focus();
        }
      });
    }
  } catch (e) { console.warn('Mobile menu error:', e); }


  // ============================================
  // 3. DARK MODE
  // ============================================
  try {
    const themeToggle  = document.getElementById('theme-toggle');
    const htmlEl       = document.documentElement;

    // Determinar tema inicial
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    htmlEl.setAttribute('data-theme', initialTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }

    // Reaccionar a cambios del sistema si no hay preferencia guardada
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        htmlEl.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  } catch (e) { console.warn('Dark mode error:', e); }


  // ============================================
  // 4. FLIP CARDS (MÓVIL)
  // ============================================
  try {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) {
      const flipCards = document.querySelectorAll('.flip-card');
      flipCards.forEach(card => {
        card.addEventListener('click', () => {
          const isFlipped = card.classList.contains('flipped');
          // Cerrar todas
          flipCards.forEach(c => c.classList.remove('flipped'));
          // Abrir la clicada (si no estaba abierta)
          if (!isFlipped) {
            card.classList.add('flipped');
          }
        });
      });
    }
  } catch (e) { console.warn('Flip cards error:', e); }


  // ============================================
  // 5. FAQ ACORDEÓN
  // ============================================
  try {
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      const answer   = item.querySelector('.faq__answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = question.getAttribute('aria-expanded') === 'true';

        // Cerrar todos
        faqItems.forEach(other => {
          const q = other.querySelector('.faq__question');
          const a = other.querySelector('.faq__answer');
          if (q && a) {
            q.setAttribute('aria-expanded', 'false');
            a.style.maxHeight = '0';
          }
        });

        // Abrir el clicado si estaba cerrado
        if (!isOpen) {
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  } catch (e) { console.warn('FAQ error:', e); }


  // ============================================
  // 6. SCROLL ANIMATIONS
  // ============================================
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Mostrar todo sin animación
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
    } else {
      const animatedEls = document.querySelectorAll('.animate-on-scroll');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      animatedEls.forEach(el => observer.observe(el));
    }
  } catch (e) { console.warn('Scroll animations error:', e); }


  // ============================================
  // 7. TESTIMONIOS MÓVIL (dots)
  // ============================================
  try {
    const grid = document.getElementById('testimonials-grid');
    const dots = document.querySelectorAll('.testimonials__dot');

    if (grid && dots.length) {
      const cards = grid.querySelectorAll('.testimonial-card');

      // Actualizar dot activo según scroll
      grid.addEventListener('scroll', () => {
        const scrollLeft  = grid.scrollLeft;
        const cardWidth   = grid.clientWidth;
        const activeIndex = Math.round(scrollLeft / cardWidth);

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      }, { passive: true });

      // Click en dots
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          const card = cards[i];
          if (card) {
            grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft, behavior: 'smooth' });
          }
        });
      });
    }
  } catch (e) { console.warn('Testimonials error:', e); }

});
