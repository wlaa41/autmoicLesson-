'use client';
import {useState} from 'react';
import Link from 'next/link';
import {lessons,stages} from '@/data/course';
import Quiz from './Quiz';
export default function Practice(){const [stage,setStage]=useState(stages[0]);const selected=lessons.filter(l=>l.stage===stage);return <><p className="careful-note">اختر مرحلة درستها بالفعل. كل سؤال مرتبط بشرحه؛ إذا وجدت كلمة جديدة فافتح الدرس أولاً. لا توجد مهلة ولا حدّ للمحاولات.</p><div className="practice-tabs">{stages.map(s=><button key={s} aria-pressed={stage===s} onClick={()=>setStage(s)}>{s}</button>)}</div><div key={stage}>{selected.map(l=><section className="practice-lesson" key={l.id}><div className="practice-lesson-heading"><h2>الدرس {l.id}: {l.title}</h2><Link href={'/learn/'+l.slug+'/'}>اشرح لي الفكرة أولاً ←</Link></div>{l.questions.map((q,i)=><Quiz key={i} question={q} index={i}/>)}</section>)}</div></>}
