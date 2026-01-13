import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400 mb-4 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          System Operational
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Redefining Trading <br /> Intelligence.
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Secure, scalable, and responsive dashboard for modern crypto-native
          analysts. Manage your intelligence data with real-time CRUD
          operations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Get Started <ArrowRight size={20} />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-zinc-900 border border-white/10 text-white rounded-lg font-bold hover:bg-zinc-800 transition w-full sm:w-auto"
          >
            Login
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm">
            <Zap className="mb-4 text-white" />
            <h3 className="text-lg font-semibold mb-2">High Performance</h3>
            <p className="text-zinc-500 text-sm">
              Built on Next.js 14 for ease of scaling and speed.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm">
            <ShieldCheck className="mb-4 text-white" />
            <h3 className="text-lg font-semibold mb-2">Secure Auth</h3>
            <p className="text-zinc-500 text-sm">
              JWT-based authentication with HTTP-only cookies.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm">
            <BarChart3 className="mb-4 text-white" />
            <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
            <p className="text-zinc-500 text-sm">
              Seamless CRUD operations with MongoDB integration.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
