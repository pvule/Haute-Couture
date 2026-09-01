import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../supabase";
import { AuthContext } from "./AuthContext";

export const FinanceContext = createContext(null);

export const CATEGORIES = [
  "Loyer", "Courses", "Santé", "Éducation", "Transport", "Cotisation", "Imprévu", "Autre",
];

// --- Petits transformateurs pour passer du snake_case (Supabase) au camelCase (React) ---
const mapTx = (t) => ({
  id: t.id, amount: t.amount, type: t.type, category: t.category, date: t.date,
  note: t.note, receiptUrl: t.receipt_url, author: t.author, authorUid: t.author_id,
});
const mapGoal = (g) => ({
  id: g.id, name: g.name, targetAmount: g.target_amount, currentAmount: g.current_amount, deadline: g.deadline,
});
const mapBudget = (b) => ({ id: b.category, category: b.category, monthlyLimit: b.monthly_limit });

export function FinanceProvider({ children }) {
  const { user } = useContext(AuthContext) || {};
  const [cotisants, setCotisants] = useState([]);
const [cotisations, setCotisations] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchAll = useCallback(async () => {
    const [txRes, membersRes, goalsRes, budgetsRes, cotisantsRes, cotisationsRes] = await Promise.all([
      supabase.from("transactions").select("*").order("date", { ascending: false }),
      supabase.from("members").select("*"),
      supabase.from("goals").select("*"),
      supabase.from("budgets").select("*"),
      supabase.from("cotisants").select("*").order("prenom", { ascending: true }),
      supabase.from("cotisations").select("*"),
    ]);
    if (txRes.data) setTransactions(txRes.data.map(mapTx));
    if (membersRes.data) setMembers(membersRes.data);
    if (goalsRes.data) setGoals(goalsRes.data.map(mapGoal));
    if (budgetsRes.data) setBudgets(budgetsRes.data.map(mapBudget));
    if (cotisantsRes.data) setCotisants(cotisantsRes.data);
    if (cotisationsRes.data) setCotisations(cotisationsRes.data);
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel("family-bank-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "budgets" }, fetchAll)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchAll]);

  // --- Bootstrap : premier connecté = admin, sinon on regarde les invitations ---
  useEffect(() => {
    if (!user || loading) return;
    const existing = members.find((m) => m.id === user.id);
    if (existing) return;

    (async () => {
      if (members.length === 0) {
        await supabase.from("members").insert({
          id: user.id, name: user.email, email: user.email, role: "admin",
        });
        return;
      }
      const { data: invite } = await supabase
        .from("invitations")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (invite) {
        await supabase.from("members").insert({
          id: user.id, name: user.email, email: user.email, role: invite.role,
        });
        await supabase.from("invitations").delete().eq("email", user.email);
      }
    })();
  }, [user, members, loading]);

  const currentMember = useMemo(() => members.find((m) => m.id === user?.id), [members, user]);
  const role = currentMember?.role || "contributeur";
  const isAdmin = role === "admin";

  const balance = useMemo(
    () => transactions.reduce((sum, t) => sum + (t.type === "entree" ? t.amount : -t.amount), 0),
    [transactions]
  );

  const addTransaction = async ({ amount, type, category, date, note, receiptUrl }) => {
    await supabase.from("transactions").insert({
      amount: Number(amount), type, category, date, note: note || "",
      receipt_url: receiptUrl || null,
      author: user?.email || "Inconnu", author_id: user?.id || null,
    });
  };

  const deleteTransaction = async (id) => {
    await supabase.from("transactions").delete().eq("id", id);
  };

  const inviteMember = async (email, role = "contributeur") => {
    await supabase.from("invitations").insert({ email, role });
  };

  const updateMemberRole = async (memberId, role) => {
    await supabase.from("members").update({ role }).eq("id", memberId);
  };

  const removeMember = async (memberId) => {
    await supabase.from("members").delete().eq("id", memberId);
  };

  const addGoal = async ({ name, targetAmount, deadline }) => {
    await supabase.from("goals").insert({
      name, target_amount: Number(targetAmount), current_amount: 0, deadline: deadline || null,
    });
  };

  const contributeToGoal = async (goalId, amount) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    await supabase.from("goals").update({
      current_amount: (goal.currentAmount || 0) + Number(amount),
    }).eq("id", goalId);
  };

  const deleteGoal = async (goalId) => {
    await supabase.from("goals").delete().eq("id", goalId);
  };

  const setBudget = async (category, monthlyLimit) => {
    await supabase.from("budgets").upsert({ category, monthly_limit: Number(monthlyLimit) });
  };
  
  // --- Cotisations ---
  const toggleCotisation = async (cotisantId, mois, paye) => {
    await supabase.from("cotisations").upsert(
      {
        cotisant_id: cotisantId,
        mois,
        paye,
        paye_le: paye ? new Date().toISOString() : null,
      },
      { onConflict: "cotisant_id,mois" }
    );
  };

   const value = {
    transactions, members, goals, budgets, balance, loading, role, isAdmin, currentMember,
    cotisants, cotisations,
    addTransaction, deleteTransaction, inviteMember, updateMemberRole, removeMember,
    addGoal, contributeToGoal, deleteGoal, setBudget, toggleCotisation,
  };
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance doit être utilisé dans <FinanceProvider>");
  return ctx;
}