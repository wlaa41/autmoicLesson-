'use client';
import {useState} from 'react';
import type {Question} from '@/data/course/types';
export default function Quiz({question,index,onCorrect}:{question:Question;index:number;onCorrect?:()=>void}){
 const [chosen,setChosen]=useState<number|null>(null),[hint,setHint]=useState(false);
 return <section className="question-card"><span className="question-number">تأكّد من فهمك · {index+1}</span><h3>{question.prompt}</h3><div className="answer-options">{question.options.map((option,i)=><button key={i} aria-pressed={chosen===i} className={chosen===i?(i===question.correct?'answer correct':'answer incorrect'):'answer'} onClick={()=>{setChosen(i);if(i===question.correct)onCorrect?.()}}><span className="option-dot">{['أ','ب','ج','د','هـ'][i]}</span><span>{option}</span>{chosen===i&&<span aria-hidden="true">{i===question.correct?'✓':'↺'}</span>}</button>)}</div><div aria-live="polite">{chosen!==null&&<div className={'answer-feedback '+(chosen===question.correct?'good':'retry')}><strong>{chosen===question.correct?'صحيح، والسبب:':'لنراجع هذه الفكرة:'}</strong><p>{question.explanations[chosen]}</p>{chosen!==question.correct&&<span>يمكنك اختيار إجابة أخرى.</span>}</div>}</div><button className="subtle-button" onClick={()=>setHint(!hint)} aria-expanded={hint}>{hint?'إخفاء التلميح':'أحتاج إلى تلميح'}</button>{hint&&<p className="hint">{question.hint}</p>}</section>
}
