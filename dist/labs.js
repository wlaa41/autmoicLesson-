function initLabs() {
  const shell = (id, markup) => {
    const lab = document.getElementById('lab-' + id);
    if (!lab || lab.dataset.initialized) return null;
    lab.classList.add('atomic-lab');
    lab.dir = 'rtl';
    lab.innerHTML = markup;
    lab.dataset.initialized = 'true';
    return lab;
  };
  const one = (root, target) => root.querySelector(target);
  const button = (text, name, variant = '') =>
    '<button type="button" class="atomic-lab-control ' + variant + '" data-act="' + name + '">' + text + '</button>';
  const diagram = (name, label, width = 640, height = 300) =>
    '<canvas data-diagram="' + name + '" width="' + width + '" height="' + height + '" role="img" aria-label="' + label + '"></canvas>';
  const status = (name) => '<p class="atomic-lab-status" data-status="' + name + '" role="status"></p>';
  const value = (text) => '<bdi dir="ltr">' + text + '</bdi>';
  const polar = (centerX, centerY, radius, theta) => [
    centerX + radius * Math.cos(theta), centerY + radius * Math.sin(theta)
  ];
  const circle = (ctx, x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  };
  const canvasText = (ctx, content, x, y, color = '#c7dbe3', size = 22) => {
    ctx.font = '600 ' + size + 'px system-ui, sans-serif';
    ctx.fillStyle = color;
    ctx.direction = 'ltr';
    ctx.fillText(content, x, y);
  };
  const stage = (canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bg = ctx.createRadialGradient(canvas.width * .5, 145, 15, canvas.width * .5, 145, 390);
    bg.addColorStop(0, '#174337');
    bg.addColorStop(1, '#0d271f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9ce9c022';
    for (let x = 20; x < canvas.width; x += 22) {
      for (let y = 17; y < canvas.height; y += 22) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
    return ctx;
  };
  const ring = (ctx, x, y, r, color, lineWidth = 2) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  };
  const atomSphere = (ctx, x, y, radius, filled) => {
    const gradient = ctx.createRadialGradient(x - radius * .25, y - radius * .4, 4, x, y, radius);
    gradient.addColorStop(0, filled ? '#a7f3b2' : '#8bd9ac36');
    gradient.addColorStop(1, filled ? '#327853' : '#8bd9ac0d');
    circle(ctx, x, y, radius, gradient);
    ring(ctx, x, y, radius, filled ? '#a7f3b2a0' : '#a7f3b260');
  };
  const nucleus = (ctx, x, y) => {
    circle(ctx, x, y, 10, '#f6c77d');
    ring(ctx, x, y, 16, '#f6c77d66');
  };

  const models = [
    { name: 'دالتون', year: '1803', detail: 'تخيّل الذرة كرة مصمتة. ساعد النموذج على تفسير اتحاد العناصر بنِسَب ثابتة، وظهرت لاحقاً أدلة على وجود جسيمات داخلها.' },
    { name: 'طومسون', year: '1897', detail: 'بعد اكتشاف الإلكترون، اقترح طومسون نموذجاً فيه إلكترونات سالبة موزّعة داخل شحنة موجبة. الذرة متعادلة في مجموعها.' },
    { name: 'رذرفورد', year: '1909', detail: 'عبرت معظم جسيمات ألفا صفيحة الذهب الرقيقة وانحرف عدد قليل انحرافاً كبيراً. دلّ ذلك على نواة صغيرة موجبة، وعلى أن معظم حجم الذرة فراغ. أُجريت التجربة عام 1909 وطُرح النموذج النووي عام 1911.' },
    { name: 'بور', year: '1913', detail: 'وضع بور الإلكترون في مستويات طاقة محددة. يفسّر الانتقال بين المستويات خطوط طيف الهيدروجين.' },
    { name: 'النموذج الحديث', year: '1923 وما بعده', detail: 'يعرض الكتاب بداية التحوّل نحو التصوّر الحديث. نُمثّل وجود الإلكترون حول النواة بسحابة احتمالية، وتدل كثافة النقاط على احتمال وجوده.' }
  ];
  const history = shell('history', '<h3>قارن نماذج الذرة</h3><div class="atomic-lab-choices" aria-label="نماذج الذرة">' +
    models.map((model, i) => button(model.name, i)).join('') + '</div>' +
    '<div class="atomic-lab-grid">' + diagram('history', 'رسم لنموذج الذرة المختار') + '<div class="atomic-lab-controls">' +
    status('history') + '</div></div>');
  if (history) {
    const canvas = one(history, 'canvas');
    const modelButtons = [...history.querySelectorAll('button')];
    const renderModel = (index) => {
      const { name, year, detail } = models[index];
      one(history, '[role="status"]').innerHTML = '<strong>' + name + ' · ' + value(year) + '</strong><br>' + detail;
      modelButtons.forEach((choice, i) => choice.setAttribute('aria-pressed', i === index));
      canvas.setAttribute('aria-label', name + ' — ' + detail);
      const ctx = stage(canvas);
      if (!ctx) return;
      const x = 320;
      const y = 150;
      if (index < 3) atomSphere(ctx, x, y, 105, index === 0);
      if (index === 1) {
        [[-47,-43],[40,-55],[-65,35],[38,48],[6,6]].forEach(([dx,dy]) => {
          circle(ctx, x + dx, y + dy, 12, '#0d3527');
          canvasText(ctx, '−', x + dx - 7, y + dy + 7, '#c0f7ce', 21);
        });
        [[-5,-64],[-35,-7],[60,12],[-21,61]].forEach(([dx,dy]) =>
          canvasText(ctx, '+', x + dx - 6, y + dy + 7, '#a7f3b2', 23));
      }
      if (index === 2) {
        nucleus(ctx, x, y);
        [[-74,-47],[67,54],[82,-51]].forEach(([dx,dy]) => circle(ctx, x + dx, y + dy, 5, '#a7f3b2'));
      }
      if (index === 3) {
        [35,66,102].forEach((r) => ring(ctx, x, y, r, '#82caa18c'));
        nucleus(ctx, x, y);
        const [ex, ey] = polar(x, y, 66, -.8);
        circle(ctx, ex, ey, 7, '#a7f3b2');
      }
      if (index === 4) {
        nucleus(ctx, x, y);
        for (let i = 0; i < 710; i++) {
          const r = Math.abs(Math.sin((i + 1) * Math.SQRT2)) ** 4 * 112;
          const [px, py] = polar(x, y, r, i * 2.399963);
          circle(ctx, px, py, i % 3 ? 1.4 : 2.5, '#a7f3b243');
        }
        nucleus(ctx, x, y);
      }
    };
    modelButtons.forEach((choice, i) => choice.addEventListener('click', () => renderModel(i)));
    renderModel(0);
  }

  const wave = shell('wave',
    '<h3>جرّب انتقالات الطاقة وطبيعة الإلكترون</h3><div class="atomic-lab-choices" aria-label="تجارب الجزء الموجي">' +
    button('مستويات بور', 'levels') + button('موجة دي برولي', 'broglie') + button('عدم التعيين', 'uncertainty') + '</div>' +
    '<section data-panel="levels"><div class="atomic-lab-grid">' + diagram('levels', 'مستويات طاقة الهيدروجين') +
    '<div class="atomic-lab-controls"><p>ابدأ من <bdi dir="ltr">n = 2</bdi>. غيّر المستوى ولاحظ ما يحدث. تتقارب مستويات الطاقة كلما ارتفعنا.</p>' +
    '<div class="atomic-lab-choices">' + button('اصعد مستوى', 'up') + button('انزل مستوى', 'down') + '</div>' +
    status('levels') + '</div></div></section>' +
    '<section data-panel="broglie" hidden><div class="atomic-lab-grid">' + diagram('broglie', 'موجة توضيحية للإلكترون') +
    '<div class="atomic-lab-controls"><label>سرعة الإلكترون <input aria-label="سرعة الإلكترون" data-range="speed" dir="ltr" type="range" min="5" max="40" value="10"></label>' +
    status('broglie') + '<p>ثبّتنا كتلة الإلكترون. حرّك الشريط إلى اليمين لزيادة السرعة.</p></div></div></section>' +
    '<section data-panel="uncertainty" hidden><div class="atomic-lab-grid">' + diagram('uncertainty', 'عرض توزيعي الموضع وكمية الحركة', 640, 330) +
    '<div class="atomic-lab-controls"><label>عرض توزيع الموضع <input aria-label="عرض توزيع الموضع" data-range="width" dir="ltr" type="range" min="10" max="100" value="38"></label>' +
    status('uncertainty') + '<p>جرّب تضييق منحنى الموضع. الرسم يقارن عرض منحنيين في حالة تبلغ الحد الأدنى من عدم التعيين.</p></div></div></section>');
  if (wave) {
    const tabs = [...wave.querySelectorAll('[data-act="levels"], [data-act="broglie"], [data-act="uncertainty"]')];
    const panels = [...wave.querySelectorAll('[data-panel]')];
    const activate = (name) => {
      tabs.forEach(tab => tab.setAttribute('aria-pressed', tab.dataset.act === name));
      panels.forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
    };
    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.act)));
    activate('levels');
    let level = 2;
    const energy = (n) => -13.6 / n ** 2;
    const levelCanvas = one(wave, '[data-diagram="levels"]');
    const up = one(wave, '[data-act="up"]');
    const down = one(wave, '[data-act="down"]');
    const drawLevels = (from) => {
      const message = one(wave, '[data-status="levels"]');
      if (from === level) {
        message.innerHTML = '<strong>المستوى الحالي ' + value('n = ' + level) + '</strong>';
      } else {
        const difference = Math.abs(energy(level) - energy(from));
        message.innerHTML = '<strong>' + (level > from ? 'امتصاص فوتون' : 'انبعاث فوتون') +
          '</strong><br>' + value('n = ' + from + ' → ' + level) + ' · ' + value('|ΔE| = ' + difference.toFixed(2) + ' eV');
      }
      levelCanvas.setAttribute('aria-label', 'مستويات طاقة الهيدروجين. ' + message.textContent);
      up.disabled = level === 4;
      down.disabled = level === 1;
      const ctx = stage(levelCanvas);
      if (!ctx) return;
      const yFor = (n) => 35 - energy(n) * 16;
      for (let n = 1; n <= 4; n++) {
        const y = yFor(n);
        ctx.strokeStyle = n === level ? '#bafd9e' : '#93d8ac6d';
        ctx.lineWidth = n === level ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(138, y);
        ctx.lineTo(508, y);
        ctx.stroke();
        const labelY = [0, 252, 114, 77, 40][n];
        ctx.strokeStyle = '#93d8ac6d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(511, y);
        ctx.lineTo(540, labelY - 6);
        ctx.stroke();
        canvasText(ctx, 'n = ' + n, 550, labelY, n === level ? '#bafd9e' : '#a7e5be', 19);
      }
      if (from !== level) {
        const a = yFor(from);
        const b = yFor(level);
        const sign = Math.sign(b - a);
        ctx.strokeStyle = '#f6c77d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(318, a);
        ctx.lineTo(318, b);
        ctx.lineTo(311, b - sign * 9);
        ctx.moveTo(318, b);
        ctx.lineTo(325, b - sign * 9);
        ctx.stroke();
      }
      circle(ctx, 430, yFor(level), 8, '#def9c9');
    };
    up.addEventListener('click', () => { const previous = level++; drawLevels(previous); });
    down.addEventListener('click', () => { const previous = level--; drawLevels(previous); });
    drawLevels(level);

    const speed = one(wave, '[data-range="speed"]');
    const broglieCanvas = one(wave, '[data-diagram="broglie"]');
    const drawBroglie = () => {
      const speedMillion = Number(speed.value) / 10;
      const wavelengthNm = 6.62607015e-34 / (9.1093837e-31 * speedMillion * 1e6) * 1e9;
      const info = one(wave, '[data-status="broglie"]');
      info.innerHTML = '<strong>' + value('λ = h / (mv)') + '</strong><br>' +
        value('v = ' + speedMillion.toFixed(1) + ' × 10⁶ m/s') + '<br>' + value('λ ≈ ' + wavelengthNm.toFixed(3) + ' nm');
      speed.setAttribute('aria-valuetext', speedMillion.toFixed(1) + ' مليون متر في الثانية');
      broglieCanvas.setAttribute('aria-label', 'موجة دي برولي. ' + info.textContent);
      const ctx = stage(broglieCanvas);
      if (!ctx) return;
      ctx.strokeStyle = '#83caa370';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(26, 150);
      ctx.lineTo(614, 150);
      ctx.stroke();
      ctx.strokeStyle = '#bafd9e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let x = 26; x <= 614; x++) {
        const y = 150 + Math.sin((x - 26) / 588 * speedMillion * 1.5 * Math.PI * 2) * 60;
        if (x === 26) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    speed.addEventListener('input', drawBroglie);
    drawBroglie();

    const width = one(wave, '[data-range="width"]');
    const uncertaintyCanvas = one(wave, '[data-diagram="uncertainty"]');
    const drawUncertainty = () => {
      const t = (Number(width.value) - 10) / 90;
      const deltaX = .35 * (3.6 / .35) ** t;
      const deltaP = .5 / deltaX;
      const info = one(wave, '[data-status="uncertainty"]');
      info.innerHTML = '<strong>' + value('Δx × Δp ≥ ħ / 2') + '</strong><br>' +
        value('Δx ≈ ' + deltaX.toFixed(2)) + ' · ' + value('Δp ≈ ' + deltaP.toFixed(2)) +
        '<br>قيم نسبية في النموذج عند ' + value('ħ = 1');
      width.setAttribute('aria-valuetext', 'عرض الموضع ' + deltaX.toFixed(2));
      uncertaintyCanvas.setAttribute('aria-label', 'مقارنة عرض الموضع بكمية الحركة. ' + info.textContent);
      const ctx = stage(uncertaintyCanvas);
      if (!ctx) return;
      [[deltaX, 140, 'Δx', '#bafd9e'], [deltaP, 287, 'Δp', '#f6c77d']].forEach(([spread, base, text, color]) => {
        const sigma = spread * 40 + 13;
        ctx.beginPath();
        ctx.moveTo(38, base);
        ctx.lineTo(602, base);
        ctx.strokeStyle = '#93d8ac80';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(38, base);
        for (let x = 38; x <= 602; x++) {
          ctx.lineTo(x, base - 82 * Math.exp(-.5 * ((x - 320) / sigma) ** 2));
        }
        ctx.lineTo(602, base);
        ctx.fillStyle = color + '24';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.stroke();
        canvasText(ctx, text, 55, base - 19, color, 28);
      });
    };
    width.addEventListener('input', drawUncertainty);
    drawUncertainty();
  }

  const cloud = shell('cloud', '<h3>ارسم سحابة من قياسات متكرّرة</h3><div class="atomic-lab-grid">' +
    diagram('cloud', 'سحابة احتمالية حول نواة الذرة') +
    '<div class="atomic-lab-controls"><p>كل نقطة تمثّل موضعاً ممكناً عند قياس جديد على ذرة محضّرة في الحالة نفسها.</p>' +
    '<div class="atomic-lab-choices">' + button('أضف نقطة', 'dot') + button('أضف 100 نقطة', 'batch', 'atomic-lab-primary') +
    button('امسح النقاط', 'clear') + '</div>' + status('cloud') + '</div></div>');
  if (cloud) {
    const canvas = one(cloud, 'canvas');
    const points = [];
    const renderCloud = () => {
      const info = one(cloud, '[role="status"]');
      info.innerHTML = '<strong>عدد النقاط: ' + value(points.length) + '</strong>' +
        (points.length >= 80 ? '<br>يزداد تراكم النقاط قرب النواة.' : '');
      canvas.setAttribute('aria-label', 'سحابة احتمالية قرب النواة. عدد النقاط ' + points.length);
      const ctx = stage(canvas);
      if (!ctx) return;
      points.forEach(([x, y]) => circle(ctx, x, y, 2, '#bafd9e75'));
      nucleus(ctx, 320, 150);
    };
    const addPoints = (amount) => {
      for (let i = 0; i < amount && points.length < 5000; i++) {
        // The 1s radial distribution is a gamma distribution with shape 3.
        const radius = -Math.log((1 - Math.random()) * (1 - Math.random()) * (1 - Math.random())) * 16;
        const z = 2 * Math.random() - 1;
        const r = radius * Math.sqrt(1 - z ** 2);
        points.push(polar(320, 150, Math.min(r, 141), Math.random() * 2 * Math.PI));
      }
      renderCloud();
    };
    one(cloud, '[data-act="dot"]').addEventListener('click', () => addPoints(1));
    one(cloud, '[data-act="batch"]').addEventListener('click', () => addPoints(100));
    one(cloud, '[data-act="clear"]').addEventListener('click', () => { points.length = 0; renderCloud(); });
    addPoints(24);
  }

  const quantum = shell('quantum', '<h3>ابنِ عنواناً للإلكترون</h3><div class="atomic-lab-grid">' +
    diagram('orbitals', 'شكل المحط الإلكتروني') + '<div class="atomic-lab-controls">' +
    '<div class="atomic-lab-selects"><label>المستوى الرئيسي ' + value('n') + '<select data-select="n" dir="ltr"></select></label>' +
    '<label>نوع السوية الفرعية ' + value('ℓ') + '<select data-select="ell" dir="ltr"></select></label>' +
    '<label>العدد المغناطيسي ' + value('mℓ') + '<select data-select="magnetic" dir="ltr"></select></label>' +
    '<label>اللفّ الذاتي ' + value('mₛ') + '<select data-select="spin" dir="ltr"><option value="+½">+½ (↑)</option><option value="−½">−½ (↓)</option></select></label></div>' +
    status('quantum') + '</div></div>');
  if (quantum) {
    const [nSelect, ellSelect, magneticSelect, spinSelect] = [...quantum.querySelectorAll('select')];
    const canvas = one(quantum, 'canvas');
    const shellNames = 'KLMNOPQ';
    const subLevels = 'spdfghi';
    const setOptions = (select, entries, selected) => {
      select.innerHTML = entries.map(([key, label]) =>
        '<option value="' + key + '">' + label + '</option>').join('');
      select.value = selected;
    };
    const signed = (number) => number > 0 ? '+' + number : number < 0 ? '−' + Math.abs(number) : '0';
    setOptions(nSelect, [...shellNames].map((name, i) => [i + 1, (i + 1) + ' · ' + name]), 2);
    const types = ['كروي', 'مثال ذو فصّين', 'مثال ذو أربعة فصوص', 'مثال ذو ستة فصوص'];
    const drawOrbital = (ell) => {
      canvas.setAttribute('aria-label', 'نموذج لشكل محط ' + subLevels[ell] + (types[ell] ? '، ' + types[ell] : '، خارج نطاق أشكال الكتاب'));
      const ctx = stage(canvas);
      if (!ctx) return;
      const x = 320;
      const y = 144;
      ctx.strokeStyle = '#99d1ad55';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 138, y);
      ctx.lineTo(x + 138, y);
      ctx.moveTo(x, y + 118);
      ctx.lineTo(x, y - 119);
      ctx.stroke();
      canvasText(ctx, 'x', x + 143, y + 7, '#b1dcbf');
      canvasText(ctx, 'z', x - 6, y - 124, '#b1dcbf');
      if (ell === 0) {
        atomSphere(ctx, x, y, 83, true);
      } else if (ell <= 3) {
        const lobes = 2 * ell;
        for (let lobe = 0; lobe < lobes; lobe++) {
          const angle = (lobe + (ell === 2 ? .5 : 0)) * 2 * Math.PI / lobes;
          const [fx, fy] = polar(x, y, 63, angle);
          const tint = lobe % 2 ? '#729c95' : '#a7f3b2';
          const paint = ctx.createRadialGradient(fx, fy, 5, fx, fy, 72);
          paint.addColorStop(0, tint);
          paint.addColorStop(1, tint + '45');
          ctx.beginPath();
          ctx.moveTo(x, y);
          for (let i = 0; i <= 80; i++) {
            const u = i / 80;
            const theta = angle + (u * 2 - 1) * Math.PI / lobes;
            const radius = 103 * Math.sin(Math.PI * u) ** .8;
            ctx.lineTo(...polar(x, y, radius, theta));
          }
          ctx.closePath();
          ctx.fillStyle = paint;
          ctx.fill();
          ctx.strokeStyle = tint + '97';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      nucleus(ctx, x, y);
      canvasText(ctx, subLevels[ell], 41, 263, '#bafd9e', 41);
    };
    const updateQuantum = () => {
      const n = Number(nSelect.value);
      const ell = Number(ellSelect.value);
      const magnetic = Number(magneticSelect.value);
      const type = subLevels[ell];
      const info = one(quantum, '[role="status"]');
      info.innerHTML = '<strong>' + value('(n, ℓ, mℓ, mₛ) = (' + n + ', ' + ell + ', ' + signed(magnetic) + ', ' + spinSelect.value + ')') + '</strong><br>' +
        'السوية ' + value(n + type) + ' فيها ' + value(2 * ell + 1) + ' من المحطّات. سعتها ' + value(2 * (2 * ell + 1)) +
        ' إلكتروناً، وسعة المستوى الرئيسي ' + value(2 * n ** 2) + '.<br>' +
        (types[ell] ? 'يعرض الرسم مثالاً لشكل محط من النوع ' + value(type) + '، ولا يحدّد اتجاه المحط المختار.' :
          'هذا النوع متاح رياضياً عند هذه القيمة، وأشكاله خارج نطاق الكتاب.');
      drawOrbital(ell);
    };
    const updateMagneticOptions = () => {
      const ell = Number(ellSelect.value);
      const previous = Number(magneticSelect.value);
      const values = Array.from({ length: 2 * ell + 1 }, (_, i) => [i - ell, signed(i - ell)]);
      setOptions(magneticSelect, values, Math.max(-ell, Math.min(ell, previous)));
      updateQuantum();
    };
    const updateEllOptions = (initial = false) => {
      const n = Number(nSelect.value);
      const previous = initial ? 1 : Number(ellSelect.value);
      setOptions(ellSelect, Array.from({ length: n }, (_, i) => [i, i + ' · ' + subLevels[i]]), Math.min(n - 1, previous));
      updateMagneticOptions();
    };
    nSelect.addEventListener('change', () => updateEllOptions());
    ellSelect.addEventListener('change', updateMagneticOptions);
    magneticSelect.addEventListener('change', updateQuantum);
    spinSelect.addEventListener('change', updateQuantum);
    updateEllOptions(true);
  }

  const elements = [
    ['H', 'هيدروجين', 1], ['He', 'هيليوم', 2], ['Li', 'ليثيوم', 3], ['Be', 'بيريليوم', 4],
    ['B', 'بورون', 5], ['C', 'كربون', 6], ['N', 'نيتروجين', 7], ['O', 'أكسجين', 8],
    ['F', 'فلور', 9], ['Ne', 'نيون', 10], ['Na', 'صوديوم', 11], ['Mg', 'مغنيسيوم', 12],
    ['Al', 'ألمنيوم', 13], ['Si', 'سيليكون', 14], ['P', 'فوسفور', 15], ['S', 'كبريت', 16],
    ['Cl', 'كلور', 17], ['Ar', 'أرجون', 18], ['K', 'بوتاسيوم', 19], ['Ca', 'كالسيوم', 20],
    ['Cr', 'كروم', 24], ['Cu', 'نحاس', 29]
  ];
  const subshells = [['1s', 1], ['2s', 1], ['2p', 3], ['3s', 1], ['3p', 3], ['4s', 1], ['3d', 5]];
  const filling = shell('filling', '<h3>وزّع الإلكترونات بنفسك</h3><div class="atomic-lab-controls atomic-lab-filling-controls">' +
    '<label>اختر عنصراً <select data-select="element">' + elements.map(([symbol, name, z]) =>
      '<option value="' + symbol + '">' + name + ' · ' + symbol + ' (' + z + ')</option>').join('') + '</select></label>' +
    '<div class="atomic-lab-choices">' + button('أضف إلكتروناً', 'add', 'atomic-lab-primary') +
    button('خطوة للخلف', 'previous') + button('أظهر التوزيع الكامل', 'all') + button('ابدأ من جديد', 'reset') +
    '</div></div><div class="atomic-lab-orbitals" dir="ltr" data-orbitals></div>' + status('filling'));
  if (filling) {
    const select = one(filling, 'select');
    select.value = 'O';
    let added = 5;
    const renderFilling = () => {
      const [symbol, name, total] = elements.find(([symbol]) => symbol === select.value);
      const exception = symbol === 'Cr' || symbol === 'Cu';
      let remaining = added;
      let working = subshells.slice(0, total <= 2 ? 1 : total <= 4 ? 2 : total <= 10 ? 3 :
        total <= 12 ? 4 : total <= 18 ? 5 : total <= 20 ? 6 : 7);
      let lastFilled = -1;
      working = working.map(([label, boxes], index) => {
        const count = Math.min(remaining, exception && label === '4s' ? 1 : boxes * 2);
        if (count > 0) lastFilled = index;
        remaining -= count;
        return { label, boxes, count };
      });
      one(filling, '[data-orbitals]').innerHTML = working.map(({ label, boxes, count }, index) => {
        const arrows = Array.from({ length: boxes }, (_, box) => {
          const marks = (box < count ? '↑' : '') + (box + boxes < count ? '↓' : '');
          const accessible = marks === '↑↓' ? 'إلكترونان متعاكسا اللف' : marks ? 'إلكترون واحد' : 'محط فارغ';
          return '<span class="atomic-lab-box" role="img" aria-label="' + accessible + '">' + marks + '</span>';
        }).join('');
        return '<div class="atomic-lab-subshell' + (index === lastFilled ? ' atomic-lab-active-subshell' : '') + '">' +
          '<b>' + label + '</b><div class="atomic-lab-boxes">' + arrows + '</div></div>';
      }).join('');
      const config = working.filter(({ count }) => count > 0).map(({ label, count }) => label + '<sup>' + count + '</sup>').join(' ');
      const explanation = exception ?
        (symbol === 'Cr' ? 'الكروم حالة خاصة. توزيعه الأرضي ينتهي بـ ' + value('4s¹ 3d⁵') + '.' :
          'النحاس حالة خاصة. توزيعه الأرضي ينتهي بـ ' + value('4s¹ 3d¹⁰') + '.') :
        'في السوية الواحدة تظهر الأسهم المفردة أولاً، ثم يبدأ الازدواج.';
      one(filling, '[role="status"]').innerHTML = '<strong>' + name + ' · ' + value(added + ' / ' + total) +
        '</strong><br>' + (config ? value(config) + '<br>' : '') + explanation;
      one(filling, '[data-act="add"]').disabled = added === total;
      one(filling, '[data-act="all"]').disabled = added === total;
      one(filling, '[data-act="previous"]').disabled = added === 0;
      one(filling, '[data-act="reset"]').disabled = added === 0;
    };
    const updateCount = (change) => {
      added = change(added, elements.find(([symbol]) => symbol === select.value)[2]);
      renderFilling();
    };
    select.addEventListener('change', () => updateCount(() => 0));
    one(filling, '[data-act="add"]').addEventListener('click', () => updateCount(n => n + 1));
    one(filling, '[data-act="previous"]').addEventListener('click', () => updateCount(n => n - 1));
    one(filling, '[data-act="all"]').addEventListener('click', () => updateCount((n, max) => max));
    one(filling, '[data-act="reset"]').addEventListener('click', () => updateCount(() => 0));
    renderFilling();
  }
  const practice = document.getElementById('lab-practice');
  if (practice) practice.hidden = true;
}
