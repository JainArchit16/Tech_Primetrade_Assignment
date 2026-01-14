"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Plus,
  Trash2,
  Search,
  Activity,
  Save,
  Loader2,
  UserCircle,
} from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "prefer_not_to_say",
  });
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, userRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/auth/me"),
      ]);
      if (taskRes.ok) setTasks(await taskRes.json());
      if (userRes.ok) setUser(await userRes.json());
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Client Validation
    if (user.name.length < 2) {
      alert("Name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          gender: user.gender,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setIsEditing(false);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    // Task Validation
    if (!newTask.trim()) return;
    if (newTask.length < 3) {
      alert("Task title must be at least 3 characters");
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: newTask }),
    });
    if (res.ok) {
      setNewTask("");
      const updatedTasks = await fetch("/api/tasks").then((r) => r.json());
      setTasks(updatedTasks);
    }
  };

  const handleDeleteTask = async (id) => {
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
      <nav className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white text-black p-2 rounded-lg">
            <Activity size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TRADING_INTEL</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
        >
          <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl sticky top-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-white truncate max-w-[150px]">
                  {user.name}
                </h2>
                <p className="text-xs text-zinc-500 capitalize">
                  {user.gender.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled={!isEditing}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-white/30 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  Gender
                </label>
                <div className="relative">
                  <select
                    value={user.gender}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setUser({ ...user, gender: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-white/30 outline-none transition appearance-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {isEditing && (
                    <UserCircle
                      size={16}
                      className="absolute right-3 top-2.5 text-zinc-500 pointer-events-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled={true}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-white/30 outline-none transition"
                />
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition text-zinc-300"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}{" "}
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchData();
                    }}
                    className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Task Manager (Right) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-3.5 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search data..."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-white/30 outline-none transition"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <form onSubmit={handleCreateTask} className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Add new intel..."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-white/30 outline-none transition"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition flex items-center gap-2"
              >
                <Plus size={20} /> Add
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="group bg-zinc-900/40 border border-white/10 p-6 rounded-2xl hover:border-white/30 hover:bg-zinc-900/60 transition backdrop-blur-sm flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-lg text-zinc-100 leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-2">
                    ID: {task._id.slice(-6).toUpperCase()} •{" "}
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-zinc-600 hover:text-red-400 transition p-2 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
