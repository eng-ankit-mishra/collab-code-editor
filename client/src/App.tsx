import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import HomePage from "./pages/Home";
import LogIn from "./features/auth/pages/Login.tsx";
import SignUp from "./features/auth/pages/SignUp.tsx";
import NotFoundPage from "./pages/NotFound";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SplashScreen from "./components/loader/FullScreenLoader.tsx";
import ResetPassword from "./features/auth/pages/ResetPassword.tsx";
import ChangePassword from "./features/auth/pages/ChangePassword.tsx";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Invititions from "./features/dashboard/components/Invititions.tsx";

const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard.tsx"));
const CodeEditor = lazy(() => import("./features/editor/pages/CodeEditor.tsx"));
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

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoutes>
              <ChangePassword />
            </ProtectedRoutes>
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
          <Route path="invititions" element={<Invititions />} />
          <Route path="sharewithme" element={<SharedWithMe />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/editor/:id"
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
