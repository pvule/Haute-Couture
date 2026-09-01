import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import "../../components/family-bank/family-bank.css";

export default function Membres() {
  const { members, isAdmin, inviteMember, updateMemberRole, removeMember } = useFinance();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("contributeur");
  const [feedback, setFeedback] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    await inviteMember(email, role);
    setFeedback(`Invitation créée pour ${email}. Elle deviendra active dès la première connexion.`);
    setEmail("");
  };

  return (
    <div className="fb-page">
      <p className="fb-eyebrow">Family Bank</p>
      <h1 className="fb-page-title">Membres</h1>

      <table className="fb-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            {isAdmin && <th></th>}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>
                {isAdmin ? (
                  <select value={m.role} onChange={(e) => updateMemberRole(m.id, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="contributeur">Contributeur</option>
                  </select>
                ) : (
                  m.role === "admin" ? "Admin" : "Contributeur"
                )}
              </td>
              {isAdmin && (
                <td>
                  <button type="button" className="fb-link-btn" onClick={() => removeMember(m.id)}>
                    Retirer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isAdmin && (
        <div className="fb-card" style={{ marginTop: 40 }}>
          <h2 className="fb-card__title">Inviter un membre de la famille</h2>
          <form className="fb-form" onSubmit={handleInvite}>
            <div className="fb-form__row">
              <label className="fb-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom@exemple.com"
                  required
                />
              </label>
              <label className="fb-field">
                <span>Rôle</span>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="contributeur">Contributeur</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            <button type="submit" className="btn fb-form__submit">Inviter</button>
            {feedback && <p className="fb-form__feedback">{feedback}</p>}
          </form>
          <p className="fb-hint">
            La personne invitée doit se connecter avec ce même email pour que son accès s'active.
          </p>
        </div>
      )}
    </div>
  );
}