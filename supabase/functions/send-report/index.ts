import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !brevoApiKey) {
      throw new Error("Variables d'environnement manquantes");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { balance, transactions = [] } = await req.json();

    // Récupère tous les membres qui ont un compte
    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("email, name");

    if (membersError) throw membersError;
    if (!members || members.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucun membre à notifier." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rows = transactions
      .slice(0, 20)
      .map((t: any) => {
        const color = t.type === "entree" ? "#2f6b4f" : "#7a2e2e";
        const sign = t.type === "entree" ? "" : "-";
        return `
          <tr>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${t.date}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${t.category}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${t.author}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;color:${color};text-align:right;">
              ${sign}${Number(t.amount).toLocaleString("fr-FR")} FCFA
            </td>
          </tr>`;
      })
      .join("");

    const htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color:#151414;">
        <h1 style="font-size: 1.8rem; margin-bottom: 0;">FAMILY BANK</h1>
        <p style="color:#777; margin-top:4px;">Rapport de la caisse familiale</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
        <p style="font-size:0.9rem;color:#777;margin-bottom:4px;">Solde actuel</p>
        <p style="font-size:2.4rem;margin:0;">${Number(balance).toLocaleString("fr-FR")} FCFA</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #151414;">Date</th>
              <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #151414;">Catégorie</th>
              <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #151414;">Auteur</th>
              <th style="text-align:right;padding:6px 10px;border-bottom:2px solid #151414;">Montant</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    // Envoie un email à chaque membre via Brevo
    const results = await Promise.all(
      members.map(async (member: any) => {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
                       sender: { name: "Family Bank", email: "tasite426@gmail.com" },
            to: [{ email: member.email, name: member.name || member.email }],
            subject: `Family Bank — Rapport du ${new Date().toLocaleDateString("fr-FR")}`,
            htmlContent,
          }),
        });
        return { email: member.email, ok: res.ok, status: res.status };
      })
    );

    return new Response(JSON.stringify({ message: "Rapport envoyé", results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});