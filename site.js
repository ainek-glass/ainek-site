(() => {
  // Нажатие кнопки связи — не подтверждённая заявка или состоявшийся звонок.
  const googleAdsId = 'AW-18498019293';
  const contactConversion = googleAdsId + '/fs7KCNWeurYdEN2_xfRE';
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', googleAdsId);
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + googleAdsId;
    document.head.appendChild(tag);
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    const isWhatsApp = url.protocol === 'https:' && url.hostname === 'wa.me' &&
      /^\/(77007202031|77077202031)\/?$/.test(url.pathname);
    const isPhone = url.protocol === 'tel:' &&
      /^\+?(77007202031|77077202031)$/.test(url.pathname.replace(/[\s()-]/g, ''));
    if (!isWhatsApp && !isPhone) return;
    const sameTab = isWhatsApp && (!link.target || link.target === '_self') &&
      !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
    let navigated = false;
    const continueToContact = () => {
      if (navigated || !sameTab) return;
      navigated = true;
      window.location.assign(link.href);
    };
    if (sameTab) {
      event.preventDefault();
      window.setTimeout(continueToContact, 800);
    }
    try {
      window.gtag('event', 'conversion', {
        send_to: contactConversion,
        contact_method: isWhatsApp ? 'whatsapp_click' : 'phone_click',
        transport_type: 'beacon',
        event_callback: continueToContact,
        event_timeout: 700
      });
    } catch (_) { continueToContact(); }
  });
})();

(() => {
  // Фильтр объектов на главной
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const kind = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('.project').forEach(p => { p.hidden = kind !== 'all' && p.dataset.kind !== kind; });
  }));

  // Просмотр фото: листание внутри одной группы
  const box = document.getElementById('lightbox');
  if (!box) return;
  const photo = box.querySelector('img'), count = box.querySelector('.lb-count');
  let links = [], pos = 0, opener = null;
  const show = n => {
    if (!links.length) return;
    pos = (n + links.length) % links.length;
    photo.src = links[pos].getAttribute('href');
    photo.alt = links[pos].querySelector('img')?.alt || '';
    count.textContent = (pos + 1) + ' / ' + links.length + (photo.alt ? ' — ' + photo.alt : '');
  };
  const close = () => { box.hidden = true; document.body.style.overflow = ''; opener?.focus(); };
  document.querySelectorAll('.gallery a').forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault();
    opener = a;
    links = [...a.closest('.gallery').querySelectorAll('a')];
    show(links.indexOf(a));
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }));
  box.querySelector('.lb-close').onclick = close;
  box.querySelector('.lb-prev').onclick = () => show(pos - 1);
  box.querySelector('.lb-next').onclick = () => show(pos + 1);
  box.addEventListener('click', ev => { if (ev.target === box) close(); });
  let x0 = null;
  box.addEventListener('touchstart', ev => { x0 = ev.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', ev => {
    if (x0 === null) return;
    const dx = ev.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(pos + (dx < 0 ? 1 : -1));
  });
  document.addEventListener('keydown', ev => {
    if (box.hidden) return;
    if (ev.key === 'Escape') close();
    if (ev.key === 'ArrowRight') show(pos + 1);
    if (ev.key === 'ArrowLeft') show(pos - 1);
  });
})();
