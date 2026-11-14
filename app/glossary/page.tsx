import {Header,Footer} from '@/components/course/Shell';
import Glossary from '@/components/course/Glossary';
export const metadata={title:'افهم كل كلمة ورمز'};
export default function Page(){return <><Header/><main className="page-width standalone" id="main"><p className="eyebrow">مرجعك أثناء التعلّم</p><h1>كل كلمة لها بداية.</h1><p className="standalone-intro">ابحث عمّا حيّرك. سنعرض المعنى أولاً، ثم اسمه ورمزه، ومثالاً عليه، ورابط الدرس الذي يشرحه من البداية.</p><Glossary/></main><Footer/></>}
