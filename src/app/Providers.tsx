"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUserCtx } from "../../providers/UserContext";

export default function Providers() {
  const { user, setUser } = useUserCtx();
  const pathname = usePathname();

  // 1) Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && !user) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem("user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) On every route change/refresh:
  //    - if localStorage is empty but we have a user in context (from server session), write it
  //    - if both are missing, try fetching /api/auth/me to rehydrate (no flicker on SSR-protected pages)
  useEffect(() => {
    const ensureUserCached = async () => {
      const stored = localStorage.getItem("user");
        console.log(stored, user);
      if (!stored && user) {
        // use server-initialized user from context to repopulate storage
        localStorage.setItem("user", JSON.stringify(user));
        return;
      }

      if (!stored && !user) {
        try {
          const res = await fetch("/api/auth/me", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              const u = {
                id: data.user.sub as string,
                email: data.user.email as string | undefined,
                name: data.user.name as string | undefined,
                picture: data.user.picture as string | undefined,
              };
              setUser(u);
              localStorage.setItem("user", JSON.stringify(u));
            } else {
              // no session; ensure storage cleared
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        } catch {
          // network error -> leave as is
        }
      }
    };

    ensureUserCached();
  }, [pathname, user, setUser]);

  // 3) Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(parsed);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setUser]);

  return null;
}
