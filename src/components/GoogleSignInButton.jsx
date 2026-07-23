import { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function GoogleSignInButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null);
  const initializedClientIdRef = useRef('');
  const onCredentialRef = useRef(onCredential);
  const [error, setError] = useState('');
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId || disabled) {
      return undefined;
    }

    let isMounted = true;

    loadGoogleScript()
      .then(() => {
        if (!isMounted || !buttonRef.current) return;

        if (initializedClientIdRef.current !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response?.credential) {
                onCredentialRef.current(response.credential);
              }
            },
          });
          initializedClientIdRef.current = clientId;
        }

        if (!buttonRef.current.hasChildNodes()) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: buttonRef.current.offsetWidth || 320,
            text: 'continue_with',
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Google login is not available right now.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [clientId, disabled]);

  if (!clientId) {
    return (
      <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Google login will be available after configuration.
      </p>
    );
  }

  return (
    <div>
      <div ref={buttonRef} className={disabled ? 'pointer-events-none opacity-60' : ''} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default GoogleSignInButton;
