import Link from 'next/link';
import OrbitCanvas from '@/components/OrbitCanvas';

export default function MadaratPage() {
  return (
    <main className="madarat-shell">
      <header className="topbar app-width">
        <Link href="/" className="brand">مدارات</Link>
        <Link href="/">العودة إلى الدرس</Link>
      </header>
      <section className="madarat-hero app-width">
        <p className="eyebrow">مختبر بصري</p>
        <h1>شاهد المدار كخريطة احتمال، وليس كمسار سيارة.</h1>
        <p>غيّر نوع المدار، ثم دوّر السحابة. النقاط الكثيفة تعني أن احتمال العثور على الإلكترون هناك أعلى.</p>
      </section>
      <OrbitCanvas />
    </main>
  );
}
