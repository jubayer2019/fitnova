import { useMemo, useState } from "react";
import { Plus, Users, BookOpen, Eye, Trash2, MessageSquare, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { Input, Label, Select, Textarea } from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { CATEGORIES } from "../../data/mockData.js";
import { fmtMoney } from "../../utils/helpers.js";
import ImageUpload from "../../components/ImageUpload.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyClasses, deleteMyClass, createClass, updateClass, getMyPosts, createPost, deleteMyPost, getTrainerBookings } from "../../lib/api.js";

export default function TrainerDashboard() {
  const { user, allUsers } = useAuth();
  const queryClient = useQueryClient();

  const { data: myClasses = [], isLoading: isClasses } = useQuery({ queryKey: ["trainer", "classes"], queryFn: getMyClasses });
  const { data: myPosts = [], isLoading: isPosts } = useQuery({ queryKey: ["trainer", "posts"], queryFn: getMyPosts });
  const { data: myBookings = [], isLoading: isBookings } = useQuery({ queryKey: ["trainer", "bookings"], queryFn: getTrainerBookings });

  const isLoading = isClasses || isPosts || isBookings;

  const studentsByClass = (classId) => myBookings.filter((b) => {
    if (!b.classId) return false;
    const bId = b.classId._id || b.classId;
    const cId = classId._id || classId;
    return String(bId) === String(cId);
  }).map((b) => {
    const u = b.userId || {};
    return {
      id: u._id || (typeof b.userId === 'string' ? b.userId : b._id),
      name: u.name || b.userName || "Student",
      email: u.email || b.userEmail || "",
      image: u.image || ""
    };
  });
  const totalStudents = myClasses.reduce((acc, c) => acc + studentsByClass(c._id).length, 0);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showStudents, setShowStudents] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Yoga", price: 20, duration: 60, difficulty: "Beginner", schedule: "", image: "", description: "" });
  const [editForm, setEditForm] = useState({ title: "", category: "Yoga", price: 20, duration: 60, difficulty: "Beginner", schedule: "", image: "", description: "" });

  const mutAddClass = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class submitted for approval.");
      queryClient.invalidateQueries({ queryKey: ["trainer", "classes"] });
      setShowAdd(false);
      setForm({ title: "", category: "Yoga", price: 20, duration: 60, difficulty: "Beginner", schedule: "", image: "", description: "" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to submit class");
    }
  });

  const mutUpdateClass = useMutation({
    mutationFn: ({ id, data }) => updateClass(id, data),
    onSuccess: () => {
      toast.success("Class updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["trainer", "classes"] });
      setShowEdit(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update class");
    }
  });

  const mutDeleteClass = useMutation({
    mutationFn: deleteMyClass,
    onSuccess: () => {
      toast.success("Class deleted.");
      queryClient.invalidateQueries({ queryKey: ["trainer", "classes"] });
    }
  });

  const onAdd = (e) => {
    e.preventDefault();
    mutAddClass.mutate({ 
      className: form.title,
      difficultyLevel: form.difficulty,
      category: form.category,
      schedule: form.schedule,
      description: form.description,
      price: Number(form.price), 
      duration: Number(form.duration), 
      image: form.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=70" 
    });
  };

  const onUpdate = (e) => {
    e.preventDefault();
    mutUpdateClass.mutate({
      id: showEdit._id || showEdit.id,
      data: {
        className: editForm.title,
        difficultyLevel: editForm.difficulty,
        category: editForm.category,
        schedule: editForm.schedule,
        description: editForm.description,
        price: Number(editForm.price),
        duration: Number(editForm.duration),
        image: editForm.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=70"
      }
    });
  };

  const handleEditClick = (c) => {
    setEditForm({
      title: c.className || c.title || "",
      category: c.category || "Yoga",
      price: c.price || 20,
      duration: c.duration || 60,
      difficulty: c.difficultyLevel || c.difficulty || "Beginner",
      schedule: c.schedule || "",
      image: c.image || "",
      description: c.description || ""
    });
    setShowEdit(c);
  };

  const [postForm, setPostForm] = useState({ title: "", category: "Strength", description: "", image: "" });

  const mutAddPost = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post published.");
      queryClient.invalidateQueries({ queryKey: ["trainer", "posts"] });
      setPostForm({ title: "", category: "Strength", description: "", image: "" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to publish post");
    }
  });

  const mutDeletePost = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("Post deleted.");
      queryClient.invalidateQueries({ queryKey: ["trainer", "posts"] });
    }
  });

  const submitPost = (e) => {
    e.preventDefault();
    mutAddPost.mutate({ ...postForm, image: postForm.image || "https://images.unsplash.com/photo-1517438476312-10d79c5f2b03?auto=format&fit=crop&w=900&q=70" });
  };

  if (isLoading) return <Spinner className="mt-20" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trainer studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your classes, rosters, and community presence.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} variant="hero"><Plus className="h-4 w-4" /> New class</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></div>
          <p className="mt-4 text-2xl font-bold">{myClasses.length}</p><p className="text-xs text-muted-foreground">Classes created</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success"><Users className="h-5 w-5" /></div>
          <p className="mt-4 text-2xl font-bold">{totalStudents}</p><p className="text-xs text-muted-foreground">Students enrolled</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground"><MessageSquare className="h-5 w-5" /></div>
          <p className="mt-4 text-2xl font-bold">{myPosts.length}</p><p className="text-xs text-muted-foreground">Forum posts</p>
        </div>
      </div>

      {/* My classes */}
      <section className="rounded-2xl border border-border bg-card">
        <header className="border-b border-border p-5"><h2 className="text-base font-semibold">My classes</h2></header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Class</th><th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th><th className="px-5 py-3">Students</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myClasses.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No classes yet. Create your first.</td></tr>
              ) : myClasses.map((c) => (
                <tr key={c._id || c.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt="" className="h-10 w-12 rounded-md object-cover" />
                      <div>
                        <p className="font-medium">{c.className || c.title}</p>
                        <p className="text-xs text-muted-foreground">{fmtMoney(c.price)} · {c.duration}m</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.category}</td>
                  <td className="px-5 py-3"><Badge tone={c.status === "approved" ? "success" : c.status === "rejected" ? "danger" : "warning"}>{c.status || 'pending'}</Badge></td>
                  <td className="px-5 py-3">{studentsByClass(c._id || c.id).length}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => setShowStudents(c)} className="rounded-md p-2 hover:bg-muted" title="View students"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleEditClick(c)} className="rounded-md p-2 text-primary hover:bg-muted" title="Edit"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => { if(window.confirm("Are you sure you want to delete this class?")) mutDeleteClass.mutate(c._id || c.id); }} className="rounded-md p-2 text-destructive hover:bg-muted" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forum post composer + list */}
      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submitPost} className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Publish a forum post</h2>
          <div className="mt-4 grid gap-4">
            <div><Label>Title</Label><Input value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <ImageUpload
                  label="Cover Image (optional)"
                  value={postForm.image}
                  onChange={(url) => setPostForm({ ...postForm, image: url })}
                />
              </div>
            </div>
            <div><Label>Body</Label><Textarea value={postForm.description} onChange={(e) => setPostForm({ ...postForm, description: e.target.value })} required /></div>
            <Button type="submit" variant="primary">Publish post</Button>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">My forum posts</h2>
          <div className="mt-4 space-y-3">
            {myPosts.length === 0 ? <p className="text-sm text-muted-foreground">No posts yet.</p> :
              myPosts.map((p) => (
                <div key={p._id || p.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <img src={p.image || "https://images.unsplash.com/photo-1517438476312-10d79c5f2b03?auto=format&fit=crop&w=900&q=70"} alt="" className="h-12 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.likes?.length || 0} likes</p>
                  </div>
                  <button onClick={() => mutDeletePost.mutate(p._id || p.id)} className="rounded-md p-2 text-destructive hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
          </div>
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
            <Button type="submit" variant="primary">Submit for approval</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Class Modal */}
      <Modal open={Boolean(showEdit)} onClose={() => setShowEdit(null)} title="Update class" maxWidth="max-w-xl">
        <form onSubmit={onUpdate} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Title</Label><Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required /></div>
          <div><Label>Category</Label>
            <Select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div><Label>Difficulty</Label>
            <Select value={editForm.difficulty} onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}>
              {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d}>{d}</option>)}
            </Select>
          </div>
          <div><Label>Price ($)</Label><Input type="number" min="0" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required /></div>
          <div><Label>Duration (min)</Label><Input type="number" min="10" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} required /></div>
          <div className="sm:col-span-2"><Label>Schedule</Label><Input value={editForm.schedule} onChange={(e) => setEditForm({ ...editForm, schedule: e.target.value })} placeholder="Mon, Wed, Fri • 7:00 AM" required /></div>
          <div className="sm:col-span-2">
            <ImageUpload
              label="Class Image (optional)"
              value={editForm.image}
              onChange={(url) => setEditForm({ ...editForm, image: url })}
            />
          </div>
          <div className="sm:col-span-2"><Label>Description</Label><Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required /></div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowEdit(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Update class</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(showStudents)} onClose={() => setShowStudents(null)} title={`Students · ${showStudents?.className || showStudents?.title || ""}`}>
        {showStudents && (
          <ul className="space-y-3">
            {studentsByClass(showStudents._id || showStudents.id).length === 0 ? (
              <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
            ) : studentsByClass(showStudents._id || showStudents.id).map((s) => (
              <li key={s._id || s.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <img src={s.image || `https://i.pravatar.cc/150?u=${s.email}`} className="h-10 w-10 rounded-full object-cover" alt="" />
                <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
