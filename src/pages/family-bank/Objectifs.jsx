import { useMemo, useState } from "react";
import { useFinance, CATEGORIES } from "../../context/FinanceContext";
import AmountLedger from "../../components/family-bank/AmountLedger";
import ProgressBar from "../../components/family-bank/ProgressBar";
import "../../components/family-bank/family-bank.css";

export default function Objectifs() {
  const { goals, budgets, transactions, isAdmin, addGoal, contributeToGoal, deleteGoal, setBudget } = useFinance();

  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const [budgetCategory, setBudgetCategory] = useState(CATEGORIES[0]);
  const [budgetLimit, setBudgetLimit] = useState("");

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const spendByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "sortie" && t.date?.startsWith(monthKey))
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions, monthKey]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    await addGoal({ name: goalName, targetAmount: goalTarget, deadline: goalDeadline });
    setGoalName("");
    setGoalTarget("");
    setGoalDeadline("");
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budgetLimit) return;
    await setBudget(budgetCategory, budgetLimit);
    setBudgetLimit("");
  };

  return (
    <div className="fb-page">
      <p className="fb-eyebrow">Family Bank</p>
      <h1 className="fb-page-title">Objectifs & budgets</h1>

      <section>
        <h2 className="fb-card__title">Objectifs d'épargne</h2>
        <div className="fb-goal-grid">
          {goals.map((g) => (
            <div className="fb-card fb-goal-card" key={g.id}>
              <h3>{g.name}</h3>
              <ProgressBar current={g.currentAmount} target={g.targetAmount} />
              <p className="fb-goal-card__amounts">
                <AmountLedger amount={g.currentAmount} type="entree" size="sm" />
                {" "}/{" "}
                <AmountLedger amount={g.targetAmount} type="entree" size="sm" />
              </p>
              {g.deadline && <p className="fb-hint">Échéance : {g.deadline}</p>}
              {isAdmin && (
                <div className="fb-goal-card__actions">
                  <button className="fb-link-btn" onClick={() => {
                    const amount = prompt("Montant à ajouter à cet objectif (FCFA) :");
                    if (amount) contributeToGoal(g.id, amount);
                  }}>
                    + Contribuer
                  </button>
                  <button className="fb-link-btn" onClick={() => deleteGoal(g.id)}>Supprimer</button>
                </div>
              )}
            </div>
          ))}
          {goals.length === 0 && <p className="fb-empty">Aucun objectif défini pour l'instant.</p>}
        </div>

        {isAdmin && (
          <form className="fb-form" onSubmit={handleAddGoal} style={{ marginTop: 24 }}>
            <div className="fb-form__row">
              <label className="fb-field">
                <span>Nom de l'objectif</span>
                <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="Ex: Fonds d'urgence" required />
              </label>
              <label className="fb-field">
                <span>Montant cible (FCFA)</span>
                <input type="number" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} required />
              </label>
              <label className="fb-field">
                <span>Échéance (optionnel)</span>
                <input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} />
              </label>
            </div>
            <button type="submit" className="btn fb-form__submit">Créer l'objectif</button>
          </form>
        )}
      </section>

      <hr className="section-divider" />

      <section>
        <h2 className="fb-card__title">Budgets mensuels par catégorie</h2>
        <table className="fb-table">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Budget mensuel</th>
              <th>Dépensé ce mois-ci</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => {
              const spent = spendByCategory[b.category] || 0;
              const over = spent > b.monthlyLimit;
              return (
                <tr key={b.id}>
                  <td>{b.category}</td>
                  <td><AmountLedger amount={b.monthlyLimit} type="entree" size="sm" /></td>
                  <td><AmountLedger amount={spent} type="sortie" size="sm" /></td>
                  <td>{over && <span className="fb-pill fb-pill--danger">Dépassé</span>}</td>
                </tr>
              );
            })}
            {budgets.length === 0 && (
              <tr><td colSpan={4} className="fb-empty">Aucun budget défini pour l'instant.</td></tr>
            )}
          </tbody>
        </table>

        {isAdmin && (
          <form className="fb-form" onSubmit={handleSetBudget} style={{ marginTop: 24 }}>
            <div className="fb-form__row">
              <label className="fb-field">
                <span>Catégorie</span>
                <select value={budgetCategory} onChange={(e) => setBudgetCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="fb-field">
                <span>Limite mensuelle (FCFA)</span>
                <input type="number" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} required />
              </label>
            </div>
            <button type="submit" className="btn fb-form__submit">Définir le budget</button>
          </form>
        )}
      </section>
    </div>
  );
}