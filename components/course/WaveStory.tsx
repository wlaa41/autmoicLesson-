'use client';

import {useId, useState} from 'react';
import './wave-story.css';

const patterns = [
  {name:'أبسط شكل', count:1, title:'انحناء واحد، والطرفان ثابتان', text:'يمكن أن يتحرّك وسط الوتر إلى أعلى ثم إلى أسفل، بينما يبقى طرفاه في مكانهما. هذا أحد الأشكال المنتظمة الممكنة لاهتزاز الوتر.'},
  {name:'انحناءان', count:2, title:'شكل آخر يحقق الشرط نفسه', text:'هنا يتحرّك جزءان من الوتر في جهتين متعاكستين. بينهما نقطة تبقى ساكنة. ما زال لدينا وتر واحد؛ عدد الأجزاء المتحرّكة لا يعدّ أوتاراً جديدة.'},
  {name:'ثلاثة انحناءات', count:3, title:'أكثر من شكل ممكن، لكن وفق القواعد', text:'هنا تظهر ثلاثة أجزاء متحرّكة، وبينها نقطتان ساكنتان. الطرفان ثابتان أيضاً. هذه أمثلة لثلاثة أنماط، وليست كل الأنماط الممكنة.'},
  {name:'جرّب شكلاً لا يلائم التثبيت', count:2.5, title:'الطرف الأيمن لا يصل إلى موضع تثبيته', text:'هذا الشكل المقترح لا يحقق شرط تثبيت الطرفين؛ ليس نمطاً ثابتاً صالحاً لهذا الوتر. قد يبدو منحنى جميلاً، لكن جمال الرسم لا يجعله متوافقاً مع القواعد.'},
];

function stringPath(count:number, phase:number) {
  return Array.from({length:161},(_,i)=>{
    const fraction=i/160;
    return `${i===0?'M':'L'}${(58+fraction*584).toFixed(2)},${(145-Math.sin(fraction*Math.PI*count)*57*phase).toFixed(2)}`;
  }).join(' ');
}

export default function WaveStory(){
  const [selected,setSelected]=useState(0);
  const [phase,setPhase]=useState(1);
  const titleId=useId();
  const chosen=patterns[selected];
  const invalid=selected===3;
  const stationary=Array.from({length:Math.max(0,Math.floor(chosen.count)-1)},(_,i)=>58+(i+1)*584/chosen.count);

  return <div className="ws-story">
    <div className="ws-lead">
      <span className="ws-label">مثال مألوف يساعدنا على فهم السبب</span>
      <h3>لماذا لا يصلح أي شكل نرسمه؟</h3>
      <p>تخيّل وتراً مشدوداً في آلة موسيقية. عندما تهزّه، يمتد الاضطراب على طوله؛ هذا النوع من الاضطراب نسمّيه <strong>موجة</strong>. وقد يهتز الوتر بطريقة منتظمة تبقى فيها أماكن الأجزاء الساكنة والمتحرّكة ثابتة، بينما تتحرّك الأجزاء نفسها إلى أعلى وأسفل. نسمّي هذه الطريقة <strong>نمط اهتزاز ثابتاً</strong>.</p>
      <p>في مثالنا طرفا الوتر مثبتان. لذلك يجب أن يبقيا في موضعيهما في كل لحظة. هذا القيد يحدّد الأنماط المنتظمة التي يمكن أن تحدث.</p>
      <p className="ws-analogy"><strong>هذا وتر حقيقي في تشبيه تعليمي.</strong> الإلكترون ليس وتراً، وهذه الانحناءات ليست طريقه حول الذرّة.</p>
    </div>

    <div className="ws-picker" role="group" aria-label="اختر نمط الوتر">
      {patterns.map((pattern,index)=><button key={pattern.name} type="button" aria-pressed={selected===index} onClick={()=>{setSelected(index);setPhase(1)}}>{pattern.name}</button>)}
    </div>

    <figure className={'ws-demonstration '+(invalid?'ws-invalid':'')}>
      <figcaption>{invalid?'البرتقالي يبيّن موضع الطرف المقترح المخالف للتثبيت.':'الأخضر هو الوتر في لحظة واحدة. الخط المتقطّع هو موضعه المستقيم قبل الاهتزاز.'}</figcaption>
      <svg viewBox="0 0 700 270" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{`${chosen.title}. ${invalid?'نهاية المنحنى لا توافق موضع الطرف المثبت.':'الصورة لوتر واحد، وطرفاه ثابتان.'}`}</title>
        <line x1="58" y1="145" x2="642" y2="145" stroke="#a7b7a9" strokeWidth="2" strokeDasharray="6 7"/>
        <rect x="40" y="118" width="18" height="55" rx="4" fill="#b9c6b4"/>
        <rect x="642" y="118" width="18" height="55" rx="4" fill="#b9c6b4"/>
        <path d={stringPath(chosen.count,phase)} fill="none" stroke={invalid?'#b7702f':'#1d7863'} strokeWidth="5" strokeLinecap="round"/>
        {invalid&&<line x1="642" y1="88" x2="642" y2="145" stroke="#b7702f" strokeWidth="2" strokeDasharray="5 5"/>}
        {invalid&&<circle cx="642" cy="88" r="7" fill="#efc192" stroke="#9f5b21" strokeWidth="2"/>}
        {!invalid&&stationary.map(x=><circle key={x} cx={x} cy="145" r="5" fill="#fffdf8" stroke="#467c65" strokeWidth="2"/>)}
        <circle cx="58" cy="145" r="7" fill="#cfaa55" stroke="#fffdf8" strokeWidth="2"/>
        <circle cx="642" cy="145" r="7" fill="#cfaa55" stroke="#fffdf8" strokeWidth="2"/>
        <text x="58" y="209" textAnchor="middle" fill="#345a46">طرف ثابت</text>
        <text x="642" y="209" textAnchor="middle" fill="#345a46">طرف ثابت</text>
        <text x="350" y="39" textAnchor="middle" fill={invalid?'#9f5b21':'#345a46'}>{invalid?'الشكل المقترح لا يلتزم بالتثبيت':'وتر واحد يمكنه الاهتزاز بأنماط مختلفة'}</text>
      </svg>
      <div className="ws-phase-control"><button type="button" disabled={invalid} onClick={()=>setPhase(value=>-value)}>شاهد لحظة أخرى من الاهتزاز</button><span>{invalid?'الطرف المخالف يظهر أعلى موضع تثبيته.':'تبديل اللحظة يغيّر موضع الوتر، ولا يغيّر نمط الاهتزاز المختار.'}</span></div>
    </figure>

    <div className="ws-feedback" role="status"><h4>{chosen.title}</h4><p>{chosen.text}</p></div>
    <p className="ws-footnote">الدوائر البيضاء، عندما تظهر، تحدّد نقاطاً ساكنة داخل الوتر. ويمكن للوتر أيضاً أن يهتز بتركيب عدة أنماط معاً. المثال لا يقول إن كل اهتزاز يجب أن يكون أحد الرسوم الثلاثة وحده.</p>

    <div className="ws-connection">
      <span className="ws-label">نعود الآن إلى الإلكترون</span>
      <h3>ما علاقة ذلك بالرسوم حول الذرّة؟</h3>
      <p>في التجارب، يظهر للإلكترون سلوك موجي: قد تتعزّز تأثيرات في مواضع وتضعف أو تنعدم في مواضع أخرى. لذلك لا يكفي وصفه ككرة صغيرة تدور في طريق محدّد.</p>
      <p>نستخدم قواعد رياضية تتعامل مع هذا السلوك ومع جذب النواة للإلكترون. هذه القواعد تسمّى <strong>ميكانيكا الكم</strong>. عندما نطبّقها على ذرّة بسيطة، نحصل على أنماط مكانية محدّدة يمكن أن يبقى فيها توزيع احتمال المكان ثابتاً مع الزمن، إذا بقيت الظروف كما هي. <strong>جذب النواة وحده لا يفسّر الأشكال؛ السلوك الموجي والقواعد معاً هما ما يحدّدها.</strong></p>
      <p>الوصف المكاني لأحد هذه الأنماط يسمّى <strong>مداراً ذرّياً</strong>. ومنه نحسب أين يرجّح أن نجد الإلكترون عند القياس. الاختلاف بين الأنماط هو سبب اختلاف خرائط الأماكن: بعض الخرائط متشابهة من جميع الجهات، وبعضها يتركّز في جهات معيّنة ويفصل بين أجزائه موضع ينعدم فيه الاحتمال.</p>
      <p>يمكن للذرّة أن تمتص ضوءاً أو تطلقه فتتغيّر حالتها. المقدار الذي ينتقل في مثل هذا التغيّر نسمّيه <strong>طاقة</strong>؛ وهو مقدار فيزيائي يصف قدرة النظام على إحداث تغيّر. الانتقال بين حالتين مسموحتين يحتاج إلى فرق الطاقة المناسب، وليس إلى إعادة تسمية الرسم.</p>
      <p>يمكن أيضاً تكوين حالات بتركيب أكثر من نمط. لهذا لا نقصد أن الإلكترون محصور في أربع صور فقط، ولا أن كل حالة تبقى إلى الأبد.</p>
      <div className="ws-limits"><strong>أين ينتهي التشبيه؟</strong><p>الذرّة تمتد في ثلاثة أبعاد، ولا تحتوي على طرفَي وتر أو جدار يثبّت الإلكترون. هذا التشبيه يوضح فكرة القيود فقط ولا يحسب أشكال المدارات؛ الحساب الخاص بالذرّة مختلف.</p></div>
    </div>

    <div className="ws-checks">
      <details><summary>إذا رأيت انحناءين، هل يوجد وتران؟</summary><p>لا. هما جزءان من نمط اهتزاز لوتر واحد. وبالمثل، ظهور جزأين في رسم مدار لا يعني وجود إلكترونين ولا مدارين.</p></details>
      <details><summary>هل اختار العلماء أشكالاً جميلة ثم أعطوها أسماء؟</summary><p>الأسماء اختيارات بشرية، لكن الأنماط تحسبها القواعد الفيزيائية، وتختبر التنبؤات المبنية عليها بالتجارب. نرسم الأشكال لمساعدة العين على فهم ما تقوله هذه الحسابات.</p></details>
      <details><summary>هل تتحرّك كرة الإلكترون على المنحنى الأخضر؟</summary><p>لا. المنحنى هنا هو وتر الآلة الموسيقية فقط. رسم المدار الذي سنراه لاحقاً يبيّن توزيع احتمال العثور على الإلكترون، ولا يرسم مسار حركة له.</p></details>
    </div>
  </div>;
}
