"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-zinc-900/80 border border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-white/40 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-white/40 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-zinc-500 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
