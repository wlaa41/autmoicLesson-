'use client';

import { useId, useState } from 'react';
import OrbitalArt from './OrbitalArt';
import './probability-story.css';

type Pattern = 'round' | 'two-sides';
type Sample = { x: number; y: number };

// Independent samples from the normalised hydrogen position distributions.
// 1s: radial Gamma(3, rate 2), uniform solid angle.
// 2pz: radial Gamma(5, rate 1), angular density 3 cos²(theta)/(4 pi).
// Project x,z onto the page; y is integrated out by sampling all directions.
// The plotting magnification differs deliberately, and is explained in the UI.
function samplePositions(pattern: Pattern, count: number): Sample[] {
  const shape = pattern === 'round' ? 3 : 5;
  const rate = pattern === 'round' ? 2 : 1;
  const scale = pattern === 'round' ? 43 : 14;
  return Array.from({ length: count }, () => {
    let radius = 0;
    for (let i = 0; i < shape; i++) radius -= Math.log(1 - Math.random()) / rate;
    const uniform = 2 * Math.random() - 1;
    const cosine = pattern === 'round' ? uniform : Math.cbrt(uniform);
    const angle = 2 * Math.PI * Math.random();
    return {
      x: 220 + scale * radius * Math.sqrt(1 - cosine * cosine) * Math.cos(angle),
      y: 174 - scale * radius * cosine,
    };
  });
}

const questions = [
  {
    question: 'ظهرت خمسون نقطة. هل صار في الذرّة خمسون إلكتروناً؟',
    answer: 'لا. كل نقطة نتيجة محاولة مستقلة، نبدأ فيها بإلكترون واحد في الحالة نفسها. جمعنا نتائج خمسين محاولة على لوحة واحدة كي نرى النمط. لم نضف خمسين إلكتروناً إلى ذرّة واحدة.',
  },
  {
    question: 'ظهر تجمع في الأعلى وآخر في الأسفل. هل انقسم الإلكترون إلى قطعتين؟',
    answer: 'لا. النمط يصف أين يمكن أن تسجّل كل محاولة نتيجة. قد تسجّل محاولة نتيجة في الأعلى، وتسجّل محاولة أخرى نتيجة في الأسفل. الجزآن يخصّان وصفاً واحداً لإلكترون واحد؛ لا نعدّ أجزاء الرسم إلكترونات.',
  },
  {
    question: 'هل أستطيع وصل النقاط لأعرف الطريق الذي سلكه الإلكترون؟',
    answer: 'لا. النقاط ليست لقطات متتابعة لحركة إلكترون نراقبه. إنها نتائج محاولات مستقلة بدأنا كل واحدة منها بالتحضير نفسه. ترتيب ظهورها في المحاكاة ليس طريق حركة.',
  },
  {
    question: 'إذا غيّرت النمط بالزر، هل دُرت حول الذرّة فقط؟',
    answer: 'لا. اخترت وصفاً مختلفاً للحالة التي نبدأ بها المحاولات. تغيير جهة النظر يبقي الحالة نفسها، أما الانتقال الحقيقي من الحالة الأبسط إلى الحالة الأعلى في هذا المثال فيحتاج إلى أن تكتسب الذرّة طاقة مناسبة.',
  },
];

export default function ProbabilityStory() {
  const [pattern, setPattern] = useState<Pattern>('round');
  const [samples, setSamples] = useState<Sample[]>([]);
  const [showShape, setShowShape] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const outside = samples.filter(p => p.x < 12 || p.x > 428 || p.y < 12 || p.y > 336).length;
  const choose = (value: Pattern) => {
    setPattern(value);
    setSamples([]);
    setShowShape(false);
  };
  const add = (amount: number) => {
    const next = samplePositions(pattern, Math.min(amount, 2000 - samples.length));
    setSamples(previous => [...previous, ...next]);
  };

  return <section className="ps-story" aria-labelledby={`${id}-heading`}>
    <div className="ps-introduction">
      <p className="ps-kicker">نجمع النتائج، ثم نفهم معنى الشكل</p>
      <h3 id={`${id}-heading`}>كيف يتحوّل وصف الإلكترون إلى صورة؟</h3>
      <p>نأخذ مثالاً بسيطاً: ذرّة فيها مركز صغير نسمّيه <strong>النواة</strong>، وإلكترون واحد مرتبط بها. نختار طريقة لوصف حالته حول المركز. هذا الوصف يسمح لنا بحساب الأماكن التي يُرجّح العثور عليه فيها؛ وهذا هو المعنى الذي نقصده هنا بكلمة <strong>مدار</strong>.</p>
      <p>«يُرجّح» تعني أن بعض النتائج أكثر حدوثاً من غيرها عند تكرار المحاولة بالشروط نفسها. نقارن هنا وصفين ممكنين. في كل محاولة جديدة نحضّر الحالة المختارة من البداية، ثم نسجّل موضع العثور على الإلكترون بنقطة واحدة.</p>
      <p className="ps-limit">الذرّة البسيطة المختارة هي ذرّة العنصر الخفيف الذي نسمّيه الهيدروجين. هذه محاكاة تعليمية لنتائج يحسبها نموذجها، وليست تسجيلاً لتجربة مصوّرة. لا نعرض مسار حركة، ولا إلكترونات كثيرة موجودة معاً.</p>
    </div>

    <div className="ps-choices" aria-label="اختر الحالة التي نبدأ بها كل محاولة">
      <button type="button" aria-pressed={pattern === 'round'} onClick={() => choose('round')}>نمط متشابه من كل الجهات</button>
      <button type="button" aria-pressed={pattern === 'two-sides'} onClick={() => choose('two-sides')}>نمط يتركز في جهتين</button>
    </div>
    <div className="ps-pattern-reason" role="status">
      <strong>{pattern === 'round' ? 'لماذا يبدو مستديراً؟' : 'لماذا يظهر جزآن؟'}</strong>
      <p>{pattern === 'round'
        ? 'في هذه الحالة لا يفضّل الوصف اتجاهاً على اتجاه آخر حول النواة. إذا قارنا مناطق صغيرة متساوية الحجم وعلى المسافة نفسها من المركز، تكون فرص العثور على الإلكترون فيها متساوية مهما اختلف اتجاهها. لذلك تتراكم النتائج في نمط مستدير في عرضنا المسطّح، وكروي في الفضاء.'
        : 'في هذه الحالة تختلف فرص العثور على الإلكترون باختلاف الاتجاه: تزداد في جهتين متقابلتين. ويمرّ بينهما سطح مسطّح عبر النواة يكون الوصف الموجي عليه صفراً؛ لذلك يفصل بين منطقتي التجمّع في الخريطة. تظهر منطقتان، مع أنه وصف لإلكترون واحد. لماذا هذا الاختلاف ممكن؟ لأن السلوك الموجي الذي شرحناه يسمح بأكثر من نمط مكاني، وليس بنمط كروي واحد فقط.'}</p>
    </div>

    <div className={`ps-experiment${showShape ? ' ps-with-shape' : ''}`}>
      <figure className="ps-measurements">
        <figcaption>كل نقطة خضراء: نتيجة محاولة جديدة</figcaption>
        <svg viewBox="0 0 440 350" role="img" aria-labelledby={`${id}-plot-title ${id}-plot-description`}>
          <title id={`${id}-plot-title`}>{samples.length ? `نتائج ${samples.length} محاولة مستقلة` : 'لوحة فارغة قبل بدء المحاولات'}</title>
          <desc id={`${id}-plot-description`}>{pattern === 'round' ? 'عرض مسطّح لنتائج موزّعة بالتساوي في الاتجاهات حول المركز.' : 'عرض مسطّح لنتائج يزداد تجمعها أعلى المركز وأسفله.'} النقطة الذهبية مركز الذرّة، وهي مكبّرة للشرح. كل نقطة خضراء نتيجة قياس مستقل، وليست إلكتروناً إضافياً.</desc>
          <defs><clipPath id={`${id}-clip`}><rect x="12" y="12" width="416" height="324" rx="12"/></clipPath></defs>
          <rect x="12" y="12" width="416" height="324" rx="12" fill="#fbfcf7"/>
          <g clipPath={`url(#${id}-clip)`}>
            {samples.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r={samples.length < 80 ? 3.3 : 2.1} fill="#24765c" opacity={samples.length < 200 ? .7 : .38}/>) }
          </g>
          <circle cx="220" cy="174" r="5.5" fill="#bd8e36" stroke="#fff1c7" strokeWidth="2"/>
          {!samples.length && <><text x="220" y="240" textAnchor="middle" className="ps-empty-text">اضغط «أضف نتيجة واحدة» لتبدأ</text><text x="220" y="264" textAnchor="middle" className="ps-empty-small">الذهبي هو مركز الذرّة، وليس نتيجة قياس</text></>}
        </svg>
        <div className="ps-legend"><span><i className="ps-gold"/>مركز الذرّة، مكبّر للشرح</span><span><i className="ps-green"/>موضع سُجّل في محاولة واحدة</span></div>
        <p className="ps-limit">عرض مسطّح لنتائج في ثلاثة أبعاد؛ قد تتراكب نقاط في الصورة. يتغيّر التكبير بين النمطين لإظهار التفاصيل، فلا تقارن حجميهما من هاتين الصورتين.</p>
        {outside > 0 && <p className="ps-outside">سُجّلت أيضاً {outside} من النتائج خارج إطار الصورة. لا توجد حافة صلبة عند الإطار.</p>}
      </figure>
      {showShape && <figure className="ps-simple-shape">
        <figcaption>تبسيط يساعدنا على تمييز النمط</figcaption>
        <OrbitalArt family={pattern === 'round' ? 's' : 'p'} labels={false}/>
        <p>{pattern === 'round' ? 'نرسم شكلاً كروياً لنعرف أن الحالة متشابهة في كل الاتجاهات.' : 'نرسم جزأين بارزين لنعرف أن الحالة تفضّل جهتين متقابلتين. الجزء البارز يسمّى «فصّاً»؛ الفصّان هنا يخصّان مداراً واحداً.'}</p>
        <p className="ps-limit">التلوين سطح توضيحي يختصر شكل توزيع الاحتمال. ليس جسم الإلكترون، ولا جداراً، ولا حدّاً نهائياً لكل مواضعه الممكنة. هذا الرسم تقريبي، لا سطحاً عددياً مطابقاً لكل النقاط.</p>
      </figure>}
    </div>

    <div className="ps-actions">
      <button type="button" onClick={() => add(1)} disabled={samples.length >= 2000}>أضف نتيجة واحدة</button>
      <button type="button" onClick={() => add(50)} disabled={samples.length >= 2000}>أضف خمسين نتيجة</button>
      <button type="button" onClick={() => setSamples([])} disabled={samples.length === 0}>امسح النتائج وابدأ من جديد</button>
    </div>
    <p className="ps-count" aria-live="polite">عدد المحاولات المسجّلة: <strong>{samples.length}</strong>. عدد الإلكترونات في كل ذرّة في هذا المثال: <strong>واحد</strong>.</p>
    <p className="ps-observation">{samples.length === 0 ? 'ابدأ بمحاولة واحدة. هذه النقطة وحدها لا تكشف شكل التوزيع. أضف محاولات كثيرة بعد ذلك.' : samples.length < 50 ? 'كل محاولة تعطي موضعاً واحداً. لا نتوقّع أن تحدّد بضع نقاط الشكل كله؛ أضف خمسين نتيجة وقارن.' : 'بدأ نمط النتائج يظهر. إذا مسحت اللوحة وأعدت المحاولات، ستتغيّر المواضع الفردية، بينما يميل النمط العام إلى التشابه عند زيادة عدد النتائج.'}</p>
    {samples.length >= 2000 && <p className="ps-limit">وصلت إلى حدّ العرض هنا: ألفا محاولة. يمكنك مسح النتائج وإعادة التجربة.</p>}
    <button className="ps-reveal" type="button" aria-expanded={showShape} onClick={() => setShowShape(!showShape)}>{showShape ? 'أخفِ الرسم المبسّط' : 'قارن بتبسيط الشكل'}</button>

    <div className="ps-energy-note"><strong>هل يغيّر الإلكترون نمطه مجاناً؟</strong><p>قد تنقل الذرّة إلى غيرها، أو تتلقّى منه، مقداراً يغيّر حالتها؛ نسمّي هذا المقدار <strong>طاقة</strong>. الحالة الكروية المختارة هنا هي أبسط حالة للذرّة. للوصول إلى الحالة الأعلى المعروضة بالجزأين، تحتاج الذرّة إلى اكتساب مقدار مناسب من الطاقة، مثلاً من ضوء تمتصّه. أزرارنا تقارن حالتين محضّرتين مسبقاً؛ لا تحاكي عملية الانتقال بينهما.</p></div>

    <div className="ps-checks">
      <h4>أمثلة تمنع الخلط بين الصورة والإلكترون</h4>
      {questions.map((item, index) => <div className="ps-question" key={item.question}>
        <button type="button" aria-expanded={openQuestion === index} aria-controls={`${id}-answer-${index}`} onClick={() => setOpenQuestion(openQuestion === index ? null : index)}>{item.question}<span aria-hidden="true">{openQuestion === index ? 'أخفِ' : 'افتح'}</span></button>
        {openQuestion === index && <p id={`${id}-answer-${index}`}>{item.answer}</p>}
      </div>)}
    </div>
  </section>;
}
