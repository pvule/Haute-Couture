import "./family-bank.css";

const formatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function AmountLedger({ amount, type, size = "md" }) {
  const isOut = type === "sortie";
  const formatted = formatter.format(Math.abs(amount));

  return (
    <span className={`fb-amount fb-amount--${size} ${isOut ? "fb-amount--out" : "fb-amount--in"}`}>
      {isOut ? `(${formatted})` : formatted}
      <span className="fb-amount__currency"> FCFA</span>
    </span>
  );
}