export type Term = { word: string; meaning: string; symbol?: string; say?: string; example: string };
export type Section = { title: string; paragraphs: string[]; note?: string };
export type WorkedExample = { title: string; question: string; steps: string[]; answer: string };
export type Question = { prompt: string; options: string[]; correct: number; explanations: string[]; hint: string };
export type Lesson = {
  id: number; slug: string; title: string; subtitle: string; stage: string; minutes: number;
  why: string; needs: string[]; terms: Term[]; sections: Section[];
  examples: WorkedExample[]; lab: string; labIntro: string;
  questions: Question[]; takeaway: string; bridge: string;
};
