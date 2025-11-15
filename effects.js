(() => {
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
  
  const io = new IntersectionObserver((entries) => {
    // Find the most visible section
    let mostVisible = null;
    let maxRatio = 0;
    
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        mostVisible = entry;
      }
      
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    }
    
    // Only change theme if a section is significantly visible (25%+) and it's different
    if (mostVisible && maxRatio >= 0.25 && mostVisible.target !== lastIntersecting) {
      const theme = mostVisible.target.getAttribute('data-theme');
      if (knownThemes.has(theme)) {
        applyTheme(theme);
        lastIntersecting = mostVisible.target;
      }
    }
  }, { threshold: [0.1, 0.25, 0.5, 0.75] });

  panels.forEach((p) => io.observe(p));

  // Set initial theme based on the first panel in view
  const first = panels[0];
  if (first) {
    const t = first.getAttribute('data-theme');
    if (knownThemes.has(t)) applyTheme(t);
  }
})();


