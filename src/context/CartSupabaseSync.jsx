import { useContext, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import { supabase } from "../supabase";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export default function CartSync() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const cart = useContext(CartContext);

  const didHydrateRef = useRef(false);
  const isHydratingRef = useRef(false);

  const currentUserId = useMemo(() => user?.id ?? null, [user]);

  // Local storage remains the fallback cache when Supabase is unavailable.
  useEffect(() => {
    if (authLoading) return;
    if (!currentUserId) {
      didHydrateRef.current = false;
      return;
    }

    if (didHydrateRef.current) return;
    didHydrateRef.current = true;

    async function hydrateCart() {
      isHydratingRef.current = true;

      try {
        const { data, error } = await supabase
          .from("user_carts")
          .select("items")
          .eq("user_id", currentUserId)
          .maybeSingle();

        if (error) throw error;

        if (data?.items) {
          cart.replaceItems?.(data.items);
          return;
        }
      } catch (error) {
        console.warn("Unable to load cart from Supabase.", error);
      } finally {
        isHydratingRef.current = false;
      }

      if (!canUseLocalStorage()) return;

      try {
        const savedCart = localStorage.getItem(`cart_${currentUserId}`);
        if (savedCart) {
          cart.replaceItems?.(JSON.parse(savedCart));
        }
      } catch {
        // ignore invalid local cache
      }
    }

    hydrateCart();
  }, [authLoading, currentUserId, cart]);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUserId) return;
    if (isHydratingRef.current) return;

    async function saveCart() {
      const items = cart.items ?? [];

      if (canUseLocalStorage()) {
        localStorage.setItem(
          `cart_${currentUserId}`,
          JSON.stringify(items)
        );
      }

      const { error } = await supabase.from("user_carts").upsert(
        {
          user_id: currentUserId,
          items,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.warn("Unable to save cart to Supabase.", error);
      }
    }

    saveCart();
  }, [cart.items, authLoading, currentUserId]);

  return null;
}
