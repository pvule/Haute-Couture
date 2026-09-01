import { useMemo, useState } from "react";
import { useFinance, CATEGORIES } from "../../context/FinanceContext";
import AmountLedger from "../../components/family-bank/AmountLedger";
import "../../components/family-bank/family-bank.css";

function exportCSV(rows) {
  const header = ["Date", "Type", "Catégorie", "Auteur", "Montant", "Note"];
  const lines = rows.map((t) => [
    t.date,
    t.type === "entree" ? "Entrée" : "Sortie",
    t.category,
    t.author,
    t.amount,
    (t.note || "").replace(/,/g, ";"),
  ]);
  const csv = [header, ...lines].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `family-bank-historique-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Historique() {
  const { transactions } = useFinance();
  const [category, setCategory] = useState("Toutes");
  const [type, setType] = useState("Tous");
  const [author, setAuthor] = useState("Tous");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const authors = useMemo(
    () => ["Tous", ...new Set(transactions.map((t) => t.author))],
    [transactions]
  );

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (category !== "Toutes" && t.category !== category) return false;
      if (type !== "Tous" && t.type !== type) return false;
      if (author !== "Tous" && t.author !== author) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (search && !`${t.category} ${t.note} ${t.author}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [transactions, category, type, author, from, to, search]);

  const total = filtered.reduce(
    (sum, t) => sum + (t.type === "entree" ? t.amount : -t.amount),
    0
  );

  return (
    <div className="fb-page">
      <p className="fb-eyebrow">Family Bank</p>
      <h1 className="fb-page-title">Historique</h1>

      <div className="fb-filters">
        <label className="fb-field">
          <span>Recherche</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="mot-clé..." />
        </label>
        <label className="fb-field">
          <span>Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Toutes</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="fb-field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Tous">Tous</option>
            <option value="entree">Entrées</option>
            <option value="sortie">Sorties</option>
          </select>
        </label>
        <label className="fb-field">
          <span>Auteur</span>
          <select value={author} onChange={(e) => setAuthor(e.target.value)}>
            {authors.map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
        <label className="fb-field">
          <span>Du</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="fb-field">
          <span>Au</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>

      <div className="fb-export-row">
        <span className="fb-export-total">
          {filtered.length} transaction{filtered.length > 1 ? "s" : ""} · Solde de la sélection :{" "}
          <AmountLedger amount={total} type={total < 0 ? "sortie" : "entree"} size="sm" />
        </span>
        <div>
          <button className="btn" onClick={() => exportCSV(filtered)}>Exporter en Excel (CSV)</button>
          <button className="btn" onClick={() => window.print()} style={{ marginLeft: 10 }}>
            Imprimer / PDF
          </button>
        </div>
      </div>

      <table className="fb-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Catégorie</th>
            <th>Auteur</th>
            <th>Note</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.type === "entree" ? "Entrée" : "Sortie"}</td>
              <td>{t.category}</td>
              <td>{t.author}</td>
              <td>{t.note}</td>
              <td><AmountLedger amount={t.amount} type={t.type} size="sm" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p className="fb-empty">Aucun résultat pour ces filtres.</p>}
    </div>
  );
}