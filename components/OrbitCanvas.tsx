'use client';

import { useEffect, useRef, useState } from 'react';

const orbitals = {
  s: { label: 's · كروي', lobes: 1 },
  p: { label: 'p · فصّان', lobes: 2 },
  d: { label: 'd · أربعة فصوص', lobes: 4 },
  f: { label: 'f · شكل أعقد', lobes: 8 },
};

type OrbitalKey = keyof typeof orbitals;

export default function OrbitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [orbital, setOrbital] = useState<OrbitalKey>('p');
  const [angle, setAngle] = useState(0.4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rect.width, rect.height) * 0.55);
    gradient.addColorStop(0, '#1e2646');
    gradient.addColorStop(1, '#0d1328');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(255,255,255,.12)';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(rect.width, rect.height) * .28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#f8f1c6';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    const { lobes } = orbitals[orbital];
    for (let l = 0; l < lobes; l++) {
      const theta = angle + (l * Math.PI * 2) / lobes;
      const x = Math.cos(theta) * Math.min(rect.width, rect.height) * .22;
      const y = Math.sin(theta) * Math.min(rect.width, rect.height) * .13;
      const phase = l % 2 === 0 ? 'rgba(107, 183, 255, .62)' : 'rgba(255, 132, 112, .58)';
      const glow = ctx.createRadialGradient(cx + x, cy + y, 0, cx + x, cy + y, Math.min(rect.width, rect.height) * .18);
      glow.addColorStop(0, phase);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(cx + x, cy + y, Math.min(rect.width, rect.height) * .16, Math.min(rect.width, rect.height) * .09, theta, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [orbital, angle]);

  return (
    <section className="orbit-lab app-width">
      <div className="orbit-panel">
        <h2>اختر نوع المدار</h2>
        <p>هذه محاكاة تعليمية مبسطة: الهدف فهم الشكل العام وكثافة الاحتمال، لا حساب القيم الدقيقة.</p>
        <div className="orbit-buttons">
          {(Object.keys(orbitals) as OrbitalKey[]).map((key) => <button key={key} onClick={() => setOrbital(key)} aria-pressed={orbital === key}>{orbitals[key].label}</button>)}
        </div>
        <label>دوّر الرسم<input type="range" min="0" max="628" value={Math.round(angle * 100)} onChange={(e) => setAngle(Number(e.target.value) / 100)} /></label>
      </div>
      <canvas ref={canvasRef} className="orbit-canvas" aria-label="محاكاة مدار إلكتروني" />
    </section>
  );
}
