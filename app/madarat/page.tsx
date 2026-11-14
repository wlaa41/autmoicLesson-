import {Header,Footer} from '@/components/course/Shell';
import CloudExplorer from '@/components/course/CloudExplorer';
import Link from 'next/link';
export const metadata={title:'مختبر خرائط الاحتمال'};
export default function Page(){return <><Header/><main id="main" className="page-width standalone"><p className="eyebrow">المختبر البصري</p><h1>ماذا لو استطعنا رؤية<br/>خريطة الأماكن المحتملة؟</h1><p className="standalone-intro">سنشرح ما تعنيه النقاط أولاً، ثم ندوّر الخريطة وننظر داخلها. يمكنك التجربة هنا، أو البدء بالشرح المتدرّج.</p><Link className="text-link" href="/learn/probability/">ابدأ بشرح معنى الاحتمال ←</Link><CloudExplorer/></main><Footer/></>}
