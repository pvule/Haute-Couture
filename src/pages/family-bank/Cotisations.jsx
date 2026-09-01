import { useMemo } from "react";
import { useFinance } from "../../context/FinanceContext";
import "../../components/family-bank/family-bank.css";

const MOIS_LABELS = {
  "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
  "05": "Mai", "06": "Juin", "07": "Juillet", "08": "Août",
  "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
};

export default function Cotisations() {
  const { cotisants, cotisations, toggleCotisation, isAdmin } = useFinance();

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = `${MOIS_LABELS[String(now.getMonth() + 1).padStart(2, "0")]} ${now.getFullYear()}`;

  const statusFor = useMemo(() => {
    const map = {};
    cotisations
      .filter((c) => c.mois === monthKey)
      .forEach((c) => {
        map[c.cotisant_id] = c.paye;
      });
    return map;
  }, [cotisations, monthKey]);

  const payeCount = cotisants.filter((c) => statusFor[c.id]).length;

  const handleToggle = (cotisantId, currentlyPaye) => {
    toggleCotisation(cotisantId, monthKey, !currentlyPaye);
  };

  return (
    <div className="fb-page">
      <p className="fb-eyebrow">Family Bank</p>
      <h1 className="fb-page-title">Cotisations — {monthLabel}</h1>

      <p className="fb-hint" style={{ marginBottom: 24 }}>
        {payeCount} / {cotisants.length} membre{cotisants.length > 1 ? "s ont" : " a"} cotisé ce mois-ci
      </p>

      <div className="fb-card">
        <table className="fb-table">
          <thead>
            <tr>
              <th>Membre</th>
              <th>Statut</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {cotisants.map((c) => {
              const paye = !!statusFor[c.id];
              return (
                <tr key={c.id}>
                  <td>{c.prenom}</td>
                  <td>
                    {paye ? (
                      <span className="fb-pill" style={{ color: "#2f6b4f", borderColor: "#2f6b4f" }}>
                        Cotisé
                      </span>
                    ) : (
                      <span className="fb-pill fb-pill--danger">En attente</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        type="button"
                        className="fb-link-btn"
                        onClick={() => handleToggle(c.id, paye)}
                      >
                        {paye ? "Annuler" : "Marquer comme cotisé"}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {cotisants.length === 0 && (
          <p className="fb-empty">Aucun membre cotisant enregistré pour l'instant.</p>
        )}
      </div>
    </div>
  );
}