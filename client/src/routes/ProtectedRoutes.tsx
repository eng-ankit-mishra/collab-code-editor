// routes/ProtectedRoutes.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth.tsx";
import SplashScreen from "../components/loader/FullScreenLoader.tsx";

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();

  // ⏳ Wait until Supabase finishes restoring session
  if (loading) {
    return <SplashScreen />;
  }

  // 🔐 Not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return <>{children}</>;
}
