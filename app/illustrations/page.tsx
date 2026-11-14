import {Header,Footer} from '@/components/course/Shell';
import OrbitalAtlas from '@/components/course/OrbitalAtlas';
export const metadata={title:'لماذا توجد هذه الأشكال؟ | دليل المدارات من البداية'};
export default function Page(){return <><Header/><main id="main" className="page-width standalone"><p className="eyebrow">قبل الرسوم والأسماء والحروف</p><h1>لماذا توجد<br/>هذه الأشكال؟</h1><p className="standalone-intro">نبدأ بما نحاول وصفه، ثم نفهم سبب اختلاف الأشكال. نجمع نتائج تجربة بأنفسنا، وبعد ذلك فقط نسمّي ما فهمناه.</p><OrbitalAtlas/></main><Footer/></>}
