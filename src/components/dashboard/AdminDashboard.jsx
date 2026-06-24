import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, DollarSign, BookOpen, MessageSquare, Check, X, Trash2, Ban, ShieldCheck, Dumbbell, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { Input, Label, Select, Textarea } from "../../components/ui/Input.jsx";
import {
  getAdminStats,
  getAllUsersAdmin,
  getAllClassesAdmin,
  getAllPostsAdmin,
  getTransactionsAdmin,
  getTrainerApplicationsAdmin,
  updateUserRoleAdmin,
  toggleBlockUserAdmin,
  approveClassAdmin,
  rejectClassAdmin,
  deleteClassAdmin,
  deletePostAdmin,
  approveTrainerAppAdmin,
  rejectTrainerAppAdmin,
  createClass
} from "../../lib/api.js";
import { monthlyAnalytics, categoryShare, CATEGORIES } from "../../data/mockData.js";
import { fmtMoney } from "../../utils/helpers.js";
import ImageUpload from "../../components/ImageUpload.jsx";

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-primary)", "var(--color-accent)"];

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isStats } = useQuery({ queryKey: ["admin", "stats"], queryFn: getAdminStats });
  const { data: allUsers = [], isLoading: isUsers } = useQuery({ queryKey: ["admin", "users"], queryFn: getAllUsersAdmin });
  const { data: classes = [], isLoading: isClasses } = useQuery({ queryKey: ["admin", "classes"], queryFn: getAllClassesAdmin });
  const { data: posts = [], isLoading: isPosts } = useQuery({ queryKey: ["admin", "posts"], queryFn: getAllPostsAdmin });
  const { data: trainerApps = [], isLoading: isApps } = useQuery({ queryKey: ["admin", "trainerApps"], queryFn: getTrainerApplicationsAdmin });
  const { data: bookings = [], isLoading: isBookings } = useQuery({ queryKey: ["admin", "bookings"], queryFn: getTransactionsAdmin });

  const isLoading = isStats || isUsers || isClasses || isPosts || isApps || isBookings;

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Yoga", price: 20, duration: 60, difficulty: "Beginner", schedule: "", image: "", description: "" });

  const handleError = (err) => toast.error(err.response?.data?.message || err.message || "Action failed");

  const mutCreateClass = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class created");
      queryClient.invalidateQueries({ queryKey: ["admin", "classes"] });
      setShowAdd(false);
      setForm({ title: "", category: "Yoga", price: 20, duration: 60, difficulty: "Beginner", schedule: "", image: "", description: "" });
    },
    onError: handleError
  });

  const onAdd = (e) => {
    e.preventDefault();
    mutCreateClass.mutate({
      className: form.title,
      difficultyLevel: form.difficulty,
      category: form.category,
      price: Number(form.price),
      duration: Number(form.duration),
      schedule: form.schedule,
      description: form.description,
      image: form.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=70"
    });
  };

  const mutRole = useMutation({
    mutationFn: ({ id, role }) => updateUserRoleAdmin(id, role),
    onSuccess: () => { toast.success("Role updated"); queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); },
    onError: handleError
  });

  const mutBlock = useMutation({
    mutationFn: ({ id, status }) => toggleBlockUserAdmin(id, status),
    onSuccess: () => { toast.success("Status updated"); queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); },
    onError: handleError
  });

  const mutApproveClass = useMutation({
    mutationFn: approveClassAdmin,
    onSuccess: () => { toast.success("Class approved"); queryClient.invalidateQueries({ queryKey: ["admin", "classes"] }); },
    onError: handleError
  });

  const mutRejectClass = useMutation({
    mutationFn: rejectClassAdmin,
    onSuccess: () => { toast("Class rejected"); queryClient.invalidateQueries({ queryKey: ["admin", "classes"] }); },
    onError: handleError
  });

  const mutDeleteClass = useMutation({
    mutationFn: deleteClassAdmin,
    onSuccess: () => { toast.success("Class deleted"); queryClient.invalidateQueries({ queryKey: ["admin", "classes"] }); },
    onError: handleError
  });

  const mutDeletePost = useMutation({
    mutationFn: deletePostAdmin,
    onSuccess: () => { toast.success("Post deleted"); queryClient.invalidateQueries({ queryKey: ["admin", "posts"] }); },
    onError: handleError
  });

  const mutApproveTrainer = useMutation({
    mutationFn: approveTrainerAppAdmin,
    onSuccess: () => { 
      toast.success("Trainer approved"); 
      queryClient.invalidateQueries({ queryKey: ["admin", "trainerApps"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); 
    },
    onError: handleError
  });

  const mutRejectTrainer = useMutation({
    mutationFn: rejectTrainerAppAdmin,
    onSuccess: () => { toast("Trainer rejected"); queryClient.invalidateQueries({ queryKey: ["admin", "trainerApps"] }); },
    onError: handleError
  });

  const revenue = stats?.totalRevenue || 0;

  if (isLoading) return <Spinner className="mt-20" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin console</h1>
        <p className="mt-1 text-sm text-muted-foreground">Network-wide controls, analytics, and moderation.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total users", value: stats?.totalUsers || 0 },
          { icon: BookOpen, label: "Total classes", value: stats?.totalClasses || 0 },
          { icon: MessageSquare, label: "Forum posts", value: posts.length },
          { icon: DollarSign, label: "Total revenue", value: fmtMoney(revenue) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
            <p className="mt-4 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="text-base font-semibold">Network growth</h2><p className="text-xs text-muted-foreground">Members & bookings, last 6 months</p></div>
            <Badge tone="success">+21% MoM</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={monthlyAnalytics}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="members" stroke="var(--color-accent)" fill="url(#gb)" strokeWidth={2} />
                <Area type="monotone" dataKey="bookings" stroke="var(--color-primary)" fill="url(#ga)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Category mix</h2>
          <p className="text-xs text-muted-foreground">Share of bookings by category</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {categoryShare.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trainer applications */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="border-b border-border p-5"><h2 className="text-base font-semibold">Trainer applications</h2></header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">Applicant</th><th className="px-5 py-3">Specialty</th><th className="px-5 py-3">Exp.</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Decide</th></tr>
            </thead>
            <tbody>
              {trainerApps.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No applications found.</td></tr>
              ) : trainerApps.map((a) => (
                <tr key={a._id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={a.userId?.image || `https://i.pravatar.cc/150?u=${a.userId?.email}`} className="h-8 w-8 rounded-full object-cover" alt="" />
                      <div><p className="font-medium">{a.userId?.name}</p><p className="text-xs text-muted-foreground">{a.userId?.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{a.specialty}</td>
                  <td className="px-5 py-3">{a.experience} yrs</td>
                  <td className="px-5 py-3"><Badge tone={a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : "warning"}>{a.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => mutApproveTrainer.mutate(a._id)} className="rounded-md p-2 text-success hover:bg-muted" title="Approve"><Check className="h-4 w-4" /></button>
                      <button onClick={() => mutRejectTrainer.mutate(a._id)} className="rounded-md p-2 text-destructive hover:bg-muted" title="Reject"><X className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Classes */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-base font-semibold">Classes</h2>
          <Button onClick={() => setShowAdd(true)} variant="primary" size="sm"><Plus className="mr-2 h-4 w-4" /> New class</Button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">Class</th><th className="px-5 py-3">Trainer</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No classes found.</td></tr>
              ) : classes.map((c) => (
                <tr key={c._id} className="border-t border-border">
                  <td className="px-5 py-3"><p className="font-medium">{c.className || c.title || "Unknown"}</p><p className="text-xs text-muted-foreground">{fmtMoney(c.price)} · {c.bookingCount || c.bookingsCount || 0} booked</p></td>
                  <td className="px-5 py-3 text-muted-foreground">{c.trainerName || c.trainerId?.name || "—"}</td>
                  <td className="px-5 py-3"><Badge tone={c.status === "approved" ? "success" : c.status === "rejected" ? "danger" : "warning"}>{c.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => mutApproveClass.mutate(c._id)} className="rounded-md p-2 text-success hover:bg-muted" title="Approve"><Check className="h-4 w-4" /></button>
                      <button onClick={() => mutRejectClass.mutate(c._id)} className="rounded-md p-2 text-amber-500 hover:bg-muted" title="Reject"><X className="h-4 w-4" /></button>
                      <button onClick={() => mutDeleteClass.mutate(c._id)} className="rounded-md p-2 text-destructive hover:bg-muted" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="border-b border-border p-5"><h2 className="text-base font-semibold">Users</h2></header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {allUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No users found.</td></tr>
              ) : allUsers.map((u) => (
                <tr key={u._id || u.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.image || `https://i.pravatar.cc/150?u=${u.email}`} className="h-8 w-8 rounded-full object-cover" alt="" />
                      <div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><Badge tone={u.role === "admin" ? "brand" : u.role === "trainer" ? "success" : "default"}>{u.role}</Badge></td>
                  <td className="px-5 py-3"><Badge tone={u.status === "active" || !u.status ? "success" : "danger"}>{u.status || "active"}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end w-32">
                      <button 
                        onClick={() => mutRole.mutate({ id: u._id || u.id, role: 'trainer' })} 
                        disabled={u.role === 'trainer'}
                        className={`rounded-md p-2 transition-colors ${u.role === 'trainer' ? 'text-success/40 cursor-not-allowed bg-success/5' : 'text-success hover:bg-muted'}`} 
                        title="Make Trainer"
                      >
                        <Dumbbell className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => mutRole.mutate({ id: u._id || u.id, role: 'admin' })} 
                        disabled={u.role === 'admin'}
                        className={`rounded-md p-2 transition-colors ${u.role === 'admin' ? 'text-primary/40 cursor-not-allowed bg-primary/5' : 'text-primary hover:bg-muted'}`} 
                        title="Make Admin"
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => mutRole.mutate({ id: u._id || u.id, role: 'user' })} 
                        disabled={u.role === 'user' || !u.role}
                        className={`rounded-md p-2 transition-colors ${u.role === 'user' || !u.role ? 'text-muted-foreground/40 cursor-not-allowed bg-muted' : 'text-muted-foreground hover:bg-muted'}`} 
                        title="Make User"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => mutBlock.mutate({ id: u._id || u.id, status: u.status || 'active' })} 
                        className={`rounded-md p-2 transition-colors ${u.status === 'blocked' ? 'text-success hover:bg-success/10' : 'text-amber-500 hover:bg-amber-500/10'}`} 
                        title={u.status === 'blocked' ? "Unblock" : "Block"}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forum posts */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="border-b border-border p-5"><h2 className="text-base font-semibold">Forum posts</h2></header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Author</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Likes</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No posts found.</td></tr>
              ) : posts.map((p) => (
                <tr key={p._id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium line-clamp-1">{p.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.authorName || p.authorId?.name || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3">{p.likes?.length || 0}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => mutDeletePost.mutate(p._id)} className="rounded-md p-2 text-destructive hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transactions */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="border-b border-border p-5"><h2 className="text-base font-semibold">Transactions</h2></header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">Txn</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Date</th><th className="px-5 py-3 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No transactions found.</td></tr>
              ) : bookings.map((b) => (
                <tr key={b._id} className="border-t border-border">
                  <td className="px-5 py-3 font-mono text-xs">{b._id.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3">{b.userId?.name || b.userEmail || b.userId || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.className || b.classId?.title || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right font-medium">{fmtMoney(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Class Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create a new class" maxWidth="max-w-xl">
        <form onSubmit={onAdd} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label>Category</Label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div><Label>Difficulty</Label>
            <Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d}>{d}</option>)}
            </Select>
          </div>
          <div><Label>Price ($)</Label><Input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
          <div><Label>Duration (min)</Label><Input type="number" min="10" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required /></div>
          <div className="sm:col-span-2"><Label>Schedule</Label><Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Mon, Wed, Fri • 7:00 AM" required /></div>
          <div className="sm:col-span-2">
            <ImageUpload
              label="Class Image (optional)"
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />
          </div>
          <div className="sm:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create class</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
