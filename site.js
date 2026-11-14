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
