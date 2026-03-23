"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SoloLogo } from "@/components/ui/SoloLogo";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock login - accept any email with password "admin"
      if (password === "admin") {
        // In real app, would store JWT and redirect
        router.push("/admin");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card p-8 border border-border shadow-lg">
          <div className="text-center mb-8">
            <SoloLogo size="lg" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted text-sm mt-1">Sign in to manage your store</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@solo.com.bz"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-surface-alt text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Forgot your password?{" "}
            <a href="#" className="text-primary hover:underline">
              Reset it here
            </a>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          For demo, use password: <code className="bg-surface-alt px-1 rounded">admin</code>
        </p>
      </div>
    </main>
  );
}
