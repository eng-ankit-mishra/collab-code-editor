import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import HomePage from "./pages/Home";
import LogIn from "./features/auth/pages/Login.tsx";
import SignUp from "./features/auth/pages/SignUp.tsx";
import NotFoundPage from "./pages/NotFound";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SplashScreen from "./components/loader/FullScreenLoader.tsx";
import ForgotPassword from "./features/auth/pages/ForgotPassword.tsx";
import ResetPassword from "./features/auth/pages/ResetPassword.tsx";
import {ToastContainer} from "react-toastify"
import Invitations from "./features/dashboard/components/Invititions.tsx";
import Oauth2Redirect from "./features/auth/pages/Oauth2Redirect.tsx";

const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard.tsx"));
const CodeEditor = lazy(() => import("./features/editor/pages/./CodePlayground"));
const AllRepository = lazy(() => import("./features/repository/components/AllRepository.tsx"));
const Recent = lazy(() => import("./features/repository/components/Recent.tsx"));
const Settings= lazy(()=>import("./features/dashboard/components/Settings.tsx"));
const SharedWithMe=lazy(()=>import("./features/dashboard/components/ShareWithMe.tsx"))

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LogIn />
            </PublicRoute>
          }
        />
          <Route path={"/oauth2/redirect"} element={
              <PublicRoute>
                  <Oauth2Redirect/>
              </PublicRoute>
          }
          />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/reset-password"
          element={
            //<ProtectedRoutes>
              <ResetPassword />
            //</ProtectedRoutes>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<SplashScreen />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoutes>
          }
        >
          <Route index element={<Recent />} />
          <Route path="allrepository" element={<AllRepository />} />
          <Route path="invititions" element={<Invitations />} />
          <Route path="sharewithme" element={<SharedWithMe />} /><Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/editor/:projectId"
          element={
            <ProtectedRoutes>
              <Suspense fallback={<SplashScreen />}>
                <CodeEditor />
              </Suspense>
            </ProtectedRoutes>
          }
        />


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
