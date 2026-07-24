// src/features/auth/pages/Signup.tsx

import { useState } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import type { SignupPayload, LoginResponse } from "../types/auth";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Building, Shield } from "lucide-react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function Signup() {
  const [form, setForm] = useState<SignupPayload>({
    username: "",
    email: "",
    password: "",
    organization_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setValidationErrors({});

    if (!form.username || !form.email || !form.password) {
      setErrorMsg("Please fill in all required fields (Username, Email, and Password)");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post<LoginResponse>("register/", form);

      // Store access token. Refresh stays in the httpOnly cookie.
      localStorage.setItem("access", res.data.access);

      // Clean up old storages
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Invalidate query cache for current user session
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          setErrorMsg(data.detail);
        } else if (typeof data === "object") {
          // Field validation errors
          setValidationErrors(data);
          setErrorMsg("Please fix the validation errors below.");
        } else {
          setErrorMsg("Registration failed. Please try again.");
        }
      } else {
        setErrorMsg("Network error. Please check your connection.");
      }
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
              Create Account
            </h2>
            <p className="mt-2 text-slate-400 text-sm text-center font-medium">
              Get started with our development workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {errorMsg && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 text-red-200 text-sm rounded-2xl p-4 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-300">Error</p>
                  <p className="text-xs text-red-400/90 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                Username <span className="text-indigo-400">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-500 pointer-events-none z-10">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="pl-12 border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                  required
                />
              </div>
              {validationErrors.username && (
                <p className="text-[11px] text-red-400 px-1 mt-1 font-medium">
                  {validationErrors.username.join(" ")}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                Email Address <span className="text-indigo-400">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-500 pointer-events-none z-10">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-12 border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="text-[11px] text-red-400 px-1 mt-1 font-medium">
                  {validationErrors.email.join(" ")}
                </p>
              )}
            </div>

            {/* Organization Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                Organization Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-500 pointer-events-none z-10">
                  <Building className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Defaults to '{Username}'s Org'"
                  value={form.organization_name || ""}
                  onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                  className="pl-12 border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
              {validationErrors.organization_name && (
                <p className="text-[11px] text-red-400 px-1 mt-1 font-medium">
                  {validationErrors.organization_name.join(" ")}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
                Password <span className="text-indigo-400">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-500 pointer-events-none z-10">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {validationErrors.password && (
                <p className="text-[11px] text-red-400 px-1 mt-1 font-medium">
                  {validationErrors.password.join(" ")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
          </form>

          {/* Redirection to Sign In */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
