(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const menu = header.querySelector('.site-menu');
  const nav = header.querySelector('.site-navlinks');
  const links = [...nav.querySelectorAll('a')];
  const page = location.pathname.split('/').pop() || 'index.html';
  const servicePages = ['consulting.html', 'outsourcing.html', 'payroll.html', 'servicios-transitorios.html'];
  const setActive = (active, state = 'page') => {
    links.forEach(link => {
      if (link === active) link.setAttribute('aria-current', state);
      else link.removeAttribute('aria-current');
    });
  };
  const pageLink = links.find(link => {
    const target = new URL(link.href);
    const targetPage = target.pathname.split('/').pop() || 'index.html';
    return !target.hash && (targetPage === page || (targetPage === 'servicios.html' && servicePages.includes(page)));
  });
  setActive(pageLink);

  const sections = links.flatMap(link => {
    const url = new URL(link.href);
    if (url.pathname !== location.pathname || !url.hash) return [];
    const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    return section ? [{ link, section }] : [];
  });
  if (sections.length) {
    let scheduled = false;
    const updateSection = () => {
      scheduled = false;
      const boundary = header.getBoundingClientRect().bottom + (innerHeight - header.offsetHeight) * 0.25;
      const ordered = [...sections].sort((a, b) => a.section.getBoundingClientRect().top - b.section.getBoundingClientRect().top);
      const active = ordered.filter(item => item.section.getBoundingClientRect().top <= boundary).pop();
      setActive(active ? active.link : pageLink, active ? 'location' : 'page');
    };
    const schedule = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateSection);
      }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('load', schedule);
    updateSection();
  }
  const setOpen = open => {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };
  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  window.matchMedia('(max-width: 760px)').addEventListener('change', () => setOpen(false));
})();
