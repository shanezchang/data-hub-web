// 趋势页的零依赖 SVG 图表(服务端渲染,无客户端 JS)。
// 数据来自 lib/trends-data.json(带 as_of 日期的构建期快照,刷新见该文件头说明)。

const W = 640;
const H = 170;
const PAD = { l: 36, r: 12, t: 12, b: 24 };

export function LineChart({ byYear }: { byYear: Record<string, number> }) {
  const years = Object.keys(byYear).sort();
  if (years.length < 2) return null;
  const max = Math.max(...years.map((y) => byYear[y]), 1);
  const x = (i: number) => PAD.l + (i / (years.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / max) * (H - PAD.t - PAD.b);
  const points = years.map((yr, i) => `${x(i)},${y(byYear[yr])}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="w-full" aria-label="Yearly trend line chart">
      <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="currentColor" strokeOpacity="0.18" />
      <text x={PAD.l - 6} y={y(max) + 4} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity="0.55">{max}</text>
      <text x={PAD.l - 6} y={H - PAD.b + 4} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity="0.55">0</text>
      <text x={x(0)} y={H - 8} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.55">{years[0]}</text>
      <text x={x(years.length - 1)} y={H - 8} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.55">{years[years.length - 1]}</text>
      <polyline points={points} fill="none" stroke="var(--accent, #2563eb)" strokeWidth="2" strokeLinejoin="round" />
      {years.map((yr, i) => (
        <circle key={yr} cx={x(i)} cy={y(byYear[yr])} r="2.4" fill="var(--accent, #2563eb)">
          <title>{`${yr}: ${byYear[yr]}`}</title>
        </circle>
      ))}
    </svg>
  );
}

const STATUS_COLORS: Record<string, string> = {
  Active: "var(--accent, #2563eb)",
  Acquired: "#8b5cf6",
  Public: "#059669",
  Inactive: "#9ca3af",
};
export const STATUS_ORDER = ["Active", "Acquired", "Public", "Inactive"];

export function StackedBar({ counts }: { counts: Record<string, number> }) {
  const total = STATUS_ORDER.reduce((s, k) => s + (counts[k] ?? 0), 0);
  if (!total) return null;
  let acc = 0;
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-4 w-full" role="img"
         aria-label="Batch outcome distribution">
      {STATUS_ORDER.map((k) => {
        const w = ((counts[k] ?? 0) / total) * 100;
        const xPos = acc;
        acc += w;
        return w > 0 ? (
          <rect key={k} x={xPos} y="0" width={w} height="10" fill={STATUS_COLORS[k]}>
            <title>{`${k}: ${counts[k]} (${Math.round((w + Number.EPSILON) * 10) / 10}%)`}</title>
          </rect>
        ) : null;
      })}
    </svg>
  );
}

export function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted">
      {STATUS_ORDER.map((k) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ background: STATUS_COLORS[k] }} aria-hidden="true" />
          {k}
        </span>
      ))}
    </div>
  );
}
