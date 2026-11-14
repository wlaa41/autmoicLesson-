import {Header,Footer} from '@/components/course/Shell';
import OrbitalAtlas from '@/components/course/OrbitalAtlas';
export const metadata={title:'من الصورة إلى الحرف | دليل المدارات المصوّر'};
export default function Page(){return <><Header/><main id="main" className="page-width standalone"><p className="eyebrow">دليلك المصوّر · من الفكرة إلى اسمها</p><h1>لنرَ ما تعنيه<br/>هذه الحروف.</h1><p className="standalone-intro">رسوم كبيرة، وأجزاء يمكنك تحديدها، وأسماء نفكّكها معاً. ابدأ بالشكل، ثم اكشف حرفه، ثم قارن بين الأمثلة.</p><OrbitalAtlas/></main><Footer/></>}
