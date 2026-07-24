// src/features/auth/pages/ResetPasswordConfirm.tsx

import { useState } from "react";
import API from "../../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const uidb64 = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!uidb64 || !token) {
      setErrorMsg("Invalid reset link. Please check your email request or get a new link.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter a new password");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await API.post("password-reset/confirm/", {
        uidb64,
        token,
        new_password: password,
      });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.detail || err?.response?.data?.new_password?.[0] || "Failed to reset password. The link might be expired or invalid.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-[#070b13] overflow-hidden">
      {/* Aurora Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[150px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/25 blur-[150px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-3xl bg-slate-950/40 border border-slate-800/60 shadow-[0_24px_80px_rgba(0,0,0,0.6)] rounded-[32px] p-6 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white text-center">
              New Password
            </h2>
            <p className="mt-2 text-slate-400 text-sm text-center font-medium">
              Create a new secure password for your account
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="space-y-5 text-center animate-fadeIn">
              <div className="flex flex-col items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-sm rounded-2xl p-6">
                <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-300">Password Updated</p>
                  <p className="text-xs text-emerald-400/80 mt-2 leading-relaxed">
                    Your password has been reset successfully. You can now use your new credentials to sign in.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => navigate("/")}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
              >
                Sign In
              </Button>
            </div>
          ) : (
            /* Reset Confirm Form */
            <form onSubmit={handleConfirmReset} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 text-red-200 text-sm rounded-2xl p-4 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-300">Validation Error</p>
                    <p className="text-xs text-red-400/90 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500 pointer-events-none z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500 pointer-events-none z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Cancel and Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default ResetPasswordConfirm;
