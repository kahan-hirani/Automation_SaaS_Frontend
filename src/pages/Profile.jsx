import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Camera,
  Bell,
  Trash2,
  Save,
  Loader,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastStack from '../components/ToastStack';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.errMessage ||
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  fallback;

const Profile = () => {
  const { user, updateLocalUser, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emailNotifications: true,
    avatarUrl: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      emailNotifications: user.emailNotifications ?? true,
      avatarUrl: user.avatarUrl || '',
    });
  }, [user]);

  const notify = (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, type, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const dismissToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const handleFormChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('error', 'Please select a valid image file.');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      notify('error', 'Only PNG, JPG, JPEG, or WEBP images are allowed.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      notify('error', 'Image should not be larger than 3MB.');
      return;
    }

    try {
      const dataUrl = await toDataUrl(file);
      handleFormChange('avatarUrl', dataUrl);
      notify('success', 'Profile image selected. Save profile to persist.');
    } catch (error) {
      notify('error', 'Unable to process selected image.');
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        emailNotifications: form.emailNotifications,
        avatarUrl: form.avatarUrl,
      };

      await authAPI.updateProfile(payload);
      const { data: profileData } = await authAPI.getProfile();
      updateLocalUser(profileData.user);
      await refreshProfile();
      notify('success', 'Profile preferences saved to database successfully.');
    } catch (error) {
      notify('error', getApiErrorMessage(error, 'Failed to update profile.'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== 'DELETE') {
      notify('error', 'Type DELETE to confirm account deletion.');
      return;
    }

    setDeletingAccount(true);
    try {
      await authAPI.deleteAccount();
      logout();
      navigate('/register');
    } catch (error) {
      notify('error', getApiErrorMessage(error, 'Failed to delete account.'));
      setDeletingAccount(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="noise-overlay" />
      <Navbar />

      <main className="page-frame space-y-12 lg:space-y-14">
        {/* <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black px-7 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-8 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-kicker">Profile Workspace</p>
              <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-[0.04em] text-white sm:text-6xl">
                Account and Automation Controls
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
                Manage your profile, notification settings, automation access, and account safety from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{user?.plan || 'free'} plan</Badge>
            </div>
          </div>
        </motion.section> */}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Profile
              </CardTitle>
              <CardDescription>Update your name, notification preference, and profile image.</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <form onSubmit={handleSaveProfile} className="space-y-7">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
                      alt="Profile"
                      className="h-24 w-24 rounded-2xl border border-white/15 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                      <User className="h-7 w-7 text-zinc-400" />
                    </div>
                  )}
                  <div className="space-y-2.5">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/35">
                      <Camera className="h-4 w-4" />
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                    <p className="text-xs text-zinc-500">PNG/JPG/JPEG/WEBP up to 3MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="section-kicker block">First Name</label>
                    <Input
                      value={form.firstName}
                      onChange={(event) => handleFormChange('firstName', event.target.value)}
                      placeholder="First name"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="section-kicker block">Last Name</label>
                    <Input
                      value={form.lastName}
                      onChange={(event) => handleFormChange('lastName', event.target.value)}
                      placeholder="Last name"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="section-kicker block">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    className="h-11"
                    readOnly
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="section-kicker block">Email Notifications</label>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/15 bg-black/55 px-4 text-sm text-zinc-100"
                    onClick={() => handleFormChange('emailNotifications', !form.emailNotifications)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      {form.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">Toggle</span>
                  </button>
                </div>

                <Button type="submit" disabled={savingProfile} className="min-w-[200px]">
                  {savingProfile ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-white/15 bg-white/[0.03]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trash2 className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Delete account and all data including automations and execution logs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <Input
                  value={confirmDeleteText}
                  onChange={(event) => setConfirmDeleteText(event.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="h-11"
                />
                <Button
                  variant="destructive"
                  disabled={deletingAccount || confirmDeleteText !== 'DELETE'}
                  onClick={handleDeleteAccount}
                  className="min-w-[200px]"
                >
                  {deletingAccount ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </div>
  );
};

export default Profile;
