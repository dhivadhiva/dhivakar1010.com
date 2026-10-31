/* ============================================================
   DHIVAKAR RAJARAM — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- THEME TOGGLE ---- */
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('dr-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('dr-theme', next);
  });

  /* ---- MOBILE NAV ---- */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  hamburger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
    });
  });

  /* ---- NAV SCROLL SHADOW ---- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 1px 0 var(--border)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within a section
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach((el, i) => {
    observer.observe(el);
  });

  /* ---- STAGGER REVEALS WITHIN SECTIONS ---- */
  // Give children of each section staggered delays
  document.querySelectorAll('.timeline-entry[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  document.querySelectorAll('.project-card[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.06) + 's';
  });

  /* ---- SMOOTH NAV ACTIVE STATE ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--text)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- HERO NAME LETTER ANIMATION ---- */
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.querySelectorAll('span').forEach((span, i) => {
      span.style.display = 'block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(40px)';
      span.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.12}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.12}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ---- HERO ELEMENTS STAGGER ---- */
  const heroEls = document.querySelectorAll('.hero [data-reveal]');
  heroEls.forEach((el, i) => {
    el.style.transitionDelay = (0.25 + i * 0.1) + 's';
  });

  /* ---- TOAST NOTIFICATION ---- */
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">✓</span> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  window.copyEmail = function (email, event) {
    if (event) event.preventDefault();
    const address = email || 'reachout@dhivalabs.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(() => {
        showToast(`Copied ${address} to clipboard!`);
      }).catch(() => {
        showToast(`Email: ${address}`);
      });
    } else {
      showToast(`Email: ${address}`);
    }
  };

  /* ---- COMMAND PALETTE ---- */
  const cmdPalette = document.getElementById('cmdPalette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdTrigger = document.getElementById('cmdTrigger');

  const COMMANDS = [
    { title: 'ApiWorkbench — API Client', sub: 'Dart / Flutter · Snap Store · MS Store', category: 'Project', url: 'https://github.com/Dhiva-Labs/ApiWorkbench', icon: '⚡' },
    { title: 'CloudDrop — Upload-only Cloud Folder', sub: 'Rust · Snap Store · MS Store', category: 'Project', url: 'https://github.com/Dhiva-Labs/CloudDrop', icon: '☁️' },
    { title: 'CrossShell — Linux ↔ Windows Remote', sub: 'Dart / Rust · SSH · Remote Desktop', category: 'Project', url: 'https://github.com/Dhiva-Labs/CrossShell', icon: '🔗' },
    { title: 'DiskRescue — Photo & Video Recovery', sub: 'Rust · Linux · Windows', category: 'Project', url: 'https://github.com/Dhiva-Labs/DiskRescue', icon: '💽' },
    { title: 'Kilonova — Monero Wallet', sub: 'Dart / Rust · Full node & LWS', category: 'Project', url: 'https://github.com/Dhiva-Labs/kilonova', icon: '🪐' },
    { title: 'BranchPilot — Visual Git GUI', sub: 'Dart / Flutter · Snap Store', category: 'Project', url: 'https://snapcraft.io/branchpilot', icon: '🌿' },
    { title: 'monero-lws — Upstream Fixes', sub: '8 merged pull requests · C++', category: 'Upstream', url: 'https://github.com/vtnerd/monero-lws/pulls?q=is%3Apr+author%3Adhivadhiva', icon: '🔧' },
    { title: 'Dhiva-Labs Official Site', sub: 'dhivalabs.com · 46 Shipped Projects', category: 'External', url: 'https://dhivalabs.com/', icon: '🌐' },
    { title: 'Sponsor Dhiva-Labs', sub: 'github.com/sponsors/Dhiva-Labs', category: 'External', url: 'https://github.com/sponsors/Dhiva-Labs', icon: '💖' },
    { title: 'View Professional Résumé', sub: 'Interactive & Printable PDF View', category: 'Navigation', url: 'resume.html', icon: '📄' },
    { title: 'Explore Work & Experience', sub: 'Timeline & Professional History', category: 'Navigation', url: '#experience', icon: '💼' },
    { title: 'Copy Lab Email', sub: 'reachout@dhivalabs.com', category: 'Action', action: () => copyEmail('reachout@dhivalabs.com'), icon: '📧' }
  ];

  let selectedIdx = 0;

  function renderCommands(query = '') {
    if (!cmdResults) return;
    const q = query.toLowerCase().trim();
    const filtered = COMMANDS.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.sub.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      cmdResults.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--text-faint);font-family:'DM Mono',monospace;font-size:0.75rem;">No matching projects or actions found</div>`;
      return;
    }

    selectedIdx = Math.min(selectedIdx, filtered.length - 1);

    cmdResults.innerHTML = filtered.map((item, idx) => `
      <div class="cmd-item ${idx === selectedIdx ? 'selected' : ''}" data-idx="${idx}" data-url="${item.url || ''}">
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${item.icon}</span>
          <div>
            <div class="cmd-item-title">${item.title}</div>
            <div class="cmd-item-sub">${item.sub}</div>
          </div>
        </div>
        <span class="cmd-item-badge">${item.category}</span>
      </div>
    `).join('');

    cmdResults.querySelectorAll('.cmd-item').forEach((el, idx) => {
      el.addEventListener('click', () => executeCommand(filtered[idx]));
    });
  }

  function executeCommand(cmd) {
    closePalette();
    if (cmd.action) {
      cmd.action();
    } else if (cmd.url) {
      if (cmd.url.startsWith('#')) {
        window.location.hash = cmd.url;
      } else if (cmd.url.endsWith('.html') || cmd.url.startsWith('/')) {
        window.location.href = cmd.url;
      } else {
        window.open(cmd.url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  function openPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('open');
    cmdPalette.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    selectedIdx = 0;
    renderCommands();
  }

  function closePalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('open');
    cmdPalette.setAttribute('aria-hidden', 'true');
  }

  window.openPalette = openPalette;
  window.closePalette = closePalette;

  if (cmdTrigger) {
    cmdTrigger.addEventListener('click', openPalette);
  }

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) closePalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      selectedIdx = 0;
      renderCommands(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      const items = cmdResults.querySelectorAll('.cmd-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % items.length;
        renderCommands(cmdInput.value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + items.length) % items.length;
        renderCommands(cmdInput.value);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const q = cmdInput.value.toLowerCase().trim();
        const filtered = COMMANDS.filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.sub.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
        if (filtered[selectedIdx]) executeCommand(filtered[selectedIdx]);
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  // Global Keyboard Listener (Ctrl+K, Cmd+K, /)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openPalette();
    }
  });

})();

