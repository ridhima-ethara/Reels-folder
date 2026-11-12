// Motion-graphics pieces for the "ml-three-ways" reel (Bold Dark look).
// All colours come from the brand (accent, accent2, text, bg, surface) so a preset swap re-skins them.
// Every `at` / time is an ABSOLUTE frame, taken from spoken words in Reel.tsx.
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand } from "../../brand-context";
import { usePop } from "../../components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Average of two 6-digit hex colours (used for a third chapter colour derived from the brand). */
export const mix = (a: string, b: string) => {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round((p(a, i) + p(b, i)) / 2).toString(16).padStart(2, "0")).join("");
};

export const useChapterColors = () => {
  const b = useBrand();
  return [b.colors.accent2, b.colors.accent, mix(b.colors.accent, b.colors.accent2)] as const;
};

const useSpring = (at: number, damping = 14, stiffness = 160) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness, mass: 0.9 } });
};

/* ------------------------------------------------------------------ backdrop */

/** Dark background with two slow-moving colour glows and a drifting dot grid. */
export const Backdrop: React.FC<{ tint: string }> = ({ tint }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const x1 = 25 + 12 * Math.sin(f / 70);
  const y1 = 22 + 8 * Math.cos(f / 90);
  const x2 = 78 + 10 * Math.cos(f / 80);
  const y2 = 72 + 10 * Math.sin(f / 60);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x1}% ${y1}%, ${tint}40 0%, transparent 42%), radial-gradient(circle at ${x2}% ${y2}%, ${b.colors.accent}22 0%, transparent 48%), ${b.colors.bg}`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${b.colors.text}18 2px, transparent 2.6px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `0px ${(f * 0.6) % 54}px`,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ progress rail */

export const ProgressRail: React.FC<{ marks: [number, number, number, number]; labels: [string, string, string] }> = ({ marks, labels }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const cols = useChapterColors();
  if (f < marks[0] || f >= marks[3]) return null;
  const fadeIn = interpolate(f - marks[0], [0, 8], [0, 1], clamp);
  return (
    <div data-el="progress" data-kind="ui" style={{ position: "absolute", left: 60, top: 244, width: 900, display: "flex", gap: 16, opacity: fadeIn, fontFamily: b.fontFamily }}>
      {labels.map((label, i) => {
        const p = interpolate(f, [marks[i], marks[i + 1]], [0, 1], clamp);
        const active = f >= marks[i] && f < marks[i + 1];
        return (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, color: active ? cols[i] : b.colors.text, opacity: active ? 1 : 0.45, marginBottom: 10 }}>
              {String(i + 1).padStart(2, "0")} {label}
            </div>
            <div style={{ height: 10, borderRadius: 5, background: `${b.colors.text}22`, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: cols[i], boxShadow: `0 0 16px ${cols[i]}` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ chips + kinetic text */

export const Chip: React.FC<{ text: string; at: number; color: string; filled?: boolean; size?: number }> = ({ text, at, color, filled, size = 44 }) => {
  const b = useBrand();
  const { style } = usePop(at);
  return (
    <div
      style={{
        ...style,
        display: "inline-block",
        fontFamily: b.fontFamily,
        fontSize: size,
        fontWeight: 700,
        padding: "14px 30px",
        borderRadius: 999,
        border: `3px solid ${color}`,
        background: filled ? color : `${color}1F`,
        color: filled ? b.colors.bg : b.colors.text,
        boxShadow: `0 0 28px ${color}55`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Words that land one by one, each on its own frame. */
export const KineticLine: React.FC<{ words: { text: string; at: number; color?: string }[]; size: number; align?: "left" | "center" }> = ({ words, size, align = "left" }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `0 ${size * 0.28}px`, fontFamily: b.fontFamily, fontSize: size, fontWeight: 700, lineHeight: 1.02, letterSpacing: -1 }}>
      {words.map((w, i) => {
        const s = spring({ frame: f - w.at, fps, config: { damping: 13, stiffness: 190 } });
        return (
          <span key={i} style={{ display: "inline-block", color: w.color ?? b.colors.text, opacity: interpolate(f - w.at, [0, 3], [0, 1], clamp), transform: `translateY(${(1 - s) * 60}px)` }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ chapter slam */

export const ChapterSlam: React.FC<{ num: string; name: string; color: string; at: number; chips: { text: string; at: number }[] }> = ({ num, name, color, at, chips }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const s = useSpring(at, 15, 150);
  const reveal = interpolate(f - at - 5, [0, 12], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const nameSize = Math.min(150, Math.floor(900 / (name.length * 0.66)));
  return (
    <div data-el="chapter" data-kind="content" style={{ position: "absolute", left: 60, top: 330, width: 900, fontFamily: b.fontFamily }}>
      <div
        style={{
          display: "inline-block",
          fontSize: 380,
          fontWeight: 700,
          lineHeight: 0.85,
          letterSpacing: -10,
          color: "transparent",
          WebkitTextStroke: `6px ${color}`,
          textShadow: `0 0 60px ${color}66`,
          opacity: interpolate(f - at, [0, 4], [0, 1], clamp),
          transform: `scale(${1.25 - 0.25 * s})`,
          transformOrigin: "left bottom",
        }}
      >
        {num}
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: nameSize,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: -2,
          backgroundImage: `linear-gradient(90deg, ${color}, ${b.colors.text})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          clipPath: `inset(-10% ${100 - reveal}% -10% 0)`,
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 56, fontWeight: 600, opacity: 0.7 * (reveal / 100), color: b.colors.text, marginTop: 6 }}>learning</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 40 }}>
        {chips.map((c) => (
          <Chip key={c.text} text={c.text} at={c.at} color={color} />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ glass panel */

export const Glass: React.FC<{ at: number; color: string; style?: React.CSSProperties; children: React.ReactNode; el?: string }> = ({ at, color, style, children, el = "panel" }) => {
  const b = useBrand();
  const { style: pop } = usePop(at);
  return (
    <div
      data-el={el}
      data-kind="content"
      style={{
        ...pop,
        position: "absolute",
        left: 60,
        width: 900,
        background: `${b.colors.surface}E6`,
        border: `2px solid ${color}55`,
        borderRadius: 28,
        boxShadow: `0 0 90px ${color}22, inset 0 1px 0 ${b.colors.text}14`,
        fontFamily: b.fontFamily,
        color: b.colors.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ 01: inbox */

const Envelope: React.FC<{ color: string }> = ({ color }) => (
  <svg width={64} height={48} viewBox="0 0 64 48">
    <rect x={2} y={2} width={60} height={44} rx={8} fill="none" stroke={color} strokeWidth={4} />
    <path d="M4 6 L32 28 L60 6" fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

const Stamp: React.FC<{ text: string; at: number; color: string }> = ({ text, at, color }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const s = useSpring(at, 11, 220);
  if (f < at) return <div style={{ width: 150 }} />;
  return (
    <div
      style={{
        width: 150,
        textAlign: "center",
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: 2,
        padding: "10px 0",
        borderRadius: 12,
        border: `4px solid ${color}`,
        color,
        background: `${color}1A`,
        fontFamily: b.fontFamily,
        transform: `scale(${1.6 - 0.6 * s}) rotate(${-8 * s}deg)`,
        transformOrigin: "right center",
        opacity: interpolate(f - at, [0, 3], [0, 1], clamp),
      }}
    >
      {text}
    </div>
  );
};

const MailRow: React.FC<{ subject: string; inAt: number; tag: string; tagAt: number; tagColor: string; scan?: [number, number]; highlight?: string }> = ({ subject, inAt, tag, tagAt, tagColor, scan, highlight }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const s = useSpring(inAt, 16, 170);
  if (f < inAt) return <div style={{ height: 120 }} />;
  const scanP = scan ? interpolate(f, scan, [0, 1], clamp) : 0;
  const scanning = scan && f >= scan[0] && f < scan[1];
  return (
    <div
      style={{
        position: "relative",
        height: 120,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 32px",
        borderRadius: 18,
        background: highlight ? `${highlight}14` : `${b.colors.text}08`,
        border: highlight ? `2px solid ${highlight}66` : "2px solid transparent",
        transform: `translateX(${(1 - Math.min(1, s)) * -500}px)`,
        opacity: s,
        overflow: "hidden",
      }}
    >
      <Envelope color={b.colors.text} />
      <div style={{ flex: 1, fontSize: 38, fontWeight: 600, whiteSpace: "nowrap" }}>{subject}</div>
      <Stamp text={tag} at={tagAt} color={tagColor} />
      {scanning ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${scanP * 100}% - 12px)`, width: 12, background: highlight, boxShadow: `0 0 40px 12px ${highlight}` }} />
      ) : null}
    </div>
  );
};

export const Inbox: React.FC<{ at: number; color: string; rows: { spam: [number, number]; ok: [number, number]; fresh: [number, number, number] } }> = ({ at, color, rows }) => {
  const b = useBrand();
  const spamColor = b.colors.accent;
  const okColor = b.colors.accent2;
  return (
    <Glass at={at} color={color} el="inbox" style={{ top: 340, padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <div style={{ fontSize: 46, fontWeight: 700 }}>Inbox</div>
        <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.6, letterSpacing: 2 }}>EXAMPLES + ANSWERS</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <MailRow subject="WIN A FREE PHONE!!!" inAt={rows.spam[0]} tag="SPAM" tagAt={rows.spam[1]} tagColor={spamColor} />
        <MailRow subject="Lunch at 1?" inAt={rows.ok[0]} tag="OK" tagAt={rows.ok[1]} tagColor={okColor} />
      </div>
      <div style={{ margin: "26px 0 16px", fontSize: 30, fontWeight: 700, letterSpacing: 2, color, opacity: useCurrentFrame() >= rows.fresh[0] ? 1 : 0 }}>NEW EMAIL · AI LABELS IT</div>
      <MailRow subject="Claim your prize now" inAt={rows.fresh[0]} tag="SPAM" tagAt={rows.fresh[2]} tagColor={spamColor} scan={[rows.fresh[1], rows.fresh[2]]} highlight={color} />
    </Glass>
  );
};

/* ------------------------------------------------------------------ 02: clusters */

const CENTERS = [
  { x: 230, y: 220 },
  { x: 680, y: 250 },
  { x: 450, y: 540 },
];

export const Clusters: React.FC<{ at: number; gatherAt: number; haloAt: number; labels: [string, string, string] }> = ({ at, gatherAt, haloAt, labels }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = useChapterColors();
  const groupCols = [cols[1], cols[0], cols[2]];
  const N = 39;
  const appear = interpolate(f - at, [0, 10], [0, 1], clamp);
  return (
    <div data-el="clusters" data-kind="content" style={{ position: "absolute", left: 60, top: 540, width: 900, height: 760, opacity: appear }}>
      <svg width={900} height={760} viewBox="0 0 900 760">
        {CENTERS.map((c, g) => {
          const h = spring({ frame: f - haloAt - g * 4, fps, config: { damping: 14 } });
          return (
            <g key={g} opacity={h}>
              <circle cx={c.x} cy={c.y} r={150 * (0.7 + 0.3 * h)} fill={`${groupCols[g]}14`} stroke={groupCols[g]} strokeWidth={4} strokeDasharray="14 12" />
              <text x={c.x} y={c.y + (g === 2 ? 192 : -170)} textAnchor="middle" fontFamily={b.fontFamily} fontSize={38} fontWeight={700} fill={groupCols[g]}>
                {labels[g]}
              </text>
            </g>
          );
        })}
        {Array.from({ length: N }).map((_, i) => {
          const g = i % 3;
          const sx = 70 + random(`x${i}`) * 760;
          const sy = 70 + random(`y${i}`) * 620;
          const ang = random(`a${i}`) * Math.PI * 2;
          const rad = 20 + random(`r${i}`) * 95;
          const tx = CENTERS[g].x + Math.cos(ang) * rad;
          const ty = CENTERS[g].y + Math.sin(ang) * rad;
          const p = spring({ frame: f - gatherAt - i * 0.9, fps, config: { damping: 16, stiffness: 90 } });
          const wob = (1 - p) * 10;
          const x = sx + (tx - sx) * p + wob * Math.sin(f / 9 + i);
          const y = sy + (ty - sy) * p + wob * Math.cos(f / 11 + i * 2);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={17} fill={`${b.colors.text}88`} opacity={1 - p} />
              <circle cx={x} cy={y} r={17} fill={groupCols[g]} opacity={p} style={{ filter: `drop-shadow(0 0 ${8 * p}px ${groupCols[g]})` }} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ 03: grid world */

type Cell = [number, number]; // [col, row]
const TILE = 150;
const GAP = 14;
const cellXY = ([c, r]: Cell) => ({ x: c * (TILE + GAP) + TILE / 2, y: r * (TILE + GAP) + TILE / 2 });

export const GridWorld: React.FC<{ at: number; path: { at: number; cell: Cell }[]; reward: number; penalty: number; goal: number; color: string }> = ({ at, path, reward, penalty, goal, color }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pit: Cell = [2, 2];
  const star: Cell = [4, 0];
  // agent position: hop from the previous cell to the current one over 8 frames
  let k = 0;
  for (let i = 0; i < path.length; i++) if (f >= path[i].at) k = i;
  const prev = cellXY(path[Math.max(0, k - 1)].cell);
  const cur = cellXY(path[k].cell);
  const hp = k === 0 ? 1 : interpolate(f - path[k].at, [0, 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ax = prev.x + (cur.x - prev.x) * hp;
  const shake = f >= penalty && f < penalty + 12 ? Math.sin((f - penalty) * 2.4) * 10 : 0;
  const ay = prev.y + (cur.y - prev.y) * hp - Math.sin(hp * Math.PI) * 34;
  const score = (f >= reward ? 1 : 0) + (f >= penalty ? -1 : 0) + (f >= goal ? 10 : 0);
  const won = spring({ frame: f - goal, fps, config: { damping: 10 } });
  const floatTag = (t: number, text: string, c: string, cell: Cell, below = false) => {
    const d = f - t;
    if (d < 0 || d > 26) return null;
    const p = cellXY(cell);
    return (
      <div style={{ position: "absolute", left: Math.max(0, Math.min(5 * TILE + 4 * GAP - 160, p.x - 80)), width: 160, top: below ? p.y + 52 + d * 1.2 : p.y - 120 - d * 2.4, textAlign: "center", fontSize: 60, fontWeight: 700, color: c, opacity: interpolate(d, [0, 4, 18, 26], [0, 1, 1, 0]), textShadow: `0 0 24px ${c}` }}>
        {text}
      </div>
    );
  };
  const W = 5 * TILE + 4 * GAP;
  return (
    <Glass at={at} color={color} el="grid" style={{ top: 340, padding: "28px 0 36px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 47px", marginBottom: 22, fontSize: 40, fontWeight: 700 }}>
        <div style={{ opacity: 0.75 }}>Goal: reach the star</div>
        <div style={{ color }}>SCORE {score > 0 ? `+${score}` : score}</div>
      </div>
      <div style={{ position: "relative", width: W, height: W, margin: "0 auto" }}>
        {Array.from({ length: 25 }).map((_, i) => {
          const c = i % 5;
          const r = Math.floor(i / 5);
          const isPit = c === pit[0] && r === pit[1];
          const isStar = c === star[0] && r === star[1];
          const flash = isPit && f >= penalty && f < penalty + 14 ? 1 : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c * (TILE + GAP),
                top: r * (TILE + GAP),
                width: TILE,
                height: TILE,
                borderRadius: 18,
                background: isPit ? `${b.colors.bg}` : `${b.colors.text}0D`,
                border: isPit ? `3px dashed ${b.colors.text}${flash ? "FF" : "55"}` : `2px solid ${b.colors.text}14`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 700,
                color: `${b.colors.text}66`,
              }}
            >
              {isPit ? "-1" : null}
              {isStar ? (
                <svg width={96} height={96} viewBox="-55 -55 110 110" style={{ transform: `scale(${1 + 0.06 * Math.sin(f / 6) + 0.3 * won})`, filter: `drop-shadow(0 0 ${14 + 20 * won}px ${b.colors.accent})` }}>
                  <polygon points={Array.from({ length: 10 }).map((_, j) => { const a = (Math.PI / 5) * j - Math.PI / 2; const rr = j % 2 ? 22 : 50; return `${Math.cos(a) * rr},${Math.sin(a) * rr}`; }).join(" ")} fill={b.colors.accent} />
                </svg>
              ) : null}
            </div>
          );
        })}
        {/* agent */}
        <div style={{ position: "absolute", left: ax - 48 + shake, top: ay - 48, width: 96, height: 96, borderRadius: 48, background: color, boxShadow: `0 0 36px ${color}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 14, height: 20, borderRadius: 7, background: b.colors.bg }} />
          <div style={{ width: 14, height: 20, borderRadius: 7, background: b.colors.bg }} />
        </div>
        {floatTag(reward, "+1", color, path.find((p) => p.at === reward)?.cell ?? [1, 4])}
        {floatTag(penalty, "-1", b.colors.text, pit)}
        {floatTag(goal, "+10", b.colors.accent, star, true)}
        {f >= goal && f < goal + 24 ? (
          <div style={{ position: "absolute", left: cellXY(star).x - 75, top: cellXY(star).y - 75, width: 150, height: 150, borderRadius: 75, border: `6px solid ${b.colors.accent}`, opacity: interpolate(f - goal, [0, 24], [1, 0]), transform: `scale(${0.5 + interpolate(f - goal, [0, 24], [0, 0.45])})`, boxShadow: `0 0 40px ${b.colors.accent}` }} />
        ) : null}
      </div>
    </Glass>
  );
};

/* ------------------------------------------------------------------ twist tiles */

export const GlitchTitle: React.FC<{ text: string; at: number; size: number }> = ({ text, at, size }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const d = f - at;
  const jitter = d < 14 ? (random(`g${f}`) - 0.5) * 30 : 4;
  const s = useSpring(at, 12, 200);
  return (
    <div
      style={{
        fontFamily: b.fontFamily,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 0.95,
        letterSpacing: -3,
        color: b.colors.text,
        textShadow: `${jitter}px 0 ${b.colors.accent}, ${-jitter}px 0 ${b.colors.accent2}`,
        opacity: interpolate(d, [0, 2], [0, 1], clamp),
        transform: `scale(${1.3 - 0.3 * s})`,
        transformOrigin: "left center",
      }}
    >
      {text}
    </div>
  );
};

export const TypeTiles: React.FC<{ at: number; lit: [number | null, number | null, number | null]; notes: [string, string, string] }> = ({ at, lit, notes }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const cols = useChapterColors();
  const names = ["Supervised", "Unsupervised", "Reinforcement"];
  return (
    <div data-el="tiles" data-kind="content" style={{ position: "absolute", left: 60, top: 860, width: 900, display: "flex", gap: 22, fontFamily: b.fontFamily }}>
      {names.map((n, i) => {
        const s = spring({ frame: f - at - i * 4, fps: 30, config: { damping: 14 } });
        const l = lit[i];
        const on = l !== null && f >= l ? spring({ frame: f - (l as number), fps: 30, config: { damping: 12 } }) : 0;
        return (
          <div
            key={n}
            style={{
              flex: 1,
              height: 300,
              borderRadius: 24,
              padding: 22,
              boxSizing: "border-box",
              background: on ? `${cols[i]}26` : `${b.colors.surface}`,
              border: `3px solid ${on ? cols[i] : `${b.colors.text}22`}`,
              boxShadow: on ? `0 0 ${50 * on}px ${cols[i]}88` : "none",
              opacity: s * (on ? 1 : 0.55),
              transform: `translateY(${(1 - s) * 60}px) scale(${1 + 0.06 * on})`,
              transformOrigin: i === 0 ? "left center" : i === 2 ? "right center" : "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 84, fontWeight: 700, color: on ? cols[i] : b.colors.text, lineHeight: 1 }}>0{i + 1}</div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700, color: b.colors.text }}>{n}</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: cols[i], opacity: on, marginTop: 6 }}>{notes[i]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ quiz: photo grouping */

const Face: React.FC<{ hair: string; variant: number }> = ({ hair, variant }) => {
  const b = useBrand();
  const tilt = (random(`t${variant}`) - 0.5) * 16;
  const sc = 0.85 + random(`s${variant}`) * 0.2;
  const hairD = [
    "M-62 -10 C-66 -80 66 -80 62 -10 C50 -45 -50 -45 -62 -10 Z",
    "M-66 10 C-80 -90 80 -90 66 10 L52 -20 C30 -50 -30 -50 -52 -20 Z",
    "M-60 -18 C-50 -76 50 -76 60 -18 L60 -30 L40 -48 L20 -34 L0 -50 L-20 -34 L-40 -48 L-60 -30 Z",
  ];
  return (
    <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ transform: `rotate(${tilt}deg) scale(${sc})` }}>
      <rect x={-70} y={40} width={140} height={80} rx={60} fill={`${b.colors.text}30`} />
      <circle cx={0} cy={-6} r={58} fill={`${b.colors.text}D9`} />
      <circle cx={-20} cy={-6} r={7} fill={b.colors.bg} />
      <circle cx={20} cy={-6} r={7} fill={b.colors.bg} />
      <path d="M-18 18 Q0 32 18 18" stroke={b.colors.bg} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={hairD[variant % 3]} fill={hair} />
    </svg>
  );
};

export const PhotoSort: React.FC<{ at: number; sortAt: number; tagAt: number }> = ({ at, sortAt, tagAt }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = useChapterColors();
  const people = [0, 1, 2, 1, 2, 0, 2, 0, 1]; // who is in each photo, mixed up
  const seen = [0, 0, 0];
  const SIZE = 260;
  const G = 20;
  return (
    <div data-el="photos" data-kind="content" style={{ position: "absolute", left: 60 + (900 - (3 * SIZE + 2 * G)) / 2, top: 470, width: 3 * SIZE + 2 * G, height: 3 * SIZE + 2 * G }}>
      {people.map((p, i) => {
        const order = seen[p]++;
        const from = { c: i % 3, r: Math.floor(i / 3) };
        const to = { c: p, r: order };
        const s = spring({ frame: f - sortAt - i * 2, fps, config: { damping: 15, stiffness: 110 } });
        const c = Math.max(0, Math.min(2, from.c + (to.c - from.c) * s));
        const r = Math.max(0, Math.min(2, from.r + (to.r - from.r) * s));
        const pop = spring({ frame: f - at - i * 2, fps, config: { damping: 13 } });
        const tag = spring({ frame: f - tagAt - p * 3, fps, config: { damping: 12 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * (SIZE + G),
              top: r * (SIZE + G),
              width: SIZE,
              height: SIZE,
              borderRadius: 22,
              background: b.colors.surface,
              border: `3px solid ${s > 0.5 ? cols[p] : `${b.colors.text}22`}`,
              boxShadow: s > 0.5 ? `0 0 30px ${cols[p]}44` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transform: `scale(${Math.min(1, pop)})`,
            }}
          >
            <Face hair={cols[p]} variant={p * 3 + order} />
            {order === 0 ? (
              <div style={{ position: "absolute", top: 12, left: 12, fontFamily: b.fontFamily, fontSize: 30, fontWeight: 700, padding: "4px 14px", borderRadius: 10, background: cols[p], color: b.colors.bg, transform: `scale(${tag})`, transformOrigin: "left top" }}>
                Name: ???
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ quiz answers */

export const AnswerButtons: React.FC<{ ats: [number, number, number] }> = ({ ats }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = useChapterColors();
  const names = ["Supervised", "Unsupervised", "Reinforcement"];
  return (
    <div data-el="answers" data-kind="content" style={{ position: "absolute", left: 60, top: 500, width: 900, display: "flex", flexDirection: "column", gap: 26, fontFamily: b.fontFamily }}>
      {names.map((n, i) => {
        const s = spring({ frame: f - ats[i], fps, config: { damping: 12, stiffness: 170 } });
        const pulse = f > ats[2] + 10 ? 0.5 + 0.5 * Math.sin((f - ats[2]) / 5 + i * 1.3) : 0;
        return (
          <div
            key={n}
            style={{
              height: 160,
              borderRadius: 28,
              border: `4px solid ${cols[i]}`,
              background: `${cols[i]}1A`,
              boxShadow: `0 0 ${30 + 40 * pulse}px ${cols[i]}${pulse > 0.5 ? "88" : "44"}`,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 36px",
              opacity: interpolate(f - ats[i], [0, 3], [0, 1], clamp),
              transform: `translateX(${(1 - Math.min(1, s)) * -200}px)`,
            }}
          >
            <div style={{ width: 104, height: 104, borderRadius: 52, background: cols[i], transform: `scale(${1 + 0.08 * pulse})`, color: b.colors.bg, fontSize: 66, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontSize: 64, fontWeight: 700, color: b.colors.text }}>{n}</div>
          </div>
        );
      })}
    </div>
  );
};

export const CommentPrompt: React.FC<{ at: number }> = ({ at }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { style } = usePop(at);
  const bob = Math.sin((f - at) / 4) * 10;
  return (
    <div data-el="comment" data-kind="content" style={{ ...style, position: "absolute", left: 60, top: 1130, width: 900, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, fontFamily: b.fontFamily, fontSize: 60, fontWeight: 700, color: b.colors.accent }}>
      Comment your answer
      <svg width={56} height={70} viewBox="0 0 56 70" style={{ transform: `translateY(${bob}px)` }}>
        <path d="M28 4 L28 60 M8 40 L28 62 L48 40" stroke={b.colors.accent} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
