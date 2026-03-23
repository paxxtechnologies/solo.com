"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    priceDrops: true,
    newsletter: false,
    sms: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileData);
    setIsEditingProfile(false);
    showToast("Profile updated successfully", "success");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    // Simulate password update
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    showToast("Password updated successfully", "success");
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    showToast("Preferences updated", "success");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Account Settings
        </h1>
        <p className="text-muted">Manage your profile and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Profile Information
          </h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-sm text-primary hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleProfileSubmit} className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={!isEditingProfile}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-foreground disabled:bg-surface-alt disabled:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  disabled={!isEditingProfile}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-foreground disabled:bg-surface-alt disabled:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  disabled={!isEditingProfile}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-foreground disabled:bg-surface-alt disabled:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {isEditingProfile && (
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfileData({
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                  });
                }}
                className="px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-surface-alt transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-5">
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>
        </div>

        <div className="p-5 space-y-4">
          {[
            {
              key: "orderUpdates" as const,
              label: "Order Updates",
              description: "Get notified about order status changes",
            },
            {
              key: "promotions" as const,
              label: "Promotions & Offers",
              description: "Receive exclusive deals and discounts",
            },
            {
              key: "priceDrops" as const,
              label: "Price Drops",
              description: "Get alerts when wishlist items go on sale",
            },
            {
              key: "newsletter" as const,
              label: "Newsletter",
              description: "Weekly tech news and product updates",
            },
            {
              key: "sms" as const,
              label: "SMS Notifications",
              description: "Receive important updates via SMS",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-surface-alt transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted">{item.description}</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationChange(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface rounded-xl border border-error/30 overflow-hidden">
        <div className="p-5 border-b border-error/30 bg-error/5">
          <h2 className="text-lg font-heading font-semibold text-error">
            Danger Zone
          </h2>
        </div>

        <div className="p-5">
          <p className="text-muted mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="px-6 py-2 border border-error text-error font-medium rounded-lg hover:bg-error hover:text-white transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
