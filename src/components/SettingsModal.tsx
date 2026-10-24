import React, { useState } from 'react';
import {
  X,
  User,
  Globe,
  Award,
  Target,
  Clock,
  LogOut,
  Trash2,
  AlertTriangle,
  Check,
  ShieldCheck,
  Mail,
  Calendar,
  Save,
} from 'lucide-react';
import { UserProfile, ExplanationLanguage, UserLevel, LearningGoal, DailyStudyTarget } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdatePreferences: (prefs: {
    preferredLanguage: ExplanationLanguage;
    level: UserLevel;
    learningGoal: LearningGoal;
    dailyStudyTarget: DailyStudyTarget;
  }) => Promise<void>;
  onResetProgress: () => Promise<void>;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdatePreferences,
  onResetProgress,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');
  const [language, setLanguage] = useState<ExplanationLanguage>(user.preferredLanguage || 'en');
  const [level, setLevel] = useState<UserLevel>(user.level || 'beginner');
  const [goal, setGoal] = useState<LearningGoal>(user.learningGoal || 'conversation');
  const [studyTarget, setStudyTarget] = useState<DailyStudyTarget>(user.dailyStudyTarget || 10);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdatePreferences({
        preferredLanguage: language,
        level,
        learningGoal: goal,
        dailyStudyTarget: studyTarget,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.warn('Failed to update preferences:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteReset = async () => {
    if (confirmInput.trim().toUpperCase() !== 'RESET') return;
    setIsResetting(true);
    try {
      await onResetProgress();
      setShowResetConfirm(false);
      setConfirmInput('');
      onClose();
    } catch (e) {
      console.warn('Reset error:', e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-title" className="font-bold text-lg text-slate-900">
                Learner Profile & Settings
              </h2>
              <p className="font-kannada text-xs text-indigo-700 font-medium">
                ಖಾತೆ ವಿವರಗಳು ಮತ್ತು ಆದ್ಯತೆಗಳು
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`cursor-pointer flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'preferences'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preferences
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`cursor-pointer flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'data'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data & Security
          </button>
        </div>

        {/* TAB 1: PROFILE INFO */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              {user.picture || user.photoURL ? (
                <img
                  src={user.picture || user.photoURL}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-indigo-200 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-indigo-700 text-white font-bold text-xl flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 truncate">{user.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Google Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.email}</span>
                </p>
                <p className="text-[11px] text-indigo-700 font-mono mt-1 truncate">
                  UID: {user.id}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-lg font-bold text-indigo-900">{user.points || 0}</div>
                <div className="text-[11px] text-slate-500 font-medium">Learning Points</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-lg font-bold text-emerald-800">
                  {user.badges?.filter((b) => b.isUnlocked).length || 0}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Badges Earned</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-lg font-bold text-orange-800">{user.streakDays || 1}d</div>
                <div className="text-[11px] text-slate-500 font-medium">Active Streak</div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="cursor-pointer w-full py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PREFERENCES */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Explanation Language */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explanation Language</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en' as const, label: 'English' },
                  { code: 'mr' as const, label: 'मराठी' },
                  { code: 'hi' as const, label: 'हिंदी' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    className={`cursor-pointer py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      language === l.code
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Proficiency Level */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Proficiency Level</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as UserLevel)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="beginner">Beginner (ಹೊಸಬರು)</option>
                <option value="intermediate">Intermediate (ಸ್ವಲ್ಪ ಗೊತ್ತು)</option>
                <option value="advanced">Advanced (ಮಾತನಾಡಬಲ್ಲೆ)</option>
              </select>
            </div>

            {/* Learning Goal */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-600" />
                <span>Primary Learning Goal</span>
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as LearningGoal)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="conversation">Daily Street Conversation & Neighbors</option>
                <option value="travel">Bengaluru Commute, Metro & Autos</option>
                <option value="work">Workplace & Tech Park Communication</option>
                <option value="college">College & Campus Life</option>
                <option value="fluency">Full Cultural & Literary Fluency</option>
              </select>
            </div>

            {/* Daily Target */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Daily Study Target</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([5, 10, 15, 20] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setStudyTarget(mins)}
                    className={`cursor-pointer py-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      studyTarget === mins
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mins}m/day
                  </button>
                ))}
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Preferences updated and saved to Cloud Firestore!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Preferences'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: DATA & RESET */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cloud Firestore Data Security</span>
              </div>
              <p className="leading-relaxed">
                Your learning progress, quiz records, and saved vocabulary are isolated under document path{' '}
                <code className="text-indigo-800 bg-indigo-50 px-1 py-0.5 rounded font-mono">
                  users/{user.id}
                </code>{' '}
                and secured by authenticated Firestore Security Rules.
              </p>
            </div>

            {/* Dangerous action: Reset Progress */}
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Reset Learning Progress</h4>
                  <p className="text-red-700 text-[11px] mt-0.5">
                    This will clear completed lessons, quiz scores, and saved words, resetting points back to 0. This action is irreversible.
                  </p>
                </div>
              </div>

              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                >
                  Reset My Progress...
                </button>
              ) : (
                <div className="space-y-2 pt-2 border-t border-red-200">
                  <p className="text-[11px] font-bold text-red-900">
                    Type "RESET" to confirm:
                  </p>
                  <input
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="RESET"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={confirmInput.trim().toUpperCase() !== 'RESET' || isResetting}
                      onClick={handleExecuteReset}
                      className="cursor-pointer px-4 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                    >
                      {isResetting ? 'Resetting...' : 'Permanently Reset'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetConfirm(false);
                        setConfirmInput('');
                      }}
                      className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SettingsModal;
