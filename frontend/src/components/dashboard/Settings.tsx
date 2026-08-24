import { useEffect, useState, useCallback } from 'react';
import { api, type User } from '../../api/nexusApi';

interface SettingsProps {
  onSignOut: () => void;
}

export default function Settings({ onSignOut }: SettingsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSignOut = () => {
    api.logout();
    onSignOut();
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await api.deleteCurrentUser();
      setIsDeleteModalOpen(false);
      api.logout();
      onSignOut();
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setDeleteError(err.message || 'Failed to delete account.');
      setIsDeleting(false);
    }
  };

  // Helper to compute initials from email or username
  const getInitials = (u: User | null): string => {
    if (!u) return 'U';
    if (u.github_username) {
      return u.github_username.substring(0, 2).toUpperCase();
    }
    if (u.email) {
      return u.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Helper to compute display name
  const getDisplayName = (u: User | null): string => {
    if (!u) return '—';
    if (u.github_username) {
      return u.github_username;
    }
    return u.email.split('@')[0];
  };

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full max-w-none space-y-6">
      {/* Header Area */}
      <div className="border-b border-border/60 pb-4 sm:pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage your Nexus account.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-2xs space-y-4 animate-pulse max-w-3xl">
          <div className="h-5 bg-slate-100 rounded w-1/4"></div>
          <div className="h-24 bg-slate-50 rounded-xl"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center space-y-3 shadow-2xs max-w-3xl">
          <h3 className="text-base font-bold text-red-800">Unable to load profile</h3>
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <span>Try Again</span>
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-3xl space-y-6">
          {/* 1. PROFILE SECTION */}
          <div className="bg-white border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Profile
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-1">
              {/* Avatar */}
              <div className="shrink-0">
                {user?.github_avatar_url ? (
                  <img
                    src={user.github_avatar_url}
                    alt={user.github_username || 'User'}
                    className="w-16 h-16 rounded-2xl border border-border object-cover shadow-2xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-nexus-600 text-white flex items-center justify-center font-bold text-xl shadow-2xs">
                    {getInitials(user)}
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">
                    Name
                  </span>
                  <span className="text-sm font-bold text-text-primary mt-0.5 block truncate">
                    {getDisplayName(user)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">
                    Email
                  </span>
                  <span className="text-sm font-semibold text-text-primary mt-0.5 block truncate">
                    {user?.email || '—'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">
                    GitHub
                  </span>
                  <span className="text-sm font-semibold text-text-primary mt-0.5 block truncate">
                    {user?.github_username || 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ACCOUNT SECTION */}
          <div className="bg-white border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Account
            </h3>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-semibold text-text-primary">Sign out of Nexus</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Sign out of your active Nexus session on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-text-primary border border-border rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* 3. DANGER ZONE */}
          <div className="bg-white border border-red-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
              Danger Zone
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary">
                  Delete Nexus Account
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-lg">
                  Permanently delete your Nexus account and all repositories, analyses, claims, evidence, and generated reports stored by Nexus.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">Delete Nexus account?</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Are you sure you want to permanently delete your Nexus account and all data stored by Nexus? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-text-secondary border border-border rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
