import { useFinance } from "../../context/FinanceContext";
import TransactionForm from "../../components/family-bank/TransactionForm";
import AmountLedger from "../../components/family-bank/AmountLedger";
import "../../components/family-bank/family-bank.css";

export default function Transactions() {
  const { transactions, deleteTransaction, isAdmin } = useFinance();

  return (
    <div className="fb-page">
      <p className="fb-eyebrow">Family Bank</p>
      <h1 className="fb-page-title">Nouvelle transaction</h1>

      <section className="fb-grid-2">
        <div className="fb-card">
          <TransactionForm />
        </div>

        <div className="fb-card">
          <h2 className="fb-card__title">Transactions récentes</h2>
          <table className="fb-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Auteur</th>
                <th>Montant</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 15).map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.author}</td>
                  <td><AmountLedger amount={t.amount} type={t.type} size="sm" /></td>
                  {isAdmin && (
                    <td>
                      <button
                        type="button"
                        className="fb-link-btn"
                        onClick={() => deleteTransaction(t.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="fb-empty">Aucune transaction enregistrée pour l'instant.</p>
          )}
        </div>
      </section>
    </div>
  );
}