import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Headphones,
  Award,
  Flame,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  signInWithFirebaseGoogle,
  signInWithFirebaseGoogleRedirect,
  syncFirebaseUserProfile,
  signUpWithFirebaseEmail,
  signInWithFirebaseEmail,
  sendFirebasePasswordReset,
  signInAsFirebaseGuest,
  getFriendlyAuthError,
} from '../lib/firebase';
import { ExplanationLanguage, UserLevel } from '../types';

export const LoginPage: React.FC = () => {
  const { user, loading: authLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email login/register/reset state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<ExplanationLanguage>('en');
  const [level, setLevel] = useState<UserLevel>('beginner');
  const [emailLoading, setEmailLoading] = useState(false);

  // Requirement 3: If an already authenticated user visits /login, redirect to /dashboard
  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle Primary Google Sign-In with Popup and Firestore Synchronization
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    setShowRedirectOption(false);
    setSuccessMessage(null);

    try {
      const fbUser = await signInWithFirebaseGoogle();
      if (!fbUser) {
        // Popup was closed before completion, or redirect was initiated
        setError('Google Sign-In popup was closed before completing authentication. Please try again or use redirect sign-in.');
        setShowRedirectOption(true);
        return;
      }

      const { profile } = await syncFirebaseUserProfile(fbUser);
      setUser(profile);
      setSuccessMessage(`Welcome back, ${profile.name}! Redirecting to your dashboard...`);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 700);
    } catch (err: any) {
      console.warn('Login page Google Sign-In notice:', err?.message || err);
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

  // Fallback: Google Sign-In with Redirect
  const handleGoogleRedirectSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithFirebaseGoogleRedirect();
      // Browser will navigate away to Google accounts
    } catch (err: any) {
      console.warn('Login page Google Redirect notice:', err?.message || err);
      setError(err.message || 'Failed to start Google redirect sign-in.');
      setGoogleLoading(false);
    }
  };

  // Email form submission — real Firebase email/password auth
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (emailMode === 'forgot') {
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter your registered email address');
        const msg = await sendFirebasePasswordReset(email);
        setSuccessMessage(msg);
        return;
      }

      if (emailMode === 'register') {
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
        setUser(profile);
        setSuccessMessage('Account created! Entering your learning journey...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 500);
      } else {
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (!password) throw new Error('Please enter your password');

        const { profile } = await signInWithFirebaseEmail(email, password);
        setUser(profile);
        setSuccessMessage('Welcome back! Loading your dashboard...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 500);
      }
    } catch (err: any) {
      setError(err.message || getFriendlyAuthError(err));
    } finally {
      setEmailLoading(false);
    }
  };

  // Anonymous Firebase guest session (real persistence, no shared fake token)
  const handleGuestSignIn = async () => {
    setGuestLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { profile } = await signInAsFirebaseGuest();
      setUser(profile);
      setSuccessMessage('Guest workspace ready. Sign in later to keep your progress.');
      setTimeout(() => navigate('/dashboard', { replace: true }), 500);
    } catch (err: any) {
      setError(err.message || getFriendlyAuthError(err));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4F0FF] to-[#FAF5FF] flex flex-col justify-between selection:bg-indigo-500/20 selection:text-indigo-900 relative overflow-hidden">
      {/* Decorative ambient background orbs with indigo/purple accents */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top minimal brand bar (no dashboard or authenticated controls) */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-800 text-white flex items-center justify-center font-kannada font-bold text-xl shadow-md shadow-indigo-700/20">
            ಕ
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-slate-900 tracking-tight leading-none">
              Kannada for Everyone
            </h1>
            <p className="font-kannada text-xs text-indigo-700 font-medium leading-none mt-1">
              ಕನ್ನಡ ಎಲ್ಲರಿಗೂ • ಡಿಜಿಟಲ್ ನಾವೀನ್ಯತೆ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Digital Innovation Challenge 2026</span>
          </span>
        </div>
      </header>

      {/* Main Login Hero & Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column: Value Proposition & Feature Highlights */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 backdrop-blur-md text-indigo-900 border border-indigo-200/70 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Interactive Learning Platform</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Master Kannada with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900">
                  Confidence & Fluency
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Bridge language gaps effortlessly in Bengaluru and beyond. Practice real-life Metro, auto, kirana, and office dialogues with audio pronunciation and verified achievement badges.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-indigo-100 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>10 Situations</span>
                </div>
                <p className="text-[11px] text-slate-500">Metro, Auto, Market & Dining</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-indigo-100 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Headphones className="w-4 h-4 text-purple-600" />
                  <span>Spoken Audio</span>
                </div>
                <p className="text-[11px] text-slate-500">Native phonetics & roleplay</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-indigo-100 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Firestore Badges</span>
                </div>
                <p className="text-[11px] text-slate-500">Bronze to Platinum tiers</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-indigo-100 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-900">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Daily Streaks</span>
                </div>
                <p className="text-[11px] text-slate-500">Track cumulative progress</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Elevated Login Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-900/10 border border-indigo-100/80 space-y-6">
              {/* Card Header */}
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome to Kannada for Everyone
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Sign in with Google or email, or try a guest workspace. Your progress is saved to Cloud Firestore.
                </p>
              </div>

              {/* Error Alert Banner */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1 leading-relaxed">
                    <p className="font-semibold text-red-900">Sign-In Notice</p>
                    <p className="mt-0.5">{error}</p>
                    {showRedirectOption && (
                      <button
                        type="button"
                        onClick={handleGoogleRedirectSignIn}
                        disabled={googleLoading}
                        className="cursor-pointer mt-2 inline-flex items-center gap-1.5 font-bold text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span>Click here for Redirect Sign-In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success Message Banner */}
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="flex-1 leading-relaxed font-semibold">{successMessage}</div>
                </div>
              )}

              {/* Primary: One Standalone Google Sign-In Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || emailLoading || guestLoading}
                  className="cursor-pointer w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/40 active:bg-indigo-100/50 text-sm font-bold text-slate-800 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md group"
                >
                  {googleLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-indigo-900 font-semibold">
                        Connecting to Google via Firebase...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                      <span>Sign In with Google</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors ml-auto" />
                    </>
                  )}
                </button>

                {/* Redirect fallback subtle helper */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleGoogleRedirectSignIn}
                    disabled={googleLoading || emailLoading || guestLoading}
                    className="cursor-pointer text-[11px] text-slate-500 hover:text-indigo-700 underline transition-colors"
                  >
                    Popups blocked in your browser? Sign in with full-page redirect &rarr;
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={googleLoading || emailLoading || guestLoading}
                  className="cursor-pointer w-full py-2.5 px-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {guestLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                      <span>Starting guest workspace...</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Continue as Guest</span>
                      <span className="text-[10px] font-medium text-slate-400">(progress saved anonymously)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Visual Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                  Or continue with email
                </span>
              </div>

              {/* Collapsible / Optional Email Sign-In for Existing Accounts */}
              {!showEmailForm ? (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(true)}
                    className="cursor-pointer text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                  >
                    Have an email/password account? Sign in here &darr;
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  {emailMode === 'forgot' ? (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <p className="font-bold">Reset your password</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed">
                        Firebase will email you a secure link. Open it, choose a new password, then come back and sign in.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEmailMode('login')}
                        className={`cursor-pointer flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          emailMode === 'login'
                            ? 'bg-indigo-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Email Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailMode('register')}
                        className={`cursor-pointer flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          emailMode === 'register'
                            ? 'bg-indigo-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Create Account
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    {emailMode === 'register' && (
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    {emailMode !== 'forgot' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-600">
                            Password
                          </label>
                          {emailMode === 'login' && (
                            <button
                              type="button"
                              onClick={() => {
                                setEmailMode('forgot');
                                setError(null);
                                setSuccessMessage(null);
                              }}
                              className="cursor-pointer text-[11px] font-semibold text-indigo-700 hover:text-indigo-900"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {emailMode === 'register' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-600 block mb-1">
                            Explanation Language
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as ExplanationLanguage)}
                            className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                          >
                            <option value="en">English (EN)</option>
                            <option value="mr">मराठी (MR)</option>
                            <option value="hi">हिंदी (HI)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-600 block mb-1">
                            Proficiency
                          </label>
                          <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as UserLevel)}
                            className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={emailLoading || googleLoading || guestLoading}
                      className="cursor-pointer w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-60"
                    >
                      {emailLoading
                        ? 'Processing...'
                        : emailMode === 'register'
                        ? 'Create Account'
                        : emailMode === 'forgot'
                        ? 'Send Reset Email'
                        : 'Sign In'}
                    </button>

                    {emailMode === 'forgot' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmailMode('login');
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="cursor-pointer w-full text-center text-[11px] font-semibold text-slate-500 hover:text-indigo-700"
                      >
                        &larr; Back to sign in
                      </button>
                    )}
                  </form>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="cursor-pointer text-[11px] text-slate-500 hover:text-indigo-700"
                    >
                      &uarr; Close email options
                    </button>
                  </div>
                </div>
              )}

              {/* Security & Firestore Storage Guarantee */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Firebase Authentication & Cloud Firestore</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500">
        <p>Kannada for Everyone • Digital Innovation Challenge 2026 • Dedicated Sign-In Portal</p>
      </footer>
    </div>
  );
};

export default LoginPage;
