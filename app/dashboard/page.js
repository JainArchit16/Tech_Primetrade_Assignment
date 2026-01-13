"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Trash2, Search, Activity } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: newTask }),
    });
    if (res.ok) {
      setNewTask("");
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <nav className="flex justify-between items-center mb-16 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black p-2 rounded-lg">
            <Activity size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TRADING_INTEL</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition px-4 py-2 hover:bg-white/5 rounded-lg"
        >
          <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
        </button>
      </nav>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Filter intelligence..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-white/30 outline-none transition"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <form onSubmit={handleCreate} className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Add new intel..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-white/30 outline-none transition"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} /> Add
          </button>
        </form>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="group bg-zinc-900/40 border border-white/10 p-6 rounded-2xl hover:border-white/30 hover:bg-zinc-900/60 transition backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
                ID: {task._id.slice(-6).toUpperCase()}
              </span>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-zinc-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="font-semibold text-lg text-zinc-100 leading-snug">
              {task.title}
            </h3>
            <p className="text-zinc-500 text-xs mt-4 pt-4 border-t border-white/5">
              Added: {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center text-zinc-600 mt-20">
          <p>No intelligence data found.</p>
        </div>
      )}
    </div>
  );
}
