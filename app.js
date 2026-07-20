(() => {
  const CDN_BASE = 'https://fullhdhh3d.pages.dev';

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const toast = document.getElementById('toast');
  const tabBtns = [...document.querySelectorAll('.tab-btn')];
  const tabPanels = [...document.querySelectorAll('.tab-panel')];
  const toolPanels = [...document.querySelectorAll('.tool-panel[data-tab]')];

  function buildBookmark(scriptName) {
    return (
      "javascript:(function(){var s=document.createElement('script');s.src='" +
      CDN_BASE +
      '/' +
      scriptName +
      "?v='+Date.now();document.body.appendChild(s);})();"
    );
  }

  // Fill bookmark codes
  document.querySelectorAll('.bookmark-item[data-script]').forEach((item) => {
    const script = item.dataset.script;
    const code = item.querySelector('.bookmark-code');
    const bookmark = buildBookmark(script);
    if (code) {
      code.textContent = bookmark;
      code.dataset.full = bookmark;
    }
  });

  // Sticky nav
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav-links a, .nav-cta').forEach((el) => {
    el.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Tabs
  function activateTab(id) {
    tabBtns.forEach((btn) => {
      const on = btn.dataset.tab === id;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', String(on));
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === `panel-${id}`);
    });
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  toolPanels.forEach((panel) => {
    panel.addEventListener('click', () => {
      activateTab(panel.dataset.tab);
      document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Copy bookmark
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 280);
    }, 1800);
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const item = btn.closest('.bookmark-item');
      const script = item?.dataset.script;
      if (!script) return;
      const text = buildBookmark(script);
      const label = btn.querySelector('span');
      try {
        await copyText(text);
        btn.classList.add('copied');
        if (label) label.textContent = 'Đã copy';
        showToast('Đã sao chép bookmark!');
        setTimeout(() => {
          btn.classList.remove('copied');
          if (label) label.textContent = 'Copy';
        }, 2000);
      } catch {
        showToast('Không copy được — hãy chọn và copy thủ công');
      }
    });
  });

  // Click code to select all (easy manual copy)
  document.querySelectorAll('.bookmark-code').forEach((code) => {
    code.addEventListener('click', () => {
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // Soft pulse on active step chip
  const smActive = document.querySelector('.sm-node.active');
  if (smActive) {
    setInterval(() => {
      if (!document.getElementById('panel-luyen-dan')?.classList.contains('active')) return;
      smActive.style.transition = 'box-shadow 0.6s ease';
      smActive.style.boxShadow =
        smActive.style.boxShadow === '0 0 20px rgba(94, 234, 212, 0.35)'
          ? '0 0 8px rgba(94, 234, 212, 0.12)'
          : '0 0 20px rgba(94, 234, 212, 0.35)';
    }, 1400);
  }
})();
