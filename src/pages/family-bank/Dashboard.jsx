import { useState } from "react";
import { supabase } from "../../supabase";
import { useFinance } from "../../context/FinanceContext";
import AmountLedger from "../../components/family-bank/AmountLedger";
import BalanceChart from "../../components/family-bank/BalanceChart";
import "../../components/family-bank/family-bank.css";

const THRESHOLD = 50000; // seuil d'alerte, en FCFA — ajuste-le selon ta caisse

export default function Dashboard() {
  const { balance, transactions, loading, isAdmin } = useFinance();
  const [sending, setSending] = useState(false);
  const [reportMsg, setReportMsg] = useState("");

  const latest = transactions.slice(0, 6);
  const belowThreshold = balance < THRESHOLD;

   const sendMonthlyReport = async () => {
    setSending(true);
    setReportMsg("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ balance, transactions: transactions.slice(0, 20) }),
        }
      );
      if (!res.ok) throw new Error("Échec de l'envoi");
      setReportMsg("Rapport envoyé ✓");
    } catch {
      setReportMsg("Impossible d'envoyer le rapport pour le moment.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="fb-page fb-page--center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="fb-page">
      <p className="fb-eyebrow">Family Bank — Registre de la caisse</p>
      <h1 className="fb-hero-balance">
        <AmountLedger amount={balance} type={balance < 0 ? "sortie" : "entree"} size="xl" />
      </h1>
      <p className="fb-hero-caption">Solde actuel de la caisse</p>

      {belowThreshold && (
        <div className="fb-alert">
          Le solde est passé sous le seuil de {THRESHOLD.toLocaleString("fr-FR")} FCFA.
        </div>
      )}

      <hr className="section-divider" />

      <section className="fb-grid-2">
        <div className="fb-card">
          <h2 className="fb-card__title">Mouvements — 6 derniers mois</h2>
          <BalanceChart transactions={transactions} />
        </div>

        <div className="fb-card">
          <h2 className="fb-card__title">Dernières transactions</h2>
          {latest.length === 0 && <p className="fb-empty">Aucune transaction pour l'instant.</p>}
          <ul className="fb-latest-list">
            {latest.map((t) => (
              <li key={t.id} className="fb-latest-list__item">
                <div>
                  <strong>{t.category}</strong>
                  <span className="fb-latest-list__meta"> · {t.author} · {t.date}</span>
                  {t.note && <span className="fb-latest-list__note"> — {t.note}</span>}
                </div>
                <AmountLedger amount={t.amount} type={t.type} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isAdmin && (
        <div className="fb-report-cta">
          <button className="btn" onClick={sendMonthlyReport} disabled={sending}>
            {sending ? "Envoi..." : "Envoyer le rapport à la famille"}
          </button>
          {reportMsg && <span className="fb-form__feedback">{reportMsg}</span>}
        </div>
      )}
    </div>
  );
}