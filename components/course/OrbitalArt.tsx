'use client';

import { useId } from 'react';

export type OrbitalFamily = 's' | 'p' | 'd' | 'f';
export type OrbitalArtProps = {
  family: OrbitalFamily;
  /** p: 0 vertical, 1 first horizontal direction, 2 second horizontal direction.
   * d: 0 xy, 1 xz, 2 yz, 3 x²−y², 4 z². s: 1 is a radial-node cutaway. */
  variant?: number;
  /** Camera orbit in degrees, with gentle tilt/roll so vertical lobes visibly turn. */
  angle?: number;
  /** Zero-based highlighted lobe, not a quantum number or an electron count. */
  highlight?: number;
  labels?: boolean;
  compact?: boolean;
};

export const ORBITAL_FAMILIES = {
  s: { name: 'العائلة الكروية', say: 'إس', orbitals: 1, capacity: 2 },
  p: { name: 'العائلة ذات الفصّين', say: 'بي', orbitals: 3, capacity: 6 },
  d: { name: 'عائلة الأشكال الأكثر تنوّعاً', say: 'دي', orbitals: 5, capacity: 10 },
  f: { name: 'عائلة الأشكال الأكثر تعقيداً', say: 'إف', orbitals: 7, capacity: 14 },
} as const;

type Vector = readonly [number, number, number];
type Point = { x: number; y: number; depth: number };
const normalise = (v: Vector): Vector => {
  const n = Math.hypot(...v);
  return [v[0] / n, v[1] / n, v[2] / n];
};

function directions(family: OrbitalFamily, variant: number): Vector[] {
  if (family === 's') return [];
  if (family === 'p') {
    const axis: Vector = variant % 3 === 1 ? [1, 0, 0] : variant % 3 === 2 ? [0, 1, 0] : [0, 0, 1];
    return [axis, [-axis[0], -axis[1], -axis[2]]];
  }
  if (family === 'd') {
    if (variant % 5 === 4) return [[0, 0, 1], [0, 0, -1]];
    if (variant % 5 === 3) return [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]];
    const plane = variant % 5;
    return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => normalise(plane === 1 ? [a, 0, b] : plane === 2 ? [0, a, b] : [a, b, 0]));
  }
  return [-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => normalise([x, y, z]))));
}

/**
 * Schematic spatial illustrations of familiar real atomic orbitals.
 * These are projected, shaded lobes, not numerically calculated isosurfaces.
 * Colour encodes neither charge nor wavefunction phase. View rotation does not
 * assign magnetic quantum numbers to the familiar real-orbital pictures.
 */
export default function OrbitalArt({ family, variant = 0, angle = 0, highlight, labels = true, compact = false }: OrbitalArtProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const named = labels && !compact;
  const cutaway = family === 's' && variant === 1;
  const ring = family === 'd' && variant % 5 === 4;
  const cx = 220, cy = 143;
  const radians = angle * Math.PI / 180;
  const yaw = -.62 + radians;
  // A pure orbit about the vertical axis leaves a vertical two-lobed picture
  // unchanged. Tilt and roll the camera gently as it orbits. Keep the tilt
  // bounded so a lobe never collapses into an edge-on line in this sketch.
  const pitch = .48 + .22 * Math.sin(radians);
  const roll = .45 * Math.sin(radians);
  const project = (v: Vector): Point => {
    const x = Math.cos(yaw) * v[0] + Math.sin(yaw) * v[1];
    const y = -(-Math.sin(yaw) * Math.sin(pitch) * v[0] + Math.cos(yaw) * Math.sin(pitch) * v[1] + Math.cos(pitch) * v[2]);
    return {
      x: x * Math.cos(roll) - y * Math.sin(roll),
      y: x * Math.sin(roll) + y * Math.cos(roll),
      depth: -Math.sin(yaw) * Math.cos(pitch) * v[0] + Math.cos(yaw) * Math.cos(pitch) * v[1] - Math.sin(pitch) * v[2],
    };
  };
  const vectors = directions(family, Math.max(0, Math.floor(variant)));
  const lobes = vectors.map((v, i) => ({ ...project(v), i })).sort((a, b) => a.depth - b.depth);
  const noun = family === 's' ? 'خريطة كروية واحدة' : 'كل الأجزاء المرسومة تنتمي إلى مدار واحد';
  const description = cutaway
    ? 'مقطع توضيحي لسحابة كروية ذات منطقة داخلية وأخرى خارجية. بينهما سطح كروي ينعدم عنده احتمال العثور على الإلكترون. الفاصل مُبرز لتسهيل رؤيته؛ لا يمثّل مساراً أو جداراً.'
    : ring
      ? 'رسم منظور لمدار واحد له فصّان وحلقة حول الوسط. الحلقة منطقة من خريطة الاحتمال وليست مسار حركة.'
      : family === 's'
        ? 'سحابة متناظرة كروياً حول النواة. حواف اللون تتلاشى؛ لا يوجد جدار صلب حول المدار.'
        : family === 'p'
          ? 'فصّان على جانبي النواة، وهما جزآن من خريطة مدار واحد. تغيير جهة النظر يغيّر مظهر الرسم فقط.'
          : family === 'd'
            ? 'أربعة فصوص حول النواة في رسم منظور لمدار واحد. هذا مثال من العائلة، وليس شكل جميع مداراتها.'
            : 'مثال واحد لمدار ذي ثمانية فصوص موزّعة في الفراغ. قد يحجب بعضها بعضاً في المنظور. لعائلته أشكال أخرى أيضاً.';

  const lobe = (p: Point & { i: number }) => {
    const projectedLength = Math.hypot(p.x, p.y);
    const ux = projectedLength > .001 ? p.x / projectedLength : 0;
    const uy = projectedLength > .001 ? p.y / projectedLength : -1;
    const length = 119 * projectedLength;
    // The visible cross-section widens as a lobe turns towards the viewer.
    const width = (family === 'f' ? 22 : family === 'd' ? 29 : 35) * (.88 + .12 * Math.abs(p.depth));
    const at = (distance: number, sideways: number) => `${cx + ux * distance - uy * sideways},${cy + uy * distance + ux * sideways}`;
    const selected = highlight === undefined || highlight < 0 || highlight === p.i;
    const outline = `M${at(2, 0)} C${at(length * .24, width * .26)} ${at(length * .43, width)} ${at(length * .72, width * .85)} C${at(length * 1.08, width * .69)} ${at(length * 1.08, -width * .69)} ${at(length * .72, -width * .85)} C${at(length * .43, -width)} ${at(length * .24, -width * .26)} ${at(2, 0)} Z`;
    return <path key={p.i} d={outline} fill={`url(#${id}-lobe)`} stroke={highlight === p.i ? '#b88636' : '#367e6e'} strokeWidth={highlight === p.i ? 2.4 : 1.05} opacity={selected ? .6 + .27 * ((p.depth + 1) / 2) : .17} />;
  };
  const circlePath = (radius: number, reverse = false) => Array.from({ length: 65 }, (_, i) => {
    const t = (reverse ? -1 : 1) * i / 64 * Math.PI * 2;
    const p = project([Math.cos(t) * radius, Math.sin(t) * radius, 0]);
    return `${i ? 'L' : 'M'}${cx + p.x},${cy + p.y}`;
  }).join(' ') + ' Z';
  const mainDescription = named ? description : `${noun}. ${description}`;

  return <svg className={`orbital-art${compact ? ' orbital-art-compact' : ''}`} viewBox={`0 0 440 ${named ? 355 : 286}`} role="img" aria-labelledby={`${id}-title ${id}-description`} data-family={family} data-variant={variant} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
    <title id={`${id}-title`}>{`${ORBITAL_FAMILIES[family].name} — ${noun}`}</title>
    <desc id={`${id}-description`}>{mainDescription} النقطة الذهبية تمثّل النواة، وهي مكبّرة وليست على المقياس الحقيقي. اللون لا يدلّ على شحنة مختلفة.</desc>
    <defs>
      <radialGradient id={`${id}-sphere`} cx="37%" cy="31%" r="67%"><stop offset="0" stopColor="#e3f4e9" stopOpacity=".92"/><stop offset=".32" stopColor="#8ecbb8" stopOpacity=".78"/><stop offset=".7" stopColor="#2d8c75" stopOpacity=".65"/><stop offset=".88" stopColor="#2d8c75" stopOpacity=".3"/><stop offset="1" stopColor="#2d8c75" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-radial-node`}><stop offset="0" stopColor="#237d67" stopOpacity=".95"/><stop offset=".14" stopColor="#449e85" stopOpacity=".85"/><stop offset=".25" stopColor="#81bca7" stopOpacity=".25"/><stop offset=".31" stopColor="#81bca7" stopOpacity="0"/><stop offset=".37" stopColor="#81bca7" stopOpacity="0"/><stop offset=".47" stopColor="#77b69f" stopOpacity=".22"/><stop offset=".67" stopColor="#4b9f85" stopOpacity=".55"/><stop offset=".87" stopColor="#6eae98" stopOpacity=".25"/><stop offset="1" stopColor="#6eae98" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-lobe`} cx="35%" cy="28%" r="85%"><stop offset="0" stopColor="#d2eee0"/><stop offset=".44" stopColor="#7bbda6"/><stop offset="1" stopColor="#247c64"/></radialGradient>
      <radialGradient id={`${id}-nucleus`} cx="30%" cy="28%"><stop offset="0" stopColor="#ffedbe"/><stop offset=".5" stopColor="#d9aa54"/><stop offset="1" stopColor="#a7782f"/></radialGradient>
    </defs>
    {named && <text x="220" y="22" textAnchor="middle" fill="#506d5e" fontSize="13" fontFamily="inherit">{cutaway ? 'مقطع يتيح رؤية الداخل' : noun}</text>}
    <ellipse cx={cx} cy="262" rx={family === 's' ? 73 : 60} ry="6" fill="#284b3c" opacity=".055"/>
    {family === 's' ? <>
      <circle cx={cx} cy={cy} r="110" fill={`url(#${id}-${cutaway ? 'radial-node' : 'sphere'})`}/>
      {!cutaway && <path d="M165 81 Q192 52 229 56" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".38"/>}
    </> : ring ? <>
      {lobes.filter(p => p.depth < 0).map(lobe)}
      <path d={`${circlePath(64)} ${circlePath(37, true)}`} fill={`url(#${id}-lobe)`} fillRule="evenodd" stroke="#367e6e" strokeWidth="1" opacity={highlight === undefined || highlight < 0 || highlight === 2 ? .83 : .2}/>
      {lobes.filter(p => p.depth >= 0).map(lobe)}
    </> : lobes.map(lobe)}
    <circle cx={cx} cy={cy} r="6" fill={`url(#${id}-nucleus)`} stroke="#fffaf0" strokeWidth="1.4"/>
    {named && <>
      <path d={`M${cx - 3},${cy + 8} L173,257 L115,277`} fill="none" stroke="#b99451" strokeWidth="1.15" strokeDasharray="3 4"/>
      <rect x="20" y="278" width="184" height="32" rx="9" fill="#fff9ec" stroke="#e7d8b7"/>
      <text x="112" y="299" textAnchor="middle" fontSize="13" fill="#725825" fontFamily="inherit">النقطة الذهبية: النواة</text>
      {cutaway ? <>
        <path d="M246 143 L350 209 L355 277" fill="none" stroke="#4b8c75" strokeWidth="1.1" strokeDasharray="3 4"/>
        <rect x="220" y="278" width="200" height="32" rx="9" fill="#eef6ed" stroke="#d7e6d9"/>
        <text x="320" y="299" textAnchor="middle" fontSize="12" fill="#386d59" fontFamily="inherit">داخلية · فاصل · خارجية</text>
      </> : <>
        <rect x="220" y="278" width="200" height="32" rx="9" fill="#eef6ed" stroke="#d7e6d9"/>
        <text x="320" y="299" textAnchor="middle" fontSize="12" fill="#386d59" fontFamily="inherit">{family === 's' ? 'اللون: خريطة الاحتمال' : ring ? 'فصّان وحلقة، ومدار واحد' : 'الجزء البارز يسمّى فصّاً'}</text>
      </>}
      <text x="220" y="336" textAnchor="middle" fontSize="11" fill="#718174" fontFamily="inherit">{cutaway ? 'الفاصل مُبرز للتوضيح؛ ليس مساراً أو جداراً.' : 'رسم توضيحي؛ لا حافة صلبة، ولا مقياس حقيقي للأحجام.'}</text>
    </>}
  </svg>;
}
