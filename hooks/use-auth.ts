import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { user, loading, authenticated, logout, setUser } = useAuthContext();
  const router = useRouter();

  const requireAuth = (userType?: "barber" | "client") => {
    // Protege rotas que precisam de autenticação
    useEffect(() => {
      if (!loading) {
        if (!authenticated) {
          router.replace("/login");
        } else if (userType && user?.type !== userType) {
          // Se um tipo específico de usuário for exigido, verifica
          router.replace("/");
        }
      }
    }, [loading, authenticated, userType, user?.type]);

    return { loading, user };
  };

  return {
    user,
    loading,
    authenticated,
    requireAuth,
  };
}
