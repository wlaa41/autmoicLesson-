(() => {
  "use strict";

  const key = "atomic-structure-quantum-beginner-v1";
  const steps = QUANTUM_STEPS;
  const number = new Intl.NumberFormat("ar", { numberingSystem: "arab" });
  const el = (id) => document.getElementById("qb-" + id);
  const article = el("lesson");
  const summary = el("summary");
  const nav = el("step-links");
  const options = el("options");
  const feedback = el("feedback");
  const completed = new Set();
  let activeIndex = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved)) {
      for (const id of saved) if (steps.some((step) => step.id === id)) completed.add(id);
    }
  } catch {}

  function updateProgress() {
    el("progress").value = completed.size;
    el("progress-text").textContent = number.format(completed.size) + " من " + number.format(steps.length) + " خطوات مجابة بشكل صحيح";
    Array.from(nav.children).forEach((button, index) => {
      const done = completed.has(steps[index].id);
      button.dataset.completed = String(done);
      button.firstElementChild.textContent = done ? "✓" : number.format(index + 1);
      if (!article.hidden && index === activeIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function focusHeading(title) {
    title.focus({ preventScroll: true });
    title.closest("article").scrollIntoView({ block: "start", behavior: "instant" });
  }

  function handleAnswer(step, index) {
    const correct = index === step.check.correct;
    if (correct) {
      completed.add(step.id);
      try {
        localStorage.setItem(key, JSON.stringify([...completed]));
        if (completed.size === steps.length) {
          const courseKey = "atomic-structure-arabic-lessons-v1";
          const saved = JSON.parse(localStorage.getItem(courseKey));
          const courseDone = new Set(Array.isArray(saved) ? saved : []);
          courseDone.add("quantum");
          localStorage.setItem(courseKey, JSON.stringify([...courseDone]));
        }
      } catch {}
      updateProgress();
    }
    feedback.hidden = false;
    feedback.dataset.result = correct ? "correct" : "retry";
    feedback.textContent = (correct ? "أحسنت. " : "جرّب مرة أخرى. ") + step.check.explanation;
    Array.from(options.children).forEach((button, answerIndex) => {
      if (answerIndex === index) button.dataset.result = correct ? "correct" : "retry";
      else delete button.dataset.result;
    });
  }

  function showStep(index, focus = true) {
    activeIndex = index;
    const step = steps[index];
    summary.hidden = true;
    article.hidden = false;
    el("step-index").textContent = "الخطوة " + number.format(index + 1) + " من " + number.format(steps.length);
    el("step-title").textContent = step.title;
    el("step-lead").textContent = step.lead;
    const points = el("step-points");
    points.replaceChildren(...step.points.map((point) => {
      const item = document.createElement("li");
      item.innerHTML = point;
      return item;
    }));
    el("lab-hint").textContent = step.lesson;
    el("lab").replaceChildren();
    mountQuantumLab(el("lab"), step.id);
    el("book").open = false;
    el("book-copy").textContent = step.book;
    el("check-prompt").textContent = step.check.prompt;
    feedback.hidden = true;
    feedback.replaceChildren();
    options.replaceChildren(...step.check.options.map((answer, answerIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "qb-answer";
      const copy = document.createElement("bdi");
      copy.dir = "auto";
      copy.textContent = answer;
      button.append(copy);
      button.addEventListener("click", () => handleAnswer(step, answerIndex));
      return button;
    }));
    el("prev").disabled = index === 0;
    el("next").textContent = index === steps.length - 1 ? "راجع مثال الكتاب ←" : "الخطوة التالية ←";
    updateProgress();
    if (focus) focusHeading(el("step-title"));
  }

  function showSummary() {
    article.hidden = true;
    summary.hidden = false;
    el("result").textContent = completed.size === steps.length
      ? "أجبت عن الأسئلة الثمانية بشكل صحيح. استخدم الجدول لفكّ أي عنوان مشابه."
      : "أجبت عن " + number.format(completed.size) + " من " + number.format(steps.length) + " أسئلة بشكل صحيح. يمكنك العودة لأي خطوة ومراجعتها.";
    updateProgress();
    focusHeading(el("summary-title"));
  }

  steps.forEach((step, index) => {
    const button = document.createElement("button");
    button.className = "qb-nav-btn";
    button.type = "button";
    const badge = document.createElement("span");
    badge.setAttribute("aria-hidden", "true");
    button.append(badge, document.createTextNode(step.title));
    button.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 740px)").matches) el("map").open = false;
      showStep(index);
    });
    nav.append(button);
  });

  const desktop = window.matchMedia("(min-width: 741px)");
  el("map").open = desktop.matches;
  if (desktop.addEventListener) {
    desktop.addEventListener("change", ({ matches }) => { el("map").open = matches; });
  }
  el("prev").addEventListener("click", () => showStep(activeIndex - 1));
  el("next").addEventListener("click", () => {
    if (activeIndex + 1 < steps.length) showStep(activeIndex + 1);
    else showSummary();
  });
  el("review").addEventListener("click", () => {
    const pending = steps.findIndex((step) => !completed.has(step.id));
    showStep(pending === -1 ? 0 : pending);
  });
  const requested = steps.findIndex((step) => "#" + step.id === location.hash);
  showStep(requested < 0 ? 0 : requested, requested >= 0);
})();
