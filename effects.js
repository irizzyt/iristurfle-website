(() => {
  'use strict';

  // Theme management
  const panels = Array.from(document.querySelectorAll('.panel'));
  if (panels.length === 0) return;

  const themePrefix = 'theme-';
  const knownThemes = new Set(['hero','summary','experience','leadership','projects','skills','education','awards','contact']);
  let currentTheme = '';

  function applyTheme(theme) {
    if (!theme || theme === currentTheme) return;
    document.body.classList.remove(...Array.from(document.body.classList).filter(c => c.startsWith(themePrefix)));
    document.body.classList.add(themePrefix + theme);
    currentTheme = theme;
  }

  let lastIntersecting = null;
  
  // Enhanced Intersection Observer for scroll animations
  const io = new IntersectionObserver((entries) => {
    let mostVisible = null;
    let maxRatio = 0;
    
    for (const entry of entries) {
      // Add in-view class for animations
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
      
      // Theme management
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        mostVisible = entry;
      }
    }
    
    // Change theme based on most visible section
    if (mostVisible && maxRatio >= 0.25 && mostVisible.target !== lastIntersecting) {
      const theme = mostVisible.target.getAttribute('data-theme');
      if (knownThemes.has(theme)) {
        applyTheme(theme);
        lastIntersecting = mostVisible.target;
      }
    }
  }, { 
    threshold: [0.1, 0.25, 0.5, 0.75],
    rootMargin: '-50px 0px -50px 0px'
  });

  // Observe all panels
  panels.forEach((p) => io.observe(p));

  // Set initial theme
  const first = panels[0];
  if (first) {
    const t = first.getAttribute('data-theme');
    if (knownThemes.has(t)) applyTheme(t);
    first.classList.add('in-view');
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add parallax effect to hero on scroll
  const hero = document.querySelector('.hero');
  const missionSection = document.querySelector('.mission-section');
  if (hero && missionSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const missionTop = missionSection.offsetTop;
      
      // Only apply parallax when hero is in view
      if (scrollY < heroBottom) {
        const parallax = scrollY * 0.3;
        hero.style.transform = `translateY(${parallax}px)`;
        
        // Fade out as mission section approaches
        const distanceToMission = missionTop - scrollY;
        if (distanceToMission < window.innerHeight) {
          const fadeAmount = Math.max(0, distanceToMission / window.innerHeight);
          hero.style.opacity = fadeAmount;
        } else {
          hero.style.opacity = 1;
        }
      }
    }, { passive: true });
  }

  // Add hover effects to hub sections
  const hubSections = document.querySelectorAll('.hub-link-wrapper');
  hubSections.forEach(section => {
    section.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(8px)';
    });
    
    section.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });

  // Add micro-interactions to buttons
  const buttons = document.querySelectorAll('.social-button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Add fade-in animation on page load
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });

  // Show/hide topbar on scroll
  const topbar = document.querySelector('.topbar');
  let lastScrollY = window.scrollY;
  const scrollThreshold = 100; // Show topbar after scrolling 100px

  if (topbar) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > scrollThreshold) {
        topbar.classList.add('topbar-visible');
      } else {
        topbar.classList.remove('topbar-visible');
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });

    // Also check on page load in case user loads page mid-scroll
    if (window.scrollY > scrollThreshold) {
      topbar.classList.add('topbar-visible');
    }
  }

})();
