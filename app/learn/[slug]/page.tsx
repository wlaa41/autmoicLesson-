import {lessons} from '@/data/course';
import LessonView from '@/components/course/LessonView';
import {Header,Footer} from '@/components/course/Shell';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return lessons.map(l=>({slug:l.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:lessons.find(l=>l.slug===slug)?.title||'الدرس'}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=lessons.find(l=>l.slug===slug);if(!lesson)notFound();return <><Header/><LessonView key={lesson.slug} lesson={lesson}/><Footer/></>}
