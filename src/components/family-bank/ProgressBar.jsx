import "./family-bank.css";

export default function ProgressBar({ current, target, danger = false }) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const over = current > target;

  return (
    <div className="fb-progress">
      <div className="fb-progress__track">
        <div
          className={`fb-progress__fill ${over || danger ? "fb-progress__fill--over" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="fb-progress__label">{Math.round(pct)}%</span>
    </div>
  );
}