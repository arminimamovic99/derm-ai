// app/contexts/UserContext.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AppUser = {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
} | null;

type Ctx = {
  user: AppUser;
  setUser: (u: AppUser) => void;
};

const UserCtx = createContext<Ctx | undefined>(undefined);

export function useUserCtx() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUserCtx must be used within <UserProvider>");
  return ctx;
}

type ProviderProps = {
  children: ReactNode;
  initialUser?: AppUser; // <-- allow initialUser
};

export function UserProvider({ children, initialUser = null }: ProviderProps) {
  const [user, setUser] = useState<AppUser>(initialUser);
  return <UserCtx.Provider value={{ user, setUser }}>{children}</UserCtx.Provider>;
}
