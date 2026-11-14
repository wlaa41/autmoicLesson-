import { foundations } from './foundations';
import { orbitals } from './orbitals';
import { advanced } from './advanced';
import { bridges } from './bridges';
export const lessons = [...foundations, ...orbitals, ...advanced, ...bridges];
export const stages = [...new Set(lessons.map(l => l.stage))];
export const allTerms = lessons.flatMap(l => l.terms.map(t => ({...t, lessonId:l.id, slug:l.slug, lessonTitle:l.title})));
