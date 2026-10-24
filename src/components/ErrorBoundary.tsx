import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E6E0D5] shadow-xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-[#183B28]">Something went wrong</h1>
              <p className="text-sm text-[#526056] mt-2">
                The learning screen hit an unexpected error. Your Firestore progress is safe.
              </p>
              {this.state.message && (
                <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-xl p-2 mt-3 font-mono break-words">
                  {this.state.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#183B28] hover:bg-[#122D1F] text-white font-bold text-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE1] text-[#183B28] font-bold text-xs border border-[#E6E0D5] transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
