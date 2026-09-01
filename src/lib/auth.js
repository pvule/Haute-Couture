import { supabase } from "../supabase";

const DEFAULT_AUTH_CALLBACK_PATH = "/auth/callback";

export function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
}

export function getAuthCallbackUrl() {
  const configuredRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL;

  if (configuredRedirectUrl) {
    return configuredRedirectUrl;
  }

  return `${getSiteUrl()}${DEFAULT_AUTH_CALLBACK_PATH}`;
}

export async function saveUserProfile(user, name = "") {
  if (!user?.id) {
    throw new Error("Utilisateur Supabase introuvable.");
  }

  const fullName =
    name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw error;
}
