import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth.tsx";
//import SplashScreen from "../components/loader/FullScreenLoader.tsx";

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session,} = useAuth();


  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
