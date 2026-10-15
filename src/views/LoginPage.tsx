import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { authApi } from '../services/api.ts';
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;

          renderButton: (
            element: HTMLElement,
            options: {
              theme: 'outline';
              size: 'large';
              text: 'continue_with';
              shape: 'rectangular';
              width: number;
            }
          ) => void;
        };
      };
    };
  }
}

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const googleCredentialHandler = useRef<
    (credential: string) => Promise<void>
  >(async () => undefined);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [googleConfigured, setGoogleConfigured] = useState<
    boolean | null
  >(null);

  // Google login handler
  const handleGoogleCredential = async (credential: string) => {
    if (!credential) {
      setError('Google did not return a valid credential.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await loginWithGoogle(credential);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Google sign-in failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  googleCredentialHandler.current = handleGoogleCredential;

  // Initialize Google Identity Services
  useEffect(() => {
    let cancelled = false;
    let script: HTMLScriptElement | null = null;

    const initializeGoogle = async () => {
      try {
        const { clientId } = await authApi.getGoogleConfig();

        if (cancelled) return;

        if (!clientId) {
          throw new Error(
            'Google Client ID is missing from server configuration.'
          );
        }

        // Load Google Identity Services if not already loaded.
        if (!window.google?.accounts?.id) {
          script = document.createElement('script');

          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;

          await new Promise<void>((resolve, reject) => {
            if (!script) {
              reject(new Error('Could not create Google script.'));
              return;
            }

            script.onload = () => resolve();

            script.onerror = () =>
              reject(
                new Error('Google Identity Services script failed to load.')
              );

            document.head.appendChild(script);
          });
        }

        if (cancelled) return;

        if (!window.google?.accounts?.id) {
          throw new Error(
            'Google Identity Services is unavailable.'
          );
        }

        const google = window.google;

        // Initialize Google sign-in.
        google.accounts.id.initialize({
          client_id: clientId,

          callback: ({ credential }) => {
            void googleCredentialHandler.current(credential);
          },
        });

        // The container is always mounted in the JSX below.
        const container = googleButtonRef.current;

        if (!container) {
          throw new Error(
            'Google button container is missing from the page.'
          );
        }

        // Clear any previous button before rendering.
        container.innerHTML = '';

        const buttonWidth = Math.max(
          200,
          Math.min(container.clientWidth || 320, 360)
        );

        // Render the actual Google button.
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: buttonWidth,
        });

        if (!cancelled) {
          setGoogleConfigured(true);
        }
      } catch (err) {
        console.error(
          'Google Sign-In initialization failed:',
          err
        );

        if (!cancelled) {
          setGoogleConfigured(false);
          setError(
            'Google Sign-In could not initialize. Please check your connection and OAuth configuration.'
          );
        }
      }
    };

    void initializeGoogle();

    return () => {
      cancelled = true;

      // Do not remove the shared Google script from the document.
      // Other components may also use Google Identity Services.
    };
  }, []);

  // Email/password login
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900">
      <div className="w-full max-w-md space-y-8 bg-slate-800/90 p-8 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-md">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-3 shadow-lg">
            <Shield className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sign In to TouristSafety
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Access personalized risk prediction and your saved travel
            histories.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* Email and password login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>

              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>

              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="space-y-3">
          <div className="relative flex items-center">
            <div className="h-px flex-1 bg-slate-700" />

            <span className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Or continue with
            </span>

            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* 
            IMPORTANT:
            The Google button container always exists in the DOM.
            Only its visibility changes; the ref is never conditionally
            mounted or unmounted.
          */}
          <div className="relative w-full min-h-11">
            <div
              ref={googleButtonRef}
              aria-label="Continue with Google"
              className={
                googleConfigured === true
                  ? 'flex min-h-11 w-full items-center justify-center overflow-hidden'
                  : 'pointer-events-none absolute inset-0 flex min-h-11 w-full items-center justify-center overflow-hidden opacity-0'
              }
            />

            {googleConfigured !== true && (
              <button
                type="button"
                disabled
                className="relative z-10 flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 opacity-80 cursor-not-allowed"
              >
                <span className="text-lg font-extrabold text-[#4285F4]">
                  G
                </span>

                <span>
                  {googleConfigured === null
                    ? 'Loading Google Sign-In...'
                    : 'Google Sign-In Unavailable'}
                </span>
              </button>
            )}
          </div>

          {googleConfigured === false && (
            <p className="text-center text-[11px] font-medium text-slate-400">
              Google Sign-In could not initialize. Please refresh the
              page or check your configuration.
            </p>
          )}
        </div>

        {/* Registration link */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}

          <Link
            to="/register"
            className="font-semibold text-cyan-400 hover:underline"
          >
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};