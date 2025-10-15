"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserCtx } from "../../providers/UserContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUserCtx();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.replace(`/auth/login`);
    }
  }, [user, router, pathname]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
