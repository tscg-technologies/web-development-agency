/**
 * WEB DEVELOPMENT AGENCY — Main Application Script
 * Vanilla JavaScript: Navigation, Scroll Reveals, Active States, Back to Top
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const header = document.querySelector('.site-header, .header, #header');
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 2. Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-toggle, #mobileMenuBtn, .mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer, #mobileDrawer');
  const mobileClose = document.querySelector('.drawer-close-btn, #drawerCloseBtn, .mobile-drawer-close');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open', 'active');
    if (mobileOverlay) mobileOverlay.classList.add('open', 'active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open', 'active');
    if (mobileOverlay) mobileOverlay.classList.remove('open', 'active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Mobile submenu toggles
  const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
  mobileSubmenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.mobile-has-submenu');
      if (parent) {
        const submenu = parent.querySelector('.mobile-submenu');
        if (submenu) {
          submenu.classList.toggle('open');
          const chevron = toggle.querySelector('svg');
          if (chevron) {
            chevron.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
          }
        }
      }
    });
  });

  // 4. Highlight Active Navigation Link based on current URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mega-item, .mobile-nav-link, .mobile-submenu-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      // If inside mega menu or mobile submenu, also mark parent
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // 5. Scroll-Triggered Reveal Animations using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px 50px 0px',
      threshold: 0.05
    });

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50) {
        el.classList.add('revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 6. Generic Demonstration Disclaimer close/dismissal if any
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.demo-modal');
      if (modal) modal.classList.remove('active');
    });
  });
});
