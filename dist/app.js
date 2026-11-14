(() => {
  const numbers = new Intl.NumberFormat("ar", { numberingSystem: "arab" });
  const count = (value) => numbers.format(value);
  const completeKey = "atomic-structure-arabic-lessons-v1";
  const list = document.querySelector("#lesson-nav");
  const body = document.querySelector("#lesson-content");
  const progress = document.querySelector("#course-progress");
  const progressText = document.querySelector("#progress-text");
  let completed;

  try {
    const stored = JSON.parse(localStorage.getItem(completeKey));
    completed = new Set(Array.isArray(stored) ? stored : []);
  } catch {
    completed = new Set();
  }

  const listItems = (items) => items.map((item) => '<li>' + item + '</li>').join("");
  const shortTitles = ["تطوّر نموذج الذرّة","الموجة وعدم التعيين","المدار الذرّي","الأعداد الكمومية","قواعد توزيع الإلكترونات","أمثلة الكتاب والمراجعة"];

  LESSONS.forEach((lesson, index) => {
    const next = LESSONS[index + 1];
    const link = document.createElement("a");
    link.href = "#" + lesson.id;
    link.className = "nav-link";
    link.innerHTML = '<span class="nav-index" aria-hidden="true">' + count(index + 1) + '</span><span>' + shortTitles[index] + '</span>';
    list.append(link);

    const section = document.createElement("section");
    section.className = "lesson-card";
    section.id = lesson.id;
    section.setAttribute("aria-labelledby", "title-" + lesson.id);
    section.innerHTML =
      '<p class="chapter-label">الدرس ' + count(index + 1) + ' · ص ' + '<bdi dir="ltr">' + lesson.pages + '</bdi></p>' +
      '<h2 id="title-' + lesson.id + '">' + lesson.title + '</h2>' +
      '<p class="lesson-intro">' + lesson.intro + '</p>' +
      '<div class="lesson-lab" id="lab-' + lesson.id + '"></div>' +
      '<div class="lesson-bridge"><h3>كيف نعبّر عنها بلغة الكتاب؟</h3><ul>' + listItems(lesson.bridge) + '</ul></div>' +
      '<div class="worked"><h3>مثال محلول خطوة بخطوة</h3><ol>' + listItems(lesson.worked) + '</ol></div>' +
      '<details class="terms"><summary>مصطلحات الدرس</summary><dl>' +
      lesson.terms.map(([term, definition]) => '<dt>' + term + '</dt><dd>' + definition + '</dd>').join("") +
      '</dl></details><div class="lesson-actions"><button type="button" class="btn complete-btn" aria-pressed="false">تمّ الدرس</button>' +
      '<a class="next-link" href="#' + (next ? next.id : "test") + '">' + (next ? "الدرس التالي" : "ابدأ الاختبار") + ' <span aria-hidden="true">←</span></a></div>';
    body.append(section);

    section.querySelector(".complete-btn").addEventListener("click", () => {
      if (completed.has(lesson.id)) completed.delete(lesson.id);
      else completed.add(lesson.id);
      try { localStorage.setItem(completeKey, JSON.stringify([...completed])); } catch {}
      refreshProgress();
    });
  });

  function refreshProgress() {
    const finished = LESSONS.filter((lesson) => completed.has(lesson.id)).length;
    progress.value = finished;
    progressText.textContent = count(finished) + " من " + count(LESSONS.length) + " دروس مكتملة";
    LESSONS.forEach((lesson, index) => {
      const done = completed.has(lesson.id);
      const button = document.querySelector("#" + lesson.id + " .complete-btn");
      const link = list.children[index];
      link.classList.toggle("is-complete", done);
      link.querySelector(".nav-index").textContent = done ? "✓" : count(index + 1);
      button.setAttribute("aria-pressed", String(done));
      button.textContent = done ? "✓ تمّ الدرس" : "تمّ الدرس";
    });
  }

  function updateNavigation() {
    const active = [...LESSONS].reverse().find((lesson) => document.getElementById(lesson.id).getBoundingClientRect().top <= 155);
    for (const link of list.children) {
      if (active && link.hash === "#" + active.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  let navigationFrame;
  window.addEventListener("scroll", () => {
    if (navigationFrame) return;
    navigationFrame = requestAnimationFrame(() => { updateNavigation(); navigationFrame = null; });
  }, { passive: true });

  refreshProgress();
  initLabs();
  initQuiz();
  updateNavigation();
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  const canvas = document.querySelector("#hero-atom");
  const ctx = canvas.getContext("2d");
  let seed = 217;
  function rand() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  function normal() {
    return Math.sqrt(-2 * Math.log(Math.max(rand(), 0.000001))) * Math.cos(2 * Math.PI * rand());
  }
  function drawCloud() {
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const zoom = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * zoom);
    canvas.height = Math.round(height * zoom);
    ctx.scale(zoom, zoom);
    ctx.translate(width * .49, height * .48);
    const radius = Math.min(width * .40, height * .42);
    seed = 217;
    ctx.lineWidth = 1;
    for (let n = 1; n <= 3; n++) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * n / 3, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(186,172,246,.13)";
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-radius * 1.15, 0);
    ctx.lineTo(radius * 1.15, 0);
    ctx.moveTo(0, -radius * 1.12);
    ctx.lineTo(0, radius * 1.12);
    ctx.strokeStyle = "rgba(186,172,246,.18)";
    ctx.stroke();
    ctx.save();
    ctx.rotate(-Math.PI / 5);
    for (const side of [-1, 1]) {
      const colour = side < 0 ? "166,130,255" : "112,177,255";
      const glow = ctx.createRadialGradient(side * radius * .49, 0, 0, side * radius * .49, 0, radius * .61);
      glow.addColorStop(0, "rgba(" + colour + ",.27)");
      glow.addColorStop(1, "rgba(" + colour + ",0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-radius * 1.20, -radius, radius * 2.40, radius * 2);
      for (let i = 0; i < 2400; i++) {
        const x = normal() * .185 + .50;
        if (x < .06 || x > 1.03) continue;
        const y = normal() * Math.sin(Math.PI * x) * .185;
        const size = rand() * 1.6 + .6;
        ctx.fillStyle = "rgba(" + colour + "," + (.14 + rand() * .65) + ")";
        ctx.fillRect(side * radius * x, radius * y, size, size);
      }
    }
    ctx.restore();
    ctx.fillStyle = "#f1eaff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#d8c2ff";
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  try {
    new ResizeObserver(drawCloud).observe(canvas);
  } catch {
    window.addEventListener("resize", drawCloud);
    drawCloud();
  }
})();
