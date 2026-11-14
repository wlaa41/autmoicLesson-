import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: {default:'مدارات | افهم الذرّة، من البداية',template:'%s | مدارات'},
 description:'رحلة عربية تفاعلية من الأشياء حولنا إلى بنية الذرة والتوزيع الإلكتروني. نفهم الفكرة أولاً، ثم الاسم، ثم الرمز. أمثلة محلولة وتجارب وأسئلة بتفسير لكل إجابة.',
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="ar" dir="rtl"><body><a className="skip-link" href="#main">انتقل إلى المحتوى</a>{children}</body></html>;
}
