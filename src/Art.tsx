// Generative SVG art: one motif per learning stage, one hue per part, seeded per chapter.
// Deterministic (same chapter → same picture), resolution-independent, theme-aware via CSS vars.
import { memo, type JSX } from "react";

function rng(seed: number) {                         // mulberry32
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hue for a part index: golden-angle spread gives distinct but harmonious colours. */
export const partHue = (partIndex: number) => Math.round((212 + partIndex * 137.508) % 360);

type R = () => number;
const W = 1200, H = 300;
const s1 = { stroke: "var(--art-1)" }, s2 = { stroke: "var(--art-2)" }, s3 = { stroke: "var(--art-3)" };
const f1 = { fill: "var(--art-1)" }, f2 = { fill: "var(--art-2)" }, f3 = { fill: "var(--art-3)" };

const motifs: ((r: R) => JSX.Element[])[] = [
  // 0 learn: a dot field where a few dots "light up"
  r => {
    const out: JSX.Element[] = [];
    for (let x = 30; x < W; x += 36) for (let y = 30; y < H; y += 36) {
      const lit = r() < 0.06, big = r() < 0.02;
      out.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={big ? 9 : lit ? 5 : 2} style={big ? f1 : lit ? f2 : f3} />);
    }
    return out;
  },
  // 1 computer: circuit traces with pads
  r => {
    const out: JSX.Element[] = [];
    for (let i = 0; i < 26; i++) {
      let x = Math.round(r() * W / 30) * 30, y = Math.round(r() * H / 30) * 30;
      let d = `M${x} ${y}`;
      for (let s = 0; s < 4; s++) {
        if (r() < 0.5) x += (r() < 0.5 ? -1 : 1) * 30 * (1 + Math.floor(r() * 5));
        else y += (r() < 0.5 ? -1 : 1) * 30 * (1 + Math.floor(r() * 3));
        d += ` L${x} ${y}`;
      }
      const st = i % 5 === 0 ? s1 : i % 2 ? s2 : s3;
      out.push(<path key={i} d={d} fill="none" strokeWidth={i % 5 === 0 ? 3 : 1.6} style={st} strokeLinejoin="round" />);
      out.push(<circle key={`p${i}`} cx={x} cy={y} r={i % 5 === 0 ? 7 : 4} style={i % 5 === 0 ? f1 : f2} />);
    }
    return out;
  },
  // 2 programs: rows of code-like bars (a zoomed-out editor)
  r => {
    const out: JSX.Element[] = [];
    let y = 26;
    while (y < H - 10) {
      let x = 40 + Math.floor(r() * 5) * 28;
      while (x < W - 60 && r() < 0.86) {
        const w = 20 + r() * 120, st = r() < 0.12 ? f1 : r() < 0.4 ? f2 : f3;
        out.push(<rect key={`${x}-${y}`} x={x} y={y} width={w} height={9} rx={4.5} style={st} />);
        x += w + 12;
      }
      y += 22;
    }
    return out;
  },
  // 3 engineers: git-style branching lanes
  r => {
    const out: JSX.Element[] = [];
    const lanes = [80, 150, 220];
    lanes.forEach((ly, li) => {
      out.push(<line key={`l${li}`} x1={li ? 200 + li * 120 : 20} y1={ly} x2={li ? 900 - li * 90 : W - 20} y2={ly} strokeWidth={li ? 3 : 4} style={li ? s2 : s1} strokeLinecap="round" />);
      for (let x = li ? 240 + li * 120 : 60; x < (li ? 880 - li * 90 : W - 40); x += 70 + r() * 60)
        out.push(<circle key={`c${li}-${x}`} cx={x} cy={ly} r={li ? 7 : 9} style={li ? f2 : f1} />);
    });
    for (let li = 1; li < 3; li++) {
      const x0 = 200 + li * 120, x1 = 900 - li * 90;
      out.push(<path key={`b${li}`} d={`M${x0 - 80} ${lanes[0]} C ${x0 - 30} ${lanes[0]}, ${x0 - 30} ${lanes[li]}, ${x0} ${lanes[li]}`} fill="none" strokeWidth={3} style={s2} />);
      out.push(<path key={`m${li}`} d={`M${x1} ${lanes[li]} C ${x1 + 50} ${lanes[li]}, ${x1 + 50} ${lanes[0]}, ${x1 + 100} ${lanes[0]}`} fill="none" strokeWidth={3} style={s3} />);
    }
    return out;
  },
  // 4 networks: layered signal waves with packets
  r => {
    const out: JSX.Element[] = [];
    for (let k = 0; k < 7; k++) {
      const amp = 12 + r() * 38, freq = 0.004 + r() * 0.012, ph = r() * 6, y0 = 40 + k * 36;
      let d = `M0 ${y0}`;
      for (let x = 0; x <= W; x += 12) d += ` L${x} ${(y0 + Math.sin(x * freq + ph) * amp).toFixed(1)}`;
      out.push(<path key={k} d={d} fill="none" strokeWidth={k === 3 ? 3 : 1.5} style={k === 3 ? s1 : k % 2 ? s2 : s3} />);
      const px = r() * W;
      out.push(<rect key={`p${k}`} x={px} y={y0 + Math.sin(px * freq + ph) * amp - 5} width={14} height={10} rx={2} style={k === 3 ? f1 : f2} />);
    }
    return out;
  },
  // 5 applications: interface cards stacked in depth
  r => {
    const out: JSX.Element[] = [];
    for (let i = 0; i < 14; i++) {
      const w = 120 + r() * 200, h = 60 + r() * 110, x = r() * (W - w), y = r() * (H - h);
      out.push(<rect key={i} x={x} y={y} width={w} height={h} rx={12} fill="none" strokeWidth={i % 4 === 0 ? 2.5 : 1.4} style={i % 4 === 0 ? s1 : i % 2 ? s2 : s3} />);
      out.push(<rect key={`h${i}`} x={x + 12} y={y + 12} width={w * 0.45} height={8} rx={4} style={i % 4 === 0 ? f1 : f3} />);
    }
    return out;
  },
  // 6 ships: isometric container stacks
  r => {
    const out: JSX.Element[] = [];
    const iso = (x: number, y: number, k: string, st: typeof f1) => {
      const w = 60, h = 34;
      out.push(<path key={k} d={`M${x} ${y} l${w} -${h / 2} l${w} ${h / 2} l-${w} ${h / 2} z`} style={st} opacity={0.9} />);
      out.push(<path key={`${k}s`} d={`M${x} ${y} l0 ${h} l${w} ${h / 2} l0 -${h} z`} style={f3} />);
      out.push(<path key={`${k}t`} d={`M${x + w} ${y + h / 2} l0 ${h} l${w} -${h / 2} l0 -${h} z`} style={f2} opacity={0.8} />);
    };
    for (let c = 0; c < 9; c++) {
      const x = 30 + c * 130, levels = 1 + Math.floor(r() * 4);
      for (let l = 0; l < levels; l++) iso(x, 240 - l * 36, `${c}-${l}`, l === levels - 1 && r() < 0.5 ? f1 : f2);
    }
    return out;
  },
  // 7 production: telemetry charts with a threshold line
  r => {
    const out: JSX.Element[] = [];
    for (let k = 0; k < 3; k++) {
      let v = 150 + k * 30, d = "", band = "";
      for (let x = 0; x <= W; x += 20) {
        v += (r() - 0.5) * 30; if (r() < 0.02) v -= 70; v = Math.min(H - 20, Math.max(30, v));
        d += `${x ? "L" : "M"}${x} ${v.toFixed(1)} `; band += `${x ? "L" : "M"}${x} ${(v + 18).toFixed(1)} `;
      }
      out.push(<path key={`b${k}`} d={band} fill="none" strokeWidth={1} style={s3} strokeDasharray="2 6" />);
      out.push(<path key={k} d={d} fill="none" strokeWidth={k === 0 ? 3 : 1.6} style={k === 0 ? s1 : s2} strokeLinejoin="round" />);
    }
    out.push(<line key="slo" x1={0} y1={60} x2={W} y2={60} strokeWidth={1.5} style={s1} strokeDasharray="10 8" />);
    return out;
  },
  // 8 distributed: orbiting nodes
  r => {
    const out: JSX.Element[] = [];
    const cx = W * (0.3 + r() * 0.4), cy = H / 2;
    for (let k = 1; k <= 6; k++) {
      const rx = 70 * k, ry = 26 * k;
      out.push(<ellipse key={k} cx={cx} cy={cy} rx={rx} ry={ry} fill="none" strokeWidth={k === 3 ? 2.5 : 1.3} style={k === 3 ? s1 : k % 2 ? s2 : s3} />);
      for (let n = 0; n < 1 + (k % 3); n++) {
        const a = r() * Math.PI * 2;
        out.push(<circle key={`${k}-${n}`} cx={cx + rx * Math.cos(a)} cy={cy + ry * Math.sin(a)} r={k === 3 ? 8 : 5} style={k === 3 ? f1 : f2} />);
      }
    }
    out.push(<circle key="core" cx={cx} cy={cy} r={14} style={f1} />);
    return out;
  },
  // 9 AI: a neural constellation
  r => {
    const out: JSX.Element[] = [];
    const layers = 6, pts: [number, number][][] = [];
    for (let l = 0; l < layers; l++) {
      const n = 3 + Math.floor(r() * 4), col: [number, number][] = [];
      for (let i = 0; i < n; i++) col.push([80 + l * ((W - 160) / (layers - 1)), 30 + (i + 0.5) * ((H - 60) / n) + (r() - 0.5) * 14]);
      pts.push(col);
    }
    for (let l = 0; l < layers - 1; l++) for (const a of pts[l]) for (const b of pts[l + 1])
      if (r() < 0.55) out.push(<line key={`${a}-${b}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth={r() < 0.12 ? 2.2 : 0.9} style={r() < 0.12 ? s1 : s3} />);
    pts.flat().forEach(([x, y], i) => out.push(<circle key={`n${i}`} cx={x} cy={y} r={r() < 0.2 ? 9 : 6} style={r() < 0.25 ? f1 : f2} />));
    return out;
  },
  // 10 build: a rising staircase of blocks
  r => {
    const out: JSX.Element[] = [];
    const steps = 12, w = (W - 80) / steps;
    for (let i = 0; i < steps; i++) {
      const h = 30 + i * 18 + r() * 10;
      out.push(<rect key={i} x={40 + i * w} y={H - 20 - h} width={w - 10} height={h} rx={6} style={i === steps - 1 ? f1 : i % 2 ? f2 : f3} />);
    }
    out.push(<circle key="flag" cx={40 + (steps - 0.5) * w - 5} cy={H - 20 - (30 + (steps - 1) * 18) - 26} r={10} style={f1} />);
    return out;
  },
];

export const Art = memo(function Art({ stage, hue, seed, className, height = 180 }:
  { stage: number; hue: number; seed: number; className?: string; height?: number }) {
  const draw = motifs[Math.max(0, stage) % motifs.length];
  return (
    <div className={`art ${className ?? ""}`} style={{ ["--h" as string]: hue, height }} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        {draw(rng(seed * 7919 + stage * 104729))}
      </svg>
    </div>
  );
});
