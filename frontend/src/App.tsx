import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Skeleton from "./components/ui/Skeleton";

const Login = lazy(() => import("./features/auth/pages/Login"));
const Signup = lazy(() => import("./features/auth/pages/Signup"));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword"));
const ResetPasswordConfirm = lazy(() => import("./features/auth/pages/ResetPasswordConfirm"));

const Atlas = lazy(() => import("./Atlas"));

export function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen space-y-4 bg-slate-50 p-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordConfirm />} />

          <Route
            path="/atlas"
            element={
              <PrivateRoute>
                <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
                  <Atlas />
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/digital-twin"
            element={
              <PrivateRoute>
                <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
                  <Atlas />
                </div>
              </PrivateRoute>
            }
          />

          {/* Catch-all redirects authenticated users straight to /atlas */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Navigate to="/atlas" replace />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
