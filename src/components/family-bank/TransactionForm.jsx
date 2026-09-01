import { useState } from "react";
import { supabase } from "../../supabase";
import { useFinance, CATEGORIES } from "../../context/FinanceContext";
import "./family-bank.css";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm() {
    const { addTransaction, cotisants, toggleCotisation } = useFinance();
  const [type, setType] = useState("entree");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
    const [cotisantId, setCotisantId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

   const resetForm = () => {
    setAmount("");
    setCategory(CATEGORIES[0]);
    setDate(todayISO());
    setNote("");
    setReceiptFile(null);
    setCotisantId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setFeedback("Indique un montant valide.");
      return;
    }
    setSubmitting(true);
    setFeedback("");

    try {
      let receiptUrl = null;
      if (receiptFile) {
        const safeName = receiptFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
const path = `${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(path, receiptFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("receipts").getPublicUrl(path);
        receiptUrl = data.publicUrl;
      }

            await addTransaction({ amount, type, category, date, note, receiptUrl });

      if (category === "Cotisation" && cotisantId) {
        const mois = date.slice(0, 7); // "2026-08"
        await toggleCotisation(cotisantId, mois, true);
      }

      setFeedback(type === "entree" ? "Entrée enregistrée." : "Sortie enregistrée.");
      resetForm();
    } catch (err) {
      console.error(err);
      setFeedback("Une erreur est survenue, réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="fb-form" onSubmit={handleSubmit}>
      <div className="fb-toggle">
        <button
          type="button"
          className={`fb-toggle__btn ${type === "entree" ? "fb-toggle__btn--active-in" : ""}`}
          onClick={() => setType("entree")}
        >
          Entrée
        </button>
        <button
          type="button"
          className={`fb-toggle__btn ${type === "sortie" ? "fb-toggle__btn--active-out" : ""}`}
          onClick={() => setType("sortie")}
        >
          Sortie
        </button>
      </div>

      <div className="fb-form__row">
        <label className="fb-field">
          <span>Montant (FCFA)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
          />
        </label>

                <label className="fb-field">
          <span>Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        {category === "Cotisation" && (
          <label className="fb-field">
            <span>Membre concerné</span>
            <select value={cotisantId} onChange={(e) => setCotisantId(e.target.value)}>
              <option value="">— Choisir —</option>
              {cotisants.map((c) => (
                <option key={c.id} value={c.id}>{c.prenom}</option>
              ))}
            </select>
          </label>
        )}

        <label className="fb-field">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
      </div>

      <label className="fb-field">
        <span>Note (optionnel)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex: courses du marché, cotisation mensuelle..."
        />
      </label>

      <label className="fb-field">
        <span>Justificatif / reçu (optionnel)</span>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
        />
      </label>

      <button type="submit" className="btn fb-form__submit" disabled={submitting}>
        {submitting ? "Enregistrement..." : "Enregistrer"}
      </button>

      {feedback && <p className="fb-form__feedback">{feedback}</p>}
    </form>
  );
}