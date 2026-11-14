function mountQuantumLab(container, id) {
  const panel = document.createElement("div");
  panel.className = "qbl-lab";
  container.replaceChildren(panel);
  const ltr = (value) => '<bdi dir="ltr">' + value + '</bdi>';
  const math = (symbol, value) => ltr(symbol + ' = ' + value);
  const types = ["s", "p", "d", "f", "g", "h", "i"];
  const shellNames = ["K", "L", "M", "N", "O", "P", "Q"];
  const integer = (number) => number < 0 ? "−" + Math.abs(number) : number > 0 ? "+" + number : "0";
  const range = (length, offset = 0) => Array.from({ length }, (_, index) => index + offset);
  const one = (selector) => panel.querySelector(selector);

  function scaffold(label, instruction, extra = "") {
    panel.innerHTML = '<h3>' + label + '</h3><p class="qbl-instruction">' + instruction + '</p>' +
      '<div class="qbl-controls"></div>' + extra + '<p class="qbl-status" role="status" aria-live="polite"></p>';
  }

  function buttons(target, options, onChange, initial = null) {
    target.replaceChildren();
    for (const [value, label] of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = label;
      if (initial !== null) button.setAttribute("aria-pressed", String(value === initial));
      button.addEventListener("click", () => {
        if (initial !== null) {
          for (const sibling of target.children) sibling.setAttribute("aria-pressed", String(sibling === button));
        }
        onChange(value, button);
      });
      target.append(button);
    }
  }

  function setStatus(html) {
    one(".qbl-status").innerHTML = html;
  }

  if (id === "atom") {
    const parts = {
      nucleus: ["النواة", "في مركز الذرّة. تحتوي على البروتونات، وعلى النيوترونات في معظم الذرّات."],
      proton: ["البروتون", "جسيم موجب الشحنة داخل النواة."],
      neutron: ["النيوترون", "جسيم متعادل الشحنة داخل النواة."],
      electron: ["الإلكترون", "جسيم سالب الشحنة. تبيّن السحابة حول النواة المناطق التي يمكن أن نجده فيها عند القياس."]
    };
    scaffold("استكشف أجزاء الذرّة", "اضغط على اسم جزء وشاهد أين يقع في الرسم المبسّط.",
      '<figure class="qbl-atom" role="img" aria-label="سحابة إلكترونية تحيط بنواة فيها بروتونات ونيوترونات"><div class="qbl-atom-cloud" data-part="electron"></div><div class="qbl-nucleus" data-part="nucleus"><span data-part="proton">+</span><span data-part="neutron">0</span><span data-part="neutron">0</span><span data-part="proton">+</span></div></figure>');
    function spotlight(key) {
      for (const part of panel.querySelectorAll("[data-part]")) {
        part.classList.toggle("qbl-highlight", part.dataset.part === key);
      }
      setStatus('<strong>' + parts[key][0] + '</strong> · ' + parts[key][1]);
    }
    buttons(one(".qbl-controls"), Object.entries(parts).map(([key, part]) => [key, part[0]]), spotlight, "nucleus");
    spotlight("nucleus");
  }

  if (id === "orbital") {
    scaffold("كوّن سحابة من النقاط", "في هذه المحاكاة، كل نقطة تمثّل نتيجة قياس في تجربة مستقلة.",
      '<canvas class="qbl-canvas" width="480" height="220" role="img" aria-label="توزيع نقاط حول النواة، تزداد كثافتها قرب المركز"></canvas>');
    const canvas = one("canvas");
    const context = canvas.getContext("2d");
    const points = [];
    let seed = 9021;

    function random() {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    function draw() {
      if (!context) return;
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      context.fillStyle = "#f5f3ff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(98, 63, 181, 0.32)";
      for (const point of points) {
        context.beginPath();
        context.arc(x + point[0], y + point[1], 2.35, 0, Math.PI * 2);
        context.fill();
      }
      context.fillStyle = "#25203a";
      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fill();
      context.font = "15px Arial";
      context.textAlign = "center";
      context.fillText("النواة", x, y + 23);
    }

    function add(count) {
      for (let index = 0; index < count && points.length < 600; index++) {
        const angle = 2 * Math.PI * random();
        const radius = Math.min(102, -27 * Math.log(Math.max(random(), 0.00001)));
        points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
      }
      draw();
      const note = points.length === 0 ? "ابدأ بقياس واحد، ثم أضف المزيد لترى النمط." :
        points.length < 10 ? "نحتاج إلى قياسات أكثر لترى أين تتجمّع النقاط." :
        "لاحظ أن النقاط تتجمّع قرب النواة. كثرة النقاط تعني احتمالاً أكبر للعثور على الإلكترون في تلك المنطقة.";
      setStatus("عدد القياسات " + ltr(points.length) + ' · ' + note);
    }

    buttons(one(".qbl-controls"), [[1, "أضف قياساً"], [30, "أضف ٣٠ قياساً"], [0, "امسح النقاط"]], (value) => {
      if (!value) {
        points.length = 0;
        seed = 9021;
      }
      add(value);
    });
    add(0);
  }

  if (id === "n") {
    scaffold("شاهد الضوء ثم اختر مستوى", "اضغط الزر لرؤية أربعة خطوط مرئية من ضوء الهيدروجين. الرسم يقرّب ألوانها.",
      '<div class="qbl-spectrum-demo"><button type="button" class="qbl-spectrum-toggle" aria-expanded="false" aria-controls="qbl-spectrum-data">أظهر خطوط ضوء الهيدروجين</button>' +
      '<div id="qbl-spectrum-data" hidden><div class="qbl-spectrum" role="img" aria-label="أربعة خطوط مرئية للهيدروجين: بنفسجي، أزرق بنفسجي، أزرق مخضر، وأحمر"><i></i><i></i><i></i><i></i></div>' +
      '<p class="qbl-note">تظهر خطوط بألوان محدّدة. كل خط يمثّل ضوءاً خرج عند انتقال بين مستويين. الأشكال الكروية وغيرها تظهر في تجربة الخطوة التالية.</p></div></div>' +
      '<div class="qbl-level-controls qbl-controls" aria-label="اختر مستوى رئيسياً"></div><div class="qbl-floors" aria-hidden="true"></div>');
    const spectrum = one("#qbl-spectrum-data");
    const spectrumToggle = one(".qbl-spectrum-toggle");
    spectrumToggle.addEventListener("click", () => {
      spectrum.hidden = !spectrum.hidden;
      spectrumToggle.setAttribute("aria-expanded", String(!spectrum.hidden));
      spectrumToggle.textContent = spectrum.hidden ? "أظهر خطوط ضوء الهيدروجين" : "أخفِ خطوط ضوء الهيدروجين";
    });
    one(".qbl-controls").remove();
    const floorControls = one(".qbl-level-controls");
    const floors = one(".qbl-floors");
    floors.innerHTML = range(7, 1).reverse().map((n) => '<div data-floor="' + n + '">' + ltr("n = " + n) + '</div>').join("");
    function showFloor(n) {
      for (const floor of floors.children) floor.classList.toggle("qbl-selected", Number(floor.dataset.floor) === n);
      setStatus("اخترت المستوى رقم " + ltr(n) + ". رمزه في الكتاب " + ltr(shellNames[n - 1]) + "، ونكتب " + math("n", n) + ".");
    }
    buttons(floorControls, range(7, 1).map((n) => [n, "المستوى " + ltr(n)]), showFloor, 1);
    showFloor(1);
  }

  if (id === "l") {
    scaffold("المستوى أولاً، ثم نوع السحابة", "ابدأ بالمستوى الثاني. بعد أن تقارن نوعيه، غيّر المستوى لترى ما يظهر.",
      '<p class="qbl-choice-heading">٢. اختر نوع السحابة</p><div class="qbl-controls qbl-second" aria-label="اختر نوع السحابة"></div>' +
      '<div class="qbl-shape" role="img"></div>');
    const levels = one(".qbl-controls");
    const levelHeading = document.createElement("p");
    levelHeading.className = "qbl-choice-heading";
    levelHeading.textContent = "١. اختر مستوى";
    levels.before(levelHeading);
    const shape = one(".qbl-shape");
    const shapeLabel = ["كروي", "جزآن بارزان", "أشكال متنوّعة", "أشكال أكثر تنوّعاً"];
    const cloudLabel = ["سحابة كروية", "سحابة لها جزآن بارزان على جانبي النواة", "مثال لسحابة لها أربعة أجزاء بارزة", "مثال لسحابة لها ثمانية أجزاء بارزة"];
    const options = ["الأول", "الثاني", "الثالث", "الرابع"];
    let shell = 2;

    function chooseType(l) {
      shape.dataset.shape = types[l];
      shape.setAttribute("aria-label", cloudLabel[l]);
      shape.innerHTML = '<span></span>'.repeat([1, 2, 4, 8][l]);
      setStatus("نقرأ " + ltr(shell + types[l]) + " هكذا. الرقم " + ltr(shell) + " للمستوى، والحرف " + ltr(types[l]) +
        " لنوع السحابة. رقم هذا النوع " + math("ℓ", l) + ". " + cloudLabel[l] + ".");
    }

    function chooseShell(n) {
      shell = n;
      buttons(one(".qbl-second"), range(n).map((l) => [l, ltr(types[l]) + " · " + shapeLabel[l]]), chooseType, 0);
      chooseType(0);
    }

    buttons(levels, options.map((name, index) => [index + 1, "المستوى " + name]), chooseShell, 2);
    chooseShell(2);
  }

  if (id === "ml") {
    scaffold("اكتشف أرقام المدارات في السوية الفرعية", "اختر نوع السوية الفرعية، ثم اضغط على رقم مدار داخلها.",
      '<div class="qbl-controls qbl-second qbl-orbital-boxes" dir="ltr" aria-label="قيم العدد المغناطيسي"></div><p class="qbl-note">الخانات تساعد على العدّ. رسم اتجاهات المدارات مثل <bdi dir="ltr">p<sub>x</sub></bdi> و<bdi dir="ltr">p<sub>y</sub></bdi> يستخدم طريقة أخرى لوصف الأشكال.</p>');
    function showOrbitals(l) {
      function report(m) {
        setStatus("داخل السوية " + ltr(types[l]) + " توجد " + ltr(2 * l + 1) +
          " خانات. اخترت الخانة ذات العدد المغناطيسي " + math("m<sub>ℓ</sub>", integer(m)) + ".");
      }
      buttons(one(".qbl-second"), range(2 * l + 1, -l).map((m) => [m, integer(m)]), report, 0);
      report(0);
    }
    buttons(one(".qbl-controls"), range(4).map((l) => [l, ltr(types[l] + " · ℓ = " + l)]), showOrbitals, 1);
    showOrbitals(1);
  }

  if (id === "ms") {
    scaffold("جرّب ملء مدار واحد", "اختر سهم الإلكترون الأول، ثم جرّب السهم نفسه أو السهم المقابل.",
      '<div class="qbl-spin-box" aria-label="المدار" dir="ltr">□</div>');
    let first = null;
    let second = null;
    function drawBox() {
      const box = one(".qbl-spin-box");
      box.textContent = (first || "") + (second || "") || "□";
      box.setAttribute("aria-label", "المدار " + (second ? "فيه إلكترونان" : first ? "فيه إلكترون واحد" : "فارغ"));
    }
    buttons(one(".qbl-controls"), [["↑", ltr("↑ +½")], ["↓", ltr("↓ −½")], [null, "أفرغ المدار"]], (arrow) => {
      if (arrow === null) {
        first = second = null;
        setStatus("المدار فارغ. اختر سهماً لإضافة الإلكترون الأول.");
      } else if (!first) {
        first = arrow;
        setStatus("أضفت إلكتروناً واحداً. أيّ سهم تختار للإلكترون الثاني؟");
      } else if (second) {
        setStatus("المدار ممتلئ بإلكترونين. أفرغه لتجربة ترتيب آخر.");
      } else if (first === arrow) {
        setStatus("هذا السهم مماثل لسهم الإلكترون الأول. لم يُضَف إلكترون. جرّب السهم المقابل.");
      } else {
        second = arrow;
        setStatus("أضفت إلكترونين في المدار نفسه. لهما سهمان متعاكسان.");
      }
      drawBox();
    });
    setStatus("المدار فارغ. اختر سهماً لإضافة الإلكترون الأول.");
  }

  if (id === "address") {
    scaffold("فكّ رموز عنوان واحد", "اضغط على كل قيمة لتكتشف مكانها في العنوان.",
      '<p class="qbl-math-line" dir="ltr"><bdi>(n, ℓ, m<sub>ℓ</sub>, m<sub>s</sub>) = (3, 2, 0, +½)</bdi></p>');
    const messages = [
      'القيمة الأولى ' + ltr("3") + ' تحدد المستوى الرئيسي الثالث، واسمه ' + ltr("M") + ".",
      'القيمة الثانية ' + ltr("2") + ' تحدد النوع ' + ltr("d") + '، ومع المستوى الثالث يصبح الاسم ' + ltr("3d") + ".",
      'القيمة الثالثة ' + ltr("0") + ' تختار خانة من الخانات الخمس في ' + ltr("3d") + ".",
      'القيمة الرابعة ' + ltr("+½") + ' تخصّ هذا الإلكترون وتمثّلها إشارة السهم ' + ltr("↑") + "."
    ];
    buttons(one(".qbl-controls"), ["3", "2", "0", "+½"].map((value, index) => [index, ltr(value)]),
      (step) => setStatus(messages[step]), 0);
    one(".qbl-controls").dir = "ltr";
    setStatus(messages[0]);
  }

  if (id === "capacity") {
    scaffold("احسب السعة خانةً خانة", "اضغط على 3s و3p و3d لإضافتها إلى مجموع المستوى الثالث. اضغط ثانيةً لإزالة أي سوية.",
      '<div class="qbl-capacity-grid"></div>');
    const selected = new Set();
    const grid = one(".qbl-capacity-grid");
    function updateCapacity() {
      grid.innerHTML = [1, 3, 5].map((count, l) =>
        '<div class="qbl-capacity-row' + (selected.has(l) ? ' qbl-counted' : '') + '"><strong>' + ltr("3" + types[l]) +
        '</strong><div dir="ltr" aria-label="' + count + ' مدارات">' +
        '<span aria-hidden="true">↑↓</span>'.repeat(count) + '</div><bdi dir="ltr">' + count * 2 + '</bdi></div>').join("");
      const count = [...selected].sort().map((l) => 2 * (2 * l + 1));
      if (!count.length) {
        setStatus("ابدأ بسوية واحدة. السهمان في كل خانة يبيّنان أنها تتّسع لإلكترونين.");
        return;
      }
      const total = count.reduce((sum, value) => sum + value, 0);
      const formula = count.length > 1 ? ltr(count.join(" + ") + " = " + total) : ltr(total);
      setStatus("المجموع المختار " + formula + " إلكتروناً." +
        (selected.size === 3 ? " هذه سعة المستوى الثالث كاملاً." : ""));
    }
    buttons(one(".qbl-controls"), [0, 1, 2].map((l) => [l, ltr("3" + types[l])]), (l, button) => {
      if (selected.has(l)) selected.delete(l);
      else selected.add(l);
      button.setAttribute("aria-pressed", String(selected.has(l)));
      updateCapacity();
    });
    for (const button of one(".qbl-controls").children) button.setAttribute("aria-pressed", "false");
    updateCapacity();
  }
}
