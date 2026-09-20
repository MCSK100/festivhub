import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GIS_SCRIPT = 'https://accounts.google.com/gsi/client';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector(`script[src="${GIS_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google script failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google script failed to load'));
    document.head.appendChild(script);
  });
}

/**
 * Google SSO button (Google Identity Services).
 * - Requires VITE_GOOGLE_CLIENT_ID on the frontend + GOOGLE_CLIENT_ID on the backend.
 * - `role` only applies to brand-new users; existing users keep their stored role.
 */
const GoogleSignIn = ({ role = 'customer', mode = 'signin', onError }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [status, setStatus] = useState(GOOGLE_CLIENT_ID ? 'loading' : 'unconfigured');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    const init = async () => {
      try {
        await loadGisScript();
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            const idToken = response?.credential;
            if (!idToken) {
              const msg = 'Google did not return a credential. Try again.';
              setError(msg);
              onError?.(msg);
              return;
            }
            setStatus('verifying');
            const result = await loginWithGoogle(idToken, role);
            if (cancelled) return;
            if (result.success) {
              const target = result.user?.role === 'vendor' ? '/vendor-dashboard' : '/customer-dashboard';
              navigate(target, { replace: true });
            } else {
              setError(result.error || 'Google sign-in failed');
              setStatus('ready');
              onError?.(result.error);
            }
          },
        });
        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
          });
        }
        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError('Could not load Google sign-in. Check your connection and try again.');
        }
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [role, mode, loginWithGoogle, navigate, onError]);

  if (status === 'unconfigured') {
    return (
      <div className="w-full px-4 py-3 rounded-full border border-dashed border-black/20 bg-[#fff7f0] text-center">
        <p className="text-sm text-gray-500 font-medium">Continue with Google</p>
        <p className="text-xs text-gray-400 mt-1">
          Not configured — set VITE_GOOGLE_CLIENT_ID + GOOGLE_CLIENT_ID to enable.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {(status === 'loading' || status === 'verifying') && !error && (
        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-center text-sm text-gray-500 font-medium">
          {status === 'verifying' ? 'Verifying with Google…' : 'Loading Google sign-in…'}
        </div>
      )}
      <div
        ref={buttonRef}
        className={`flex justify-center ${status === 'ready' ? '' : 'hidden'}`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
      {status === 'error' && !error && (
        <p className="mt-2 text-sm text-red-600 text-center" role="alert">
          Google sign-in is temporarily unavailable.
        </p>
      )}
    </div>
  );
};

export default GoogleSignIn;
