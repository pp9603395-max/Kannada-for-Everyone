import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  Check,
  ArrowRight,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Award,
  Flame,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { ExplanationLanguage, UserLevel, UserProfile } from '../types';
import {
  signInWithFirebaseGoogle,
  signInWithFirebaseGoogleRedirect,
  syncFirebaseUserProfile,
  signOutFirebase,
  signUpWithFirebaseEmail,
  signInWithFirebaseEmail,
  sendFirebasePasswordReset,
  signInAsFirebaseGuest,
  getFriendlyAuthError,
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onLogout,
}) => {
  const isRealUser = currentUser && !currentUser.isGuest;

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'profile'>(
    isRealUser ? 'profile' : 'login'
  );

  // Email/password form states
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<ExplanationLanguage>(
    currentUser?.preferredLanguage || 'en'
  );
  const [level, setLevel] = useState<UserLevel>(currentUser?.level || 'beginner');

  // Loading & status states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Sync state whenever modal opens or currentUser changes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      setShowRedirectOption(false);
      setConfirmLogout(false);
      setPassword('');

      if (currentUser && !currentUser.isGuest) {
        setMode('profile');
        setName(currentUser.name);
        setEmail(currentUser.email);
        setLanguage(currentUser.preferredLanguage);
        setLevel(currentUser.level);
      } else {
        setMode('login');
      }
    }
  }, [isOpen, currentUser]);

  // Primary: Google Sign-In with Popup and Firestore Synchronization
  const handleFirebaseGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    setShowRedirectOption(false);
    setSuccessMessage(null);

    try {
      const fbUser = await signInWithFirebaseGoogle();
      if (!fbUser) {
        setError('Google Sign-In popup was closed before completing authentication. Please try again or use redirect sign-in.');
        setShowRedirectOption(true);
        return;
      }

      const { profile } = await syncFirebaseUserProfile(fbUser);
      onUserChange(profile);
      setSuccessMessage(`Welcome back, ${profile.name}! Signed in with Google.`);
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      console.warn('Firebase Google Sign-In notice:', err?.message || err);
      const errMsg = err.message || 'Google sign-in could not be completed.';
      setError(errMsg);
      if (
        errMsg.toLowerCase().includes('popup') ||
        errMsg.toLowerCase().includes('blocked')
      ) {
        setShowRedirectOption(true);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Fallback: Google Sign-In with Redirect (for popup-blocked or strict browsers)
  const handleFirebaseGoogleRedirectSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithFirebaseGoogleRedirect();
      // Browser will navigate to Google's OAuth consent screen
    } catch (err: any) {
      console.warn('Firebase Google Redirect notice:', err?.message || err);
      setError(err.message || 'Failed to start Google redirect sign-in.');
      setGoogleLoading(false);
    }
  };

  // Email / Password Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

        const { profile } = await signUpWithFirebaseEmail({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          preferredLanguage: language,
          level,
        });
        onUserChange(profile);
        setSuccessMessage('Account created successfully! Welcome to Kannada for Everyone.');
        setTimeout(() => onClose(), 800);
      } else if (mode === 'login') {
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (!password) throw new Error('Please enter your password');

        const { profile } = await signInWithFirebaseEmail(email, password);
        onUserChange(profile);
        setSuccessMessage('Welcome back! Loading your learning journey...');
        setTimeout(() => onClose(), 800);
      } else if (mode === 'forgot') {
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter your registered email address');
        const msg = await sendFirebasePasswordReset(email);
        setSuccessMessage(msg);
      }
    } catch (err: any) {
      setError(err.message || getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Continue as Guest Explorer (anonymous Firebase account)
  const handleContinueAsGuest = async () => {
    setLoading(true);
    setError(null);
    try {
      const { profile } = await signInAsFirebaseGuest();
      onUserChange(profile);
      setSuccessMessage('Continuing as Guest Explorer. You can create an account later.');
      setTimeout(() => onClose(), 600);
    } catch (err: any) {
      setError(err.message || getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutFirebase();
      if (onLogout) {
        onLogout();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
      setConfirmLogout(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDD5C7] overflow-hidden p-6 sm:p-7 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 p-2 rounded-full text-[#707F74] hover:text-[#183B28] hover:bg-[#FAF8F4] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#183B28]/10 text-[#183B28] mb-3">
            {mode === 'profile' ? (
              <User className="w-6 h-6" />
            ) : mode === 'forgot' ? (
              <KeyRound className="w-6 h-6 text-[#E07A5F]" />
            ) : (
              <Sparkles className="w-6 h-6 text-[#E07A5F]" />
            )}
          </div>

          <h2 className="text-xl font-bold text-[#183B28]">
            {mode === 'profile'
              ? 'Learner Profile & Account'
              : mode === 'forgot'
              ? 'Reset Account Password'
              : mode === 'register'
              ? 'Join Kannada for Everyone'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#526056] mt-1">
            {mode === 'profile'
              ? 'Manage your learning identity, points, and saved progress'
              : mode === 'forgot'
              ? 'Enter your registered email to reset your login password'
              : mode === 'register'
              ? 'Create a permanent account to save your points and badges'
              : 'Sign in to access your saved vocabulary, badges, and progress'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1 leading-relaxed">
              <p className="font-semibold text-red-900">Sign-in Notice</p>
              <p className="mt-0.5">{error}</p>
              {showRedirectOption && (
                <button
                  type="button"
                  onClick={handleFirebaseGoogleRedirectSignIn}
                  disabled={googleLoading}
                  className="cursor-pointer mt-2 inline-flex items-center gap-1.5 font-bold text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Click here to use Redirect Sign-In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 leading-relaxed">{successMessage}</div>
          </div>
        )}

        {/* 1. PROFILE VIEW FOR SIGNED-IN USERS */}
        {mode === 'profile' && currentUser && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#DDD5C7] space-y-3">
              <div className="flex items-center gap-3">
                {currentUser.picture || currentUser.photoURL ? (
                  <img
                    src={currentUser.picture || currentUser.photoURL}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#183B28]/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#183B28] text-white flex items-center justify-center font-bold text-lg">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm text-[#183B28]">{currentUser.name}</h3>
                  <p className="text-xs text-[#526056]">{currentUser.email || 'Anonymous guest workspace'}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {currentUser.authProvider === 'google'
                      ? 'Verified Google Account (Firebase)'
                      : currentUser.authProvider === 'guest'
                      ? 'Guest Session (anonymous Firebase)'
                      : 'Verified Email Account (Firebase)'}
                  </span>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6E0D5]">
                <div className="bg-white p-2.5 rounded-xl border border-[#E6E0D5]">
                  <div className="flex items-center gap-1.5 text-xs text-[#526056] mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Learning Points</span>
                  </div>
                  <div className="text-base font-extrabold text-[#183B28]">
                    {currentUser.points || 0} pts
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#E6E0D5]">
                  <div className="flex items-center gap-1.5 text-xs text-[#526056] mb-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>Active Streak</span>
                  </div>
                  <div className="text-base font-extrabold text-[#183B28]">
                    {currentUser.streakDays || 1} Days
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Confirmation or Trigger */}
            {!confirmLogout ? (
              <button
                type="button"
                onClick={() => setConfirmLogout(true)}
                className="cursor-pointer w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-3">
                <p className="text-xs text-red-800 font-medium text-center">
                  Are you sure you want to sign out? Your points and badges are securely stored in Cloud Firestore.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmLogout(false)}
                    className="cursor-pointer flex-1 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs font-semibold text-[#526056] hover:bg-[#FAF8F4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={loading}
                    className="cursor-pointer flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{loading ? 'Signing out...' : 'Yes, Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. SIGN IN / REGISTER / FORGOT VIEWS */}
        {mode !== 'profile' && (
          <div>
            {/* Mode Switch Tabs (Sign In vs Sign Up) */}
            {mode !== 'forgot' && (
              <div className="flex items-center bg-[#FAF8F4] p-1 rounded-2xl border border-[#E6E0D5] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`cursor-pointer flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-[#183B28] text-white shadow-xs'
                      : 'text-[#526056] hover:text-[#183B28]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`cursor-pointer flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-[#183B28] text-white shadow-xs'
                      : 'text-[#526056] hover:text-[#183B28]'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Single Prominent Google Sign-In Button */}
            {mode !== 'forgot' && (
              <div className="mb-5 space-y-2">
                <button
                  type="button"
                  onClick={handleFirebaseGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="cursor-pointer w-full py-3 px-4 rounded-2xl bg-white border-2 border-[#183B28] hover:bg-[#FAF8F4] active:bg-[#F0ECE1] text-xs sm:text-sm font-bold text-[#183B28] flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow-md"
                >
                  {googleLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#183B28] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>
                        {mode === 'register' ? 'Sign Up with Google' : 'Sign In with Google'}
                      </span>
                    </>
                  )}
                </button>

                {/* Redirect fallback link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleFirebaseGoogleRedirectSignIn}
                    disabled={googleLoading || loading}
                    className="cursor-pointer text-[11px] text-[#707F74] hover:text-[#183B28] underline transition-colors"
                  >
                    Popups blocked? Click for Google Redirect Sign-In
                  </button>
                </div>

                {/* Visual Divider */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-[#E6E0D5] w-full" />
                  <span className="bg-white px-3 text-[11px] font-semibold text-[#88988D] uppercase tracking-wider absolute">
                    Or with email
                  </span>
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-[#526056] block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#88988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kulkarni"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-sm text-[#2A2E2B] focus:outline-none focus:ring-2 focus:ring-[#183B28]/20 focus:border-[#183B28]"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-[#526056] block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#88988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-sm text-[#2A2E2B] focus:outline-none focus:ring-2 focus:ring-[#183B28]/20 focus:border-[#183B28]"
                  />
                </div>
              </div>

              {/* Password for Login & Register */}
              {(mode === 'login' || mode === 'register') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#526056]">
                      Password {mode === 'register' && <span className="text-red-500">*</span>}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError(null);
                        }}
                        className="cursor-pointer text-[11px] font-semibold text-[#E07A5F] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#88988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] text-sm text-[#2A2E2B] focus:outline-none focus:ring-2 focus:ring-[#183B28]/20 focus:border-[#183B28]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#88988D] hover:text-[#183B28]"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Information */}
              {mode === 'forgot' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold">We will email you a secure reset link</p>
                  <p className="mt-1 text-[11px]">
                    Open the link in your inbox, choose a new password, then return here to sign in. If the email does not arrive, check spam or try again in a minute.
                  </p>
                </div>
              )}

              {/* Language and Level selection on registration */}
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-[#526056] block mb-1">
                      Preferred Explanation Language
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { code: 'en', label: 'English', script: 'Eng' },
                        { code: 'mr', label: 'Marathi', script: 'मराठी' },
                        { code: 'hi', label: 'Hindi', script: 'हिंदी' },
                      ].map((lang) => (
                        <button
                          type="button"
                          key={lang.code}
                          onClick={() => setLanguage(lang.code as ExplanationLanguage)}
                          className={`cursor-pointer py-2 rounded-xl text-xs font-semibold border transition-all ${
                            language === lang.code
                              ? 'bg-[#183B28] text-white border-[#183B28]'
                              : 'bg-[#FAF8F4] text-[#526056] border-[#DDD5C7] hover:bg-[#F2ECE1]'
                          }`}
                        >
                          {lang.script}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#526056] block mb-1">
                      Current Kannada Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setLevel(lvl)}
                          className={`cursor-pointer py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                            level === lvl
                              ? 'bg-[#183B28] text-white border-[#183B28]'
                              : 'bg-[#FAF8F4] text-[#526056] border-[#DDD5C7] hover:bg-[#F2ECE1]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Email Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="cursor-pointer w-full py-3 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : mode === 'register' ? (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                ) : mode === 'forgot' ? (
                  <span>Send Reset Link</span>
                ) : (
                  <>
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </form>

            {/* Back to sign in from forgot password */}
            {mode === 'forgot' && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="cursor-pointer text-xs text-[#526056] hover:text-[#183B28] font-semibold"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            )}

            {/* Guest Option */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                disabled={loading || googleLoading}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-[#E07A5F] hover:underline"
              >
                <span>Or continue learning as Guest Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
