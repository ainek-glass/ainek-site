(() => {
  const kk = document.documentElement.lang === 'kk';
  const t = (ru, kz) => kk ? kz : ru;
  const services = [t('Офисные перегородки','Кеңсе қалқалары'), t('Стеклянные перегородки','Әйнек қалқалар'), t('Алюминиевые перегородки','Алюминий қалқалар'), t('Перегородки гармошка','Жиналмалы қалқалар'), t('Окна и двери','Терезелер мен есіктер'), t('Демонтаж конструкций','Конструкцияларды бөлшектеу'), t('Металлопластиковые окна и двери','Металлопластик терезелер мен есіктер')];
  const file = location.pathname;
  const initial = file.includes('pvc-windows-doors') ? 6 : file.includes('garmoshka') ? 3 : file.includes('demontazh') ? 5 : 0;
  // Prepare a draft only. No personal details are stored or sent to analytics.
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
    const u = new URL(a.href);
    if (!/^\/(77007202031|77077202031)\/?$/.test(u.pathname) || u.searchParams.has('text')) return;
    u.searchParams.set('text', t('Здравствуйте! Нужен расчёт: ', 'Сәлеметсіз бе! Есептеу қажет: ') + services[initial]);
    a.href = u.href;
  });
  const box = document.createElement('section');
  box.className = 'quote-box'; box.id = 'request-quote';
  box.innerHTML = `<h2>${t('Расчёт по размерам, фото или чертежу','Өлшем, фото немесе сызба бойынша есептеу')}</h2>
    <p>${t('Укажите известные размеры. Если их пока нет, оставьте поля пустыми. Фото или чертёж можно приложить в WhatsApp.','Белгілі өлшемдерді енгізіңіз. Әзірге белгісіз болса, бос қалдырыңыз. Фотоны немесе сызбаны WhatsApp-та тіркей аласыз.')}</p>
    <form><div class="quote-grid">
    <label>${t('Что требуется','Қажетті қызмет')}<select name="service">${services.map((s,i)=>`<option${i===initial?' selected':''}>${s}</option>`).join('')}</select></label>
    <label>${t('Населённый пункт','Елді мекен')}<input name="place" maxlength="100" placeholder="${t('Алматы или населённый пункт области','Алматы немесе облыстағы елді мекен')}"></label>
    <label>${t('Ширина, мм','Ені, мм')}<input name="width" type="number" min="1" step="1" inputmode="numeric"></label>
    <label>${t('Высота, мм','Биіктігі, мм')}<input name="height" type="number" min="1" step="1" inputmode="numeric"></label>
    <label>${t('Количество дверей, шт.','Есіктер саны, дана')}<input name="doors" type="number" min="0" step="1" inputmode="numeric"></label>
    <label>${t('Пожелания','Қосымша ақпарат')}<input name="notes" maxlength="400" placeholder="${t('Тип стекла, проёмы, особенности объекта','Әйнек түрі, ойықтар, нысан ерекшеліктері')}"></label>
    </div><button type="submit">${t('Подготовить сообщение','Хабарлама дайындау')}</button></form>
    <div class="quote-preview" hidden><p>${t('Проверьте сообщение. Отправка выполняется вами в WhatsApp.','Хабарламаны тексеріңіз. Оны WhatsApp-та өзіңіз жібересіз.')}</p><pre></pre><a class="quote-send" target="_blank" rel="noopener">${t('Открыть WhatsApp','WhatsApp ашу')}</a></div>
    <p class="quote-note">${t('Это запрос расчёта, не заказ. Стоимость определим после уточнения конструкции и условий монтажа.','Бұл — есептеуге сұрау, тапсырыс емес. Баға конструкция мен монтаж шарттары нақтыланғаннан кейін анықталады.')}</p>`;
  const anchor = document.querySelector('footer');
  if (anchor) anchor.before(box); else document.body.append(box);
  box.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [t('Здравствуйте! Прошу рассчитать:', 'Сәлеметсіз бе! Есептеп беруіңізді сұраймын:'), String(data.get('service'))];
    const fields = [['place', t('Населённый пункт','Елді мекен'),''],['width',t('Ширина','Ені'),' мм'],['height',t('Высота','Биіктігі'),' мм'],['doors',t('Дверей','Есік саны'), t(' шт.',' дана')],['notes',t('Пожелания','Қосымша ақпарат'),'']];
    fields.forEach(([key,label,unit])=> { const value=String(data.get(key)||'').trim(); if(value) lines.push(label+': '+value+unit); });
    const message=lines.join('\n');
    box.querySelector('pre').textContent=message;
    box.querySelector('.quote-send').href='https://wa.me/77007202031?text='+encodeURIComponent(message);
    box.querySelector('.quote-preview').hidden=false;
    box.querySelector('.quote-send').focus();
  });
})();
