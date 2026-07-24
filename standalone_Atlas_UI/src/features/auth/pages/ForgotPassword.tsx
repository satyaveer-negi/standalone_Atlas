// src/features/auth/pages/ForgotPassword.tsx

import { useState } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, AlertCircle, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await API.post("password-reset/request/", { email });
      setSuccess(true);
      toast.success("Password reset request submitted");
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.email?.[0] || err?.response?.data?.detail || "Something went wrong. Please try again.";
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
              Reset Password
            </h2>
            <p className="mt-2 text-slate-400 text-sm text-center font-medium">
              We'll send you link instructions to reset your password
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="flex flex-col items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-sm rounded-2xl p-6">
                <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-300">Request Sent Successfully</p>
                  <p className="text-xs text-emerald-400/80 mt-2 leading-relaxed">
                    If an account is associated with <strong>{email}</strong>, a password reset link has been dispatched.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Note: In development environments, reset emails are printed directly to the backend uvicorn terminal console output logs.
              </p>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full py-3.5 rounded-2xl border-slate-850 hover:border-slate-700 bg-slate-950/40 text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleRequestReset} className="space-y-5">
              {errorMsg && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 text-red-200 text-sm rounded-2xl p-4 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-300">Error</p>
                    <p className="text-xs text-red-400/90 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500 pointer-events-none">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending instructions...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
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
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
