'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { buildSequence, coreTerms, glossary, quickChecks } from '@/data/lesson';

function AutoDir({ children }: { children: React.ReactNode }) {
  return <bdi dir="auto">{children}</bdi>;
}

export default function AtomicLesson() {
  const [stage, setStage] = useState(0);
  const [answered, setAnswered] = useState<Record<string, number>>({});
  const [showGlossary, setShowGlossary] = useState(false);
  const currentCheck = quickChecks[Math.min(stage, quickChecks.length - 1)];
  const progress = useMemo(() => Math.round(((stage + 1) / buildSequence.length) * 100), [stage]);

  function choose(answerIndex: number) {
    setAnswered((prev) => ({ ...prev, [currentCheck.id]: answerIndex }));
  }

  return (
    <main>
      <header className="topbar app-width">
        <a className="brand" href="#top">Madarat · درس الذرّة</a>
        <nav>
          <a href="#terms">القاموس</a>
          <a href="#build">ابنِ الفكرة</a>
          <Link href="/madarat/">مختبر المدارات</Link>
        </nav>
      </header>

      <section id="top" className="hero app-width">
        <div>
          <p className="eyebrow">من الصفر، بدون افتراض معرفة مسبقة</p>
          <h1>قبل الرموز: ما المشكلة التي نحاول حلّها؟</h1>
          <p className="hero-copy">نريد أن نفهم كيف تتوزّع الإلكترونات حول النواة. بعد ذلك فقط نستخدم كلمات مثل مستوى، مدار، و <span dir="ltr">n, ℓ, mℓ, ms</span>.</p>
          <div className="hero-actions">
            <a className="primary" href="#story">ابدأ بالصورة الكبيرة</a>
            <Link className="secondary" href="/madarat/">افتح المحاكاة</Link>
          </div>
        </div>
        <div className="hero-card" aria-label="مثال الأكسجين">
          <h2>مثال واحد نمشي عليه: الأكسجين</h2>
          <p>ذرّة الأكسجين المتعادلة فيها ٨ إلكترونات.</p>
          <div className="electron-row" aria-label="ثمانية إلكترونات">{Array.from({ length: 8 }).map((_, i) => <span key={i} />)}</div>
          <p className="mini-note">سنحوّل هذه النقاط لاحقاً إلى كتابة علمية: <bdi dir="ltr">1s² 2s² 2p⁴</bdi>.</p>
        </div>
      </section>

      <section id="story" className="section app-width">
        <p className="eyebrow">الصورة الكبيرة</p>
        <h2>القصة في خمس جمل</h2>
        <div className="story-grid">
          {[
            ['١', 'الذرّة لها نواة في المركز.'],
            ['٢', 'الإلكترونات لا نرسمها ككرات تدور في طريق ثابت.'],
            ['٣', 'نرسم خريطة احتمال: أين يمكن أن نجد الإلكترون غالباً؟'],
            ['٤', 'هذه الخرائط لها أحجام وأشكال مختلفة، فاحتجنا أسماءً لها.'],
            ['٥', 'الأعداد الكمومية هي “عنوان” يصف خريطة الإلكترون وحالته.'],
          ].map(([n, text]) => (
            <article key={n} className="story-card"><span>{n}</span><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section id="terms" className="section app-width two-col">
        <div>
          <p className="eyebrow">أولاً: القاموس</p>
          <h2>كل مصطلح قبل أن نستعمله</h2>
          <p>لن نكتب معادلة قبل أن نعرف الكلمات. افتح المصطلحات الأساسية، ثم انتقل للبناء خطوة بخطوة.</p>
          <button className="plain-button" onClick={() => setShowGlossary(!showGlossary)}>{showGlossary ? 'أخفِ القاموس الكامل' : 'اعرض القاموس الكامل'}</button>
        </div>
        <div className="term-list">
          {coreTerms.map((term) => (
            <details key={term.name} open>
              <summary><AutoDir>{term.name}</AutoDir></summary>
              <p>{term.simple}</p>
              <p className="why"><strong>لماذا يهم؟</strong> {term.why}</p>
            </details>
          ))}
          {showGlossary && glossary.map((term) => (
            <details key={term.name}>
              <summary><AutoDir>{term.name}</AutoDir></summary>
              <p>{term.simple}</p>
              <p className="why"><strong>لماذا يهم؟</strong> {term.why}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="build" className="section app-width lesson-builder">
        <div className="builder-head">
          <div>
            <p className="eyebrow">ثانياً: نبني على المصطلحات</p>
            <h2>{buildSequence[stage].title}</h2>
          </div>
          <div className="progress" aria-label={`التقدم ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="builder-layout">
          <aside className="step-nav">
            {buildSequence.map((item, index) => (
              <button key={item.id} onClick={() => setStage(index)} aria-current={stage === index ? 'step' : undefined}>
                <span>{index + 1}</span>{item.short}
              </button>
            ))}
          </aside>
          <article className="step-card">
            <p className="lead">{buildSequence[stage].bigIdea}</p>
            <div className="term-chip-row">
              {buildSequence[stage].terms.map((term) => <span key={term}>{term}</span>)}
            </div>
            <div className="explain-box">
              {buildSequence[stage].explain.map((line) => <p key={line}>{line}</p>)}
            </div>
            <div className="visual-box">
              <Visual stage={buildSequence[stage].visual} />
            </div>
            <div className="check-card">
              <h3>تأكد من فهمك قبل الانتقال</h3>
              <p>{currentCheck.prompt}</p>
              <div className="answer-grid">
                {currentCheck.options.map((option, index) => {
                  const selected = answered[currentCheck.id] === index;
                  const correct = index === currentCheck.correct;
                  return <button key={option} onClick={() => choose(index)} data-state={selected ? (correct ? 'correct' : 'wrong') : 'idle'}>{option}</button>;
                })}
              </div>
              {answered[currentCheck.id] !== undefined && <p className="feedback">{answered[currentCheck.id] === currentCheck.correct ? 'صحيح. ' : 'ليس بعد. '} {currentCheck.explanation}</p>}
            </div>
            <div className="pager">
              <button onClick={() => setStage(Math.max(0, stage - 1))} disabled={stage === 0}>السابق</button>
              <button onClick={() => setStage(Math.min(buildSequence.length - 1, stage + 1))} disabled={stage === buildSequence.length - 1}>التالي</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function Visual({ stage }: { stage: string }) {
  if (stage === 'oxygen') return <div className="oxygen-model"><div className="shell first"><span /><span /></div><div className="shell second">{Array.from({ length: 6 }).map((_, i) => <span key={i} />)}</div><b>O</b></div>;
  if (stage === 'cloud') return <div className="cloud-model">{Array.from({ length: 90 }).map((_, i) => <span key={i} style={{ transform: `translate(${Math.sin(i * 4.7) * (20 + (i % 7) * 7)}px, ${Math.cos(i * 2.9) * (12 + (i % 9) * 5)}px)` }} />)}</div>;
  if (stage === 'levels') return <div className="level-model"><span>n = 3</span><span>n = 2</span><span>n = 1</span></div>;
  if (stage === 'types') return <div className="shape-model"><div className="s">s</div><div className="p"><i /><i />p</div><div className="d"><i /><i /><i /><i />d</div></div>;
  if (stage === 'address') return <div className="address-model" dir="ltr"><b>(3, 2, 0, +½)</b><span>n</span><span>ℓ</span><span>mℓ</span><span>ms</span></div>;
  return <div className="capacity-model" dir="ltr"><p>3s: ↑↓</p><p>3p: ↑↓ ↑↓ ↑↓</p><p>3d: ↑↓ ↑↓ ↑↓ ↑↓ ↑↓</p></div>;
}
