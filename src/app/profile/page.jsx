"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { authClient } from "../../lib/auth-client.js";
import toast from "react-hot-toast";
import { Save, User, Mail, Lock, Image as ImageIcon } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { Input, Label } from "../../components/ui/Input.jsx";
import ImageUpload from "../../components/ImageUpload.jsx";

export default function ProfileSettings() {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await authClient.updateUser({
        name,
        image
      });
      if (res.error) throw new Error(res.error.message);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    try {
      const res = await authClient.changeEmail({
        newEmail: email,
      });
      if (res.error) throw new Error(res.error.message);
      toast.success("Email updated successfully! Please check your new email to verify.");
    } catch (err) {
      toast.error(err.message || "Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error("Please fill in both password fields");
    setIsUpdatingPassword(true);
    try {
      const res = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true
      });
      if (res.error) throw new Error(res.error.message);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Profile Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account details, email, and security settings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Info Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Public Profile</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <ImageUpload
                  label="Avatar Image"
                  value={image}
                  onChange={(url) => setImage(url)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Saving..." : "Save Profile"} <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          {/* Email Section */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Email Address</h2>
            </div>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="pt-2">
                <Button type="submit" variant="outline" disabled={isUpdatingEmail}>
                  {isUpdatingEmail ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Security</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="pt-2">
                <Button type="submit" variant="outline" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
