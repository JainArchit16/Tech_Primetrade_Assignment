"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/40 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-zinc-500 text-sm">
              Join the network to start trading intelligence.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 ml-1">
                Full Name
              </label>
              <div className="relative group/input">
                <User
                  className="absolute left-3 top-3.5 text-zinc-500 group-focus-within/input:text-white transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-white/30 focus:bg-black/60 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-300"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 ml-1">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail
                  className="absolute left-3 top-3.5 text-zinc-500 group-focus-within/input:text-white transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="analyst@firm.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-white/30 focus:bg-black/60 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-300"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 ml-1">
                Password
              </label>
              <div className="relative group/input">
                <Lock
                  className="absolute left-3 top-3.5 text-zinc-500 group-focus-within/input:text-white transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:bg-black/60 focus:ring-1 focus:ring-white/20 outline-none transition-all duration-300"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-medium hover:underline underline-offset-4 decoration-zinc-600"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
