import "./family-bank.css";

export default function BalanceChart({ transactions }) {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("fr-FR", { month: "short" }),
      entree: 0,
      sortie: 0,
    };
  });

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (!bucket) return;
    if (t.type === "entree") bucket.entree += t.amount;
    else bucket.sortie += t.amount;
  });

  const max = Math.max(1, ...months.map((m) => Math.max(m.entree, m.sortie)));
  const chartHeight = 160;
  const barWidth = 18;
  const groupWidth = 70;

  return (
    <div className="fb-chart">
      <svg
        viewBox={`0 0 ${months.length * groupWidth} ${chartHeight + 30}`}
        className="fb-chart__svg"
        role="img"
        aria-label="Entrées et sorties des 6 derniers mois"
      >
        {months.map((m, i) => {
          const x = i * groupWidth + 10;
          const hIn = (m.entree / max) * chartHeight;
          const hOut = (m.sortie / max) * chartHeight;
          return (
            <g key={m.key}>
              <rect x={x} y={chartHeight - hIn} width={barWidth} height={hIn} className="fb-chart__bar fb-chart__bar--in" />
              <rect x={x + barWidth + 4} y={chartHeight - hOut} width={barWidth} height={hOut} className="fb-chart__bar fb-chart__bar--out" />
              <text x={x + barWidth} y={chartHeight + 20} textAnchor="middle" className="fb-chart__label">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="fb-chart__legend">
        <span><i className="fb-chart__swatch fb-chart__swatch--in" /> Entrées</span>
        <span><i className="fb-chart__swatch fb-chart__swatch--out" /> Sorties</span>
      </div>
    </div>
  );
}