"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type User = {
  id?: string;
  dbId?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type Session = {
  user?: User;
  expires?: string;
} | null;

type Status = "loading" | "authenticated" | "unauthenticated";

type UpdateArg = Partial<Session> | ((prev: Session) => Session);

export function useAppSession() {
  const [data, setData] = useState<Session>(null);
  const [status, setStatus] = useState<Status>("loading");
  const fetched = useRef(false);

  const fetchOnce = async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) throw new Error("session fetch failed");
      const json = await res.json();
      if (json && json.user) {
        setData(json);
        setStatus("authenticated");
      } else {
        setData(null);
        setStatus("unauthenticated");
      }
    } catch {
      setData(null);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchOnce();
    }

    const onFocus = () => fetchOnce();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const update = useMemo(
    () => async (arg?: UpdateArg) => {
      if (!arg) return;
      setData((prev) => {
        const next = typeof arg === "function" ? (arg as any)(prev) : { ...prev, ...(arg as any) };
        // Keep status in sync
        setStatus(next && (next as any).user ? "authenticated" : "unauthenticated");
        return next as Session;
      });
    },
    []
  );

  return { data, status, update } as const;
}

