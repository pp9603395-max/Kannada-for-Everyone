import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <main className="min-h-screen bg-[#FBF8F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E6E0D5] shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative z-10 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#183B28] text-amber-200 flex items-center justify-center font-kannada font-bold text-3xl shadow-lg shadow-[#183B28]/20">
            ಕ
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#E07A5F]">
              ಪುಟ ಸಿಗಲಿಲ್ಲ • Page not found
            </p>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#183B28] mt-2">
              404 — This path is still locked
            </h1>
            <p className="text-sm text-[#526056] mt-3 leading-relaxed">
              The page you followed does not exist, or it moved while you were learning.
              Your streak and Firestore progress are safe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Link
              to={loading ? '/' : user ? '/dashboard' : '/login'}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white font-bold text-xs transition-colors w-full sm:w-auto justify-center"
            >
              <Home className="w-4 h-4" />
              {user ? 'Back to Dashboard' : 'Go to Sign In'}
            </Link>
            <Link
              to="/dashboard?tab=path"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE1] text-[#183B28] font-bold text-xs border border-[#E6E0D5] transition-colors w-full sm:w-auto justify-center"
            >
              <Compass className="w-4 h-4" />
              Learning Path
            </Link>
          </div>

          <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-center gap-2 text-[11px] text-[#707F74]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Kannada for Everyone • ಕನ್ನಡ ಎಲ್ಲರಿಗೂ</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
