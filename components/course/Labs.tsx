'use client';

import { useState } from 'react';
import './labs.css';

const ar = (n: number) => n.toLocaleString('ar');
const shapes = ['s', 'p', 'd', 'f'];
const shapeNames = ['كروي', 'ذو فصّين', 'أشكال أكثر تنوّعاً', 'أشكال أكثر تعقيداً'];
const capacities = [2, 6, 10, 14];
function Frame({intro,children,note}:{intro:string;children:React.ReactNode;note?:string}) {
  return <div className="lab-frame"><p className="lab-intro">{intro}</p>{children}{note && <p className="lab-caution">{note}</p>}</div>;
}
function Feedback({children}:{children:React.ReactNode}) {return <div className="lab-feedback" role="status" aria-live="polite">{children}</div>;}
function Range({label,value,min=0,max,onChange}:{label:string;value:number;min?:number;max:number;onChange:(v:number)=>void}) {
 return <label className="lab-range"><span>{label} <b>{ar(value)}</b></span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
function Picks({items,value,onChange}:{items:string[];value:number;onChange:(v:number)=>void}) {return <div className="lab-picks">{items.map((label,i)=><button type="button" key={i} aria-pressed={i===value} className={i===value?'is-active':''} onClick={()=>onChange(i)}>{label}</button>)}</div>;}
function Dots({count=100,spread=100,color='#35b6a2',centerX=180,centerY=140}:{count?:number;spread?:number;color?:string;centerX?:number;centerY?:number}) {
 return <>{Array.from({length:count},(_,i)=>{const t=i*2.39996; const r=spread*Math.sqrt(((i*37+17)%137)/137)*(.4+.6*((i*43+19)%101)/101); return <circle key={i} cx={centerX+Math.cos(t)*r} cy={centerY+Math.sin(t)*r} r={2} fill={color} opacity={.25+((i*17)%7)/10}/>;})}</>;
}
function MatterLab({zoom=false}:{zoom?:boolean}) {
 const [choice,setChoice]=useState(0);
 const [guess,setGuess]=useState<number|null>(null);
 const items = [
  {name:'كوب ماء',answer:0,text:'الماء يشغل حيزاً وله كتلة، لذلك هو مادة. والكوب نفسه مادة أيضاً.'},
  {name:'الهواء داخل بالون',answer:0,text:'الهواء غير مرئي عادةً، لكنه يشغل حيزاً وله كتلة. لذلك هو مادة.'},
  {name:'ضوء المصباح',answer:1,text:'الضوء يحمل طاقة. لا نصنّفه مادة في هذا الدرس؛ لا يتكوّن من ذرّات مثل الماء أو الهواء.'},
  {name:'ملعقة حديد',answer:0,text:'الحديد مادة. القطعة التي تراها تتكوّن من عدد هائل من ذرّات الحديد.'},
 ];
 if(zoom) return <Frame intro="سنقرّب رسم قطعة حديد على ثلاث مراحل. الدوائر الصغيرة تمثّل ذرّات؛ ليست صورة فوتوغرافية ولا حجمها الحقيقي.">
  <Picks items={['قطعة نراها','تكبير تخيّلي','ذرّة واحدة']} value={choice} onChange={setChoice}/>
  <svg className="lab-svg" viewBox="0 0 360 240" role="img" aria-label={['قطعة حديد','ذرّات مرسومة داخل الحديد','تكبير ذرّة واحدة'][choice]}>
   {choice===0?<><rect x="80" y="65" width="200" height="110" rx="18" fill="#637987"/><path d="M90 75h180v18H90z" fill="#a7bac4"/></>:choice===1?Array.from({length:35},(_,i)=><circle key={i} cx={62+(i%7)*40} cy={40+Math.floor(i/7)*40} r="15" fill={i===17?'#e6a33f':'#3e9d91'}/>):<><circle cx="180" cy="120" r="80" fill="#d9f2eb"/><circle cx="180" cy="120" r="8" fill="#e6a33f"/><Dots count={130} centerY={120} spread={78}/></>}
  </svg>
  <Feedback>{['هذه قطعة واحدة في حياتنا اليومية. صغر حجمها لا يعني أنها ذرّة واحدة.','كل دائرة تمثّل ذرّة حديد. الرسم يعرض عدداً قليلاً فقط؛ القطعة الحقيقية تحتوي عدداً هائلاً.','وصلنا إلى ذرّة واحدة. وسطها الصغير هو النواة، والمنطقة المحيطة تمثّل أماكن يمكن أن نجد فيها الإلكترونات. سنتعرّف إليهما في الدرس التالي.'][choice]}</Feedback>
 </Frame>;
 return <Frame intro="المادة هي ما له كتلة ويشغل حيزاً؛ أي يمكن أن نزن كمية منه ويأخذ مكاناً. جرّب تصنيف أمثلة من حياتك.">
  <Picks items={items.map(x=>x.name)} value={choice} onChange={v=>{setChoice(v);setGuess(null);}}/>
  <div className="lab-bigword">{items[choice].name}</div><p>هل المثال مادة؟</p><div className="lab-picks"><button type="button" onClick={()=>setGuess(0)}>نعم، مادة</button><button type="button" onClick={()=>setGuess(1)}>ليس مادة في هذا التصنيف</button></div>
  {guess!==null&&<Feedback>{guess===items[choice].answer?'صحيح. ':'لنفكّر مرة أخرى. '}{items[choice].text}</Feedback>}
 </Frame>;
}
function AtomLab({kind}:{kind:string}) {
 const [protons,setProtons]=useState(kind==='isotope'?6:3);
 const [electrons,setElectrons]=useState(kind==='isotope'?6:3);
 const [neutrons,setNeutrons]=useState(kind==='isotope'?6:4);
 const [part,setPart]=useState(0);
 const isBasic=kind==='atom'; const isotope=kind==='isotope'; const net=protons-electrons;
 return <Frame intro={isBasic?'في وسط الذرّة نواة تحتوي بروتونات ونيوترونات. خارجها توجد إلكترونات. البرتقالي يمثّل البروتون، والرمادي النيوترون، والأخضر الإلكترون. اختر جزءاً لتعرف وظيفته.':isotope?'سنثبت عدد البروتونات على ستة: لذلك تبقى الذرّة كربوناً. غيّر النيوترونات فقط: ستحصل على ذرّات للعنصر نفسه تختلف في عدد النيوترونات. نسمّي هذه الذرّات نظائر.':'البروتون موجب الشحنة والإلكترون سالب الشحنة. كل واحد منهما يعادل الآخر في مقدار الشحنة. النيوترون بلا شحنة كهربائية. غيّر الأعداد وقارنها.'} note="الأحجام والمسافات مكبّرة ومبسّطة. النقاط الإلكترونية هنا رموز للعدّ، وليست مواقع ثابتة أو مسارات.">
  {isBasic&&<Picks items={['النواة','البروتون','النيوترون','الإلكترون']} value={part} onChange={setPart}/>}
  <div className="lab-split"><svg className="lab-svg" viewBox="0 0 360 260" role="img" aria-label="رسم تعليمي لمكونات الذرّة">
   <ellipse cx="180" cy="130" rx="145" ry="100" fill="#ecf7f3"/>
   {Array.from({length:protons+neutrons},(_,i)=>{const a=i*2.39996,r=10+Math.sqrt(i)*6;return <circle key={i} cx={180+Math.cos(a)*r} cy={130+Math.sin(a)*r} r="9" fill={i<protons?'#e7a641':'#708390'} opacity={isBasic&&((part===1&&i>=protons)||(part===2&&i<protons)||part===3)?.3:1}/>;})}
   {Array.from({length:electrons},(_,i)=><circle key={i} cx={180+Math.cos(i*2.39996)*110} cy={130+Math.sin(i*2.39996)*80} r="6" fill="#16866e" opacity={isBasic&&part!==3?.5:1}/>)}
  </svg><div className="lab-controls">
   {!isBasic&&!isotope&&<><Range label="البروتونات" value={protons} min={1} max={10} onChange={setProtons}/><Range label="الإلكترونات" value={electrons} max={12} onChange={setElectrons}/></>}
   {isotope&&<Range label="النيوترونات" value={neutrons} min={6} max={8} onChange={setNeutrons}/>}
   <div className="lab-stats"><span><i className="lab-dot proton"/> بروتونات <b>{ar(protons)}</b></span><span><i className="lab-dot neutron"/> نيوترونات <b>{ar(neutrons)}</b></span><span><i className="lab-dot electron"/> إلكترونات <b>{ar(electrons)}</b></span></div>
  </div></div>
  <Feedback>{isBasic?['النواة هي الجزء الصغير في الوسط. تحتوي معظم كتلة الذرّة. وهي أصغر كثيراً مما يوحي به الرسم.','البروتون أحد نوعي الجسيمات داخل النواة. نمثّله هنا بالبرتقالي. عدده يحدّد نوع الذرّة؛ سنبني على هذه الفكرة في الدروس التالية.','النيوترون هو النوع الآخر من الجسيمات داخل النواة، إلى جانب البروتون. نمثّله هنا بالرمادي، ونعدّه منفصلاً عن البروتونات.','الإلكترون جسيم أصغر كتلةً بكثير من جسيمات النواة. يوجد حول النواة، ولا نعتبر هذه النقاط عناوين ثابتة له. سنتعلّم خصائصه خطوة خطوة.'][part]:isotope?`ستة بروتونات ومعها ${ar(neutrons)} نيوترونات: المجموع ${ar(protons+neutrons)} من البروتونات والنيوترونات داخل النواة. هذا كربون-${ar(protons+neutrons)}. لم يتغيّر العنصر، لأن عدد بروتوناته لم يتغيّر.`:net===0?'عدد البروتونات يساوي عدد الإلكترونات، فتتعادل الشحنات. هذه ذرّة متعادلة كهربائياً.':net>0?`هناك ${ar(net)} من الشحنات الموجبة الزائدة. أصبحت الذرّة مشحونة بالموجب. نسمّي الذرّة المشحونة أيوناً؛ هذا أيون موجب.`:`هناك ${ar(-net)} من الشحنات السالبة الزائدة. أصبحت الذرّة مشحونة بالسالب. نسمّي الذرّة المشحونة أيوناً؛ هذا أيون سالب.`}</Feedback>
 </Frame>;
}
function ScatteringLab() {
 const [model,setModel]=useState(0);const [sent,setSent]=useState(false);
 return <Frame intro="أرسل العلماء جسيمات صغيرة موجبة نحو صفيحة ذهب رقيقة. مرورها أو انحرافها ساعدهم على معرفة ما بداخل الذرّة. الخطوط التالية تمثّل مسارات جسيمات الفحص، وليست مسارات إلكترونات.">
  <Picks items={['ماذا لو توزّعت الشحنة في الذرّة؟','ماذا لو تركزت في نواة صغيرة؟']} value={model} onChange={v=>{setModel(v);setSent(false);}}/>
  <button type="button" className="lab-action" onClick={()=>setSent(true)}>أرسل جسيمات الفحص</button>
  <svg className="lab-svg" viewBox="0 0 480 260" role="img" aria-label="مقارنة مسارات الفحص في نموذجين للذرّة">
   <rect x="30" y="36" width="28" height="190" rx="8" fill="#e6a33f"/>
   <circle cx="260" cy="130" r="100" fill={model?'#eff7f3':'#fcebd2'}/>{model===1&&<circle cx="260" cy="130" r="10" fill="#e6a33f"/>}
   {sent&&Array.from({length:9},(_,i)=>{const y=42+i*22;const d=model&&i===4?`M60 ${y} H244 Q235 142 110 175`:model&&(i===3||i===5)?`M60 ${y} H225 Q260 ${y} 447 ${i===3?22:244}`:`M60 ${y} H447`;return <path key={i} d={d} fill="none" stroke="#15917d" strokeWidth="2.5"/>;})}
  </svg>
  <Feedback>{!sent?'اختر تصوراً لبنية الذرّة ثم أرسل الجسيمات.':model===0?'لو كانت الشحنة الموجبة منتشرة بهذا الشكل، لتوقّعنا انحرافات صغيرة غالباً. هذا لا يفسّر ارتداد بعض الجسيمات بزوايا كبيرة.':'وجود مركز صغير كثيف موجب يفسّر مرور معظم الجسيمات بعيداً عنه، وانحراف أو ارتداد عدد قليل اقترب كثيراً منه. هذا هو الدليل على النواة.'}</Feedback>
  <p className="lab-caution">المسارات تخطيطية وعدد الانحرافات مبالغ فيه لإظهار الفكرة؛ لا يمثّل نسبة نتائج التجربة الحقيقية.</p>
 </Frame>;
}
function WaveLab() {
 const [frequency,setFrequency]=useState(3);
 const path=Array.from({length:241},(_,i)=>`${i?'L':'M'}${i*1.6},${110-Math.sin(i/240*Math.PI*2*frequency)*50}`).join(' ');
 return <Frame intro="الموجة نمط يتكرر. المسافة بين قمتين متتاليتين تسمّى الطول الموجي. وعدد التكرارات التي تمر في زمن محدد يسمّى التردّد. هنا نقارن الضوء وهو ينتشر في الهواء نفسه وبالظروف نفسها، فتكون سرعة انتشاره ثابتة تقريباً.">
  <Range label="عدد التكرارات في نافذة الرسم" value={frequency} min={1} max={7} onChange={setFrequency}/>
  <svg className="lab-svg" viewBox="0 0 420 220" role="img" aria-label="موجة تتغيّر المسافة بين قممها"><path d="M18 110H402" stroke="#c7d8d3" strokeDasharray="5 5"/><path transform="translate(18 0)" d={path} stroke="#148b75" strokeWidth="4" fill="none"/></svg>
  <div className="lab-meter"><span>تردّد أقل</span><progress value={frequency} max={7}/><span>تردّد أكبر</span></div>
  <Feedback>{frequency<4?'التكرارات أقل والقمم متباعدة: التردّد أقل والطول الموجي أكبر.':'التكرارات أكثر والقمم متقاربة: التردّد أكبر والطول الموجي أصغر.'} عند السرعة نفسها، لا يمكن زيادة التردّد مع إبقاء الطول الموجي نفسه.</Feedback>
  <p className="lab-caution">هذا تمثيل لشكل الموجة، وليس رسماً لطريق متعرّج يسير فيه الضوء. الأعداد للمقارنة فقط، وليست قياسات ضوء حقيقية.</p>
 </Frame>;
}
function EnergyLab() {
 const [level,setLevel]=useState(0);const [message,setMessage]=useState('ابدأ من الحالة الأقل طاقة، ثم اختر حالة أعلى.');
 const ys=[208,126,65];
 const change=(v:number)=>{setMessage(v===level?'الإلكترون في هذه الحالة بالفعل.':v>level?'انتقلنا إلى حالة أعلى طاقة. يلزم امتصاص مقدار الطاقة المناسب تماماً لهذا الفرق.':'انتقلنا إلى حالة أقل طاقة. يمكن أن يخرج فرق الطاقة على هيئة حزمة من الضوء؛ اسم هذه الحزمة فوتون.');setLevel(v);};
 return <Frame intro="لكل حالة إلكترونية طاقة محددة. الخطوط تمثّل قيماً مسموحة للطاقة، وليست رفوفاً داخل الذرّة. النقطة تحدّد الحالة الحالية فقط. اضغط مستوى لترى ما يحتاجه الانتقال.">
  <div className="lab-split"><svg className="lab-svg" viewBox="0 0 320 260" role="img" aria-label="ثلاث قيم مسموحة للطاقة"><path d="M45 225V28" stroke="#96afa7" strokeWidth="2"/>{ys.map((y,i)=><g key={i}><path d={`M65 ${y}H275`} stroke={i===level?'#11826d':'#b8cdc5'} strokeWidth="4"/>{i===level&&<circle cx="170" cy={y} r="10" fill="#e7a33c"/>}</g>)}</svg><div className="lab-controls"><Picks items={['الأقل طاقة','طاقة أعلى','طاقة أعلى أكثر']} value={level} onChange={change}/><button type="button" onClick={()=>setMessage('لا توجد حالة مسموحة بين هذين الخطين في هذا المثال. لا يكتسب الإلكترون أي مقدار عشوائي من الطاقة ليبقى بينهما.')}>هل يمكن الوقوف بين خطين؟</button></div></div>
  <Feedback>{message}</Feedback><p className="lab-caution">مخطط تعليمي بثلاث حالات؛ المسافات ليست مقياساً عددياً. نموذج بور نجح للهيدروجين والأنظمة ذات الإلكترون الواحد، لكنه لا يكفي لوصف كل الذرّات.</p>
 </Frame>;
}
function ProbabilityLab({cloud=false}:{cloud?:boolean}) {
 const [count,setCount]=useState(cloud?180:1);const [cross,setCross]=useState(false);
 return <Frame intro={cloud?'المدار وصف لحالة إلكترونية، ومنه نحصل على خريطة احتمال العثور على الإلكترون. كل نقطة هنا تمثّل نتيجة قياس منفصل في تجارب أُعدّت بالطريقة نفسها. ليست هذه إلكترونات كثيرة موجودة معاً.':'الاحتمال يخبرنا أي النتائج أرجح، من دون أن يضمن مكاناً في القياس التالي. سنجمع نتائج قياسات منفصلة لإلكترون في الحالة نفسها. كل نقطة نتيجة قياس واحد، وليست أثراً لحركة الإلكترون.'} note="توزيع النقاط تخطيطي لتعليم معنى الاحتمال، وليس بيانات مختبرية أو حلاً عددياً دقيقاً لمعادلة كمومية.">
  <div className="lab-picks"><button type="button" onClick={()=>setCount(c=>Math.min(400,c+20))}>أضف عشرين قياساً</button><button type="button" onClick={()=>setCount(400)}>اجمع أربعمئة قياس</button><button type="button" onClick={()=>{setCount(1);setCross(false);}}>ابدأ بقياس واحد</button>{cloud&&<button type="button" aria-pressed={cross} onClick={()=>setCross(x=>!x)}>{cross?'أظهر الخريطة كاملة':'أظهر نصف الخريطة'}</button>}</div>
  <svg className="lab-svg lab-cloud" viewBox="0 0 360 280" role="img" aria-label={`خريطة تحتوي ${count} نتائج قياس منفصلة`}>
   <circle cx="180" cy="140" r="112" fill="#edf8f4"/><Dots count={count} spread={112}/>{cross&&<rect x="180" y="0" width="180" height="280" fill="#f9fcfa" opacity=".96"/>}<circle cx="180" cy="140" r="5" fill="#e6a33f"/>
  </svg><p className="lab-caption">البرتقالي: موضع النواة. الأخضر: نتائج القياس. عدد القياسات: {ar(count)}.</p>
  <Feedback>{count<30?'قياس واحد أو بضعة قياسات لا تكشف شكل الخريطة جيداً. أضف قياسات مستقلة.':'مع تكرار القياس يظهر نمط: مناطق تتجمع فيها النتائج أكثر، لذلك يكون العثور على الإلكترون فيها أرجح. كثرة النقاط لا تعني وجود كل تلك الإلكترونات معاً.'}{cloud?' الحد الخارجي المرسوم للتوضيح ليس جداراً يحبس الإلكترون.':''}</Feedback>
 </Frame>;
}
function LevelsLab() {
 const [level,setLevel]=useState(0);
 return <Frame intro="نجمع الحالات الإلكترونية في مجموعات رئيسية، نسمّيها مستويات رئيسية. الأول ثم الثاني ثم الثالث هو ترتيب هذه المجموعات. المناطق الملوّنة التالية مقارنة تخطيطية للامتداد، وليست أغلفة صلبة أو مسارات دائرية.">
  <Picks items={['المستوى الأول','المستوى الثاني','المستوى الثالث']} value={level} onChange={setLevel}/>
  <svg className="lab-svg" viewBox="0 0 360 260" role="img" aria-label="تغيّر الامتداد التقريبي للحالات مع المستوى"><circle cx="180" cy="130" r={45+level*35} fill="#d9f1e9"/><Dots count={160} centerY={130} spread={45+level*35}/><circle cx="180" cy="130" r="7" fill="#e6a33f"/></svg>
  <Feedback>اخترت المستوى {['الأول','الثاني','الثالث'][level]}. الرقم هنا اسم للترتيب. في العموم، حالات المستوى الأعلى تمتد أبعد. لكن الإلكترون لا يثبت على بُعد واحد، ومناطق المستويات قد تتداخل.</Feedback>
 </Frame>;
}
function ShapeVisual({shape}:{shape:number}) {
 return <svg className="lab-svg" viewBox="0 0 360 260" role="img" aria-label={`مثال تخطيطي لمدار من النوع ${shapes[shape]}`}>
  <path d="M180 20v220M40 130h280" stroke="#d6e5df" strokeDasharray="5 5"/>
  {shape===0?<circle cx="180" cy="130" r="82" fill="#48b39e" opacity=".45"/>:shape===1?<><ellipse cx="126" cy="130" rx="52" ry="39" fill="#48b39e" opacity=".58"/><ellipse cx="234" cy="130" rx="52" ry="39" fill="#48b39e" opacity=".58"/></>:Array.from({length:shape===2?4:6},(_,i)=>{const angle=i*(360/(shape===2?4:6))+(shape===2?45:0);return <ellipse key={i} cx="180" cy="77" rx="27" ry="52" transform={`rotate(${angle} 180 130)`} fill="#48b39e" opacity=".55"/>;})}
  <circle cx="180" cy="130" r="6" fill="#e6a33f"/>
 </svg>;
}
function ShapesLab() {
 const [shape,setShape]=useState(0);
 return <Frame intro="نصنّف المدارات في عائلات بحسب خصائص أشكالها. الاسم بالحرف مجرد تسمية تاريخية: «إس» للكروي، «بي» لفصّين، «دي» و«إف» لعائلات أكثر تنوّعاً. الآن نربط الاسم بالرسم.">
 <Picks items={['إس · s','بي · p','دي · d','إف · f']} value={shape} onChange={setShape}/><ShapeVisual shape={shape}/>
 <Feedback>{shape===0?'شكل مدار إس كروي في ثلاثة أبعاد؛ الدائرة هنا صورة مسطّحة لكرة.':shape===1?'هذان الفصّان معاً يمثّلان مداراً واحداً من نوع بي، وليس مدارين. توجد ثلاثة مدارات في هذه العائلة داخل المستوى المناسب.':shape===2?'هذا مثال مبسّط ذو أربعة فصوص من عائلة دي. ليست كل مدارات هذه العائلة بالشكل نفسه؛ هناك أيضاً شكل ذو فصّين وحلقة.':'هذه إشارة تخطيطية إلى تعقيد عائلة إف. لها سبعة مدارات بأشكال متعددة؛ الرسم ليس وصفاً دقيقاً لكل واحد منها.'}</Feedback>
 <p className="lab-caution">اللون يبيّن الشكل فقط؛ لا يرمز إلى شحنة أو إلكترون منفصل. الخطوط الرمادية خطوط مرجعية للرسم. الأسطح ليست حدوداً صلبة، وهذه رسومات ثنائية الأبعاد لأشكال مكانية.</p>
 </Frame>;
}
function LabelsLab() {
 const labels=[{n:1,s:0},{n:2,s:0},{n:2,s:1},{n:3,s:2},{n:4,s:3}];
 const [choice,setChoice]=useState(0);const selected=labels[choice];const [part,setPart]=useState(0);
 return <Frame intro="اسم المجموعة يتكوّن من جزأين: عدد في البداية يحدّد المستوى الرئيسي، وحرف بعده يحدّد عائلة المدارات. الحروف التي تعلّمناها هي إس وبي ودي وإف. الاسم ليس عملية ضرب.">
  <Picks items={labels.map(x=>`${x.n}${shapes[x.s]}`)} value={choice} onChange={setChoice}/>
  <div className="lab-label" dir="ltr"><button type="button" className={part===0?'selected':''} onClick={()=>setPart(0)} aria-label="اشرح العدد الأول">{selected.n}</button><button type="button" className={part===1?'selected':''} onClick={()=>setPart(1)} aria-label="اشرح حرف العائلة">{shapes[selected.s]}</button></div>
  <p className="lab-caption">اضغط العدد أو الحرف لقراءة معناه وحده.</p>
  <Feedback>{part===0?`العدد ${ar(selected.n)} يعني المستوى الرئيسي رقم ${ar(selected.n)}. لا يخبرنا كم إلكتروناً يوجد هنا.`:`الحرف ${shapes[selected.s]} هو اسم العائلة ${['إس','بي','دي','إف'][selected.s]}. هذه مجموعة فيها ${ar(2*selected.s+1)} من المدارات، وليست عدداً من الإلكترونات.`}</Feedback>
 </Frame>;
}
function CapacityLab({notation=false}:{notation?:boolean}) {
 const [family,setFamily]=useState(0);const [count,setCount]=useState(0);const total=2*family+1;
 const changeFamily=(v:number)=>{setFamily(v);setCount(0);};
 return <Frame intro={notation?'بعد اسم المجموعة، نكتب عدداً صغيراً مرتفعاً يبيّن عدد الإلكترونات الموجودة فيها بالفعل. هذا العدد في التوزيع الإلكتروني يعني عدّ الإلكترونات؛ لا يعني ضرب العدد بنفسه. الخانات مدارات، والنقاط إلكترونات للعدّ.':'كل خانة تمثّل مداراً واحداً، ويمكن أن يتّسع لإلكترونين كحد أقصى. العائلة الواحدة قد تضم خانة أو ثلاثاً أو خمساً أو سبعاً. النقطة هنا رمز لإلكترون للعدّ فقط.'}>
  <Picks items={['إس · خانة واحدة','بي · ثلاث خانات','دي · خمس خانات','إف · سبع خانات']} value={family} onChange={changeFamily}/>
  <Range label="عدد الإلكترونات التي نضعها" value={count} max={capacities[family]} onChange={setCount}/>
  <div className="lab-boxes" dir="ltr">{Array.from({length:total},(_,i)=>{const occupied=(count>i?1:0)+(count>total+i?1:0);return <div className="lab-box" key={i} aria-label={`مدار ${i+1} فيه ${occupied} إلكترون`}><span>{occupied>0?'●':''}</span><span>{occupied>1?'●':''}</span></div>;})}</div>
  {notation&&<div className="lab-notation" dir="ltr"><span>{family+1}{shapes[family]}</span><sup>{count}</sup></div>}
  <Feedback>{notation?`نقرأ الكتابة: المجموعة ${family+1}${shapes[family]} تحتوي الآن ${ar(count)} إلكتروناً. `:''}السعة القصوى {ar(capacities[family])} إلكتروناً، أما الموجود الآن فهو {ar(count)}. السعة لا تعني أن المجموعة ممتلئة دائماً.</Feedback>
 </Frame>;
}
function SpinLab() {
 const [state,setState]=useState(0);
 const texts=['خانـة فارغة: لا إلكترون.','إلكترون واحد في الحالة التي نرمز لها بسهم إلى أعلى.','إلكترون واحد في الحالة التي نرمز لها بسهم إلى أسفل.','إلكترونان في المدار نفسه، وحالتا اللف الذاتي متعاكستان.'];
 return <Frame intro="للإلكترون خاصية داخلية اسمها اللف الذاتي. نستخدم سهمين متعاكسين لتمثيل حالتيها. السهم إلى أعلى أو أسفل لا يعني أن الإلكترون يتحرك في هذا الاتجاه، ولا أنه كرة تدور حرفياً. المربع يمثّل مداراً واحداً.">
  <Picks items={['فارغ','إلكترون: الحالة الأولى','إلكترون: الحالة الثانية','إلكترونان متعاكسان']} value={state} onChange={setState}/>
  <div className="lab-boxes"><div className="lab-box lab-box-large" dir="ltr">{['','↑','↓','↑↓'][state]}</div></div>
  <Feedback>{texts[state]} {state===3?'لا يمكن وضع إلكترون ثالث في هذه الخانة، ولا إلكترونين بالحالة نفسها.':''}</Feedback>
 </Frame>;
}
function FillingLab() {
 const [boxes,setBoxes]=useState([0,0,0]);const [feedback,setFeedback]=useState('أضف الإلكترون الأول إلى أي خانة.');
 const add=(i:number)=>{if(boxes[i]>=2){setFeedback('الخانة ممتلئة بإلكترونين. لا يمكن إضافة ثالث إلى المدار نفسه.');return;}if(boxes[i]===1&&boxes.some(x=>x===0)){setFeedback('توجد خانة فارغة بالطاقة نفسها. ضع إلكتروناً منفرداً فيها أولاً قبل تكوين زوج؛ هذه قاعدة هوند.');return;}const b=[...boxes];b[i]++;setBoxes(b);setFeedback(b.every(x=>x===2)?'اكتملت المجموعة: ستة إلكترونات في ثلاثة مدارات، وفي كل مدار سهمان متعاكسان.':b.some(x=>x===0)?'جيد. بقيت خانات فارغة متساوية الطاقة؛ نضع فيها إلكترونات منفردة أولاً.':'شُغلت كل الخانات بإلكترون منفرد. الآن نستطيع تكوين أزواج بسهم معاكس.');};
 return <Frame intro="نتمرّن على ثلاثة مدارات متساوية الطاقة داخل مجموعة بي. كل مربع مدار، وكل سهم إلكترون يبيّن حالة لفّه الذاتي. نملأ المربعات بإلكترون منفرد أولاً، ثم نكوّن أزواجاً متعاكسة.">
 <div className="lab-boxes" dir="ltr">{boxes.map((n,i)=><button type="button" className="lab-box lab-box-large" key={i} onClick={()=>add(i)} aria-label={`أضف إلكتروناً إلى المدار ${i+1}، يحتوي الآن ${n}`}><span>{['','↑','↑↓'][n]}</span><small>{ar(i+1)}</small></button>)}</div><p className="lab-caption">اضغط الخانة التي تختارها للإلكترون التالي.</p>
 <button type="button" onClick={()=>{setBoxes([0,0,0]);setFeedback('بدأنا من جديد. اختر أي خانة للإلكترون الأول.');}}>افرغ الخانات وجرّب مجدداً</button><Feedback>{feedback}</Feedback>
 </Frame>;
}
const elementNames=['الهيدروجين','الهيليوم','الليثيوم','البيريليوم','البورون','الكربون','النيتروجين','الأكسجين','الفلور','النيون','الصوديوم','المغنيسيوم','الألومنيوم','السيليكون','الفوسفور','الكبريت','الكلور','الأرجون','البوتاسيوم','الكالسيوم'];
const groups=[{label:'1s',capacity:2,n:1},{label:'2s',capacity:2,n:2},{label:'2p',capacity:6,n:2},{label:'3s',capacity:2,n:3},{label:'3p',capacity:6,n:3},{label:'4s',capacity:2,n:4}];
function occupancy(count:number) {let remaining=count;return groups.map(g=>{const used=Math.min(remaining,g.capacity);remaining-=used;return used;});}
function ConfigurationsLab({valence=false}:{valence?:boolean}) {
 const [element,setElement]=useState(valence?11:8);const [filled,setFilled]=useState(valence?11:0);
 const counts=occupancy(valence?element:filled);const maxLevel=Math.max(...groups.filter((_,i)=>counts[i]>0).map(x=>x.n),0);const outer=counts.reduce((sum,c,i)=>sum+(groups[i].n===maxLevel?c:0),0);
 const choose=(n:number)=>{setElement(n);setFilled(valence?n:0);};
 return <Frame intro={valence?'نبحث عن أكبر رقم مستوى رئيسي موجود في التوزيع. الإلكترونات الموجودة في هذا المستوى هي الإلكترونات الخارجية للذرّات البسيطة التي ندرسها هنا. في الرسم تُلوّن مجموعاتها بالذهبي.':'سنوزّع إلكترونات ذرّة متعادلة في حالتها الأقل طاقة. العدد الأول في الاسم للمستوى، والحرف للعائلة، والعدد المرتفع لعدد الإلكترونات. نملأ المجموعات بالترتيب المعروض؛ بعد الثالثة بي تأتي الرابعة إس لهذه الأمثلة.'}>
  <label className="lab-select">اختر ذرّة متعادلة<select value={element} onChange={e=>choose(Number(e.target.value))}>{elementNames.map((name,i)=><option key={name} value={i+1}>{name} · {ar(i+1)} إلكتروناً</option>)}</select></label>
  {!valence&&<><div className="lab-picks"><button type="button" onClick={()=>setFilled(x=>Math.min(element,x+1))} disabled={filled>=element}>أضف الإلكترون التالي</button><button type="button" onClick={()=>setFilled(element)}>أكمل التوزيع</button><button type="button" onClick={()=>setFilled(0)}>ابدأ من جديد</button></div><p>وُزّع {ar(filled)} من {ar(element)} إلكتروناً.</p></>}
  <div className="lab-config" dir="ltr">{groups.map((g,i)=><div className={`lab-config-group ${valence&&g.n===maxLevel&&counts[i]>0?'outer':''} ${counts[i]===0?'empty':''}`} key={g.label}><b>{g.label}<sup>{counts[i]}</sup></b><div className="lab-boxes">{Array.from({length:g.capacity/2},(_,j)=><span className="lab-box" key={j}>{counts[i]>j?'↑':''}{counts[i]>g.capacity/2+j?'↓':''}</span>)}</div></div>)}</div>
  <Feedback>{valence?`أكبر رقم مستوى مستخدم هو ${ar(maxLevel)}. مجموع إلكتروناته ${ar(outer)}. هذه هي الإلكترونات الخارجية في ${elementNames[element-1]} المتعادلة.`:filled===0?'لم نضع إلكترونات بعد. ابدأ بالمجموعة الأولى: واحد إس.':filled===element?`اكتمل توزيع ${elementNames[element-1]}. جمع الأعداد المرتفعة يعطينا ${ar(element)}، وهو عدد الإلكترونات في الذرّة المتعادلة.`:`بعد هذه الخطوة لدينا ${ar(filled)} إلكتروناً موزّعاً، وبقي ${ar(element-filled)}. الخانات الشاغرة لا تعني أنها ممنوعة؛ لم نصل إليها بعد.`}</Feedback>
  {valence&&<p className="lab-caution">هذه الأمثلة للعناصر العشرين الأولى. وصف إلكترونات التكافؤ في العناصر الانتقالية يحتاج تفصيلاً إضافياً؛ ليس دائماً مجرد عدّ المستوى الخارجي.</p>}
 </Frame>;
}
function PrincipalLab() {
 const [n,setN]=useState(1);
 return <Frame intro="رقم المستوى الرئيسي نكتبه بالحرف اللاتيني الصغير إن، ورمزه n. لحساب السعة القصوى نضرب رقم المستوى بنفسه ثم نضرب الناتج في اثنين. علامة الضرب تعني تكرار المجموعة، وعلامة المساواة تعني أن الطرفين يعطيان العدد نفسه. وللمستويات السبعة أسماء قديمة بحروف كبيرة تُقرأ: كي، إل، إم، إن، أو، بي، كيو؛ وهي K وL وM وN وO وP وQ على الترتيب.">
  <Range label="رقم المستوى الرئيسي" value={n} min={1} max={7} onChange={setN}/>
  <div className="lab-equation" dir="ltr">2 × {n} × {n} = {2*n*n}</div>
  <div className="lab-stats"><span>رقم المستوى <b>{ar(n)}</b></span><span>اسم المستوى بالحرف <b dir="ltr">{['K','L','M','N','O','P','Q'][n-1]}</b></span><span>السعة القصوى <b>{ar(2*n*n)}</b></span></div>
  <Feedback>المستوى رقم {ar(n)} يتّسع حتى {ar(2*n*n)} إلكتروناً. هذا حدّ السعة، لا عدد الإلكترونات الفعلي في أي ذرّة، ولا ترتيب امتلاء المستويات كلها.</Feedback>
  <p className="lab-caution">حروف أسماء المستويات تُقرأ بالترتيب: كي، إل، إم، إن، أو، بي، كيو. الحرف الكبير هنا اسم قديم للمستوى؛ لا تخلطه بحروف عائلات المدارات الصغيرة.</p>
 </Frame>;
}
function SecondaryLab() {
 const [n,setN]=useState(3);const [l,setL]=useState(0);
 return <Frame intro="نستخدم رقماً ثانياً لتمييز العائلة داخل المستوى. رمزه حرف إل الصغير المزخرف، ℓ. الصفر يعني إس، والواحد بي، والاثنان دي، والثلاثة إف. القيم المسموحة تبدأ من صفر وتتوقف قبل رقم المستوى بواحد. نجرب أول أربعة مستويات هنا، لأننا تعلّمنا أول أربع عائلات. في المستويات الأعلى توجد عائلات إضافية أيضاً.">
  <Range label="رقم المستوى الرئيسي" value={n} min={1} max={4} onChange={v=>{setN(v);setL(x=>Math.min(x,v-1));}}/>
  <Picks items={Array.from({length:n},(_,i)=>`${ar(i)} · ${shapes[i]}`)} value={l} onChange={setL}/><ShapeVisual shape={l}/>
  <Feedback>في المستوى رقم {ar(n)} القيم المسموحة للعدد الثاني هي {Array.from({length:n},(_,i)=>ar(i)).join('، ')}. اختيار {ar(l)} يعني عائلة {shapes[l]}، فيكون اسم المجموعة <b dir="ltr">{n}{shapes[l]}</b>.</Feedback>
 </Frame>;
}
function MagneticLab() {
 const [l,setL]=useState(1);const [m,setM]=useState(0);
 const values=Array.from({length:2*l+1},(_,i)=>i-l);
 return <Frame intro="بعد تحديد العائلة نحتاج رقماً يميّز الحالات المدارية داخلها. نسمّيه العدد المغناطيسي ورمزه mℓ، ويُقرأ «إم إل». علامتا السالب والموجب تعنيان قيماً على جانبي الصفر، وليستا شحنة الإلكترون. القيم من سالب رقم العائلة إلى موجبه.">
  <Picks items={['عائلة إس · عددها الثاني صفر','عائلة بي · عددها الثاني واحد','عائلة دي · عددها الثاني اثنان','عائلة إف · عددها الثاني ثلاثة']} value={l} onChange={v=>{setL(v);setM(0);}}/>
  <div className="lab-numberline" dir="ltr">{values.map(v=><button type="button" key={v} aria-pressed={v===m} className={v===m?'is-active':''} onClick={()=>setM(v)}>{v>0?'+':''}{v}</button>)}</div>
  <Feedback>هنا {ar(values.length)} قيم مسموحة، ولذلك توجد {ar(values.length)} حالات مدارية في هذه العائلة. القيمة المختارة <b dir="ltr">{m>0?'+':''}{m}</b>. كل مدار يستوعب إلكترونين، فتكون سعة المجموعة {ar(values.length*2)}.</Feedback>
  <p className="lab-caution">لا نربط كل عدد سالب أو موجب بفصّ منفصل في صورة المدار. الرسوم الواقعية المعروفة لاتجاهات مدارات بي ودي ليست مطابقة ببساطة لهذه القيم واحداً لواحد.</p>
 </Frame>;
}
function AddressLab() {
 const [n,setN]=useState(3);const [l,setL]=useState(2);const [m,setM]=useState(0);const [spin,setSpin]=useState(0);
 const adjustN=(v:number)=>{const nextL=Math.min(l,v-1);setN(v);setL(nextL);setM(x=>Math.max(-nextL,Math.min(nextL,x)));};
 return <Frame intro="نجمع أربعة أوصاف بالترتيب: رقم المستوى، ثم رقم العائلة، ثم رقم الحالة المدارية، ثم حالة اللف الذاتي. الرموز التي تعلمناها هي n وℓ وmℓ وms. النصف يعني واحداً مقسوماً على اثنين؛ الموجب والسالب يميّزان حالتي اللف، لا شحنة الإلكترون. نقتصر هنا على أول أربعة مستويات والعائلات الأربع التي تعلّمناها؛ للمستويات الأعلى عائلات إضافية.">
  <div className="lab-address-controls"><label className="lab-select">المستوى الرئيسي<select value={n} onChange={e=>adjustN(Number(e.target.value))}>{[1,2,3,4].map(v=><option key={v} value={v}>{ar(v)}</option>)}</select></label>
  <label className="lab-select">رقم العائلة<select value={l} onChange={e=>{const v=Number(e.target.value);setL(v);setM(x=>Math.max(-v,Math.min(v,x)));}}>{Array.from({length:n},(_,i)=><option key={i} value={i}>{ar(i)} · {shapes[i]}</option>)}</select></label>
  <label className="lab-select">الحالة المدارية<select dir="ltr" value={m} onChange={e=>setM(Number(e.target.value))}>{Array.from({length:2*l+1},(_,i)=>i-l).map(v=><option value={v} key={v}>{v>0?'+':''}{v}</option>)}</select></label>
  <label className="lab-select">حالة اللف الذاتي<select value={spin} onChange={e=>setSpin(Number(e.target.value))}><option value={0}>موجب نصف · ↑</option><option value={1}>سالب نصف · ↓</option></select></label></div>
  <div className="lab-equation" dir="ltr">({n}, {l}, {m>0?'+':''}{m}, {spin===0?'+½':'−½'})</div>
  <Feedback>نقرأ من اليسار: المستوى {ar(n)}، العائلة {shapes[l]}، الحالة المدارية {m>0?'موجب ':m<0?'سالب ':''}{ar(Math.abs(m))}، ثم لف ذاتي {spin===0?'موجب نصف':'سالب نصف'}. المجموعة هي <b dir="ltr">{n}{shapes[l]}</b>. الخيارات تتغيّر تلقائياً حتى يبقى العنوان مسموحاً.</Feedback>
 </Frame>;
}
const challengeQuestions=[
 {q:'في الكتابة 2p⁴، ماذا يعني العدد المرتفع أربعة؟',options:['أربعة إلكترونات في المجموعة','المستوى الرابع','أربعة مدارات'],a:0,why:'العدد الأول للمستوى، والحرف للعائلة، والعدد الصغير المرتفع لعدد الإلكترونات الفعلي.'},
 {q:'مجموعة دي تضم خمسة مدارات. ما سعتها القصوى؟',options:['خمسة إلكترونات','عشرة إلكترونات','عشرون إلكتروناً'],a:1,why:'كل مدار يسع إلكترونين. خمس مجموعات من اثنين تعطي عشرة؛ ليس كل مدار إلكتروناً واحداً فقط.'},
 {q:'إلكترون في المستوى الثاني. هل يمكن أن يكون رقم العائلة اثنين؟',options:['نعم لأن المستوى الثاني','لا؛ المسموح صفر أو واحد','نعم لأي مستوى'],a:1,why:'رقم العائلة يبدأ بصفر ويقل عن رقم المستوى. المستوى الثاني يسمح بصفر وواحد فقط، أي إس وبي.'},
 {q:'هل يجوز وضع إلكترونين بسهمين إلى أعلى في المدار نفسه؟',options:['نعم دائماً','نعم إذا كان المستوى كبيراً','لا؛ حالتا اللف يجب أن تتعاكسا'],a:2,why:'في المدار نفسه يجب أن يختلف الإلكترونان في حالة اللف الذاتي. لذلك نرسم سهماً إلى أعلى وآخر إلى أسفل.'},
 {q:'المستوى الثالث يسع ثمانية عشر إلكتروناً. هل يجب أن يحتوي دائماً ثمانية عشر؟',options:['نعم، السعة هي الموجود','لا، السعة حد أقصى','يحتوي تسعة دائماً'],a:1,why:'السعة القصوى تخبرنا كم يمكن أن يتّسع له المستوى، أما العدد الموجود فيعتمد على الذرّة وحالتها.'},
 ];
function ChallengeLab() {
 const [index,setIndex]=useState(0);const [answer,setAnswer]=useState<number|null>(null);const [solved,setSolved]=useState<number[]>([]);
 const q=challengeQuestions[index];
 return <Frame intro="هذه مراجعة تجمع المعاني التي تعلّمناها. في أمثلة الكتابة: العدد الأول للمستوى، والحرف لعائلة المدارات، والعدد المرتفع للإلكترونات. اقرأ السؤال ثم اختر؛ سيظهر تفسير الإجابة.">
 <p className="lab-caption">السؤال {ar(index+1)} من {ar(challengeQuestions.length)} · أجبت بصورة صحيحة عن {ar(solved.length)}</p><h3>{q.q}</h3>
 <div className="lab-answers">{q.options.map((option,i)=><button type="button" key={i} aria-pressed={answer===i} className={answer===i?'is-active':''} onClick={()=>{setAnswer(i);if(i===q.a)setSolved(s=>s.includes(index)?s:[...s,index]);}}>{option}</button>)}</div>
 {answer!==null&&<Feedback>{answer===q.a?'صحيح. ':'راجع هذه النقطة: '}{q.why}</Feedback>}
 <div className="lab-picks"><button type="button" disabled={index===0} onClick={()=>{setIndex(x=>x-1);setAnswer(null);}}>السؤال السابق</button><button type="button" disabled={index===challengeQuestions.length-1} onClick={()=>{setIndex(x=>x+1);setAnswer(null);}}>السؤال التالي</button><button type="button" onClick={()=>{setIndex(0);setAnswer(null);setSolved([]);}}>أعد المراجعة</button></div>
 </Frame>;
}
export default function Labs({kind}:{kind:string}) {
 switch(kind) {
  case 'matter':return <MatterLab key={kind}/>;
  case 'zoom':return <MatterLab key={kind} zoom/>;
  case 'atom':case 'charge':case 'isotope':return <AtomLab key={kind} kind={kind}/>;
  case 'scattering':return <ScatteringLab/>;
  case 'wave':return <WaveLab/>;
  case 'energy':return <EnergyLab/>;
  case 'probability':return <ProbabilityLab key={kind}/>;
  case 'cloud':return <ProbabilityLab key={kind} cloud/>;
  case 'levels':return <LevelsLab/>;
  case 'shapes':return <ShapesLab/>;
  case 'labels':return <LabelsLab/>;
  case 'capacity':return <CapacityLab key={kind}/>;
  case 'notation':return <CapacityLab key={kind} notation/>;
  case 'spin':return <SpinLab/>;
  case 'filling':return <FillingLab/>;
  case 'configurations':return <ConfigurationsLab key={kind}/>;
  case 'valence':return <ConfigurationsLab key={kind} valence/>;
  case 'principal':return <PrincipalLab/>;
  case 'secondary':return <SecondaryLab/>;
  case 'magnetic':return <MagneticLab/>;
  case 'address':return <AddressLab/>;
  case 'challenge':return <ChallengeLab/>;
  default:return <p>جرّب أمثلة الدرس ثم انتقل إلى أسئلة الفهم.</p>;
 }
}
