(() => {
  'use strict';

  // ============================================
  // PARTICLE SYSTEM - Subtle
  // ============================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = `rgba(139, 92, 246, ${this.opacity})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles - fewer and more subtle
    function initParticles() {
      const particleCount = Math.floor((canvas.width * canvas.height) / 30000);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    // Draw connections - more subtle
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    animate();
  }

  // ============================================
  // SCROLL REVEAL WITH IMAGES
  // ============================================
  const imageWrappers = document.querySelectorAll('.mission-image-wrapper, .hub-image-wrapper');
  const revealTexts = document.querySelectorAll('.reveal-text');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Reveal text elements when image is in view
        const section = entry.target.closest('.scroll-reveal');
        if (section) {
          const texts = section.querySelectorAll('.reveal-text');
          texts.forEach((text, index) => {
            setTimeout(() => {
              text.classList.add('revealed');
            }, index * 200);
          });
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  imageWrappers.forEach(wrapper => revealObserver.observe(wrapper));
  revealTexts.forEach(text => revealObserver.observe(text));

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  const panels = Array.from(document.querySelectorAll('.panel'));
  if (panels.length > 0) {
    const observerOptions = {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Stagger animation for hub sections
          if (entry.target.classList.contains('hub-section')) {
            const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
          }
        }
      });
    }, observerOptions);

    panels.forEach(panel => observer.observe(panel));
  }

  // ============================================
  // PARALLAX EFFECTS - Subtle
  // ============================================
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.gradient-orb');
  const images = document.querySelectorAll('.mission-image, .hub-image');
  
  if (hero) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.1;
          
          if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.4;
          }

          // Subtle parallax for orbs
          orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.05;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
          });

          // Parallax for images
          images.forEach((img, index) => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
              const imgTop = rect.top + window.pageYOffset;
              const scrollProgress = (window.pageYOffset - imgTop + window.innerHeight) / (window.innerHeight * 2);
              const parallax = scrollProgress * 30;
              img.style.transform = `scale(1) translateY(${parallax}px)`;
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // BUTTON RIPPLE EFFECT
  // ============================================
  const buttons = document.querySelectorAll('.social-button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
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
      
      setTimeout(() => ripple.remove(), 800);
    });
  });

  // ============================================
  // TOPBAR VISIBILITY
  // ============================================
  const topbar = document.querySelector('.topbar');
  const scrollThreshold = 100;
  const pathname = window.location.pathname;
  const isHomePage = pathname === '/' || pathname.endsWith('/index.html') || pathname.endsWith('/');
  const isContactPage = pathname.includes('/contact/') || pathname.includes('contact/index.html');

  if (topbar) {
    if (isContactPage || !isHomePage) {
      topbar.classList.add('topbar-visible');
      const keepVisible = () => topbar.classList.add('topbar-visible');
      keepVisible();
      window.addEventListener('scroll', keepVisible, { passive: true });
    } else {
      window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
          topbar.classList.add('topbar-visible');
        } else {
          topbar.classList.remove('topbar-visible');
        }
      }, { passive: true });

      if (window.scrollY > scrollThreshold) {
        topbar.classList.add('topbar-visible');
      }
    }
  }

  // ============================================
  // PAGE LOAD ANIMATION
  // ============================================
  // Removed - content should be visible immediately

  // ============================================
  // HUB SECTION INTERACTIONS
  // ============================================
  const hubSections = document.querySelectorAll('.hub-link-wrapper');
  hubSections.forEach(section => {
    section.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(8px)';
    });
    
    section.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });

  // ============================================
  // SMOOTH CARD HOVER EFFECTS
  // ============================================
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

})();
