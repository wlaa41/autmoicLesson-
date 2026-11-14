import {Header,Footer} from '@/components/course/Shell';
import Practice from '@/components/course/Practice';
import {lessons} from '@/data/course';
export const metadata={title:'تدرّب على ما تعلّمته'};
export default function Page(){return <><Header/><main className="page-width standalone narrow" id="main"><p className="eyebrow">المراجعة مع التفسير</p><h1>الفهم يأتي مع المحاولة.</h1><p className="standalone-intro">{lessons.reduce((n,l)=>n+l.questions.length,0)} سؤالاً متدرّجاً. لكل اختيار تفسير، ولكل سؤال تلميح.</p><Practice/></main><Footer/></>}
