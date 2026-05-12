import { useContext, useEffect, useMemo, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import { supabase } from '../lib/supabaseClient';

// Synchronise le panier de ton UI (CartContext) avec une table Supabase.
// Hypothèses de schéma (à créer dans Supabase) :
// - table cart_items
//   - user_id uuid (fk vers auth.users)
//   - product_id text
//   - title text
//   - price numeric
//   - image text
//   - qty int

export default function CartSupabaseSync() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const cart = useContext(CartContext);

  const didHydrateRef = useRef(false);

  const currentUserId = useMemo(() => user?.id ?? null, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUserId) {
      didHydrateRef.current = false;
      return;
    }
    if (didHydrateRef.current) return;

    didHydrateRef.current = true;

    async function hydrate() {
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, title, price, image, qty')
        .eq('user_id', currentUserId);

      if (error) {
        // si table vide / non configurée, on ignore (pour ne pas casser l'app)
        return;
      }

      if (!Array.isArray(data) || data.length === 0) return;

      // reset local
      cart.clearCart?.();

      // reconstituer cart local
      data.forEach((row) => {
        cart.addItem(
          {
            id: row.product_id,
            title: row.title,
            price: Number(row.price),
            image: row.image,
          },
          row.qty
        );
      });
    }

    hydrate();
  }, [authLoading, currentUserId, cart]);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUserId) return;

    let cancelled = false;

    async function persist() {
      // Supprime puis réinsère (simple/robuste pour MVP)
      const { error: delError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUserId);

      if (delError) return;

      const rows = (cart.items ?? []).map((it) => ({
        user_id: currentUserId,
        product_id: it.id,
        title: it.title,
        price: it.price,
        image: it.image,
        qty: it.qty,
      }));

      if (rows.length === 0) return;

      await supabase.from('cart_items').insert(rows);
    }

    persist().catch(() => {
      if (cancelled) return;
    });

    return () => {
      cancelled = true;
    };
  }, [cart.items, authLoading, currentUserId, cart]);

  return null;
}

