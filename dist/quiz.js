function initQuiz() {
  const mount = document.getElementById('quiz-app');
  if (!mount) return;

  const notation = (value) => `<bdi class="quiz-notation" dir="ltr">${value}</bdi>`;
  const boxes = (...arrows) => `<span class="quiz-orbitals" dir="ltr">${arrows.map((value) => `<span>${value}</span>`).join('')}</span>`;
  const number = (value) => new Intl.NumberFormat('ar').format(value);
  const stages = ['الفكرة ببساطة', 'الرموز والقواعد', 'مستوى الكتاب'];
  const questions = [
    {
      stage: 0,
      prompt: 'مرّت معظم جسيمات ألفا عبر صفيحة الذهب، وانحرف عدد قليل بشدة. ماذا استنتج رذرفورد؟',
      options: ['معظم الذرة فراغ، وفي مركزها نواة صغيرة موجبة.', 'الشحنة الموجبة موزّعة بالتساوي في الذرة.', 'الذرة كرة مصمتة ومتجانسة.'],
      correct: 0,
      reason: 'مرور معظم الجسيمات يدل على أن معظم حجم الذرة فراغ. والانحراف الشديد لبعضها يدل على تركّز الشحنة الموجبة في نواة صغيرة.',
    },
    {
      stage: 0,
      prompt: `في نموذج بور، ماذا يحدث عندما ينتقل إلكترون الهيدروجين من ${notation('n = 3')} إلى ${notation('n = 2')}؟`,
      options: ['يمتص فوتوناً.', 'يصدر فوتوناً.', 'تبقى طاقته كما هي.'],
      correct: 1,
      reason: 'ينتقل الإلكترون إلى مستوى أدنى طاقة، فيصدر فوتوناً طاقته تساوي الفرق بين المستويين.',
    },
    {
      stage: 0,
      prompt: 'إذا تضاعفت سرعة إلكترون وبقيت كتلته ثابتة، ماذا يحدث لطول موجة دي برولي بحسب العلاقة في الكتاب؟',
      options: ['يتضاعف.', 'يبقى ثابتاً.', 'يصبح نصف قيمته.'],
      correct: 2,
      reason: `من ${notation('λ = h/(mv)')}، الطول الموجي يتناسب عكسياً مع السرعة عند ثبات الكتلة. مضاعفة المقام تقسم الناتج على اثنين.`,
    },
    {
      stage: 0,
      prompt: 'بحسب مبدأ هايزنبرغ، إذا قلّ عدم التعيّن في موضع الإلكترون كثيراً، فماذا يلزم أن يحدث للحد الأدنى لعدم التعيّن في كمية حركته؟',
      options: ['يزداد.', 'يقلّ بالمقدار نفسه.', 'يبقى صفراً.'],
      correct: 0,
      reason: 'كلما ضاق نطاق المواضع المحتملة، ازداد الحد الأدنى لاتساع نطاق قيم كمية الحركة. يتعذّر تحديدهما معاً بدقة غير محدودة.',
    },
    {
      stage: 0,
      prompt: 'ماذا يعني أن نقاط سحابة الإلكترون أكثر كثافة في منطقة من الرسم؟',
      options: ['يمر الإلكترون دائماً في هذه المنطقة.', 'احتمال العثور على الإلكترون فيها أعلى.', 'يوجد إلكترون عند كل نقطة.'],
      correct: 1,
      reason: 'الرسم يمثّل توزيع الاحتمال حول النواة. كثافة النقاط الأعلى تعني احتمالاً أعلى لكل مساحة مماثلة في الرسم.',
    },
    {
      stage: 1,
      prompt: `ما قيمة العدد الكمّي الرئيسي وسعة المستوى ${notation('M')} القصوى؟`,
      options: [`${notation('n = 2')} وسعته ٨ إلكترونات.`, `${notation('n = 3')} وسعته ٨ إلكترونات.`, `${notation('n = 3')} وسعته ١٨ إلكتروناً.`],
      correct: 2,
      reason: `المستوى ${notation('M')} هو الثالث. بالتعويض في ${notation('2n²')} نجد ${notation('2 × 3² = 18')} إلكتروناً.`,
    },
    {
      stage: 1,
      prompt: `أي مجموعة من القيم تصف المستوى الفرعي ${notation('3d')}؟`,
      options: [`${notation('n = 3, ℓ = 2')} وله خمسة مدارات.`, `${notation('n = 3, ℓ = 3')} وله سبعة مدارات.`, `${notation('n = 2, ℓ = 1')} وله ثلاثة مدارات.`],
      correct: 0,
      reason: `الرقم ٣ يحدّد ${notation('n')}، والحرف ${notation('d')} يقابل ${notation('ℓ = 2')}. قيم ${notation('m<sub>ℓ</sub>')} هي ${notation('−2, −1, 0, +1, +2')}.`,
    },
    {
      stage: 1,
      prompt: `أيّ اختيار يصف عدد مدارات المستوى الفرعي ${notation('f')} وعدد إلكتروناته عند الامتلاء؟`,
      options: ['٣ مدارات و٦ إلكترونات.', '٥ مدارات و١٠ إلكترونات.', '٧ مدارات و١٤ إلكتروناً.'],
      correct: 2,
      reason: `للمستوى الفرعي ${notation('f')} قيمة ${notation('ℓ = 3')}، وعدد مداراته ${notation('2ℓ + 1 = 7')}. يسع كل مدار إلكترونين، فالسعة ١٤.`,
    },
    {
      stage: 1,
      prompt: `أين تضع ثلاثة إلكترونات في مدارات ${notation('p')} الثلاثة وفق قاعدة هوند؟`,
      options: [boxes('↑↓', '↑', '—'), boxes('↑', '↓', '↑'), boxes('↑', '↑', '↑')],
      correct: 2,
      reason: 'تشغل الإلكترونات المدارات المتساوية في الطاقة فرادى بلفّ ذاتي متوازٍ أولاً. يبدأ الازدواج بعد أن يشغل إلكترونٌ كلَّ مدار منها.',
    },
    {
      stage: 1,
      prompt: 'أي تمثيل لإلكترونين في المدار نفسه يخالف مبدأ باولي؟',
      options: [boxes('↑↓'), boxes('↑↑')],
      correct: 1,
      reason: `يتفق إلكترونا المدار الواحد في ${notation('n, ℓ, m<sub>ℓ</sub>')}، ولذلك يجب أن يختلفا في ${notation('mₛ')}. السهمان في الاتجاه نفسه يعطيان الإلكترونين الأعداد الكمّية الأربعة ذاتها.`,
    },
    {
      stage: 2,
      prompt: `رتّب ${notation('2s, 4p, 3d, 5f')} تصاعدياً بحسب ترتيب الملء الذي يعرضه الكتاب.`,
      options: [notation('2s → 4p → 3d → 5f'), notation('3d → 2s → 4p → 5f'), notation('2s → 3d → 4p → 5f')],
      correct: 2,
      reason: `عند تساوي مجموع ${notation('n + ℓ')} يأخذ الأصغر في ${notation('n')} الأولوية. لكلٍّ من ${notation('3d')} و${notation('4p')} مجموع يساوي ٥، لذا يسبق ${notation('3d')} المستوى ${notation('4p')}.`,
    },
    {
      stage: 2,
      prompt: `توزيع الأكسجين المتعادل هو ${notation('1s² 2s² 2p⁴')}. ما توزيع الفلور المتعادل، وهو العنصر التالي؟`,
      options: [notation('1s² 2s² 2p⁵'), notation('1s² 2s² 2p⁶'), notation('1s² 2s² 2p⁴ 3s¹')],
      correct: 0,
      reason: `للأكسجين ٨ إلكترونات وللفلور ٩. يتّسع ${notation('2p')} لستة إلكترونات، لذا يدخل إليه الإلكترون التاسع ويصبح ${notation('2p⁵')}.`,
    },
    {
      stage: 2,
      prompt: `ينتهي توزيع الفوسفور ${notation('P')} في ${notation('3p')}. قارن نهاية توزيعه مع الأرغون ${notation('Ar')}.`,
      options: [`${notation('P: 3p⁵')} و${notation('Ar: 3p⁶')}`, `${notation('P: 3p³')} و${notation('Ar: 3p⁶')}`, `${notation('P: 3p³')} و${notation('Ar: 4s¹')}`],
      correct: 1,
      reason: `التوزيع المشترك قبل ${notation('3p')} هو ${notation('1s² 2s² 2p⁶ 3s²')} وفيه ١٢ إلكتروناً. الفوسفور لديه ١٥ إلكتروناً، والأرغون ١٨، فيتبقّى في ${notation('3p')} ثلاثة وستة على الترتيب.`,
    },
    {
      stage: 2,
      prompt: `للبوتاسيوم ${notation('K')} المتعادل ١٩ إلكتروناً. أين يذهب الإلكترون بعد توزيع الأرغون ${notation('[Ar]')}؟`,
      options: [notation('3d¹'), notation('3p⁷'), notation('4s¹')],
      correct: 2,
      reason: `الرمز ${notation('[Ar]')} يختصر أول ١٨ إلكتروناً. يمتلئ ${notation('3p')} عند ٦ إلكترونات، ويأتي ${notation('4s')} قبل ${notation('3d')} في ترتيب الملء المستخدم هنا.`,
    },
    {
      stage: 2,
      prompt: `أي توزيعَين يطابقان حالة الاستقرار للكروم ${notation('Cr')} والنحاس ${notation('Cu')}؟`,
      options: [`${notation('Cr: [Ar] 4s¹ 3d⁵')} و${notation('Cu: [Ar] 4s¹ 3d¹⁰')}`, `${notation('Cr: [Ar] 4s² 3d⁴')} و${notation('Cu: [Ar] 4s² 3d⁹')}`, `${notation('Cr: [Ar] 4s¹ 3d⁵')} و${notation('Cu: [Ar] 4s² 3d⁹')}`],
      correct: 0,
      reason: `الكروم والنحاس من استثناءات ترتيب الملء البسيط. للكروم مستوى فرعي ${notation('3d⁵')} نصف ممتلئ، وللنحاس ${notation('3d¹⁰')} ممتلئ. يبقى إلكترون واحد في ${notation('4s')} في الحالتين.`,
    },
  ];

  let index = 0;
  const answers = [];

  function focusHeading() {
    mount.querySelector('.quiz-heading').focus();
  }

  function reset() {
    index = 0;
    answers.length = 0;
    render();
    focusHeading();
  }

  function takeAnswer(selected) {
    if (answers.length > index) return;
    const question = questions[index];
    const correct = selected === question.correct;
    answers[index] = selected;
    mount.querySelectorAll('.quiz-option').forEach((button, optionIndex) => {
      button.setAttribute('aria-disabled', 'true');
      if (optionIndex === question.correct) {
        button.classList.add('is-correct');
        button.querySelector('.quiz-option-status').textContent = 'الإجابة الصحيحة';
      } else if (optionIndex === selected) {
        button.classList.add('is-incorrect');
        button.querySelector('.quiz-option-status').textContent = 'اختيارك';
      }
    });
    const feedback = mount.querySelector('.quiz-feedback');
    feedback.classList.add(correct ? 'is-correct' : 'is-incorrect');
    feedback.innerHTML = `<strong>${correct ? 'إجابة صحيحة' : 'الإجابة الصحيحة'} </strong>${correct ? '' : question.options[question.correct]}<p>${question.reason}</p>`;
    mount.querySelector('.quiz-progress').value = answers.length;
    mount.querySelector('.quiz-next').disabled = false;
  }

  function renderFinish() {
    const correctCount = answers.filter((answer, position) => answer === questions[position].correct).length;
    const recap = stages.map((stage, stageIndex) => {
      const total = questions.filter((question) => question.stage === stageIndex).length;
      const right = answers.filter((answer, position) => questions[position].stage === stageIndex && answer === questions[position].correct).length;
      return `<li><span>${stage}</span><strong>${number(right)} من ${number(total)}</strong></li>`;
    }).join('');
    const corrections = questions.flatMap((question, position) => {
      if (answers[position] === question.correct) return [];
      return [`<li><p><strong>${question.prompt}</strong></p><p>الإجابة الصحيحة ${question.options[question.correct]}</p><p>${question.reason}</p></li>`];
    }).join('');
    mount.innerHTML = `<div class="quiz-result">
      <h3 class="quiz-heading" tabindex="-1">نتيجتك ${number(correctCount)} من ${number(questions.length)}</h3>
      <ul class="quiz-stage-scores">${recap}</ul>
      ${corrections ? `<details class="quiz-review"><summary>راجع الأسئلة التي أخطأت فيها</summary><ul>${corrections}</ul></details>` : '<p>أجبت عن جميع الأسئلة إجابة صحيحة.</p>'}
      <button type="button" class="quiz-next quiz-restart">أعد الاختبار</button>
    </div>`;
    mount.querySelector('.quiz-restart').addEventListener('click', reset);
  }

  function render() {
    if (index === questions.length) {
      renderFinish();
      return;
    }
    const question = questions[index];
    mount.innerHTML = `<div class="quiz-topline">
      <span class="quiz-stage">${stages[question.stage]}</span>
      <span>السؤال ${number(index + 1)} من ${number(questions.length)}</span>
    </div>
    <progress class="quiz-progress" aria-label="عدد الأسئلة المجاب عنها" max="${questions.length}" value="${answers.length}"></progress>
    <h3 class="quiz-heading" tabindex="-1">${question.prompt}</h3>
    <div class="quiz-options" role="group" aria-label="خيارات الإجابة">
      ${question.options.map((option, optionIndex) => `<button type="button" class="quiz-option" data-index="${optionIndex}"><span>${option}</span><span class="quiz-option-status"></span></button>`).join('')}
    </div>
    <div class="quiz-feedback" role="status"></div>
    <div class="quiz-actions">
      <button type="button" class="quiz-next" disabled>${index === questions.length - 1 ? 'اعرض نتيجتي' : 'السؤال التالي'}</button>
      ${index > 0 ? '<button type="button" class="quiz-reset">ابدأ من جديد</button>' : ''}
    </div>`;
    mount.querySelectorAll('.quiz-option').forEach((button) => {
      button.addEventListener('click', () => takeAnswer(Number(button.dataset.index)));
    });
    mount.querySelector('.quiz-next').addEventListener('click', () => {
      index += 1;
      render();
      focusHeading();
    });
    mount.querySelector('.quiz-reset')?.addEventListener('click', reset);
  }

  render();
}
